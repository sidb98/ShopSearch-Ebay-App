import React from "react";

export default function ShippingTab({ item }) {
  const keyOrder = {
    shippingCost: "Shipping Cost",
    shippingLocation: "Shipping Location",
    handlingTime: "Handling Time",
    expeditedShipping: "Expedited Shipping",
    oneDayShipping: "One Day Shipping",
    returnsAccepted: "Returns Accepted",
  };
  console.log(item);

  // "How to skip printing the key value pair if the value is null or N/A” prompt (5 line). ChatGPT, 17 Oct. version, OpenAI, 11 Oct. 2023, chat.openai.com/chat.
  // “How to display tick or cross when the value is true or false for expeditedShipping, oneDayShipping, returnsAccepted” prompt (5 line). ChatGPT, 17 Oct. version, OpenAI, 11 Oct. 2023, chat.openai.com/chat.

  return (
    <div className="table-responsive container">
      <table className="w-100">
        <tbody>
          {Object.entries(keyOrder).map(([key, name], index) => {
            const value = item.shippingInfo[key];
            if (value !== "N/A" && value !== null) {
              return (
                <tr
                  key={key}
                  className={index % 2 === 0 ? "row-even" : "row-odd"}
                >
                  <td className="col-12 col-md-5 bold-title ps-md-4 py-2 d-block d-sm-table-cell">
                    {name}
                  </td>
                  <td className="col-12 col-md-3 py-2 d-block d-sm-table-cell">
                    {key === "expeditedShipping" ||
                    key === "oneDayShipping" ||
                    key === "returnsAccepted" ? (
                      value === "true" ? (
                        <span
                          className="material-icons"
                          style={{ color: "green" }}
                        >
                          done
                        </span>
                      ) : (
                        <span
                          className="material-icons"
                          style={{ color: "red" }}
                        >
                          clear
                        </span>
                      )
                    ) : (
                      value
                    )}
                  </td>
                </tr>
              );
            }
            return null; // Skip rendering for zero values
          })}
        </tbody>
      </table>
    </div>
  );
}
