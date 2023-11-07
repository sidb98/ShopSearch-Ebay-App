import React from "react";
import axios from "axios";
import SearchForm from "./SearchForm";
import { WishlistProvider } from "./WishlistContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

axios.defaults.baseURL = window.location.protocol +"//"+ window.location.hostname + ":5000";
// change this for production becuase server and client are on diffrent servers

function App() {
    return (
        <>
            <WishlistProvider>
                <SearchForm />
            </WishlistProvider>
        </>
    )
}

export default App;