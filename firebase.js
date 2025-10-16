// https://console.firebase.google.com/
// user: bogdan personal gmail
// Project id: pizza-ordering-c23f3
// Project Name: pizza-ordering
// Project Number: 142060262413
// orders pass: Bogdan123
// I think i gonna die but not now

// Replace with your Firebase project settings:
const firebaseConfig = {
  apiKey: "AIzaSyCxILhuDSU6AJq6J-NlYJukb88FX6Rd9X4",
  authDomain: "pizza-ordering-c23f3.firebaseapp.com",
  databaseURL: "https://pizza-ordering-c23f3-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "pizza-ordering-c23f3",
  storageBucket: "pizza-ordering-c23f3.appspot.com",
  messagingSenderId: "142060262413",
  appId: "1:142060262413:web:d99c1ed2d3935d88147144"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const auth = firebase.auth();
