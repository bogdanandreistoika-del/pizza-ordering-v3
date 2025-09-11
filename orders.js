const ordersList = document.getElementById("orders-list");
const clearBtn = document.getElementById("clear-orders");

// Listen for changes in Firebase
db.ref("orders").on("value", snapshot => {
  const orders = snapshot.val() || {};
  ordersList.innerHTML = "";

  const allOrders = Object.values(orders);
  if (allOrders.length === 0) {
    ordersList.innerHTML = "<p>No orders yet.</p>";
    return;
  }

  allOrders.forEach((order, index) => {
    const div = document.createElement("div");
    div.className = "order-card";
    div.innerHTML = `
      <h3>Order #${index + 1}</h3>
      <p><strong>Name:</strong> ${order.customer.name}</p>
      <p><strong>Phone:</strong> ${order.customer.phone}</p>
      <p><strong>Date:</strong> ${order.date}</p>
      <p><strong>Total:</strong> $${order.total}</p>
      <ul>
        ${order.cart.map(item => `<li>${item.name} x ${item.quantity}</li>`).join("")}
      </ul>
      <hr>
    `;
    ordersList.appendChild(div);
  });
});

// Clear all orders
clearBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all orders?")) {
    db.ref("orders").remove();
  }
});
