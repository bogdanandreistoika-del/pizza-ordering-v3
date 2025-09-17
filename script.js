const pizzas = [
  { id: 1, name: "Margherita", price: 8 },
  { id: 2, name: "Pepperoni", price: 10 },
  { id: 3, name: "BBQ Chicken", price: 12 },
  { id: 4, name: "Veggie", price: 9 },
  { id: 5, name: "Hawaiian", price: 11 }
];

let cart = [];
let currentUser = null;

// DOM references
const menuDiv = document.getElementById("menu");
const cartList = document.getElementById("cart-list");
const totalEl = document.getElementById("total");
const orderBtn = document.getElementById("order-btn");

const nameInput = document.getElementById("customer-name");
const phoneInput = document.getElementById("customer-phone");

const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");

// Render pizza menu
pizzas.forEach(pizza => {
  const btn = document.createElement("button");
  btn.textContent = `${pizza.name} - $${pizza.price}`;
  btn.onclick = () => addToCart(pizza);
  menuDiv.appendChild(btn);
});

function addToCart(pizza) {
  const existing = cart.find(item => item.id === pizza.id);
  if (existing) existing.quantity++;
  else cart.push({ ...pizza, quantity: 1 });
  renderCart();
}

function removeFromCart(pizzaId) {
  cart = cart.filter(item => item.id !== pizzaId);
  renderCart();
}

function renderCart() {
  cartList.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `${item.name} x ${item.quantity} = $${item.price * item.quantity}
      <button onclick="removeFromCart(${item.id})">X</button>`;
    cartList.appendChild(li);
    total += item.price * item.quantity;
  });
  totalEl.textContent = `Total: $${total}`;
}

orderBtn.addEventListener("click", () => {
  if (!currentUser) {
    alert("Please log in first.");
    return;
  }
  if (!nameInput.value || !phoneInput.value || cart.length === 0) {
    alert("Fill in name, phone, and add pizzas.");
    return;
  }

  const order = {
    customer: { name: nameInput.value, phone: phoneInput.value },
    cart,
    total: cart.reduce((s, i) => s + i.price * i.quantity, 0),
    date: new Date().toLocaleString()
  };

  db.ref("orders/" + currentUser.uid).set(order);
  alert("Order saved!");
  cart = [];
  renderCart();
});

// Auth
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
  } else {
    currentUser = null;
    loginBtn.style.display = "inline";
    logoutBtn.style.display = "none";
  }
});
