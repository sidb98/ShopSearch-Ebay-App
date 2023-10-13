import React, { useState } from "react";
import "./SearchItemCard.css";
import axios from "axios";

const SearchItemCard = ({ items }) => {
  const [wishlist, setWishlist] = useState([]);

  const isItemInWishlist = (itemId) => wishlist.includes(itemId);

  const handleWishlistClick = async (item) => {
    const itemId = item.itemId;
  
    try {
      if (isItemInWishlist(itemId)) {
        await axios.delete(`http://localhost:5000/favorite/${itemId}`);
        setWishlist(prevWishlist => prevWishlist.filter((wishlistItemId) => wishlistItemId !== itemId));
        console.log("Removed from wishlist-ReactJS", itemId);
    
      } else {
        await axios.post('http://localhost:5000/favorite', {
          _id: itemId,
          image: item.image,
          title: item.title,
          price: item.price,
          shipping: item.shipping,
        });
  
        setWishlist(prevWishlist => [...prevWishlist, itemId]);
        console.log("Added to wishlist-ReactJS", itemId);
      }
    } catch (error) {
      console.log(error.response);
    }
  };
  

  return (
    <div>
      {items.map((item, index) => (
        <div className="item-card" key={item.itemId}>
          <p>{index + 1}</p>
          <div className="item-image">
            <img src={item.image} alt={item.title} />
          </div>
          <div className="item-details">
            <p className="item-title">{item.title}</p>
            <p className="item-price">{item.price}</p>
            <p className="item-shipping">{item.shipping}</p>
            <p className="item-zipcode">{item.zip}</p>
          </div>
          <button
            className={`wishlist-button ${isItemInWishlist(item.itemId) ? 'wishlist-button-active' : ''}`}
            onClick={() => handleWishlistClick(item)}
          >
            {isItemInWishlist(item.itemId) ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default SearchItemCard;
