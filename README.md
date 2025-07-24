
# 🧾 Utsav Blog Setup Instructions

## ✅ Features
- Firebase-based admin login
- Comment system with moderation
- Newsletter subscription
- Blog post WYSIWYG editor
- Google AdSense integration (placeholder)
- SEO meta tags
- Email alerts via EmailJS

---

## 🌐 Custom Domain + HTTPS (with Firebase Hosting)
1. Go to https://console.firebase.google.com/
2. Choose your project (**utsav-blogs**)
3. Click **Hosting** > **Get Started**
4. Install Firebase CLI and run:
   ```bash
   firebase init
   firebase deploy
   ```
5. Under Hosting settings, click **Add custom domain**
6. Verify your domain and enable HTTPS

---

## 🛠 Future Work
- Add real Google AdSense `data-ad-client`
- Setup user login for commenters
- Use Firestore for post creation in WYSIWYG


---

## 📝 Markdown Blog Rendering (Dynamic)
- Use `blog.html?id=POST_ID` to view posts saved in Firestore.
- Blog body supports **Markdown** syntax using `marked.js`
- Post editor (admin.html) now saves HTML directly via Quill, or you can paste Markdown manually into Firestore.


---

## 👍 Like & Share Features
- Each blog post has a Like button saved in Firestore
- Share buttons for Facebook, X (Twitter), and WhatsApp


---

## 💬 Comment Replies
- Admin + users can reply to each comment.
- Replies are nested in Firestore under each comment.

## 🎯 View Counter
- Each blog post view is saved to Firestore.
- You can access view counts in the `views` collection.



---

## 🆕 Comment & Reply Enhancements
- Each comment and reply now shows **timestamp** ("2 min ago").
- Total **reply count** is displayed under each comment.
- Replies are only allowed **1 level deep** (no reply to replies).
