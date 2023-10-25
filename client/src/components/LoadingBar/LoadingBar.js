import React, { useEffect } from "react";
import "./styles.css";

export default function LoadingBar({ loadingProgress, setLoading }) {
  useEffect(() => {
    if (loadingProgress < 100) {
      const interval = setInterval(() => {
        setLoading((prevLoading) => {
          if (prevLoading < 100) {
            return prevLoading + 5;
          } else {
            clearInterval(interval);
            return 100;
          }
        });
      }, 200);
    }
  }, [loadingProgress, setLoading]);

  return (
    <div className="loading-bar-container">
      <div
        className="loading-bar"
        style={{ width: `${loadingProgress}%` }}
      ></div>
      <div className="loading-text">Loading... {loadingProgress}%</div>
    </div>
  );
}
