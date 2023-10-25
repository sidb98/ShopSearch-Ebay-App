import React, { useState } from "react";
import "./styles.css";

import ProductsTab from "../ProductsTab";
import PhotosTab from "../PhotosTab";
import ShippingTab from "../ShippingTab";
import SellerTab from "../SellerTab";
import SimilarItemsTab from "../SimilarItemsTab";
import { useWishlist } from "../WishlistContext";

export default function SingleItem({ item }) {
  const [activeTab, setActiveTab] = useState("products");
  const { wishlist, addItemToWishlist, removeItemFromWishlist } = useWishlist();

  // TODO: Send product link instead of image link
  const handleFacebookShare = () => {
    // Construct the Facebook sharing message
    const productName = item.title;
    const price = item.price;
    const link = item.image;

    const facebookShareMessage = `Buy ${productName} at ${price} from ${link} below.`;
    console.log(facebookShareMessage);

    // Create the Facebook sharing URL
    const facebookShareURL = `https://www.facebook.com/sharer.php?u=${encodeURIComponent(
      link
    )}&quote=${encodeURIComponent(facebookShareMessage)}`;

    // Open the Facebook sharing dialog
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
    <div>
      <button
        className="facebook-share-button"
        onClick={handleFacebookShare}
      ></button>
      <button
        className={`wishlist-button ${
          isItemInWishlist(item.itemId) ? "wishlist-button-active" : ""
        }`}
        onClick={() => handleWishlistClick(item)}
      ></button>
      <div className="tab-header">
        <div
          className={`tab ${activeTab === "products" ? "active" : ""}`}
          onClick={() => handleTabClick("products")}
        >
          Products
        </div>
        <div
          className={`tab ${activeTab === "photos" ? "active" : ""}`}
          onClick={() => handleTabClick("photos")}
        >
          Photos
        </div>
        <div
          className={`tab ${activeTab === "shipping" ? "active" : ""}`}
          onClick={() => handleTabClick("shipping")}
        >
          Shipping
        </div>
        <div
          className={`tab ${activeTab === "seller" ? "active" : ""}`}
          onClick={() => handleTabClick("seller")}
        >
          Seller
        </div>
        <div
          className={`tab ${activeTab === "similar" ? "active" : ""}`}
          onClick={() => handleTabClick("similar")}
        >
          Similar Items
        </div>
      </div>
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
