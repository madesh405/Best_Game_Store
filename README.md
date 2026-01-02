# 🎮 The Best Game Store 

![Project Status](https://img.shields.io/badge/Status-Live-success)
![Tech Stack](https://img.shields.io/badge/Stack-HTML%20|%20CSS%20|%20JS%20|%20Firebase-orange)
![License](https://img.shields.io/badge/License-MIT-blue)

A modern, responsive web application that helps gamers find the absolute lowest prices for PC games. It aggregates real-time data from over 25+ digital retailers (Steam, Epic Games, Humble Bundle, etc.) and allows users to track their favorite games.

## 🚀 Live Demo
**[Click here to visit the website](https://madesh405.github.io/Best_Game_Store/)**

---

## ✨ Key Features

* **🔍 Global Search:** Instantly search for any game and see prices from all major stores.
* **📊 Price Comparison:** Compare prices side-by-side to ensure you get the best deal.
* **💎 Budget Corner:** Curated "Gems under ₹900" section for budget-conscious gamers.
* **👤 User Authentication:** Secure Google Sign-In powered by **Firebase Auth**.
* **❤️ Cloud Wishlist:** Save games to your personal wishlist. Data is stored in **Cloud Firestore**, so it syncs across devices.
* **🔔 Interactive UI:** Features custom toast notifications, loading states, and a glassmorphism design.
* **📱 Fully Responsive:** Works perfectly on Desktops, Tablets, and Mobile phones.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript (ES6 Modules).
* **Backend / Database:** Firebase Authentication, Cloud Firestore.
* **API:** [CheapShark API](https://apidocs.cheapshark.com/) (for game data).
* **Hosting:** GitHub Pages.

---

## 📸 Screenshots

<img width="1919" height="1034" alt="image" src="https://github.com/user-attachments/assets/8e87dd67-4c8e-4b42-a75a-a1e5a3cd12df" />
<img width="1919" height="1038" alt="image" src="https://github.com/user-attachments/assets/3d3ce935-1e88-42a5-80e9-6fc821ba2eae" />


---

## ⚙️ How to Run Locally

If you want to run this project on your own computer, follow these steps:

### Prerequisites
* Visual Studio Code (recommended).
* "Live Server" extension for VS Code OR Python installed.

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/madesh405/Best_Game_Store.git](https://github.com/madesh405/Best_Game_Store.git)
    cd Best_Game_Store
    ```

2.  **Run the App**
    * **Option A (VS Code):** Open `index.html`, right-click, and select **"Open with Live Server"**.
    * **Option B (Python):** Run `python -m http.server` in the terminal and visit `http://localhost:8000`.

    > **⚠️ Important:** You cannot run this project by double-clicking the HTML file. It must run on a local server (`localhost`) for Google Login to work.

---

## 🔐 Firebase Configuration

This project uses Firebase for the backend. The configuration keys are located in `firebase-logic.js`.
* **Note on Security:** The Firebase API key is visible in the client-side code. This is standard for Firebase Web Apps. The database is secured using **Firestore Security Rules** which prevent unauthorized access to user data.

---

## 🤝 Credits

* Game data provided by the awesome **[CheapShark API](https://www.cheapshark.com/)**.
* Icons and Avatars via Google & UI Avatars.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Made with ❤️ by [Madesh](https://github.com/madesh405)
