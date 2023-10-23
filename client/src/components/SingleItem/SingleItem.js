import React, { useState } from "react";
import "./styles.css"

import ProductsTab from "../ProductsTab";
import PhotosTab from "../PhotosTab";
import ShippingTab from "../ShippingTab";
import SellerTab from "../SellerTab";
import SimilarItemsTab from "../SimilarItemsTab";


export default function SingleItem({ item }) {
  const [activeTab, setActiveTab] = useState("products");
  
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  return (
    <div>
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
        {activeTab === "photos" && <PhotosTab item={item} />}
        {activeTab === "shipping" && <ShippingTab item={item} />}
        {activeTab === "seller" && <SellerTab item={item} />}
        {activeTab === "similar" && <SimilarItemsTab item={item} />}
      </div>
    </div>
  );
}
