import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* 🔥 YOUR FIREBASE CONFIG HERE 🔥 */
const firebaseConfig = {
    apiKey: "AIzaSyBiUIVQ56dsKRKCy4EjH-dbXafgB0B24VQ",
    authDomain: "habit-tracker-pro-d8ed4.firebaseapp.com",
    projectId: "habit-tracker-pro-d8ed4",
    storageBucket: "habit-tracker-pro-d8ed4.firebasestorage.app",
    messagingSenderId: "553812934904",
    appId: "1:553812934904:web:670994364e8907845f7b0d",
    measurementId: "G-MBJSMVRD3G"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* 🔑 MAKE FUNCTIONS GLOBAL */
window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful");
  } catch (err) {
    alert(err.message);
  }
};

window.signup = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Account created");
  } catch (err) {
    alert(err.message);
  }
};

window.addHabit = async function () {
  const habitText = document.getElementById("habitInput").value;
  if (!habitText) return;

  const user = auth.currentUser;
  if (!user) {
    alert("Login first");
    return;
  }

  await addDoc(collection(db, "habits"), {
    uid: user.uid,
    name: habitText,
    createdAt: new Date()
  });

  document.getElementById("habitInput").value = "";
  loadHabits();
};

async function loadHabits() {
  const user = auth.currentUser;
  if (!user) return;

  const q = query(
    collection(db, "habits"),
    where("uid", "==", user.uid)
  );

  const snapshot = await getDocs(q);
  const container = document.getElementById("habits");
  container.innerHTML = "";

  snapshot.forEach(doc => {
    const d = doc.data();
    container.innerHTML += `<div class="habit">${d.name}</div>`;
  });
}

onAuthStateChanged(auth, user => {
  if (user) {
    loadHabits();
  }
});

