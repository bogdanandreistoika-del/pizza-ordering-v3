// Menu with 8 pizzas, each with small/large price
const pizzas = [
  { id: 1, name: "Margherita", small: 6, large: 10 },
  { id: 2, name: "Pepperoni", small: 7, large: 12 },
  { id: 3, name: "BBQ Chicken", small: 8, large: 13 },
  { id: 4, name: "Veggie", small: 6, large: 11 },
  { id: 5, name: "Hawaiian", small: 7, large: 12 },
  { id: 6, name: "Four Cheese", small: 8, large: 14 },
  { id: 7, name: "Meat Lovers", small: 9, large: 15 },
  { id: 8, name: "Seafood", small: 10, large: 16 }
];

let cart = [];
let editingOrderId = null;

// DOM references
const menuDiv = document.getElementById("menu");
const cartList = document.getElementById("cart-list");
const totalEl = document.getElementById("total");
const orderBtn = document.getElementById("order-btn");
const nameInput = document.getElementById("customer-name");
const phoneInput = document.getElementById("customer-phone");

const lookupBtn = document.getElementById("lookup-btn");
const lookupPhone = document.getElementById("lookup-phone");
const myOrderDiv = document.getElementById("my-order");

// Render menu with size options
pizzas.forEach(pizza => {
  const div = document.createElement("div");
  div.className = "pizza";
  div.innerHTML = `
    <strong>${pizza.name}</strong><br>
    <button onclick="addToCart(${pizza.id}, 'Small')">Small - $${pizza.small}</button>
    <button onclick="addToCart(${pizza.id}, 'Large')">Large - $${pizza.large}</button>
  `;
  menuDiv.appendChild(div);
});

function addToCart(pizzaId, size) {
  const pizza = pizzas.find(p => p.id === pizzaId);
  const price = size === "Small" ? pizza.small : pizza.large;
  const existing = cart.find(item => item.id === pizzaId && item.size === size);
  if (existing) existing.quantity++;
  else cart.push({ id: pizzaId, name: pizza.name, size, price, quantity: 1 });
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function renderCart() {
  cartList.innerHTML = "";
  let total = 0;
  cart.forEach((item, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.name} (${item.size}) x ${item.quantity} = $${item.price * item.quantity}
      <button onclick="removeFromCart(${idx})">X</button>`;
    cartList.appendChild(li);
    total += item.price * item.quantity;
  });
  totalEl.textContent = `Total: $${total}`;
}

// Place or update order
orderBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();

  if (!name || !phone || cart.length === 0) {
    alert("Please fill in name, phone, and add pizzas.");
    return;
  }

  const order = {
    customer: { name, phone },
    cart,
    total: cart.reduce((s, i) => s + i.price * i.quantity, 0),
    date: new Date().toLocaleString()
  };

  if (editingOrderId) {
    db.ref("orders/" + editingOrderId).set(order);
    alert("Order updated!");
    editingOrderId = null;
  } else {
    db.ref("orders").push(order);
    alert("Order placed!");
  }

  cart = [];
  renderCart();
  nameInput.value = "";
  phoneInput.value = "";
  myOrderDiv.innerHTML = "";
});

// Lookup
lookupBtn.addEventListener("click", () => {
  const phone = lookupPhone.value.trim();
  if (!phone) return;

  db.ref("orders").orderByChild("customer/phone").equalTo(phone).once("value")
    .then(snapshot => {
      myOrderDiv.innerHTML = "";
      if (!snapshot.exists()) {
        myOrderDiv.innerHTML = "<p>No order found.</p>";
        return;
      }
      snapshot.forEach(child => {
        const key = child.key;
        const order = child.val();
        const div = document.createElement("div");
        div.innerHTML = `
          <h3>Your Order</h3>
          <p>Name: ${order.customer.name}</p>
          <p>Phone: ${order.customer.phone}</p>
          <p>Total: $${order.total}</p>
          <p>Date: ${order.date}</p>
          <ul>${order.cart.map(i => `<li>${i.name} (${i.size}) x ${i.quantity}</li>`).join("")}</ul>
          <button onclick="editOrder('${key}')">Edit</button>
          <button onclick="cancelOrder('${key}')">Cancel</button>
        `;
        myOrderDiv.appendChild(div);
      });
    });
});

function cancelOrder(orderId) {
  db.ref("orders/" + orderId).remove().then(() => {
    alert("Order cancelled.");
    myOrderDiv.innerHTML = "";
  });
}

function editOrder(orderId) {
  db.ref("orders/" + orderId).once("value").then(snapshot => {
    if (snapshot.exists()) {
      const order = snapshot.val();
      nameInput.value = order.customer.name;
      phoneInput.value = order.customer.phone;
      cart = order.cart;
      renderCart();
      editingOrderId = orderId;
      alert("You can now update your order and click Place Order to save changes.");
    }
  });
}
