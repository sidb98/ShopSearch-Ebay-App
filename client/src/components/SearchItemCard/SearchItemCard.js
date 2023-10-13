import React, { useEffect, useState } from "react";
import "./SearchItemCard.css";
import axios from "axios";

const SearchItemCard = ({ items }) => {
  const itemsPerPage = 10;
  const [wishlist, setWishlist] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const isItemInWishlist = (itemId) => wishlist.includes(itemId);

  useEffect(() => {
    axios
      .get("http://localhost:5000/getKeys")
      .then((response) => {
        setWishlist(response.data);
      })
      .catch((error) => {
        console.log("Could not retrieve keys from the database for wishlist");
        console.log(error);
      });
  }, []);

  const handleWishlistClick = async (item) => {
    const itemId = item.itemId;

    try {
      if (isItemInWishlist(itemId)) {
        await axios.delete(`http://localhost:5000/favorite/${itemId}`);
        setWishlist((prevWishlist) =>
          prevWishlist.filter((wishlistItemId) => wishlistItemId !== itemId)
        );
      } else {
        await axios.post("http://localhost:5000/favorite", {
          _id: itemId,
          image: item.image,
          title: item.title,
          price: item.price,
          shipping: item.shipping,
        });

        setWishlist((prevWishlist) => [...prevWishlist, itemId]);
      }
    } catch (error) {
      console.log(error.response);
    }
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
    <div>
      <table className="item-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Title</th>
            <th>Price</th>
            <th>Shipping</th>
            <th>Zipcode</th>
            <th>Wishlist</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={item.itemId}>
              <td>{startIndex + index + 1}</td>
              <td>
                <img src={item.image} alt={item.title} />
              </td>
              <td>{item.title}</td>
              <td>{item.price}</td>
              <td>{item.shipping}</td>
              <td>{item.zip}</td>
              <td>
                <button
                  className={`wishlist-button ${
                    isItemInWishlist(item.itemId)
                      ? "wishlist-button-active"
                      : ""
                  }`}
                  onClick={() => handleWishlistClick(item)}
                >
                  {isItemInWishlist(item.itemId)
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length > 0 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchItemCard;
