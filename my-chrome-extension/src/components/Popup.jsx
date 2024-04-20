import { useState, useEffect } from "react";
import "./Popup.css";
import { IoSearchCircleSharp } from "react-icons/io5";

function Popup() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Function to save state to Chrome's local storage
  const saveState = (state) => {
    chrome.storage.local.set({ queryState: state });
  };

  // Function to load state from Chrome's local storage
  const loadState = () => {
    chrome.storage.local.get("queryState", (data) => {
      const state = data.queryState;
      if (state) {
        setIsLoading(state.loading);
        setQuery(state.query || "");
        setResponse(state.response || "");
      }
    });
  };

  useEffect(() => {
    // Load the initial state and update the UI
    loadState();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    saveState({ loading: true, query });

    // Send message to background script
    chrome.runtime.sendMessage({ query }, (response) => {
      setIsLoading(false);
      if (response && response.answer && response.sources) {
        setResponse(
          `<p>Answer: ${response.answer}</p><p>Sources: <a href="${response.sources}" target="_blank">${response.sources}</a></p>`
        );
      } else {
        setResponse("<p>No valid response received.</p>");
      }
      saveState({ loading: false, response });
    });
  };

  const handleClear = (event) => {
    event.preventDefault();
    setResponse("");
    setIsLoading(false);
    saveState({ loading: false, response: "" });
  };

  return (
    <div className="popup-container">
      <img
        src="./icons/llamao-logo.png"
        alt="Extension Icon"
        className="extension-icon"
      />

      <div className="input-group">
        <input
          type="text"
          placeholder="Ask a question..."
          id="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button id="submit" onClick={handleSubmit}>
          <IoSearchCircleSharp className="search-icon" />
        </button>
      </div>

      {response && (
        <>
          <div
            id="response-container"
            className="response-container"
            dangerouslySetInnerHTML={{ __html: response }}
          ></div>
          <button id="clear" onClick={handleClear}>
            ✖
          </button>
        </>
      )}

      {isLoading && (
        <div id="loading-container" className="loading-container">
          Loading...
        </div>
      )}
    </div>
  );
}

export default Popup;

// import { useState, useEffect } from "react";
// import "./Popup.css";
// import { IoSearchCircleSharp } from "react-icons/io5";

// function Popup() {
//   const [query, setQuery] = useState("");
//   const [response, setResponse] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   // Function to save state to Chrome's local storage
//   const saveState = (state) => {
//     chrome.storage.local.set({ queryState: state });
//   };

//   // Function to load state from Chrome's local storage
//   const loadState = () => {
//     chrome.storage.local.get("queryState", (data) => {
//       const state = data.queryState;
//       if (state) {
//         setIsLoading(state.loading);
//         setQuery(state.query || "");
//         setResponse(state.response || "");
//       }
//     });
//   };

//   useEffect(() => {
//     // Load the initial state and update the UI
//     loadState();
//   }, []);

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     setIsLoading(true);
//     saveState({ loading: true, query });

//     // Simulate a delay of 5 seconds before showing the response
//     setTimeout(() => {
//       setResponse(
//         `<p>Fyodor Dostoevsky wrote novels that explore profound psychological depth, moral dilemmas, and existential themes. His works often delve into the complexities of human nature, tackling questions of morality, ethics, and the search for meaning. Dostoevsky's narratives also provide social and political critiques, reflecting the turbulent context of 19th-century Russia. Overall, his books are known for their intricate character studies, psychological insights, and exploration of fundamental aspects of the human experience.</p>`
//       );
//       setIsLoading(false);
//       saveState({ loading: false, response });
//     }, 5000);
//   };

//   const handleClear = (event) => {
//     event.preventDefault();
//     setResponse("");
//     setIsLoading(false);
//     saveState({ loading: false, response: "" });
//   };

//   return (
//     <div className="popup-container">
//       <img
//         src="./icons/llamao-logo.png"
//         alt="Extension Icon"
//         className="extension-icon"
//       />

//       <div className="input-group">
//         <input
//           type="text"
//           placeholder="Ask a question..."
//           id="query"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//         />
//         <button id="submit" onClick={handleSubmit}>
//           <IoSearchCircleSharp className="search-icon" />
//         </button>
//       </div>

//       {response && (
//         <>
//           <div
//             id="response-container"
//             className="response-container"
//             dangerouslySetInnerHTML={{ __html: response }}
//           ></div>
//           <button id="clear" onClick={handleClear}>
//             ✖
//           </button>
//         </>
//       )}

//       {isLoading && (
//         <div id="loading-container" className="loading-container">
//           Loading...
//         </div>
//       )}
//     </div>
//   );
// }

// export default Popup;
