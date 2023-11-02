import React, { useState } from "react";

import ProductsTab from "../ProductsTab";
import PhotosTab from "../PhotosTab";
import ShippingTab from "../ShippingTab";
import SellerTab from "../SellerTab";
import SimilarItemsTab from "../SimilarItemsTab";
import { useWishlist } from "../WishlistContext";

export default function SingleItem({ item }) {
  const [activeTab, setActiveTab] = useState("products");
  const { wishlist, addItemToWishlist, removeItemFromWishlist } = useWishlist();

  const handleFacebookShare = () => {
    const link = item.link;
    const facebookShareURL = `https://www.facebook.com/sharer.php?u=${encodeURIComponent(
      link
    )}`;
    window.open(facebookShareURL, "Facebook Share", "width=600,height=400");
  };

  const isItemInWishlist = (itemId) =>
    wishlist.some((item) => item.itemId === itemId);
  const handleWishlistClick = async (item) => {
    const itemId = item.itemId;

    try {
      if (isItemInWishlist(itemId)) {
        removeItemFromWishlist(itemId);
      } else {
        addItemToWishlist(item);
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  return (
    <div className="container mb-5">
      <h3 className="text-center mt-4">{item.title}</h3>
      <div className="row justify-content-end">
        <button
          className="btn facebook-share-button"
          onClick={handleFacebookShare}
        ></button>
        <button
          className={`btn wishlist-button ${
            isItemInWishlist(item.itemId) ? "wishlist-button-active" : ""
          }`}
          onClick={() => handleWishlistClick(item)}
        ></button>
      </div>

      <ul className="nav nav-tabs justify-content-end">
        {" "}
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "products" ? "active" : ""} `}
            onClick={() => handleTabClick("products")}
            style={
              activeTab === "products"
                ? { backgroundColor: "black", color: "#fff" }
                : {}
            }
          >
            Products
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "photos" ? "active" : ""}`}
            onClick={() => handleTabClick("photos")}
            style={
              activeTab === "photos"
                ? { backgroundColor: "black", color: "#fff" }
                : {}
            }
          >
            Photos
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "shipping" ? "active" : ""}`}
            onClick={() => handleTabClick("shipping")}
            style={
              activeTab === "shipping"
                ? { backgroundColor: "black", color: "#fff" }
                : {}
            }
          >
            Shipping
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "seller" ? "active" : ""}`}
            onClick={() => handleTabClick("seller")}
            style={
              activeTab === "seller"
                ? { backgroundColor: "black", color: "#fff" }
                : {}
            }
          >
            Seller
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "similar" ? "active" : ""}`}
            onClick={() => handleTabClick("similar")}
            style={
              activeTab === "similar"
                ? { backgroundColor: "black", color: "#fff" }
                : {}
            }
          >
            Similar Items
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {activeTab === "products" && <ProductsTab item={item} />}
        {activeTab === "photos" && <PhotosTab title={item.title} />}
        {activeTab === "shipping" && <ShippingTab item={item} />}
        {activeTab === "seller" && <SellerTab item={item} />}
        {activeTab === "similar" && <SimilarItemsTab item={item} />}
      </div>
    </div>
  );
}
