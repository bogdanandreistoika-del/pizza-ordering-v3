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

    db.ref("admins/" + user.uid).once("value").then(snapshot => {
      if (snapshot.exists()) {
        db.ref("orders").on("value", snap => {
          const orders = snap.val() || {};
          ordersList.innerHTML = "";
          Object.entries(orders).forEach(([id, order], idx) => {
            const div = document.createElement("div");
            div.innerHTML = `
              <h3>Order #${idx + 1}</h3>
              <p><strong>Name:</strong> ${order.customer.name}</p>
              <p><strong>Phone:</strong> ${order.customer.phone}</p>
              <p><strong>Total:</strong> $${order.total}</p>
              <p><strong>Date:</strong> ${order.date}</p>
              <ul>${order.cart.map(i => `<li>${i.name} x ${i.quantity}</li>`).join("")}</ul>
              <button onclick="deleteOrder('${id}')">Delete</button>
              <hr>
            `;
            ordersList.appendChild(div);
          });
        });
      } else {
        ordersList.innerHTML = "<p>You are not authorized.</p>";
      }
    });
  } else {
    currentUser = null;
    loginBtn.style.display = "inline";
    logoutBtn.style.display = "none";
    ordersList.innerHTML = "";
  }
});

function deleteOrder(id) {
  if (confirm("Delete this order?")) {
    db.ref("orders/" + id).remove();
  }
}
