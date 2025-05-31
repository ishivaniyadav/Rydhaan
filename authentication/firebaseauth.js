import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  getDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCEotzbW4GpYIQEwpu3QMluMv5unpog4WE",
  authDomain: "rydhaan-56fe6.firebaseapp.com",
  projectId: "rydhaan-56fe6",
  storageBucket: "rydhaan-56fe6.firebasestorage.app",
  messagingSenderId: "1044560063486",
  appId: "1:1044560063486:web:1b074396e3b85423ab2eaf",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

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

document.getElementById("submitSignUp").addEventListener("click", async (event) => {
  event.preventDefault();
  const email = document.getElementById("rEmail").value;
  const password = document.getElementById("rPassword").value;
  const Name = document.getElementById("Name").value;
  const role = document.getElementById("role").value;
  const phoneNo = document.getElementById("phoneNo").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      email,
      Name,
      role,
      phoneNo,
    });

    showMessage("Account Created Successfully", "signUpMessage");

    if (role === "renter") {
      window.location.href = "../rydhaan-main/renter.html";
    } else if (role === "owner") {
      window.location.href = "../rydhaan-main/owner.html";
    } else {
      showMessage("Invalid role selected", "signUpMessage");
    }
  } catch (error) {
    const errorCode = error.code;
    showMessage(
      errorCode === "auth/email-already-in-use" ? "Email already exists!" : "Unable to create user",
      "signUpMessage"
    );
  }
});

document.getElementById("submitSignIn").addEventListener("click", async (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;
    localStorage.setItem("loggedInUserId", userId);

    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const role = userDoc.data().role;
      showMessage("Login Successful", "signInMessage");

      if (role === "renter") {
        window.location.href = "../rydhaan-main/renter.html";
      } else if (role === "owner") {
        window.location.href = "../rydhaan-main/owner.html";
      } else {
        showMessage("Invalid role data", "signInMessage");
      }
    } else {
      showMessage("User data not found", "signInMessage");
    }
  } catch (error) {
    const errorCode = error.code;
    showMessage(
      errorCode === "auth/user-not-found" ? "Account does not exist" : "Invalid credentials",
      "signInMessage"
    );
  }
});