import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import cors from 'cors';
import OAuthToken from './ebay_oauth_token.js';


const app = express();
app.use(cors());

dotenv.config();
const ebayAppId = process.env.EBAY_APP_ID;
const ebayDevId = process.env.EBAY_DEV_ID;
const ebayCertId = process.env.EBAY_CERT_ID;


const PORT = process.env.PORT || 5000;


// Search for all items
app.get('/search', async (req, res) => {
    let query = req.query;

    let url = `https://svcs.ebay.com/services/search/FindingService/v1`;
    let reqParams = {
        'OPERATION-NAME': 'findItemsByKeywords',
        'SERVICE-VERSION': '1.0.0',
        'SECURITY-APPNAME': ebayAppId,
        'RESPONSE-DATA-FORMAT': 'JSON',
        'paginationInput.entriesPerPage': '50',
        'outputSelector(0)': 'SellerInfo',
        'outputSelector(1)': 'StoreInfo',
        'keywords': query.keyword,
        'buyerPostalCode': query.zipcode,
        'itemFilter(0).name': 'MaxDistance',
        'itemFilter(0).value': query.distance,
    };

    let itemFilterIdx = 1;


    // TODO: Fix cateogryId
    if (query.category !== 'all') reqParams['categoryId'] = query.category;

    if (query.localpickup) {
        reqParams[`itemFilter(${itemFilterIdx}).name`] = 'LocalPickupOnly';
        reqParams[`itemFilter(${itemFilterIdx}).value(${itemFilterIdx})`] = 'true';
        itemFilterIdx++;
    }
    if (query.free) {
        reqParams[`itemFilter(${itemFilterIdx}).name`] = 'FreeShippingOnly';
        reqParams[`itemFilter(${itemFilterIdx}).value(${itemFilterIdx})`] = 'true';
        itemFilterIdx++;
    }

    if (query.new || query.used || query.unspecified) {
        let itemFilterConditionIdx = 0;
        reqParams[`itemFilter(${itemFilterIdx}).name`] = 'Condition';
        if (query.new) {
            reqParams[`itemFilter(${itemFilterIdx}).value(${itemFilterConditionIdx})`] = 'New';
            itemFilterConditionIdx++;
        }
        if (query.used) {
            reqParams[`itemFilter(${itemFilterIdx}).value(${itemFilterConditionIdx})`] = 'Used';
            itemFilterConditionIdx++;
        }
        if (query.unspecified) {
            reqParams[`itemFilter(${itemFilterIdx}).value(${itemFilterConditionIdx})`] = 'Unspecified';
            itemFilterConditionIdx++;
        }
        itemFilterIdx++;
    }
    console.log('reqParams')
    console.log(reqParams);


    Object.keys(query).forEach(key => {
        reqParams[key] = query[key];
    });
    try {
        let resApiData = (await axios.get(url, { params: reqParams })).data;
        let resData = {}
        // res.send(resApiData);

        let itemsList = resApiData.findItemsByKeywordsResponse[0].searchResult[0].item;
        itemsList.forEach((item, idx) => {
            let singleItem = {};
            singleItem.itemId = item.itemId[0];
            singleItem.title = item.title[0];
            singleItem.price = item.sellingStatus[0].currentPrice[0].__value__;
            singleItem.shipping = item.shippingInfo[0].shippingServiceCost[0].__value__;
            singleItem.zip = item.postalCode && item.postalCode[0] ? item.postalCode[0] : 'N/A';               // from https://stackoverflow.com/questions/57333535/add-a-default-value-for-a-json-property-when-it-doesnt-exist-in-javascript

            let sellerInfo = {}
            sellerInfo.feedbackScore = item.sellerInfo[0].feedbackScore[0];
            sellerInfo.popularity = item.sellerInfo[0].positiveFeedbackPercent[0];
            sellerInfo.feedbackRating = item.sellerInfo[0].feedbackRatingStar[0];
            sellerInfo.topRated = item.sellerInfo[0].topRatedSeller[0];

            // From https://stackoverflow.com/questions/48514504/how-to-deal-with-json-when-a-key-is-missing-sometimes
            sellerInfo.storeName = (item.storeInfo && item.storeInfo[0] && item.storeInfo[0].storeName) ? item.storeInfo[0].storeName[0] : 'N/A';
            sellerInfo.buyProductAt = (item.storeInfo && item.storeInfo[0] && item.storeInfo[0].storeURL) ? item.storeInfo[0].storeURL[0] : 'N/A';
            singleItem.sellerInfo = sellerInfo;

            if (singleItem.shipping === '0.0')
                singleItem.shipping = 'Free Shipping';

            if (singleItem.shipping === '')
                singleItem.shipping = 'N/A';

            resData[idx] = singleItem;
        });
        res.send(resData);
    }
    catch (err) {
        console.log(err);
    }


}
);


