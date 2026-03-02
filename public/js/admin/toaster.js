function showGlassToast(message) {
  const toast = document.createElement("div");
  toast.className = "glass-toast";

  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <div style="font-size: 1.2rem;">✅</div>
      <div style="font-family: system-ui, sans-serif;">
        <p style="margin: 0; font-size: 0.85rem; font-weight: 600;">${message}</p>
      </div>
    </div>
    <div class="toast-progress"></div>
  `;

  document.body.appendChild(toast);

  // 1. Wait 1.5 seconds (The "Stay" time)
  setTimeout(() => {
    // 2. Start the 0.3s fade
    requestAnimationFrame(() => {
      toast.classList.add("toast-hidden");
    });

    // 3. Remove from DOM exactly when CSS finishes (300ms)
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 1500);
}

// Logic to check localStorage on load
window.addEventListener("load", () => {
  const msg = localStorage.getItem("realmNotification");
  if (msg) {
    showGlassToast(msg);
    localStorage.removeItem("realmNotification");
  }
});

// Logic to capture the button click
document.addEventListener("click", (e) => {
  // 1. Handle FORM Buttons (Add / Save)
  const btn = e.target.closest('button[type="submit"]');
  if (btn) {
    const form = btn.closest("form");
    if (form && form.checkValidity()) {
      const val = btn.innerText.toLowerCase();
      let text = "Changes Saved!"; // Default

      // If it's your Add form, it likely has "Add" in the button text
      if (
        val.includes("add") ||
        val.includes("create") ||
        val.includes("new")
      ) {
        text = "New Item Summoned! ✨";
      }

      localStorage.setItem("realmNotification", text);
    }
  }

  // 2. Handle DELETE Links (The Trash Icon)
  // This looks for any <a> tag that has "/delete/" in the URL
  const deleteLink = e.target.closest('a[href*="/delete/"]');
  if (deleteLink) {
    // Optional: Add a confirmation so they don't misclick
    const confirmed = confirm("Are you sure you want to banish this item?");

    if (confirmed) {
      localStorage.setItem(
        "realmNotification",
        "Item Banished to the Void! 🔥",
      );
    } else {
      e.preventDefault(); // Stop the deletion if they click 'Cancel'
    }
  }
});
