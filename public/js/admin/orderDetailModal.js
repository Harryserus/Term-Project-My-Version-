/**
 * Opens the Order Modal and populates it with data.
 * @param {Object} order - The order object parsed from the data attribute.
 */
function openOrderModal(order) {
  const modal = document.getElementById("orderModal");
  const body = document.getElementById("modalBody");

  const itemsHTML = order.items
    .map(
      (item) => `
    <div class="modal-item-card">
      <div class="modal-img-wrapper">
        <img src="${item.thumbnailUrl}" alt="${item.title}">
      </div>
      <div style="flex-grow: 1;">
        <div class="modal-item-title">${item.title}</div>
        <div class="modal-item-meta">Qty: ${item.quantity} × $${item.priceAtPurchase}</div>
      </div>
      <div class="modal-item-price">$${(item.quantity * item.priceAtPurchase).toFixed(2)}</div>
    </div>
  `,
    )
    .join("");

  body.innerHTML = `
    <div class="modal-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem;">
      <div>
        <h2 class="modal-title">#${order.id}</h2>
        <div class="modal-user-line" style="color: #10b981; font-size: 0.9rem; margin-top: 5px;">
           Customer: <span style="color: #fff; font-weight: 600;">${order.userId}</span>
        </div>
      </div>
      <span class="modal-status status-${order.status.toLowerCase()}">${order.status}</span>
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
  // Lock body scroll so the user doesn't scroll the background
  document.body.style.overflow = "hidden";
}

/**
 * Closes the modal and restores page scroll.
 */
function closeModal() {
  const modal = document.getElementById("orderModal");
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

// --- GLOBAL EVENT LISTENERS ---

document.addEventListener("DOMContentLoaded", () => {
  const orderCards = document.querySelectorAll(".order-card");
  const modalOverlay = document.getElementById("orderModal");

  // 1. Open Modal on Card Click
  orderCards.forEach((card) => {
    card.addEventListener("click", (event) => {
      if (
        event.target.closest(".order-checkbox") ||
        event.target.closest("button")
      ) {
        return;
      }
      try {
        const orderData = JSON.parse(card.dataset.orderInfo);
        openOrderModal(orderData);
      } catch (err) {
        console.error("Data Parse Error:", err);
      }
    });
  });

  // 2. Click Outside to Close
  // We attach this to the overlay. event.target ensures we clicked the background, not the content.
  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
      closeModal();
    }
  });

  // 3. Escape Key to Close
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });
});