app.get('/singleItem/:itemId', async (req, res) => {
    const oauthToken = new OAuthToken(ebayAppId, ebayCertId);

    let accessToken = await oauthToken.getApplicationToken();



    let itemId = req.params.itemId;
    let url = `https://open.api.ebay.com/shopping`
    let headers = {
        "X-EBAY-API-IAF-TOKEN": accessToken
    }
    let reqParams = {
        'callname': 'GetSingleItem',
        'responseencoding': 'JSON',
        'appid': ebayAppId,
        'siteid': '0',
        'version': '967',
        'ItemID': itemId,
        'IncludeSelector': 'Description,Details,ItemSpecifics',
    };

    try {
        let resApiData = (await axios.get(url, { params: reqParams, headers: headers })).data;
        let resData = {};
        res.send(resApiData);
        // Info tab data
        resData.productImg = resApiData.Item.PictureURL;
        resData.price = resApiData.Item.CurrentPrice.Value;
        resData.location = resApiData.Item.Location || '';
        resData.return = resApiData.Item.ReturnPolicy.ReturnsAccepted || '' + ' within ' + resApiData.Item.ReturnPolicy.ReturnsWithin || '';

        const itemSpecifics = resApiData.Item?.ItemSpecifics?.NameValueList || [];
        itemSpecifics.forEach(spec => {
            resData[spec.Name || ""] = spec.Value?.[0] || "";
        });

        // Shipping Tab data



        // Remove empty fields  
        // from https://stackoverflow.com/questions/65441273/js-remove-empty-keys-from-an-object
        let cleanResData = Object.entries(resData).reduce((acc, [k, v]) => v ? { ...acc, [k]: v } : acc, {})

        res.send(cleanResData);
    }

    catch (err) {
        console.log(err);
    }
});

app.get('/similarItems/:itemId', async (req, res) => {

    const oauthToken = new OAuthToken(ebayAppId, ebayCertId);

    let accessToken = await oauthToken.getApplicationToken();

    let itemId = req.params.itemId;
    let url = `https://svcs.ebay.com/MerchandisingService`
    let headers = {
        "X-EBAY-API-IAF-TOKEN": accessToken
    }

    let reqParams = {
        'OPERATION-NAME': 'getSimilarItems',
        'SERVICE-NAME': 'MerchandisingService',
        'SERVICE-VERSION': '1.1.0',
        'CONSUMER-ID': ebayAppId,
        'RESPONSE-DATA-FORMAT': 'JSON',
        'REST-PAYLOAD': '',
        'itemId': itemId,
        'maxResults': '20',
        'itemId': itemId,
    };

    try {

        let resApiData = (await axios.get(url, { params: reqParams, headers: headers })).data;
        let resData = {};

        let itemsList = resApiData.getSimilarItemsResponse.itemRecommendations.item;

        itemsList.forEach((item, idx) => {
            let singleItem = {};
            singleItem.title = item.title;
            singleItem.price = item.buyItNowPrice.__value__;
            singleItem.shipping = item.shippingCost.__value__;

            // "how do i get the value between P and D" prompt (2 lines) . ChatGPT September 25 Version  OpenAI, 7 Oct. 2023, chat.openai.com/chat.
            const match = item.timeLeft.match(/P(\d+)D/);
            singleItem.daysLeft = match ? parseInt(match[1]) : null;
            
            resData[idx] = singleItem;
        }
        );

        res.send(resData)
    }


    catch (err) {
        console.log(err);
    }
}
);

app.get('/')

app.listen(PORT, () => {
    console.log('Server listening on port 5000!');
});