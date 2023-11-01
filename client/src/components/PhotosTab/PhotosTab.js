import React, { useState, useEffect } from "react";
import axios from "axios";

import "./styles.css";

export default function PhotosTab({ title }) {
  const [photoList, setPhotoList] = useState([]);
  useEffect(() => {
    axios
      .get(`/photos?productTitle=${title}`)
      .then((response) => {
        setPhotoList(response.data);
      })
      .catch((error) => {
        console.log("Could not retrieve photos");
        console.log(error);
      });
  }, [title]);

  const openPhotoInNewTab = (imageUrl) => {
    window.open(imageUrl, "_blank");
  };

  return (
    <div>
      <h2>Photos Tab</h2>
      <div className="photo-grid">
        {photoList.map((photo, index) => (
          <div key={index} className="photo-item">
            <img
              src={photo}
              alt={title}
              onClick={() => openPhotoInNewTab(photo)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
