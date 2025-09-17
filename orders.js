const ordersList = document.getElementById("orders-list");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");

let currentUser = null;

loginBtn.addEventListener("click", () => {
  auth.signInWithEmailAndPassword(loginEmail.value, loginPassword.value)
    .catch(err => alert(err.message));
});

logoutBtn.addEventListener("click", () => {
  auth.signOut();
});

auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline";

    // Check if admin
    db.ref("admins/" + user.uid).once("value").then(snapshot => {
      if (snapshot.exists()) {
        // Admin → load all orders
        db.ref("orders").on("value", snap => {
          const orders = snap.val() || {};
          ordersList.innerHTML = "";
          Object.values(orders).forEach((order, idx) => {
            const div = document.createElement("div");
            div.innerHTML = `
              <h3>Order #${idx + 1}</h3>
              <p>Name: ${order.customer.name}</p>
              <p>Phone: ${order.customer.phone}</p>
              <p>Total: $${order.total}</p>
              <p>Date: ${order.date}</p>
              <ul>${order.cart.map(i => `<li>${i.name} x ${i.quantity}</li>`).join("")}</ul>
              <hr>
            `;
            ordersList.appendChild(div);
          });
        });
      } else {
        ordersList.innerHTML = "<p>You are not an admin.</p>";
      }
    });
  } else {
    currentUser = null;
    loginBtn.style.display = "inline";
    logoutBtn.style.display = "none";
    ordersList.innerHTML = "";
  }
});
