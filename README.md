# AI Text Explainer - Chrome Extension

![Status](https://img.shields.io/badge/status-complete-success?style=for-the-badge)
![Tech](https://img.shields.io/badge/tech-JavaScript-yellow?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

An intelligent browser extension that provides instant, AI-powered explanations for any text you select on a webpage, powered by the Google Gemini API.

---

![demo](https://github.com/user-attachments/assets/37b45f5f-987d-46f1-98a9-1fdcc784f356)


## What It Does

In today's information-dense world, we constantly encounter new terms, concepts, and complex sentences. The typical workflow involves highlighting text, copying it, opening a new tab, and pasting it into a search engine or AI. This context-switching is inefficient and breaks concentration.

AI Text Explainer solves this problem by bringing the power of generative AI directly to your selection. Simply highlight any text, and a discreet "Explain" button appears. A single click provides a clear, concise explanation in a clean modal overlay, keeping you focused and in your workflow.

## ✅ Key Features

-   **On-Demand Explanations:** Get AI-generated explanations for any text on any webpage without leaving the page.
-   **Contextual UI:** An elegant "Explain" button appears contextually right next to your selected text, providing a seamless user experience.
-   **Secure API Key Storage:** Your Google Gemini API key is stored securely and locally using the `chrome.storage` API.
-   **Clean & Responsive Modal:** Explanations are displayed in a beautifully styled and responsive modal overlay that works on any site.
-   **Powered by Google Gemini:** Leverages the speed and intelligence of the Gemini API for high-quality, relevant explanations.

## 🛠️ Tech Stack

-   **JavaScript (ES6+):** Core logic for DOM manipulation, event handling, and API communication.
-   **Chrome Extension API (Manifest V3):** The foundation of the extension, including background service workers, content scripts, and secure storage.
-   **Google Gemini API:** The generative AI engine that provides the explanations.
-   **HTML5 & CSS3:** For the structure and styling of the popup and modal interfaces, including modern features like animations and dark mode support.

## 🚀 How to Install and Run Locally

Since this project is not on the Chrome Web Store, you can easily run it locally in developer mode.

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/YOUR-GITHUB-USERNAME/YOUR-REPO-NAME.git](https://github.com/YOUR-GITHUB-USERNAME/YOUR-REPO-NAME.git)
    ```

2.  **Open Chrome Extensions:**
    Navigate to `chrome://extensions` in your Chrome browser.

3.  **Enable Developer Mode:**
    Ensure the "Developer mode" toggle in the top-right corner is switched on.

4.  **Load the Extension:**
    Click the "Load unpacked" button and select the cloned project folder from your computer.

5.  **Add Your API Key:**
    Click the extension's icon in your Chrome toolbar. A popup will appear. Enter your Google Gemini API key (you can get one from [Google AI Studio](https://aistudio.google.com/app/apikey)) and click "Save Key."

The extension is now installed and ready to use!

## 🔮 Future Improvements

-   [ ] **User-Selectable Prompts:** Add an option in the settings to choose different explanation styles (e.g., "Explain Like I'm 5," "Detailed Technical Breakdown").
-   [ ] **Explanation History:** Store the last 10 explanations in local storage for easy access via the popup.
-   [ ] **Custom Prompts:** Allow users to create and save their own custom prompts to use on selected text.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
