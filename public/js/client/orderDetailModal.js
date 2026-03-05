function openOrderModal(order) {
  const modal = document.getElementById("orderModal");
  const body = document.getElementById("modalBody");

  const items = Array.isArray(order.items) ? order.items : [];

  const itemsHTML = items
    .map(
      (item) => `
      <div class="modal-item-card">
        <div class="modal-img-wrapper">
          <img src="${item.thumbnailUrl}" alt="${item.title}">
        </div>
        <div style="flex-grow: 1;">
          <div class="modal-item-title">${item.title}</div>
        </div>
        <div class="modal-item-price">$${Number(item.priceAtPurchase || 0).toFixed(2)}</div>
      </div>
    `
    )
    .join("");

  body.innerHTML = `
    <div class="modal-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem;">
      <div>
        <h2 class="modal-title">#${order.id || order._id}</h2>
      </div>
      <span class="modal-status status-${String(order.status || "pending").toLowerCase()}">${order.status || "pending"}</span>
    </div>

    <div class="modal-scroll-area">
      ${itemsHTML}
    </div>

    <div class="modal-footer" style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: baseline;">
      <span style="opacity: 0.5; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px;">Total Amount</span>
      <div class="modal-total-value">$${order.totalAmount}</div>
    </div>
  `;

  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = document.getElementById("orderModal");
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const orderCards = document.querySelectorAll(".order-card");
  const modalOverlay = document.getElementById("orderModal");

  orderCards.forEach((card) => {
    card.addEventListener("click", async () => {
      const orderId = card.dataset.orderid;
      if (!orderId) return;

      try {
        const response = await fetch("/customer/order/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: orderId }),
        });

        if (!response.ok) throw new Error("Order details not found");
        const fullOrderData = await response.json();
        openOrderModal(fullOrderData);
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    });
  });

  // click outside to close
  modalOverlay?.addEventListener("click", (event) => {
    if (event.target === modalOverlay) closeModal();
  });

  // escape to close
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });
});