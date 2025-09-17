const pizzas = [
  { id: 1, name: "Margherita", price: 8 },
  { id: 2, name: "Pepperoni", price: 10 },
  { id: 3, name: "BBQ Chicken", price: 12 },
  { id: 4, name: "Veggie", price: 9 },
  { id: 5, name: "Hawaiian", price: 11 }
];

let cart = [];
let editingOrderId = null; // track if editing an existing order

// DOM references
const menuDiv = document.getElementById("menu");
const cartList = document.getElementById("cart-list");
const totalEl = document.getElementById("total");
const orderBtn = document.getElementById("order-btn");
const nameInput = document.getElementById("customer-name");
const phoneInput = document.getElementById("customer-phone");

// Lookup
const lookupBtn = document.getElementById("lookup-btn");
const lookupPhone = document.getElementById("lookup-phone");
const myOrderDiv = document.getElementById("my-order");

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

// Place new or update existing order
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
    // Update existing order
    db.ref("orders/" + editingOrderId).set(order);
    alert("Order updated!");
    editingOrderId = null;
  } else {
    // Create new order
    db.ref("orders").push(order);
    alert("Order placed!");
  }

  cart = [];
  renderCart();
  nameInput.value = "";
  phoneInput.value = "";
  myOrderDiv.innerHTML = "";
});

// Lookup by phone
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
          <ul>${order.cart.map(i => `<li>${i.name} x ${i.quantity}</li>`).join("")}</ul>
          <button onclick="editOrder('${key}')">Edit</button>
          <button onclick="cancelOrder('${key}')">Cancel</button>
        `;
        myOrderDiv.appendChild(div);
      });
    });
});

// Cancel order
function cancelOrder(orderId) {
  db.ref("orders/" + orderId).remove().then(() => {
    alert("Order cancelled.");
    myOrderDiv.innerHTML = "";
  });
}

// Edit order
function editOrder(orderId) {
  db.ref("orders/" + orderId).once("value").then(snapshot => {
    if (snapshot.exists()) {
      const order = snapshot.val();
      // Load into form
      nameInput.value = order.customer.name;
      phoneInput.value = order.customer.phone;
      cart = order.cart;
      renderCart();
      editingOrderId = orderId;
      alert("You can now update your order and click Place Order to save changes.");
    }
  });
}
