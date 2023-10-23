import React from "react";

export default function SellerTab({ item }) {
  const keyOrder = {
    feedbackScore: "Feedback Score",
    popularity: "Popularity",
    feedbackRating: "Feedback Rating Star",
    topRated: "Top Rated",
    storeName: "Store Name",
    buyProductAt: "Buy Products At",
  };

  return (
    <table>
      <tbody>
        <tr>
            <td colSpan="2" >{item.sellerInfo.storeName}</td>
        </tr>
        {Object.entries(keyOrder).map(([key, name]) => {
          const value = item.sellerInfo[key];
          if (value !== null) {
            if (key === "buyProductAt") {
              return (
                <tr key={key}>
                  <td>{name}</td>
                  <td>
                    <a href={value} target="_blank" rel="noopener noreferrer">
                      Store
                    </a>
                  </td>
                </tr>
              );
            } else {
              return (
                <tr key={key}>
                  <td>{name}</td>
                  <td>{value}</td>
                </tr>
              );
            }
          }
          return null; // Skip rendering for null values
        })}
      </tbody>
    </table>
  );
}
