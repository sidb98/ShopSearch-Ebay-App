import React, { useState } from "react";
import { useWishlist } from "../WishlistContext";
import SingleItem from "../SingleItem";

export default function SearchItemCard({ items }) {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const { wishlist, addItemToWishlist, removeItemFromWishlist } = useWishlist();
  const [selectedItem, setSelectedItem] = useState(null);

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

  const handleItemClick = (item) => {
    console.log(item);
    setSelectedItem(item);
  };

  // Calculate total pages
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Calculate the index range for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get the items for the current page
  const currentItems = items.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container">
      {selectedItem ? (
        <div>
          <h3>{selectedItem.title}</h3>
          <button onClick={() => setSelectedItem(null)}>List</button>
          <SingleItem item={selectedItem} />
        </div>
      ) : (
        // Display the table when no item is selected
        <div className="table-responsive">
          <table className=" item-table">
            {items.length > 0 && (
              <thead>
                <tr className="row-odd">
                  <th className="number-column">#</th>
                  <th className="image-column">Image</th>
                  <th className="title-column">Title</th>
                  <th className="price-column">Price</th>
                  <th className="shipping-column">Shipping</th>
                  <th className="zipcode-column">Zipcode</th>
                  <th className="wishlist-column">Wishlist</th>
                </tr>
              </thead>
            )}
            <tbody>
              {currentItems.map((item, index) => (
                <tr
                  key={item.itemId}
                  onClick={() => handleItemClick(item)}
                  className={index % 2 === 0 ? "row-even" : "row-odd"}
                >
                  <td className="number-column">{startIndex + index + 1}</td>
                  <td className="image-column">
                    <img src={item.image} alt={item.title} />
                  </td>
                  <td className="title-column">
                    <span className="ellipsis-text" title={item.title}>
                      {item.title.length > 32
                        ? item.title.substring(0, 40) + "..."
                        : item.title}
                    </span>
                  </td>
                  <td className="price-column">{item.price}</td>
                  <td className="shipping-column">{item.shipping}</td>
                  <td className="zipcode-column">{item.zip}</td>
                  <td className="wishlist-column">
                    <button
                      className={`btn wishlist-button ${
                        isItemInWishlist(item.itemId)
                          ? "wishlist-button-active"
                          : ""
                      }`}
                      onClick={(e) => {
                        // Prevent the click on the button from propagating to the div
                        e.stopPropagation();
                        handleWishlistClick(item);
                      }}
                    ></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length > 0 && (
            <div className="pagination justify-content-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="page-button"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={
                    currentPage === index + 1 ? "active" : "page-button"
                  }
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="page-button"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
