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

  return (
    <div className="table-responsive container">
    <table>
      <tbody>
        {Object.entries(keyOrder).map(([key, name], index) => {
          const value = item.shippingInfo[key];
          if (value !== 0) {
            return (
              <tr key={key} className={index % 2 === 0 ? "row-even" : "row-odd"}>
                <td>{name}</td>
                <td>{value}</td>
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
