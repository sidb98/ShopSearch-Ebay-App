import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    axios
      .get("/getKeys")
      .then((response) => {
        setWishlist(response.data);
      })
      .catch((error) => {
        console.log("Could not retrieve keys from the database for wishlist");
        console.log(error);
      });
  }, []);

  // Function to add an item to the wishlist
  const addItemToWishlist = async (item) => {
    try {
      await axios.post("/favorite", {
        _id: item.itemId,
        image: item.image,
        title: item.title,
        price: item.price,
        shipping: item.shipping,
      });

      setWishlist((prevWishlist) => [...prevWishlist, item]);
    } catch (error) {
      console.log(error.response);
    }
  };

  // Function to remove an item from the wishlist
  const removeItemFromWishlist = async (itemId) => {
    try {
      await axios.delete(`/favorite/${itemId}`);
      setWishlist((prevWishlist) =>
        prevWishlist.filter((item) => item.itemId !== itemId)
      );
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addItemToWishlist, removeItemFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export { WishlistProvider, useWishlist };
