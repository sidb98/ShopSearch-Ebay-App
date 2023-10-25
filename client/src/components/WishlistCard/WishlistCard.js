import React from "react";
import { useWishlist } from "../WishlistContext";

export default function WishlistCard() {
  const { wishlist, removeItemFromWishlist } = useWishlist();

  const totalShoppingPrice = wishlist.reduce((total, item) => total + parseFloat(item.price), 0);


  const removeItem = (itemId) => {
    removeItemFromWishlist(itemId);
  };

  return (
    <div>
      {wishlist.length > 0 ? (
        <table className="item-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Shipping</th>
              <th>Favorite</th>
            </tr>
          </thead>
          <tbody>
            {wishlist.map((item, index) => (
              <tr key={item.itemId}>
                <td>{index + 1}</td>
                <td>
                  <img src={item.image} alt={item.title} />
                </td>
                <td>{item.title}</td>
                <td>{item.price}</td>
                <td>{item.shipping}</td>
                <td>
                  <button onClick={() => removeItem(item.itemId)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="5" style={{ textAlign: 'right' }}>Total Shopping</td>
              <td>${totalShoppingPrice.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p className="no-result-message">No records</p>
      )}
    </div>
  );
}
