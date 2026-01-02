// Import Firebase functions (Do not change these links)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, deleteDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- PASTE YOUR CONFIG HERE (From Firebase Console) ---
// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPXDv_R5wVvucQ9blPLutvYHcyBAQrPKY",
  authDomain: "bestgamestore-1474c.firebaseapp.com",
  projectId: "bestgamestore-1474c",
  storageBucket: "bestgamestore-1474c.firebasestorage.app",
  messagingSenderId: "562994919602",
  appId: "1:562994919602:web:1b1eda4154eb96db1ef1ab"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// --- DOM Elements ---
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userInfo = document.getElementById('user-info');
const userPic = document.getElementById('user-pic');
const wishlistLink = document.getElementById('nav-wishlist');

let currentUser = null;

// --- 1. Login Logic ---
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log("Logged in:", result.user);
            }).catch((error) => {
                console.error("Login failed", error);
            });
    });
}

// --- 2. Logout Logic ---
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => {
            console.log("Logged out");
            window.location.reload(); // Refresh page to clear data
        });
    });
}

// --- 3. Check User State (Runs automatically) ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is logged in
        currentUser = user;
        if (loginBtn) loginBtn.style.display = 'none';
        if (userInfo) userInfo.style.display = 'flex';
        if (wishlistLink) wishlistLink.style.display = 'block';
        if (userPic) userPic.src = user.photoURL;
        
        // If we are on the wishlist page, load the items
        if (window.location.pathname.includes('wishlist.html')) {
            loadWishlist();
        }
    } else {
        // User is logged out
        currentUser = null;
        if (loginBtn) loginBtn.style.display = 'block';
        if (userInfo) userInfo.style.display = 'none';
        if (wishlistLink) wishlistLink.style.display = 'none';
    }
});

// --- 4. Add to Wishlist (Global Function) ---
window.addToWishlist = async (gameID, title, thumb, price) => {
    if (!currentUser) {
        alert("Please login to use the Wishlist!");
        return;
    }

    try {
        await setDoc(doc(db, "users", currentUser.uid, "wishlist", gameID), {
            title: title,
            thumb: thumb,
            price: price
        });
        alert("Saved to Wishlist! ❤");
    } catch (e) {
        console.error("Error saving: ", e);
    }
};

// --- 5. Load Wishlist (Only for wishlist.html) ---
async function loadWishlist() {
    const grid = document.getElementById('wishlist-grid');
    if (!grid) return;

    grid.innerHTML = '<div class="loading">Loading your collection...</div>';
    
    const querySnapshot = await getDocs(collection(db, "users", currentUser.uid, "wishlist"));
    
    if (querySnapshot.empty) {
        grid.innerHTML = '<div class="loading">No games saved yet.</div>';
        return;
    }

    let html = '';
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        html += `
            <div class="featured-card" id="card-${doc.id}">
                <img src="${data.thumb}" class="featured-thumb">
                <div class="featured-info">
                    <div class="featured-title">${data.title}</div>
                    <div class="featured-price">
                        ${data.price}
                        <button onclick="removeFromWishlist('${doc.id}')" style="background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Remove</button>
                    </div>
                </div>
            </div>
        `;
    });
    grid.innerHTML = html;
}

// --- 6. Remove Function ---
window.removeFromWishlist = async (gameID) => {
    if (!confirm("Remove from wishlist?")) return;
    await deleteDoc(doc(db, "users", currentUser.uid, "wishlist", gameID));
    document.getElementById(`card-${gameID}`).remove();
};