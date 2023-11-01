import React, { useState, useEffect } from "react";
import axios from "axios";

import LoadingBar from "../LoadingBar";
import ImageModal from "../ImageModal";

import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";



export default function ProductsTab({ item }) {
  const [productDetails, setProductDetails] = useState({});
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [images, setImages] = useState([]);


  const openImageModal = () => {
    setShowImageModal(true);
    console.log(images);
  };

  useEffect(() => {
    axios
      .get(`/singleItem/${item.itemId}`)
      .then((response) => {
        setProductDetails(response.data);
        setLoadingProgress(100);
        setLoading(false);
  
        const convertedImages = response.data.productImg.map((url) => ({
          original: url,
        }));
        setImages(convertedImages);
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
              <td className="col-5 bold-title ps-4 pt-2 pb-2 ">
                Product Images
              </td>
              <td className="col-3 pt-2 pb-2">
                <button
                  onClick={openImageModal}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "white",
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
                <td className="col-5 bold-title ps-4 pt-2 pb-2">
                  Return Policy
                </td>
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
                  <td className="col-3 pt-2 pb-2">
                    {productDetails.ItemSpecs[key]}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
      {showImageModal && (
        <ImageModal
          images={productDetails.productImg}
          isOpen={setShowImageModal}
          onClose={() => setShowImageModal(false)}
        />
        // console.log(images),
        // <ImageGallery  items={images}/>
      )}
    </div>
  );
}
