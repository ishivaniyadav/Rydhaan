import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEotzbW4GpYIQEwpu3QMluMv5unpog4WE",
  authDomain: "rydhaan-56fe6.firebaseapp.com",
  projectId: "rydhaan-56fe6",
  storageBucket: "rydhaan-56fe6.appspot.com", 
  messagingSenderId: "1044560063486",
  appId: "1:1044560063486:web:1b074396e3b85423ab2eaf",
  measurementId: "G-SNBQK7H29M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); 
const db = getFirestore(app); 

// Show message function
function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);
  if (messageDiv) {
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    setTimeout(() => {
      messageDiv.style.display = "none";
    }, 5000);
  } else {
    console.error(`Message container with ID "${divId}" not found.`);
  }
}

// Sign Up Event Listener
document.getElementById('submitSignUp').addEventListener('click', async (event) => {
  event.preventDefault();
  const email = document.getElementById('rEmail').value;
  const password = document.getElementById('rPassword').value;
  const firstName = document.getElementById('fName').value;
  const lastName = document.getElementById('lName').value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      email,
      firstName,
      lastName,
    });

    showMessage("Account Created Successfully", "signUpMessage");
    window.location.href = "homepage.html";
  } catch (error) {
    console.error("Error creating user:", error); 
    showMessage(error.message, "signUpMessage"); 
  }
});

// Sign In Event Listener
document.getElementById('submitSignIn').addEventListener('click', async (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    localStorage.setItem("loggedInUserId", userCredential.user.uid);
    showMessage("Login Successful", "signInMessage");
    window.location.href = "homepage.html";
  } catch (error) {
    console.error("Login error:", error); 
    showMessage(error.message, "signInMessage"); 
  }
});
