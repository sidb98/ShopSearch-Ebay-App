import React from "react";
import "material-icons/iconfont/material-icons.css";

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


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
    <table className="w-100">
      <tbody>
        <tr>
          <td
            colSpan="2"
            className="col-5 bold-title ps-4 pt-2 pb-2 text-center row-odd"
          >
            {item.sellerInfo.storeName}
          </td>
        </tr>
        {Object.entries(keyOrder).map(([key, name], index) => {
          const value = item.sellerInfo[key];
          if (value !== "N/A" && value !== null) {
            return (
              <tr
                key={key}
                className={index % 2 === 0 ? "row-even" : "row-odd"}
              >
                <td className="col-12 col-md-5 bold-title ps-md-4 py-2 d-block d-sm-table-cell">{name}</td>
                <td className="col-12 col-md-3 py-2 d-block d-sm-table-cell">
                  {key === "buyProductAt" ? (
                    <a href={value} target="_blank" rel="noopener noreferrer">
                      Store
                    </a>
                  ) : key === "topRated" ? (
                    value === "true" ? (
                      <span
                        className="material-icons"
                        style={{ color: "green" }}
                      >
                        done
                      </span>
                    ) : (
                      <span className="material-icons" style={{ color: "red" }}>
                        clear
                      </span>
                    )
                  ) : key === "feedbackRating" ? (
                    <span
                      className="material-icons"
                      style={{ color: value.toLowerCase() }}
                    >
                      {item.sellerInfo.feedbackScore >= 10000
                        ? "stars"
                        : "star_border"}
                    </span>
                  ) : key === "popularity" ? (
                    <div style={{ width: '40px', height: '40px' }}>
                        <CircularProgressbar
                            value={value}
                            text={`${value}`}
                            styles={{
                              root: {},
                              path: {
                                  stroke: `#117811`,
                                  strokeLinecap: 'butt',
                                  transition: 'stroke-dashoffset 0.5s ease 0s',
                              },
                              trail: {
                                  stroke: '#e1e1e1',
                                  strokeLinecap: 'butt',
                              },
                              text: {
                                  fill: '#FFFFFF',
                                  fontSize: '32px',
                              },
                          }}
                        />
                    </div>
                ) 
                  : (
                    value
                  )}
                </td>
              </tr>
            );
          }
          return null; // Skip rendering for null values
        })}
      </tbody>
    </table>
  );
}
