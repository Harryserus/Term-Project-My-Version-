document.querySelector(".add-new-product-button").addEventListener(
  "click",
  () => {
    window.location.href = "/admin/product/add";
  },
)
document.querySelectorAll(".status-btn").forEach((button) => {
  button.addEventListener("click", async () => {
    const status = button.getAttribute("data-status");

    // Get all checked checkboxes
    const selectedCheckboxes = document.querySelectorAll(
      ".order-checkbox:checked",
    );
    const orderIds = Array.from(selectedCheckboxes).map((cb) => cb.value);

    if (orderIds.length === 0) {
      return alert("Please select at least one order.");
    }

    // Send the data to the server
    const response = await fetch("/admin/orders/update-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderIds, status }),
    });

    if (response.ok) {
      window.location.reload(); // Refresh to show new statuses
    } else {
      alert("Failed to update orders.");
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const categoryButtons = document.querySelectorAll(".category-button");
  const productCards = document.querySelectorAll(".product-card");

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // 1. Manage Active Class UI
      categoryButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // 2. Get the filter value
      const selectedPlatform = button.getAttribute("data-category");

      // 3. Filter the cards
      productCards.forEach((card) => {
        // Get platform from the data attribute we added in step 1
        const cardPlatforms = card.getAttribute("data-platform");

        if (
          selectedPlatform === "all" ||
          cardPlatforms.includes(selectedPlatform)
        ) {
          card.style.display = "flex"; // Show
        } else {
          card.style.display = "none"; // Hide
        }
      });
    });
  });

  document.querySelectorAll(".status-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".status-button")
        .forEach((btn) => btn.classList.remove("active"));
      btn.classList.add("active");
      const selectedStatus = btn.getAttribute("data-order-status");
      document.querySelectorAll(".order-card").forEach((order) => {
        const cardStatus = order.getAttribute("data-status");
        if (selectedStatus === "all" || cardStatus === selectedStatus) {
          order.style.display = "flex";
        } else {
          order.style.display = "none";
        }
      });
    });
  });
  document.getElementById("select_all").addEventListener("click", () => {
    const checkboxes = document.querySelectorAll(".order-checkbox");
    checkboxes.forEach((c) => {
      c.checked = !c.checked;
    });
  });
});
const searchInput = document.querySelector("#search-order");
const orderCards = document.querySelectorAll(".order-card");

searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();

  orderCards.forEach((card) => {
    // Grab the text from your EJS-rendered spans
    const orderId = card.querySelector(".order-number").innerText.toLowerCase();
    const userName = card
      .querySelector(".customer-name")
      .innerText.toLowerCase();

    // Check if the query exists in either field
    if (orderId.includes(query) || userName.includes(query)) {
      card.style.display = "flex"; // Show it
    } else {
      card.style.display = "none"; // Hide it
    }
  });
});
