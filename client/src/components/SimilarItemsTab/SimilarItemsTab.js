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
      .get(`/api/similarItems/${item.itemId}`)
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


  const openItemInNewTab = (link) => {
    window.open(link, "_blank");
  }

  return (
    <div className="container">
      <div className="sorting-controls d-flex flex-column flex-md-row my-3">
        <select
          value={sortCriteria}
          onChange={handleSortCriteriaChange}
          className="form-select me-3"
        >
          <option value="default">Default</option>
          <option value="productname">Product Name</option>
          <option value="daysleft">Days Left</option>
          <option value="price">Price</option>
          <option value="shippingcost">Shipping Cost</option>
        </select>
        <select
          value={sortOrder}
          onChange={handleSortOrderChange}
          className="form-select "
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      {similarItems.length > 0 ? (
        <div className="similar-items ">
          {similarItems
            .slice(0, showAllItems ? similarItems.length : 5)
            .map((item, index) => (
              <div
                className="similar-item mb-3 rounded p-3 pb-4"
                key={item.itemId}
                onClick={openItemInNewTab.bind(this, item.link)}
              >
                <div className="row">
                  <div className="col-md-2">
                    <div className="item-image ms-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{ width: "150px", height: "150px" }}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 ms-3">
                    <div className="item-detail">
                      <p className="text-primary my-0">{item.title}</p>
                      <p className="text-success my-0">Price: ${item.price}</p>
                      <p className="text-warning my-0">
                        Shipping Cost: ${item.shipping}
                      </p>
                      <p className="text-white my-0">
                        Days Left: {item.daysLeft}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) :(
        <p className="no-result-message">No records</p>
      )}

      {similarItems.length > 5 && (
        <div className="d-flex justify-content-center">
          <button onClick={toggleItemsDisplay} className="btn active">
            {showAllItems ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
}
