import express, { response } from "express";
import dotenv from "dotenv";
import axios from "axios";
import cors from "cors";
import OAuthToken from "./ebay_oauth_token.js";
import mongoose from "mongoose";
import favouriteModel from "./favouriteModel.js";

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();
const ebayAppId = process.env.EBAY_APP_ID;
const ebayDevId = process.env.EBAY_DEV_ID;
const ebayCertId = process.env.EBAY_CERT_ID;
const mongoUri = process.env.MONGO_URI;

const PORT = process.env.PORT || 5000;

async function connectToMongo() {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.log(err);
  }
}

connectToMongo();

// “How to send data to MongoDB using a model” prompt (5 line). ChatGPT, 11 Oct. version, OpenAI, 11 Oct. 2023, chat.openai.com/chat.

// MongoDB API endpoints
app.post("/api/favorite", async (req, res) => {
  try {
    const { _id, image, title, price, shipping } = req.body;
    const newFavourite = new favouriteModel({
      _id,
      image,
      title,
      price,
      shipping,
    });
    await newFavourite.save();
    res.status(201).json(newFavourite);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// “How to delete data from MongoDB ” prompt (3 line). ChatGPT, 11 Oct. version, OpenAI, 11 Oct. 2023, chat.openai.com/chat.

app.delete("/api/favorite/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await favouriteModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Successfully deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// “How to fetch all the keys from monogodb" prompt (6 line). ChatGPT, 11 Oct. version, OpenAI, 11 Oct. 2023, chat.openai.com/chat.

app.get("/api/getKeys", async (req, res) => {
  try {
    const favoriteItems = await favouriteModel.find(
      {},
      "_id image title price shipping"
    );
    const items = favoriteItems.map((item) => ({
      itemId: item._id,
      image: item.image,
      title: item.title,
      price: item.price,
      shipping: item.shipping,
    }));

    res.status(200).json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Google API endpoints
app.get("/api/photos", async (req, res) => {
  let query = req.query;
  let url = `https://www.googleapis.com/customsearch/v1`;
  let reqParams = {
    q: query.productTitle,
    cx: process.env.GOOGLE_ENGINE_ID,
    imageSize: "huge",
    imageType: "news",
    num: 8,
    searchType: "image",
    key: process.env.GOOGLE_API_KEY,
  };

  try {
    let resApiData = (await axios.get(url, { params: reqParams })).data;
    let itemLinks = [];
    if (!resApiData.items) res.send([]);
    // console.log(resApiData);
    resApiData.items.forEach((item) => {
      itemLinks.push(item.link);
    });
    res.send(itemLinks);
  } catch (err) {
    console.log("Error in Google API call");
    console.log(err);
  }
});

//GeoLocation API endpoints
app.get("/api/geolocation", async (req, res) => {
  let query = req.query;
  let startsWith = query.startsWith;
  let url = `http://api.geonames.org/postalCodeSearchJSON`;
  let reqParams = {
    username: process.env.GEONAME_USERNAME,
    country: "US",
    maxRows: 5,
    postalcode_startsWith: startsWith,
  };

  try {
    let resApiData = (await axios.get(url, { params: reqParams })).data;
    let zipCodes = [];
    if (!resApiData.postalCodes) res.send([]);
    resApiData.postalCodes.forEach((item) => {
      zipCodes.push(item.postalCode);
    });
    res.send(zipCodes);
  } catch (err) {
    console.log("Error in GeoLocation API call");
    console.log(err);
  }
});

// Ebay API endpoints
app.get("/api/search", async (req, res) => {
  let query = req.query;

  let url = `https://svcs.ebay.com/services/search/FindingService/v1`;
  let reqParams = {
    "OPERATION-NAME": "findItemsByKeywords",
    "SERVICE-VERSION": "1.0.0",
    "SECURITY-APPNAME": ebayAppId,
    "RESPONSE-DATA-FORMAT": "JSON",
    "paginationInput.entriesPerPage": "50",
    "outputSelector(0)": "SellerInfo",
    "outputSelector(1)": "StoreInfo",
    keywords: query.keyword,
  };

  let itemFilterIdx = 1;

  if (query.category !== "all") reqParams["categoryId"] = query.category;

  reqParams["buyerPostalCode"] = query.zipcode;
  reqParams["itemFilter(0).name"] = "MaxDistance";
  reqParams["itemFilter(0).value"] = query.distance;

  if (query.localpickup) {
    reqParams[`itemFilter(${itemFilterIdx}).name`] = "LocalPickupOnly";
    reqParams[`itemFilter(${itemFilterIdx}).value`] = "true";
    itemFilterIdx++;
  }
  if (query.freeshipping) {
    reqParams[`itemFilter(${itemFilterIdx}).name`] = "FreeShippingOnly";
    reqParams[`itemFilter(${itemFilterIdx}).value`] = "true";
    itemFilterIdx++;
  }

  if (query.new || query.used || query.unspecified) {
    let itemFilterConditionIdx = 0;
    reqParams[`itemFilter(${itemFilterIdx}).name`] = "Condition";
    if (query.new) {
      reqParams[
        `itemFilter(${itemFilterIdx}).value(${itemFilterConditionIdx})`
      ] = "1000";
      itemFilterConditionIdx++;
    }
    if (query.used) {
      reqParams[
        `itemFilter(${itemFilterIdx}).value(${itemFilterConditionIdx})`
      ] = "3000";
      itemFilterConditionIdx++;
    }

    itemFilterIdx++;
  }

  try {
    let response = await axios.get(url, { params: reqParams });

    if (response.data.findItemsByKeywordsResponse[0].ack[0] === "Failure") {
      res.send([]);
      return;
    }

    let resApiData = response.data;
    let resData = {};
    // res.send(resApiData);
    let items = [];

    let itemsList =
      resApiData.findItemsByKeywordsResponse[0].searchResult[0].item;
    if (!itemsList) {
      resData.ack = "Faliure";
      resData.items = [];
      res.send(resData);
      return;
    }

    // “How to handle missing json keys and send default value "N/A"” prompt (10 line). ChatGPT, 11 Oct. version, OpenAI, 11 Oct. 2023, chat.openai.com/chat.

    itemsList.forEach((item, idx) => {
      let singleItem = {};
      singleItem.itemId = item.itemId ? item.itemId[0] : "N/A";
      singleItem.image = item.galleryURL ? item.galleryURL[0] : "N/A";
      singleItem.link = item.viewItemURL ? item.viewItemURL[0] : "N/A";
      singleItem.title = item.title ? item.title[0] : "N/A";
      singleItem.price =
        item.sellingStatus &&
        item.sellingStatus[0] &&
        item.sellingStatus[0].currentPrice
          ? item.sellingStatus[0].currentPrice[0].__value__
          : "N/A";
      singleItem.shipping =
        item.shippingInfo &&
        item.shippingInfo[0] &&
        item.shippingInfo[0].shippingServiceCost
          ? item.shippingInfo[0].shippingServiceCost[0].__value__
          : "N/A";
      singleItem.zip =
        item.postalCode && item.postalCode[0] ? item.postalCode[0] : "N/A";

      let sellerInfo = {};
      sellerInfo.feedbackScore =
        item.sellerInfo &&
        item.sellerInfo[0] &&
        item.sellerInfo[0].feedbackScore
          ? item.sellerInfo[0].feedbackScore[0]
          : "N/A";
      sellerInfo.popularity =
        item.sellerInfo &&
        item.sellerInfo[0] &&
        item.sellerInfo[0].positiveFeedbackPercent
          ? item.sellerInfo[0].positiveFeedbackPercent[0]
          : "N/A";
      sellerInfo.feedbackRating =
        item.sellerInfo &&
        item.sellerInfo[0] &&
        item.sellerInfo[0].feedbackRatingStar
          ? item.sellerInfo[0].feedbackRatingStar[0]
          : "N/A";
      sellerInfo.topRated =
        item.sellerInfo &&
        item.sellerInfo[0] &&
        item.sellerInfo[0].topRatedSeller
          ? item.sellerInfo[0].topRatedSeller[0]
          : "N/A";
      sellerInfo.storeName =
        item.storeInfo && item.storeInfo[0] && item.storeInfo[0].storeName
          ? item.storeInfo[0].storeName[0]
          : "N/A";
      sellerInfo.buyProductAt =
        item.storeInfo && item.storeInfo[0] && item.storeInfo[0].storeURL
          ? item.storeInfo[0].storeURL[0]
          : "N/A";
      singleItem.sellerInfo = sellerInfo;

      if (singleItem.shipping === "0.0") singleItem.shipping = "Free Shipping";
      if (singleItem.shipping === "") singleItem.shipping = "N/A";

      let shippingInfo = {};
      if (item.shippingInfo && item.shippingInfo[0]) {
        shippingInfo.shippingCost = item.shippingInfo[0].shippingServiceCost
          ? item.shippingInfo[0].shippingServiceCost[0].__value__
          : "N/A";
        shippingInfo.shippingLocation = item.shippingInfo[0].shipToLocations
          ? item.shippingInfo[0].shipToLocations[0]
          : "N/A";
        shippingInfo.handlingTime = item.shippingInfo[0].handlingTime
          ? item.shippingInfo[0].handlingTime[0]
          : "N/A";
        shippingInfo.expeditedShipping = item.shippingInfo[0].expeditedShipping
          ? item.shippingInfo[0].expeditedShipping[0]
          : "N/A";
        shippingInfo.oneDayShipping = item.shippingInfo[0]
          .oneDayShippingAvailable
          ? item.shippingInfo[0].oneDayShippingAvailable[0]
          : "N/A";
      } else {
        shippingInfo.shippingCost = "N/A";
        shippingInfo.shippingLocation = "N/A";
        shippingInfo.handlingTime = "N/A";
        shippingInfo.expeditedShipping = "N/A";
        shippingInfo.oneDayShipping = "N/A";
      }
      shippingInfo.shippingCost =
        shippingInfo.shippingCost === "0.0"
          ? "Free Shipping"
          : "$" + shippingInfo.shippingCost;
      singleItem.shippingInfo = shippingInfo;
      shippingInfo.returnsAccepted = item.returnsAccepted
        ? item.returnsAccepted[0]
        : "N/A";

      items.push(singleItem);
    });
    resData.ack = "Success";
    resData.items = items;
    res.send(resData);
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/singleItem/:itemId", async (req, res) => {
  const oauthToken = new OAuthToken(ebayAppId, ebayCertId);

  let accessToken = await oauthToken.getApplicationToken();

  let itemId = req.params.itemId;
  let url = `https://open.api.ebay.com/shopping`;

// “How to add headers to axios.get call” prompt (3 line). ChatGPT, 11 Oct. version, OpenAI, 11 Oct. 2023, chat.openai.com/chat.

  let headers = {
    "X-EBAY-API-IAF-TOKEN": accessToken,
  };
  let reqParams = {
    callname: "GetSingleItem",
    responseencoding: "JSON",
    appid: ebayAppId,
    siteid: "0",
    version: "967",
    ItemID: itemId,
    IncludeSelector: "Description,Details,ItemSpecifics",
  };

  try {
    let resApiData = (
      await axios.get(url, { params: reqParams, headers: headers })
    ).data;
    let resData = {};
    // Info tab data
    resData.productImg = resApiData.Item.PictureURL;
    resData.link = resApiData.Item.ViewItemURLForNaturalSearch;
    resData.Price = "$" + resApiData.Item.CurrentPrice.Value || "N/A";
    resData.Location = resApiData.Item.Location || "";
    resData.Return =
      resApiData.Item.ReturnPolicy.ReturnsAccepted ||
      "" + " within " + resApiData.Item.ReturnPolicy.ReturnsWithin ||
      "";
    const itemSpecs = {};
    const itemSpecifics = resApiData.Item?.ItemSpecifics?.NameValueList || [];
    itemSpecifics.forEach((spec) => {
      itemSpecs[spec.Name || ""] = spec.Value?.[0] || "";
    });

    resData.ItemSpecs = itemSpecs;

    res.send(resData);
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/similarItems/:itemId", async (req, res) => {
  const oauthToken = new OAuthToken(ebayAppId, ebayCertId);

  let accessToken = await oauthToken.getApplicationToken();

  let itemId = req.params.itemId;
  let url = `https://svcs.ebay.com/MerchandisingService`;
  let headers = {
    "X-EBAY-API-IAF-TOKEN": accessToken,
  };

  let reqParams = {
    "OPERATION-NAME": "getSimilarItems",
    "SERVICE-NAME": "MerchandisingService",
    "SERVICE-VERSION": "1.1.0",
    "CONSUMER-ID": ebayAppId,
    "RESPONSE-DATA-FORMAT": "JSON",
    "REST-PAYLOAD": "",
    itemId: itemId,
    maxResults: "20",
    itemId: itemId,
  };

  try {
    let resApiData = (
      await axios.get(url, { params: reqParams, headers: headers })
    ).data;
    let resData = {};
    // res.send(resApiData);

    if (
      resApiData.getSimilarItemsResponse.ack === "Failure" ||
      !resApiData.getSimilarItemsResponse.itemRecommendations
    ) {
      resData.ack = "Failure";
      resData.items = [];
      res.send(resData);
      return;
    }

    resData.ack = "Success";
    let items = [];

    let itemsList = resApiData.getSimilarItemsResponse.itemRecommendations.item;

    itemsList.forEach((item, idx) => {
      let singleItem = {};
      singleItem.itemId = item.itemId;
      singleItem.title = item.title;
      singleItem.price = item.buyItNowPrice.__value__;
      singleItem.shipping = item.shippingCost.__value__;
      singleItem.image = item.imageURL;
      singleItem.link = item.viewItemURL;

      // "how do i get the value between P and D" prompt (2 lines) . ChatGPT September 25 Version  OpenAI, 7 Oct. 2023, chat.openai.com/chat.
      const match = item.timeLeft.match(/P(\d+)D/);
      singleItem.daysLeft = match ? parseInt(match[1]) : null;

      items.push(singleItem);
    });
    resData.items = items;
    res.send(resData);
  } catch (err) {
    console.log(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});
