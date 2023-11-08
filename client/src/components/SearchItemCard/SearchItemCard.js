import React, { useState } from "react";
import { useWishlist } from "../WishlistContext";
import SingleItem from "../SingleItem";

export default function SearchItemCard({ items }) {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const { wishlist, addItemToWishlist, removeItemFromWishlist } = useWishlist();
  const [selectedItem, setSelectedItem] = useState(null);
  const [prevSelectedItem, setPrevSelectedItem] = useState(null);

  const isItemInWishlist = (itemId) =>
    wishlist.some((item) => item.itemId === itemId);

  // "how to use wishlist context to add and remove items from wishlist" prompt (5 line). ChatGPT, 8 Oct. version, OpenAI, 11 Oct. 2023, chat.openai.com/chat.

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
    setSelectedItem(item);
    setPrevSelectedItem(item);
  };

  const handleDetailsBtnClick = () => {
    setSelectedItem(prevSelectedItem);
  };

  const handleListBtnClick = () => {
    setSelectedItem(null);
  };

  // "Add pagination to the table such that each page shows 10 items" prompt (11 line). ChatGPT, 13 Oct. version, OpenAI, 11 Oct. 2023, chat.openai.com/chat.
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentItems = items.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  // "How to show details of the selected row instead of the table when i click on the item" prompt (13 line). ChatGPT, 15 Oct. version, OpenAI, 11 Oct. 2023, chat.openai.com/chat.
  const renderViewSingleItem = (selectedItem) => {
    return (
      <div>
        <button onClick={handleListBtnClick} className="btn">
          List
        </button>
        <SingleItem item={selectedItem} />;
      </div>
    );
  };

  const renderViewTable = () => {
    return (
      <div className="table-responsive ">
        <table className=" item-table">
          {items.length > 0 && (
            <thead>
              <tr className="row-title">
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
                className={
                  index % 2 === 0 ? "row-even row-hover" : "row-odd row-hover" //"Make the rows alternate in color" prompt (1 line). ChatGPT, 29 Oct. version, OpenAI, 11 Oct. 2023, chat.openai.com/chat.
                }
              >
                <td className="number-column">{startIndex + index + 1}</td>
                <td className="image-column">
                  <a
                    href={item.image} // "how to open image in new tab when clicked" prompt (1 line). ChatGPT, 19 Oct. version, OpenAI, 11 Oct. 2023, chat.openai.com/chat.
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: "150px", height: "150px" }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </a>
                </td>
                <td className="title-column text-primary">
                  <span className="ellipsis-text" title={item.title}>  
                    {item.title.length > 32   // "How to make the title of the item in the table to be truncated if it is too long" prompt (2 line). ChatGPT, 23 Oct. version, OpenAI, 11 Oct. 2023, chat.openai.com/chat.
                      ? item.title.substring(0, 40) + "..."
                      : item.title}
                  </span>
                </td>
                <td className="price-column">${item.price}</td>
                <td className="shipping-column">
                  {item.shipping === "Free Shipping"
                    ? item.shipping
                    : `$${item.shipping}`}
                </td>
                <td className="zipcode-column">{item.zip}</td>
                <td className="wishlist-column">
                  <button
                    className={`btn wishlist-button ${
                      isItemInWishlist(item.itemId)
                        ? "wishlist-button-active"
                        : ""
                    }`}
                    onClick={(e) => {
                      // "Prevent the click on the button from propagating to the div" prompt (1 line). ChatGPT, 6 Oct. version, OpenAI, 11 Oct. 2023, chat.openai.com/chat.
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
              className="page-button me-2"
            >
              &lt; &lt; Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={currentPage === index + 1 ? "active" : "page-button"}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="page-button"
            >
              Next &gt;&gt;
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container">
      {selectedItem ? (
        // Display the single item when an item is selected
        renderViewSingleItem(selectedItem)
      ) : (
        // Display the table when no item is selected
        <div className="text-end">
          <button
            className="btn"
            disabled={prevSelectedItem === null}
            onClick={handleDetailsBtnClick}
          >
            Details &gt;
          </button>
          {renderViewTable()}
        </div>
      )}
    </div>
  );
}
