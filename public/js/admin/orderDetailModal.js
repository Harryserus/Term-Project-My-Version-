function openOrderModal(order) {
  const modal = document.getElementById("orderModal");
  const body = document.getElementById("modalBody");

  // Map items to HTML
  const itemsHTML = order.items
    .map(
      (item) => `
    <div class="modal-item-card">
      <div class="modal-img-wrapper">
        <img src="${item.thumbnailUrl}" alt="${item.title}">
      </div>
      <div style="flex-grow: 1;">
        <div class="modal-item-title">${item.title}</div>
      </div>
      <div class="modal-item-price">$${(item.priceAtPurchase).toFixed(2)}</div>
    </div>
  `,
    )
    .join("");

  body.innerHTML = `
    <div class="modal-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem;">
      <div>
        <h2 class="modal-title">#${order.id || order._id}</h2>
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
      <div class="modal-total-value">$${(order.totalAmount).toFixed(2)}</div>
    </div>
  `;

  modal.style.display = "flex";
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

  orderCards.forEach((card) => {
    card.addEventListener("click", async (event) => {
      // 1. Ignore checkbox or button clicks
      if (
        event.target.closest(".order-checkbox") ||
        event.target.closest("button")
      ) {
        return;
      }

      try {
        // 2. Get info from data attribute

        const orderId = card.dataset.orderid;
        const userId = card.dataset.userid;

        // 3. GET fetch
        const response = await fetch(`/admin/order/${userId}/${orderId}`);

        if (!response.ok) throw new Error("Order details not found");

        const fullOrderData = await response.json();
        openOrderModal(fullOrderData);
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    });
  });

  // 4. Click Outside to Close
  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
      closeModal();
    }
  });

  // 5. Escape Key to Close
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });
});
