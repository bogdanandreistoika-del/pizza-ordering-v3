// https://console.firebase.google.com/
// user: bogdan personal gmail
// Project id: pizza-ordering-c23f3
// Project Name: pizza-ordering
// Project Number: 142060262413


// Replace with your Firebase project settings:
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "pizza-ordering-c23f3.firebaseapp.com",
  databaseURL: "https://pizza-ordering-c23f3-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "pizza-ordering-c23f3",
  storageBucket: "pizza-ordering-c23f3.firebasestorage.app",
  messagingSenderId: "142060262413",
  appId: "1:142060262413:web:d99c1ed2d3935d88147144",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

