// src/background.js

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // Fetch the current tab's URL
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var currentTab = tabs[0];
    var currentTabUrl = currentTab.url;

    // Make the fetch request to the Flask server
    fetch("http://localhost:5000/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: currentTabUrl, query: request.query }),
    })
      .then((response) => response.json())
      .then((data) => sendResponse(data))
      .catch((error) => console.error("Error:", error));
  });

  // Return true to keep the message channel open for asynchronous response
  return true;
});
