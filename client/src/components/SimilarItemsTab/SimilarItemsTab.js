import React, { useState, useEffect } from "react";
import axios from "axios";

export default function SimilarItemsTab({ item }) {
  const [similarItems, setSimilarItems] = useState([]);
  const [originalItems, setOriginalItems] = useState([]);
  const [showAllItems, setShowAllItems] = useState(false);
  const [sortCriteria, setSortCriteria] = useState("default");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/similarItems/${item.itemId}`)
      .then((response) => {
        setSimilarItems(response.data.items);
        setOriginalItems(response.data.items);
        console.log(response.data);
      })
      .catch((error) => {
        console.log("Could not retrieve similar items");
        console.log(error);
      });
  }, [item.itemId]);

  const toggleItemsDisplay = () => {
    setShowAllItems(!showAllItems);
  };

  const handleSortCriteriaChange = (event) => {
    setSortCriteria(event.target.value);
    sortItems(event.target.value, sortOrder);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
    sortItems(sortCriteria, event.target.value);
  };

  const sortItems = (criteria, order) => {
    let sortedItems = [...similarItems];

    if (criteria === "default") {
        sortedItems = [...originalItems];
    } else if (criteria === "productname") {
      sortedItems.sort((a, b) => a.title.localeCompare(b.title));
    } else if (criteria === "daysleft") {
      sortedItems.sort((a, b) => a.daysLeft - b.daysLeft);
    } else if (criteria === "price") {
      sortedItems.sort((a, b) => a.price - b.price);
    } else if (criteria === "shippingcost") {
      sortedItems.sort((a, b) => a.shipping.localeCompare(b.shipping));
    }

    if (order === "desc") {
      sortedItems.reverse();
    }

    setSimilarItems(sortedItems);
  };
  return (
    <div>
      <div className="sorting-controls">
        <label>
          Sort by:
          <select value={sortCriteria} onChange={handleSortCriteriaChange}>
            <option value="default">Default</option>
            <option value="productname">Product Name</option>
            <option value="daysleft">Days Left</option>
            <option value="price">Price</option>
            <option value="shippingcost">Shipping Cost</option>
          </select>
        </label>
        <label>
          Sort order:
          <select value={sortOrder} onChange={handleSortOrderChange}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>

      {similarItems.length > 0 && (
        <div className="similar-items">
          {similarItems
            .slice(0, showAllItems ? similarItems.length : 5)
            .map((item) => (
              <div className="similar-item" key={item.itemId}>
                <div className="item-image">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="item-detail">
                  <p>{item.title}</p>
                  <p>Price: ${item.price}</p>
                  <p>Shipping Cost: ${item.shipping}</p>
                  <p>Days Left: {item.daysLeft}</p>
                </div>
              </div>
            ))}
        </div>
      )}

      {similarItems.length > 5 && (
        <button onClick={toggleItemsDisplay}>
          {showAllItems ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
}