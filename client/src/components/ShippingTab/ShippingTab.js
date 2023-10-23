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

  return (
    <table>
      <tbody>
        {Object.entries(keyOrder).map(([key, name]) => {
          const value = item.shippingInfo[key];
          if (value !== 0) {
            return (
              <tr key={key}>
                <td>{name}</td>
                <td>{value}</td>
              </tr>
            );
          }
          return null; // Skip rendering for zero values
        })}
      </tbody>
    </table>
  );
}
