import React from "react";
import SearchForm from "./SearchForm";
import { WishlistProvider } from "./WishlistContext";


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