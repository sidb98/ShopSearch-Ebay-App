import React from "react";
import { useWishlist } from "../WishlistContext";

export default function WishlistCard() {
  const { wishlist, removeItemFromWishlist } = useWishlist();

  const totalShoppingPrice = wishlist.reduce(
    (total, item) => total + parseFloat(item.price),
    0
  );

  const removeItem = (itemId) => {
    removeItemFromWishlist(itemId);
  };

  return (
    <div className="container">
      {wishlist.length > 0 ? (
        <div className="table-responsive">
          <table className="item-table">
            {wishlist.length > 0 && (
              <thead>
                <tr className="row-odd">
                  <th className="number-column">#</th>
                  <th className="image-column">Image</th>
                  <th className="title-column">Title</th>
                  <th className="price-column">Price</th>
                  <th className="shipping-column">Shipping</th>
                  <th className="wishlist-column">Favorite</th>
                </tr>
              </thead>
            )}
            <tbody>
              {wishlist.map((item, index) => (
                <tr
                  key={item.itemId}
                  className={index % 2 === 0 ? "row-even" : "row-odd"}
                >
                  <td className="number-column">{index + 1}</td>
                  <td className="image-column">
                    <img src={item.image} alt={item.title} style={{ width: "150px", height: "150px" }}  />
                  </td>
                  <td className="title-column">{item.title}</td>
                  <td className="price-column">{item.price}</td>
                  <td className="shipping-column">{item.shipping}</td>
                  <td className="wishlist-column">
                    <button
                      onClick={() => removeItem(item.itemId)}
                      className="btn wishlist-button-active"
                    >
                    </button>
                  </td>
                </tr>
              ))}
              <tr
                className={wishlist.length % 2 === 0 ? "row-even" : "row-odd"}
              >
                <td colSpan="5" style={{ textAlign: "right" }}>
                  Total Shopping
                </td>
                <td>${totalShoppingPrice.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-result-message">No records</p>
      )}
    </div>
  );
}
