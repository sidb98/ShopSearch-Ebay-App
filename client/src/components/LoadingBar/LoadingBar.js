import React, { useEffect } from "react";

export default function LoadingBar({ loadingProgress, setLoading }) {
  // "Create a component for loading bar that will be displayed when the user is waiting for the response from the server" prompt (25 lines) ChatGPT, 4 Sep. version, OpenAI, 11 Sep. 2023, chat.openai.com/chat.
  useEffect(() => {
    if (loadingProgress < 100) {
      const interval = setInterval(() => {
        setLoading((prevLoading) => {
          if (prevLoading < 50) {
            return prevLoading + 5;
          } else {
            clearInterval(interval);
            return 50;
          }
        });
      }, 200);
    }
  }, [loadingProgress, setLoading]);

  return (
    <div className="loading-bar-container w-100">
      <div
        className="loading-bar"
        style={{ width: `${loadingProgress}%` }}
      ></div>
      <div className="loading-text">Loading... {loadingProgress}%</div>
    </div>
  );
}
