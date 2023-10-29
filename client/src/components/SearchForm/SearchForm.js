import React, { useState } from "react";
import axios from "axios";
import SearchItemCard from "../SearchItemCard";
import WishlistCard from "../WishlistCard";
import LoadingBar from "../LoadingBar";

export default function SearchhtmlForm() {
  const ipinfoToken = process.env.REACT_APP_IPINFO_TOKEN;

  const initialFormData = {
    Keyword: "",
    Category: "all",
    New: false,
    Used: false,
    Unspecified: false,
    LocalPickup: false,
    FreeShipping: false,
    Distance: "10",
    From: "Current Location",
    Zipcode: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [showKeywordError, setShowKeywordError] = useState(false);
  const [items, setItems] = useState([]);
  const [view, setView] = useState("Results");
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleCategoryChange = (event) => {
    const { name, value } = event.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
  };

  const handleCheckboxChange = (event) => {
    const { name } = event.target;
    setFormData((formData) => ({ ...formData, [name]: !formData[name] }));
  };

  const handleTextboxChange = (event) => {
    const { name, value } = event.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
    if (name === "Zipcode") {
      axios
        .get(`http://localhost:5000/geolocation?startsWith=${value}`)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleRadioChange = (event) => {
    const { name, value } = event.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setShowKeywordError(false);
    setItems([]);
    setView("Results");
    setSearchSubmitted(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowKeywordError(false);
    setSearchSubmitted(true);
    setLoading(true);

    // Check if keyword is empty
    if (formData.Keyword === "") {
      setShowKeywordError(true);
    }

    let zipcode;
    if (formData.From === "Zipcode") {
      zipcode = formData.Zipcode;
    }

    // Get zipcode from IP address if Current Location is selected
    if (formData.From === "Current Location") {
      let url = "https://ipinfo.io/json?token=" + ipinfoToken;

      try {
        const response = await axios.get(url);
        zipcode = response.data.postal;
      } catch (error) {
        console.log(error);
      }
    }

    // Create request URL json
    let url = "http://localhost:5000/search?";

    const urlJson = {
      keyword: formData.Keyword,
      category: formData.Category,
      distance: formData.Distance,
      zipcode: zipcode,
    };

    if (formData.New) urlJson["new"] = formData.New;
    if (formData.Used) urlJson["used"] = formData.Used;
    if (formData.Unspecified) urlJson["unspecified"] = formData.Unspecified;
    if (formData.LocalPickup) urlJson["localpickup"] = formData.LocalPickup;
    if (formData.FreeShipping) urlJson["freeshipping"] = formData.FreeShipping;

    // console.log(urlJson);
    const searchQuery = new URLSearchParams(urlJson).toString();
    url += searchQuery;
    // console.log(url);

    // Send request
    try {
      const response = await axios.get(url);
      console.log(response.data);
      setItems(response.data.items);
      setLoadingProgress(100);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const renderResultsView = () => {
    if (searchSubmitted) {
      if (loading) {
        return (
          <div className="d-flex justify-content-center align-items-center mt-3">
            <LoadingBar
              loadingProgress={loadingProgress}
              setLoading={setLoadingProgress}
            />
          </div>
        );
      } else {
        return (
          <div>
            {searchSubmitted && items.length === 0 ? (
              <p className="no-result-message">No Results</p>
            ) : (
              <SearchItemCard items={items} />
            )}
          </div>
        );
      }
    }
  };

  const renderWishlistView = () => {
    return (
      <div>
        <WishlistCard />
      </div>
    );
  };

  return (
    <div className="container mb-5">
      <form id="serch-htmlForm" onSubmit={handleSubmit} className="my-4 ps-5">
        <h1>Product Search</h1>
        <div className="form-group row my-3">
          <label htmlFor="Keyword" className="col-sm-2 col-form-label">
            Keywords<span className="required-char">*</span>
          </label>
          <div className="col-sm-6">
            <input
              type="text"
              id="Keyword"
              name="Keyword"
              autoComplete="on"
              value={formData.Keyword}
              onChange={handleTextboxChange}
              placeholder="Enter Product Name (eg Iphone 8)"
              className="form-control"
              size="10"
            />
            {showKeywordError && (
              <p className="text-danger">Please enter a keyword</p>
            )}
          </div>
        </div>

        <div className="form-group row my-3">
          <label htmlFor="Category" className="col-sm-2 col-form-label">
            Category
          </label>
          <div className="col-sm-2">
            <select
              id="Category"
              name="Category"
              value={formData.Category}
              onChange={handleCategoryChange}
              className="form-control"
            >
              <option value="all">All Categories</option>
              <option value="550">Art</option>
              <option value="2984">Baby</option>
              <option value="261186">Books</option>
              <option value="11450">Clothing, Shoes & Accessories</option>
              <option value="58058">Computers/Tablets & Networking</option>
              <option value="26395">Health & Beauty</option>
              <option value="11233">Music</option>
              <option value="1249">Video Games & Consoles</option>
            </select>
          </div>
        </div>

        <div className="form-group row my-3">
          <label className="col-sm-2 col-form-label">Condition</label>
          <div className="col-sm-10">
            <div className="form-check form-check-inline square-checkbox">
              <input
                className="form-check-input"
                type="checkbox"
                id="New"
                name="New"
                checked={formData.New}
                onChange={handleCheckboxChange}
              />
              <label className="form-check-label" htmlFor="New">
                New
              </label>
            </div>
            <div className="form-check form-check-inline square-checkbox">
              <input
                className="form-check-input"
                type="checkbox"
                id="Used"
                name="Used"
                checked={formData.Used}
                onChange={handleCheckboxChange}
              />
              <label className="form-check-label" htmlFor="Used">
                Used
              </label>
            </div>
            <div className="form-check form-check-inline square-checkbox">
              <input
                className="form-check-input"
                type="checkbox"
                id="Unspecified"
                name="Unspecified"
                checked={formData.Unspecified}
                onChange={handleCheckboxChange}
              />
              <label className="form-check-label" htmlFor="Unspecified">
                Unspecified
              </label>
            </div>
          </div>
        </div>

        <div className="form-group row my-3">
          <label className="col-sm-2 col-form-label">Shipping Options</label>
          <div className="col-sm-10">
            <div className="form-check form-check-inline square-checkbox">
              <input
                className="form-check-input"
                type="checkbox"
                id="LocalPickup"
                name="LocalPickup"
                checked={formData.LocalPickup}
                onChange={handleCheckboxChange}
              />
              <label className="form-check-label" htmlFor="LocalPickup">
                Local Pickup
              </label>
            </div>
            <div className="form-check form-check-inline square-checkbox">
              <input
                className="form-check-input"
                type="checkbox"
                id="FreeShipping"
                name="FreeShipping"
                checked={formData.FreeShipping}
                onChange={handleCheckboxChange}
              />
              <label className="form-check-label" htmlFor="FreeShipping">
                Free Shipping
              </label>
            </div>
          </div>
        </div>

        <div className="form-group row my-3">
          <label htmlFor="Distance" className="col-sm-2 col-form-label">
            Distance(Miles)
          </label>
          <div className="col-sm-2">
            <input
              type="number"
              id="Distance"
              name="Distance"
              value={formData.Distance}
              onChange={handleTextboxChange}
              className="form-control"
            />
          </div>
        </div>

        <div className="form-group row my-3">
          <label className="col-sm-2 col-form-label">
            From<span className="required-char">*</span>
          </label>
          <div className="col-sm-10" id="location-div">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                id="Current-Location-Radio"
                name="From"
                value="Current Location"
                checked={formData.From === "Current Location"}
                onChange={handleRadioChange}
              />
              <label
                className="form-check-label"
                htmlFor="Current-Location-Radio"
              >
                'Current Location'
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                id="Zipcode-Radio"
                name="From"
                value="Zipcode"
                checked={formData.From === "Zipcode"}
                onChange={handleRadioChange}
              />
              <label className="form-check-label" htmlFor="Zipcode-Radio">
                Other. Please specify zip <br />
                code:
              </label>
            </div>
          </div>
        </div>
        <div className="form-group row my-3">
          <div className="col-sm-2"></div>
          <div className="col-sm-10" id="location-div">
            <div className="col-sm-7">
              <input
                type="number"
                id="Zipcode"
                name="Zipcode"
                autoComplete="on"
                maxLength="5"
                value={formData.Zipcode}
                onChange={handleTextboxChange}
                disabled={formData.From !== "Zipcode"}
                required
                className="form-control"
              />
              {formData.From === "Zipcode" && formData.Zipcode === "" && (
                <p className="text-danger">Please enter a zipcode</p>
              )}
            </div>
          </div>
        </div>

        <div className="form-group row">
          <div className="col-sm-10">
            <button
              type="submit"
              disabled={
                formData.From === "Zipcode" && formData.Zipcode.length !== 5
              }
              className=" btn btn-primary btn-search"
            >
              Search
            </button>
            <button
              type="reset"
              onClick={handleClear}
              className="btn btn-secondary mx-5 btn-clear"
            >
              Clear
            </button>
          </div>
        </div>
      </form>

      <div className="text-center mt-3">
        <button
          className={`btn ${view === "Results" ? "active" : ""}`}
          onClick={() => setView("Results")}
        >
          Results
        </button>
        <button
          className={`btn ${view === "Wishlist" ? "active" : ""}`}
          onClick={() => setView("Wishlist")}
        >
          Wish List
        </button>
      </div>
      {view === "Results" && renderResultsView()}
      {view === "Wishlist" && renderWishlistView()}
    </div>
  );
}
