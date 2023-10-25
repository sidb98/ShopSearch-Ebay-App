import React from "react";
import SearchForm from "./SearchForm";
import { WishlistProvider } from "./WishlistContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";


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