// Firebase + Login + Likes + Comments + EmailJS Alerts
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, onSnapshot, query } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCcQaB8fX2o0_kQh8pY9vzyX6uUfYk1j-A",
  authDomain: "utsav-blogs.firebaseapp.com",
  projectId: "utsav-blogs",
  storageBucket: "utsav-blogs.firebasestorage.app",
  messagingSenderId: "935516206475",
  appId: "1:935516206475:web:5cc3d2a0d6fe6b20456b8e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

// Like System
const likeBtn = document.getElementById("likeBtn");
const likeCountSpan = document.getElementById("likeCount");

async function updateLikes() {
    const snap = await getDocs(collection(db, "likes"));
    likeCountSpan.innerText = snap.size;
}
async function addLike() {
    if (auth.currentUser) {
        await addDoc(collection(db, "likes"), { uid: auth.currentUser.uid, likedAt: Date.now() });
        updateLikes();
    } else {
        alert("Please log in to like.");
    }
}
likeBtn.addEventListener("click", addLike);
updateLikes();

// Comment System with EmailJS
const commentInput = document.getElementById("commentInput");
const commentList = document.getElementById("commentList");

async function addComment() {
    const text = commentInput.value.trim();
    if (text && auth.currentUser) {
        await addDoc(collection(db, "comments"), {
            text: text,
            createdAt: Date.now(),
            uid: auth.currentUser.uid
        });
        commentInput.value = "";

        // Send email alert via EmailJS
        emailjs.send("service_qmzjs3i", "template_xdxovvr", {
            comment: text,
            user_email: auth.currentUser.email
        }, "H-0LYc7_KcX4DLx78");
    } else {
        alert("Please log in to comment.");
    }
}
document.querySelector('button[onclick="addComment()"]').onclick = addComment;

onSnapshot(query(collection(db, "comments")), (snapshot) => {
    commentList.innerHTML = "";
    snapshot.forEach((doc) => {
        const li = document.createElement("li");
        li.textContent = doc.data().text;
        commentList.appendChild(li);
    });
});

// Auth UI
const authBox = document.getElementById("authBox");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");

loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const pass = loginForm.password.value;
    try {
        await signInWithEmailAndPassword(auth, email, pass);
    } catch {
        await createUserWithEmailAndPassword(auth, email, pass);
    }
    loginForm.reset();
};

logoutBtn.onclick = () => signOut(auth);

onAuthStateChanged(auth, (user) => {
    if (user) {
        authBox.innerHTML = `<p>Logged in as ${user.email}</p><button id="logoutBtn">Logout</button>`;
        document.getElementById("logoutBtn").onclick = () => signOut(auth);
    } else {
        authBox.innerHTML = `
            <form id="loginForm">
                <input type="email" name="email" placeholder="Email" required />
                <input type="password" name="password" placeholder="Password" required />
                <button type="submit">Login / Sign Up</button>
            </form>`;
        document.getElementById("loginForm").onsubmit = loginForm.onsubmit;
    }
});