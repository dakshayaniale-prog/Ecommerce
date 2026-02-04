/* ============================================================
   LUXORA — Shared JavaScript
   ============================================================ */

/* ---------- PRODUCT DATA ---------------------------------- */
const PRODUCTS = [
  {
    id: 1,
    name: "Minimalist Ceramic Vase",
    category: "Home Decor",
    price: 1299,
    oldPrice: 1799,
    badge: "New",
    color1: "#c9a96e", color2: "#8a7045"
  },
  {
    id: 2,
    name: "Linen Table Napkin Set",
    category: "Kitchen",
    price: 899,
    oldPrice: 1200,
    badge: "Sale",
    color1: "#a8c4b8", color2: "#6e9a86"
  },
  {
    id: 3,
    name: "Walnut Desk Organiser",
    category: "Office",
    price: 2499,
    oldPrice: null,
    badge: null,
    color1: "#8b6914", color2: "#5c4410"
  },
  {
    id: 4,
    name: "Handwoven Cotton Throw",
    category: "Bedroom",
    price: 1599,
    oldPrice: 2100,
    badge: "Popular",
    color1: "#b8a88a", color2: "#8a7d65"
  },
  {
    id: 5,
    name: "Brass Candle Holder",
    category: "Home Decor",
    price: 749,
    oldPrice: null,
    badge: null,
    color1: "#d4a843", color2: "#a07d2e"
  },
  {
    id: 6,
    name: "Ceramic Coffee Mug",
    category: "Kitchen",
    price: 599,
    oldPrice: 849,
    badge: "Sale",
    color1: "#7aadcf", color2: "#4d7da3"
  },
  {
    id: 7,
    name: "Bamboo Storage Box",
    category: "Storage",
    price: 1099,
    oldPrice: 1450,
    badge: null,
    color1: "#9aad7a", color2: "#6d8a4d"
  },
  {
    id: 8,
    name: "Leather Journal",
    category: "Stationery",
    price: 1849,
    oldPrice: null,
    badge: "New",
    color1: "#8b5e3c", color2: "#5c3a22"
  }
];

/* ---------- CART HELPERS ---------------------------------- */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem("luxora_cart")) || [];
  } catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem("luxora_cart", JSON.stringify(cart));
  updateBadges();
}

function updateBadges() {
  const total = getCart().reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll(".cart-badge").forEach(el => el.textContent = total);
}

/* ---------- PRODUCT SVG ICON (generic) ----------------- */
function productSVG(c1, c2) {
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="pg${Math.random().toString(36).slice(2,6)}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient></defs>
    <rect x="15" y="15" width="70" height="70" rx="10" fill="url(#pg${Math.random().toString(36).slice(2,6)})" opacity="0.7"/>
    <circle cx="50" cy="50" r="22" fill="${c1}" opacity="0.5"/>
  </svg>`;
}

/* ---------- RENDER PRODUCTS (index.html) -------------- */
function renderProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  grid.innerHTML = PRODUCTS.map(p => `
    <div class="product-card" data-id="${p.id}">
      <div class="product-img">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
        ${productSVG(p.color1, p.color2)}
      </div>
      <div class="product-info">
        <span class="product-cat">${p.category}</span>
        <h4>${p.name}</h4>
        <div class="product-price-row">
          <span class="product-price">₹${p.price.toLocaleString()}</span>
          ${p.oldPrice ? `<span class="product-price-old">₹${p.oldPrice.toLocaleString()}</span>` : ""}
        </div>
      </div>
      <button class="add-to-cart-btn" onclick="addToCart(${p.id}, this)">Add to Cart</button>
    </div>
  `).join("");
}

/* ---------- ADD TO CART -------------------------------- */
function addToCart(id, btn) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  let cart = getCart();
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, qty: 1, color1: product.color1, color2: product.color2 });
  }
  saveCart(cart);

  // Button feedback
  if (btn) {
    btn.textContent = "✓ Added";
    btn.classList.add("added");
    setTimeout(() => {
      btn.textContent = "Add to Cart";
      btn.classList.remove("added");
    }, 1400);
  }

  showATCToast(product.name);
}

/* ---------- ADD-TO-CART TOAST (bottom center) ---------- */
function showATCToast(name) {
  let toast = document.getElementById("atcToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "atc-toast";
    toast.id = "atcToast";
    document.body.appendChild(toast);
  }
  toast.textContent = `🛒  "${name}" added to cart`;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

/* ---------- CART PAGE LOGIC -------------------------------- */
function renderCart() {
  const cartItems   = document.getElementById("cartItems");
  const cartEmpty   = document.getElementById("cartEmpty");
  const cartContent = document.getElementById("cartContent");
  if (!cartItems) return; // not on cart page

  const cart = getCart();

  if (cart.length === 0) {
    cartEmpty.style.display   = "block";
    cartContent.style.display = "none";
    return;
  }
  cartEmpty.style.display   = "none";
  cartContent.style.display = "grid";

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item" id="cartItem${item.id}">
      <div class="cart-item-info">
        <div class="cart-item-thumb">${productSVG(item.color1, item.color2)}</div>
        <div><h5>${item.name}</h5><span>₹${item.price.toLocaleString()} each</span></div>
      </div>
      <span>₹${item.price.toLocaleString()}</span>
      <div class="qty-controls">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
        <span class="qty-val">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
      </div>
      <span>₹${(item.price * item.qty).toLocaleString()}</span>
      <button class="remove-btn" onclick="removeItem(${item.id})">🗑</button>
    </div>
  `).join("");

  calcTotals();
}

