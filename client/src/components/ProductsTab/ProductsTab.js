import React, { useState, useEffect } from "react";
import axios from "axios";

import LoadingBar from "../LoadingBar";
import ProductImages from "../ProductImages";

export default function ProductsTab({ item }) {
  const [productDetails, setProductDetails] = useState({});
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);

  const openImageModal = () => {
    setShowImageModal(true);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/singleItem/${item.itemId}`)
      .then((response) => {
        setProductDetails(response.data);
        setLoadingProgress(100);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Could not retrieve product details");
        console.log(error);
      });
  }, [item.itemId]);

  return (
    <div>
      {loading ? (
        <LoadingBar
          loadingProgress={loadingProgress}
          setLoading={setLoadingProgress}
        />
      ) : (
        <table>
          <tbody>
            <tr className="row-odd">
              <td>Product Images</td>
              <td>
                <a href="#" onClick={openImageModal}>
                  View Product Images
                </a>
              </td>
            </tr>

            {productDetails.Price !== null && (
              <tr className="row-even">
                <td>Price</td>
                <td>{productDetails.Price}</td>
              </tr>
            )}
            {productDetails.Location !== null && (
              <tr className="row-odd">
                <td>Location</td>
                <td>{productDetails.Location}</td>
              </tr>
            )}
            {productDetails.Return !== null && (
              <tr className="row-even">
                <td>Return Policy</td>
                <td>{productDetails.Return}</td>
              </tr>
            )}
            {productDetails.ItemSpecs && // Check if ItemSpecs is not null or undefined
              Object.keys(productDetails.ItemSpecs).map((key, index) => (
                <tr
                  key={key}
                  className={index % 2 !== 0 ? "row-even" : "row-odd"}
                >
                  <td>{key}</td>
                  <td>{productDetails.ItemSpecs[key]}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
      {showImageModal && (
        <ProductImages
          images={productDetails.productImg}
          onClose={() => setShowImageModal(false)}
        />
      )}
    </div>
  );
}
