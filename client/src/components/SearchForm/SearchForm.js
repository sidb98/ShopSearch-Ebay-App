import React, { useState } from "react";
import axios from "axios";
import SearchItemCard from "../SearchItemCard";

export default function SearchhtmlForm() {
  const ipinfoToken = process.env.REACT_APP_IPINFO_TOKEN;
  const geonameUsername = process.env.REACT_APP_GEONAME_USERNAME;

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

  const handleCategoryChange = (event) => {
    const { name, value } = event.target;
    // console.log(name, value);
    setFormData((formData) => ({ ...formData, [name]: value }));
  };

  const handleCheckboxChange = (event) => {
    const { name } = event.target;
    // console.log(name, value);
    setFormData((formData) => ({ ...formData, [name]: !formData[name] }));
  };

  const handleTextboxChange = (event) => {
    const { name, value } = event.target;
    // console.log(name, value);
    setFormData((formData) => ({ ...formData, [name]: value }));
    if (name === "Zipcode") {
    }
  };

  const handleRadioChange = (event) => {
    const { name, value } = event.target;
    // console.log(name, value);
    setFormData((formData) => ({ ...formData, [name]: value }));
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setShowKeywordError(false);
    setItems([]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log(formData);

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
        // console.log(zipcode);
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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Product Search</h1>
      <form id="serch-htmlForm" onSubmit={handleSubmit}>
        <label htmlFor="Keyword" className="tag">
          Keywords<span className="required-char">*</span>
        </label>
        <input
          type="text"
          id="Keyword"
          name="Keyword"
          autoComplete="on"
          value={formData.Keyword}
          onChange={handleTextboxChange}
          placeholder="Enter Product Name (eg Iphone 8)"
        />
        {showKeywordError && <p>Please enter a keyword</p>}
        <br></br>
        <label htmlFor="Category" className="tag">
          Category
        </label>
        <select
          id="Category"
          name="Category"
          value={formData.Category}
          onChange={handleCategoryChange}
        >
          <option value="all">All Categories</option>
          <option value="550">Art</option>
          <option value="2984">Baby</option>
          <option value="261186">Books</option>
          <option value="11450">Clothing, Shoes &amp; Accessories</option>
          <option value="58058">Computers/Tablets &amp; Networking</option>
          <option value="21136">Health &amp; Beauty</option>
          <option value="157003">Music</option>
          <option value="1249">Video Games &amp; Consoles</option>
        </select>
        <br></br>
        <label className="tag">Condition</label>
        <input
          type="checkbox"
          id="New"
          name="New"
          checked={formData.New}
          onChange={handleCheckboxChange}
        />{" "}
        New
        <input
          type="checkbox"
          id="Used"
          name="Used"
          checked={formData.Used}
          onChange={handleCheckboxChange}
        />{" "}
        Used
        <input
          type="checkbox"
          id="Unspecified"
          name="Unspecified"
          checked={formData.Unspecified}
          onChange={handleCheckboxChange}
        />{" "}
        Unspecified
        <br></br>
        <label className="tag">Shipping Options</label>
        <input
          type="checkbox"
          id="LocalPickup"
          name="LocalPickup"
          checked={formData.LocalPickup}
          onChange={handleCheckboxChange}
        />{" "}
        Local Pickup
        <input
          type="checkbox"
          id="FreeShipping"
          name="FreeShipping"
          checked={formData.FreeShipping}
          onChange={handleCheckboxChange}
        />{" "}
        Free Shipping
        <br></br>
        <label htmlFor="Distance" className="tag">
          Distance(Miles)
        </label>
        <input
          type="number"
          id="Distance"
          name="Distance"
          value={formData.Distance}
          onChange={handleTextboxChange}
        ></input>
        <br></br>
        <label className="tag">
          From<span className="required-char">*</span>
        </label>
        <div id="location-div">
          <input
            type="radio"
            id="Current-Location-Radio"
            name="From"
            value="Current Location"
            checked={formData.From === "Current Location"}
            onChange={handleRadioChange}
          />{" "}
          'Current Location'
          <input
            type="radio"
            id="Zipcode-Radio"
            name="From"
            value="Zipcode"
            checked={formData.From === "Zipcode"}
            onChange={handleRadioChange}
          />{" "}
          Other. Please specify zip code:
          <input
            type="number"
            id="Zipcode"
            name="Zipcode"
            autoComplete="on"
            value={formData.Zipcode}
            onChange={handleTextboxChange}
            disabled={formData.From !== "Zipcode"} // Enable/disable based on radio button
            required
          />
          {formData.From === "Zipcode" && formData.Zipcode === "" && (
            <>Please enter a zipcode</>
          )}
        </div>
        <br></br>
        <div>
          <button
            type="submit"
            disabled={
              formData.From === "Zipcode" && formData.Zipcode.length !== 5
            }
          >
            Search
          </button>

          <button
            type="reset"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      </form>
      <SearchItemCard items={items} />{" "}
    </div>
  );
}
