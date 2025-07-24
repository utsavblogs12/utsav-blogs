
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCcQaB8fX2o0_kQh8pY9vzyX6uUfYk1j-A",
  authDomain: "utsav-blogs.firebaseapp.com",
  projectId: "utsav-blogs",
  storageBucket: "utsav-blogs.appspot.com",
  messagingSenderId: "935516206475",
  appId: "1:935516206475:web:5cc3d2a0d6fe6b20456b8e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Parse post ID from URL
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

async function loadPost() {
  if (!postId) return;

  const postRef = doc(db, "posts", postId);
  const snap = await getDoc(postRef);
  if (!snap.exists()) {
    document.getElementById("postTitle").innerText = "Post not found";
    return;
  }

  const data = snap.data();
  document.getElementById("postTitle").innerText = data.title;
  document.getElementById("postImage").src = data.image || "";
  if (data.image) document.getElementById("postImage").style.display = "block";

  // If Markdown, render via marked
  document.getElementById("postBody").innerHTML = marked.parse(data.body);
}

loadPost();


// LIKE + SHARE logic
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const likeBtn = document.getElementById("likeBtn");
const likeCount = document.getElementById("likeCount");

async function loadLikes() {
  if (!postId) return;
  const likeRef = doc(db, "likes", postId);
  const snap = await getDoc(likeRef);
  likeCount.innerText = snap.exists() ? snap.data().count : 0;
}

likeBtn?.addEventListener("click", async () => {
  const likeRef = doc(db, "likes", postId);
  await setDoc(likeRef, { count: increment(1) }, { merge: true });
  loadLikes();
});

loadLikes();

// SHARE
const pageUrl = window.location.href;
document.getElementById("shareFacebook").href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
document.getElementById("shareTwitter").href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}`;
document.getElementById("shareWhatsApp").href = `https://api.whatsapp.com/send?text=${encodeURIComponent(pageUrl)}`;


// 💬 Reply to Comments
async function renderComment(comment, id) {
  const div = document.createElement("div");
  div.className = "comment";
  div.innerHTML = `
    <p><strong>${comment.name}</strong>: ${comment.text}</p>
    <button onclick="showReplyForm('${id}')">Reply</button>
    <div id="replyForm-${id}" style="display:none; margin-left:20px;">
      <input type="text" placeholder="Your Name" id="replyName-${id}" />
      <input type="text" placeholder="Your Reply" id="replyText-${id}" />
      <button onclick="submitReply('${id}')">Submit Reply</button>
    </div>
    <div id="replies-${id}" style="margin-left:20px;"></div>
  `;
  document.getElementById("commentList")?.appendChild(div);
  loadReplies(id);
}

async function showReplyForm(commentId) {
  document.getElementById("replyForm-" + commentId).style.display = "block";
}

async function submitReply(commentId) {
  const name = document.getElementById("replyName-" + commentId).value;
  const text = document.getElementById("replyText-" + commentId).value;
  if (!name || !text) return alert("Please fill in both fields.");
  const replyRef = collection(db, "comments", commentId, "replies");
  await addDoc(replyRef, { name, text, timestamp: Date.now() });
  loadReplies(commentId);
}

async async function loadReplies(commentId) {
  const repliesRef = collection(db, "comments", commentId, "replies");
  const q = query(repliesRef, orderBy("timestamp", "asc"));
  const snap = await getDocs(q);
  const container = document.getElementById("replies-" + commentId);
  container.innerHTML = "";
  snap.forEach(doc => {
    const reply = doc.data();
    const div = document.createElement("div");
    div.innerHTML = `<p><strong>${reply.name}</strong>: ${reply.text}</p>`;
    container.appendChild(div);
  });
}

// 🎯 View Counter
async function incrementViewCount() {
  if (!postId) return;
  const postRef = doc(db, "views", postId);
  await setDoc(postRef, { count: increment(1) }, { merge: true });
}
incrementViewCount();


function timeAgo(timestamp) {
  const now = Date.now();
  const secondsPast = (now - timestamp) / 1000;
  if (secondsPast < 60) return 'just now';
  if (secondsPast < 3600) return Math.floor(secondsPast / 60) + ' min ago';
  if (secondsPast < 86400) return Math.floor(secondsPast / 3600) + ' hr ago';
  return new Date(timestamp).toLocaleDateString();
}


async function renderComment(comment, id) {
  const div = document.createElement("div");
  div.className = "comment";
  const time = comment.timestamp ? timeAgo(comment.timestamp) : '';
  div.innerHTML = `
    <p><strong>${comment.name}</strong> (${time}): ${comment.text}</p>
    <span id="replyCount-${id}">Replies: 0</span><br>
    <button onclick="showReplyForm('${id}')">Reply</button>
    <div id="replyForm-${id}" style="display:none; margin-left:20px;">
      <input type="text" placeholder="Your Name" id="replyName-${id}" />
      <input type="text" placeholder="Your Reply" id="replyText-${id}" />
      <button onclick="submitReply('${id}')">Submit Reply</button>
    </div>
    <div id="replies-${id}" style="margin-left:20px;"></div>
  `;
  document.getElementById("commentList")?.appendChild(div);
  loadReplies(id);
}

async function loadReplies(commentId) {
  const repliesRef = collection(db, "comments", commentId, "replies");
  const q = query(repliesRef, orderBy("timestamp", "asc"));
  const snap = await getDocs(q);
  const container = document.getElementById("replies-" + commentId);
  container.innerHTML = "";
  let count = 0;
  snap.forEach(doc => {
    const reply = doc.data();
    const time = reply.timestamp ? timeAgo(reply.timestamp) : '';
    const div = document.createElement("div");
    div.innerHTML = `<p><strong>${reply.name}</strong> (${time}): ${reply.text}</p>`;
    container.appendChild(div);
    count++;
  });
  const counter = document.getElementById("replyCount-" + commentId);
  if (counter) counter.innerText = `Replies: ${count}`;
}
