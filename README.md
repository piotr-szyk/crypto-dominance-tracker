# 🪙 Crypto Dominance Tracker

A real-time dashboard that fetches and visualizes market dominance data for top cryptocurrencies. This project demonstrates the ability to interact with RESTful APIs and manage asynchronous data flow in JavaScript.

![Difficulty: Medium](https://img.shields.io/badge/Difficulty-Medium-orange?style=for-the-badge)
![Topic: API Integration](https://img.shields.io/badge/Topic-REST_API-blue?style=for-the-badge)
![Tech: Async JS](https://img.shields.io/badge/Tech-Async_/_Await-yellow?style=for-the-badge)

---

## 🎯 Project Goal
To provide users with a clean, live-updating interface that tracks how much of the total crypto market cap is held by Bitcoin vs. Altcoins. This requires handling live data streams and transforming JSON responses into readable UI elements.

## 🛠️ Technical Implementation
This project highlights advanced frontend development skills:

* **Fetch API & Async/Await:** Implementing non-blocking code to retrieve data from external servers without freezing the browser UI.
* **REST API Consumption:** Interfacing with professional data providers (e.g., CoinGecko) to access real-time financial metrics.
* **JSON Parsing:** Extracting specific data points from complex nested objects to display to the user.
* **Error Handling:** Using `try...catch` blocks to ensure the application remains stable even if the API is down or the rate limit is reached.
* **Dynamic DOM Manipulation:** Updating the webpage content on-the-fly based on the fetched data.

## 🚀 Key Features
- **Real-Time Statistics:** Fetches the latest market dominance percentages.
- **Responsive Design:** Optimized for viewing on both desktop and mobile devices.
- **Clean UI:** Focuses on data readability and modern typography.

## 📂 Project Structure
- `index.html`: Main dashboard layout.
- `assets/js/script.js`: Handles API calls and data rendering logic.
- `assets/css/style.css`: Custom styling for the tracker interface.