function changeQty(id, delta) {
  let cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  saveCart(cart);
  renderCart();
}

function removeItem(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  renderCart();
}

function clearCart() {
  saveCart([]);
  renderCart();
}

/* ---------- TOTALS & PROMO -------------------------------- */
let appliedDiscount = 0; // percentage

function calcTotals() {
  const cart     = getCart();
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 2000 ? 0 : 199;
  const discounted = subtotal - (subtotal * appliedDiscount / 100);
  const tax      = Math.round(discounted * 0.05);
  const total    = discounted + shipping + tax;

  setText("subtotal", `₹${subtotal.toLocaleString()}`);
  setText("shipping", shipping === 0 ? "Free" : `₹${shipping}`);
  setText("tax",      `₹${tax.toLocaleString()}`);
  setText("total",    `₹${total.toLocaleString()}`);
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

/* Promo codes map */
const PROMO_CODES = {
  "LUXORA10": 10,
  "WELCOME20": 20,
  "SAVE15":    15
};

function applyPromo() {
  const input = document.getElementById("promoInput");
  const msg   = document.getElementById("promoMsg");
  if (!input || !msg) return;

  const code = input.value.trim().toUpperCase();
  if (!code) { msg.className = "promo-msg error"; msg.textContent = "Please enter a code."; return; }

  if (PROMO_CODES[code] !== undefined) {
    appliedDiscount = PROMO_CODES[code];
    msg.className   = "promo-msg success";
    msg.textContent = `✓ "${code}" applied — ${appliedDiscount}% off!`;
    input.disabled  = true;
    calcTotals();
  } else {
    appliedDiscount = 0;
    msg.className   = "promo-msg error";
    msg.textContent = "Invalid promo code.";
    calcTotals();
  }
}

/* ---------- CHECKOUT MODAL -------------------------------- */
function checkout() {
  document.getElementById("checkoutModal").classList.add("open");
}

function closeModal() {
  document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("open"));
}

function placeOrder(e) {
  e.preventDefault();
  // Close checkout, open success
  document.getElementById("checkoutModal").classList.remove("open");
  document.getElementById("successModal").classList.add("open");
  saveCart([]); // clear cart after order
}

/* ---------- CONTACT FORM ---------------------------------- */
function submitContact(e) {
  e.preventDefault();
  // Gather values (for demonstration)
  const name    = document.getElementById("contactName").value;
  const email   = document.getElementById("contactEmail").value;
  const subject = document.getElementById("contactSubject").value;
  const message = document.getElementById("contactMessage").value;
  const newsletter = document.getElementById("newsletter").checked;

  console.log("Contact submission →", { name, email, subject, message, newsletter });

  // Reset form
  e.target.reset();

  // Show toast
  const toast = document.getElementById("toast");
  if (toast) {
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3800);
  }
}

/* ---------- CLOSE MODALS ON OVERLAY CLICK ------------------ */
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-overlay")) {
    e.target.classList.remove("open");
  }
});

/* ---------- INIT (runs on every page) ---------------------- */
document.addEventListener("DOMContentLoaded", () => {
  updateBadges();
  renderProducts();  // no-op if grid doesn't exist
  renderCart();      // no-op if cart elements don't exist
});
