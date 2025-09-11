// Pizza menu
const pizzas = [
  { id: 1, name: "Margherita", price: 8 },
  { id: 2, name: "Pepperoni", price: 10 },
  { id: 3, name: "BBQ Chicken", price: 12 },
  { id: 4, name: "Veggie", price: 9 },
  { id: 5, name: "Hawaiian", price: 11 }
];

// Cart (still local, only orders are global)
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const menuDiv = document.getElementById("menu");
const cartList = document.getElementById("cart-list");
const totalEl = document.getElementById("total");
const orderBtn = document.getElementById("order-btn");
const nameInput = document.getElementById("customer-name");
const phoneInput = document.getElementById("customer-phone");

// Render menu
pizzas.forEach(pizza => {
  const button = document.createElement("button");
  button.textContent = `${pizza.name} - $${pizza.price}`;
  button.onclick = () => addToCart(pizza);
  menuDiv.appendChild(button);
});

// Add pizza to cart
function addToCart(pizza) {
  const existing = cart.find(item => item.id === pizza.id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...pizza, quantity: 1 });
  }
  saveCart();
  renderCart();
}

// Remove pizza from cart
function removeFromCart(pizzaId) {
  cart = cart.filter(item => item.id !== pizzaId);
  saveCart();
  renderCart();
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Render cart in UI
function renderCart() {
  cartList.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} x ${item.quantity} - $${item.price * item.quantity}
      <button onclick="removeFromCart(${item.id})">X</button>
    `;
    cartList.appendChild(li);
    total += item.price * item.quantity;
  });

  totalEl.textContent = `Total: $${total}`;
}

// Place order
orderBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();

  if (!name || !phone) {
    alert("Please enter your name and phone.");
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const order = {
    customer: { name, phone },
    cart: [...cart],
    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    date: new Date().toLocaleString()
  };

  // Save order to Firebase
  db.ref("orders").push(order);

  alert("Your order has been placed!");
  cart = [];
  saveCart();
  renderCart();
  nameInput.value = "";
  phoneInput.value = "";
});

// Render cart on page load
renderCart();
