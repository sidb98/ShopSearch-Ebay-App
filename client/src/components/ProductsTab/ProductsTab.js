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
    <div className="container mb-5">
      
      {loading ? (
        <div className="d-flex justify-content-center align-items-center mt-3">
        <LoadingBar
          loadingProgress={loadingProgress}
          setLoading={setLoadingProgress}
        />
        </div>
      ) : (
        <table className="w-100">
          <tbody>
            <tr className="row-odd">
              <td className="col-5 bold-title ps-4 pt-2 pb-2 ">Product Images</td>
              <td className="col-3 pt-2 pb-2">
                <button
                  onClick={openImageModal}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  View Product Images
                </button>
              </td>
            </tr>

            {productDetails.Price !== null && (
              <tr className="row-even">
                <td className="col-5 bold-title ps-4 pt-2 pb-2">Price</td>
                <td className="col-3 pt-2 pb-2">{productDetails.Price}</td>
              </tr>
            )}
            {productDetails.Location !== null && (
              <tr className="row-odd">
                <td className="col-5 bold-title ps-4 pt-2 pb-2">Location</td>
                <td className="col-3 pt-2 pb-2">{productDetails.Location}</td>
              </tr>
            )}
            {productDetails.Return !== null && (
              <tr className="row-even">
                <td className="col-5 bold-title ps-4 pt-2 pb-2">Return Policy</td>
                <td className="col-3 pt-2 pb-2">{productDetails.Return}</td>
              </tr>
            )}
            {productDetails.ItemSpecs && // Check if ItemSpecs is not null or undefined
              Object.keys(productDetails.ItemSpecs).map((key, index) => (
                <tr
                  key={key}
                  className={index % 2 !== 0 ? "row-even" : "row-odd"}
                >
                  <td className="col-5 bold-title ps-4 pt-2 pb-2">{key}</td>
                  <td className="col-3 pt-2 pb-2">{productDetails.ItemSpecs[key]}</td>
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
