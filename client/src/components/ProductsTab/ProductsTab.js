import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ProductsTab({ item }) {
  const [productDetails, setProductDetails] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:5000/singleItem/${item.itemId}`)
      .then((response) => {
        setProductDetails(response.data);
      })
      .catch((error) => {
        console.log("Could not retrieve product details");
        console.log(error);
      });
  }, [item.itemId]);

  //   console.log(productDetails);
  return (
    <>
      <table>
        <tbody>
          {productDetails.Price !== null && (
            <tr>
              <td>Price</td>
              <td>{productDetails.Price}</td>
            </tr>
          )}
          {productDetails.Location !== null && (
            <tr>
              <td>Location</td>
              <td>{productDetails.Location}</td>
            </tr>
          )}
          {productDetails.Return !== null && (
            <tr>
              <td>Return Policy</td>
              <td>{productDetails.Return}</td>
            </tr>
          )}
          {productDetails.ItemSpecs && // Check if ItemSpecs is not null or undefined
            Object.keys(productDetails.ItemSpecs).map((key) => (
              <tr key={key}>
                <td>{key}</td>
                <td>{productDetails.ItemSpecs[key]}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}
