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

  // “Add a method that shares a link to facebook in a new tab” prompt (5 line). ChatGPT, 28 Oct. version, OpenAI, 11 Oct. 2023, chat.openai.com/chat.

  const handleFacebookShare = () => {
    const link = item.link;
    const facebookShareURL = `https://www.facebook.com/sharer.php?u=${encodeURIComponent(
      link
    )}`;
    window.open(facebookShareURL, "Facebook Share", "width=600,height=400");
  };

  // “How add and remove items from wishlist context” prompt (10 line). ChatGPT, 14 Oct. version, OpenAI, 11 Oct. 2023, chat.openai.com/chat.

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

  // “Write JSX to create 5 tabs as components to that i can display relevant content of each tab” prompt (20 line). ChatGPT, 15 Oct. version, OpenAI, 11 Oct. 2023, chat.openai.com/chat.

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
