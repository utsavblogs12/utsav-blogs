
import emailjs from 'https://cdn.jsdelivr.net/npm/emailjs-com@3.2.0/dist/email.min.js';
emailjs.init("H-0LYc7_KcX4DLx78");

async function sendEmailNotification(comment) {
  await emailjs.send("service_qmzjs3i", "template_xdxovvr", {
    message: comment
  });
}


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, getDocs, deleteDoc, doc, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCcQaB8fX2o0_kQh8pY9vzyX6uUfYk1j-A",
  authDomain: "utsav-blogs.firebaseapp.com",
  projectId: "utsav-blogs",
  storageBucket: "utsav-blogs.firebasestorage.app",
  messagingSenderId: "935516206475",
  appId: "1:935516206475:web:5cc3d2a0d6fe6b20456b8e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const adminEmail = "utsavshrma525@gmail.com";

const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");
const authSection = document.getElementById("authSection");
const dashboard = document.getElementById("dashboard");
const likeTotal = document.getElementById("likeTotal");
const commentList = document.getElementById("commentList");
const subscriberList = document.getElementById("subscriberList");

loginForm.onsubmit = async (e) => {
  e.preventDefault();
  const email = document.getElementById("adminEmail").value;
  const password = document.getElementById("adminPassword").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch {
    alert("Login failed");
  }
};

logoutBtn.onclick = () => signOut(auth);

onAuthStateChanged(auth, async (user) => {
  if (user && user.email === adminEmail) {
    dashboard.classList.remove("hidden");
    authSection.classList.add("hidden");
    await loadLikes();
    await loadComments();
    await loadSubscribers();
  } else {
    dashboard.classList.add("hidden");
    authSection.classList.remove("hidden");
  }
});

async function loadLikes() {
  const snap = await getDocs(collection(db, "likes"));
  likeTotal.innerText = snap.size;
}

async function loadComments() {
  const snap = await getDocs(collection(db, "comments"));
  commentList.innerHTML = "";
  snap.forEach(docSnap => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.className = "comment";
    div.innerHTML = `<strong>${data.text}</strong><br><button class="deleteBtn">Delete</button>`;
    div.querySelector("button").onclick = async () => {
      await deleteDoc(doc(db, "comments", docSnap.id));
      await loadComments();
    };
    commentList.appendChild(div);
  });
}

async function loadSubscribers() {
  const snap = await getDocs(collection(db, "subscribers"));
  subscriberList.innerHTML = "";
  snap.forEach(docSnap => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.className = "subscriber";
    div.textContent = data.email;
    subscriberList.appendChild(div);
  });
}

document.getElementById("postForm").onsubmit = async (e) => {
  e.preventDefault();
  const title = document.getElementById("postTitle").value;
  const body = document.getElementById("postBody").value;
  const image = document.getElementById("postImage").value;
  await addDoc(collection(db, "posts"), { title, body, image, createdAt: Date.now() });
  alert("Post published!");
  e.target.reset();
};


// Submit new post with WYSIWYG content
async function submitEditorPost() {
  const title = document.getElementById("editorTitle").value;
  const content = quill.root.innerHTML;
  const img = document.getElementById("editorImage").value;
  try {
    await addDoc(collection(db, "posts"), {
      title,
      body: content,
      image: img || "",
      created: new Date().toISOString()
    });
    alert("Post published!");
  } catch (e) {
    alert("Post failed.");
  }
}

const quill = new Quill('#editor', { theme: 'snow' });