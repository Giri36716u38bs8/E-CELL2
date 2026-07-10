const API = 'https://e-cell2.onrender.com';
document.addEventListener('DOMContentLoaded', () => {
 const page = window.location.pathname.split('/').pop();
 if (page === 'shop.html') loadCatalog();
 if (page === 'support.html') wireSupportForm();
 if (page === 'order.html') wireOrderForm();
});

async function loadCatalog() {
 const container = document.getElementById('shop-box');
 if (!container) return;
 container.innerHTML = '<p style="color:#fff">Loading products...</p>';
 try {
 const res = await fetch(`${API}/api/products`);
 if (!res.ok) throw new Error('bad response');
 const data = await res.json();
 if (data.length === 0) {
 container.innerHTML = '<p style="color:#fff">No products in the database yet.</p>';
 return;
 }
 container.innerHTML = data.map(item => `
 <div class="product">
 <div class="image-placeholder">■</div>
 <div class="product-info">
 <h3>${item.name}</h3>
 <p class="price">$${(item.price / 100).toFixed(2)}</p>
 <button class="buy-btn" data-name="${item.name}" data-price="${item.price}" data-action="cart">Add <button class="buy-btn" data-name="${item.name}" data-price="${item.price}" data-action="buynow"  </div>
 </div>
 `).join('');
 container.querySelectorAll('.buy-btn').forEach(btn => {
 btn.addEventListener('click', () => {
 const item = { name: btn.dataset.name, price: Number(btn.dataset.price), qty: 1 };
 if (btn.dataset.action === 'cart') {
 addToCart(item);
 } else {
 checkout([item], false);
 }
 });
 });
 renderCartBar();
 } catch (err) {
 container.innerHTML = '<p style="color:#fff">Could not reach the store server. Is the backend deployed and is  }
}

function getCart() {
 return JSON.parse(localStorage.getItem('flux_cart') || '[]');
}
function saveCart(cart) {
 localStorage.setItem('flux_cart', JSON.stringify(cart));
 renderCartBar();
}
function addToCart(item) {
 const cart = getCart();
 const existing = cart.find(i => i.name === item.name);
 if (existing) existing.qty += 1;
 else cart.push(item);
 saveCart(cart);
}
function renderCartBar() {
 let bar = document.getElementById('cart-bar');
 if (!bar) {
 bar = document.createElement('div');
 bar.id = 'cart-bar';
 bar.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#fff;padding:16px 20px;border-radius:14p document.body.appendChild(bar);
 }
 const cart = getCart();
 const count = cart.reduce((sum, i) => sum + i.qty, 0);
 const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
 if (count === 0) {
 bar.innerHTML = '<strong>Cart is empty</strong>';
 return;
 }
 bar.innerHTML = `
 <strong>${count} item(s) — $${(total / 100).toFixed(2)}</strong><br>
 <button id="checkout-btn" style="margin-top:8px;padding:8px 14px;background:#1f1c2c;color:#fff;border:none;bor `;
 document.getElementById('checkout-btn').addEventListener('click', () => checkout(getCart(), true));
}

async function checkout(items, isFullCart) {
 const email = prompt('Enter your email to place the order:');
 if (!email) return;
 try {
 const res = await fetch(`${API}/api/checkout`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ email, items })
 });
 const data = await res.json();
 if (!res.ok) {
 alert(data.msg || 'Checkout failed');
 return;
 }
 alert(`Order placed! Your order number is ${data.orderNumber}. Save it so you can track your order.`);
 if (isFullCart) saveCart([]);
 } catch (err) {
 alert('Could not reach the store server.');
 }
}

function wireSupportForm() {
 const form = document.querySelector('.support form');
 if (!form) return;
 form.addEventListener('submit', async (e) => {
 e.preventDefault();
 const name = form.querySelector('input[type="text"]').value;
 const message = form.querySelector('textarea').value;
 const btn = form.querySelector('.submit-btn');
 const originalText = btn.textContent;
 btn.textContent = 'Sending...';
 btn.disabled = true;
 try {
 const res = await fetch(`${API}/api/support`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ name, message })
 });
 if (!res.ok) throw new Error('failed');
 btn.textContent = 'Sent!';
 form.reset();
 } catch (err) {
 btn.textContent = 'Failed to send, try again';
 } finally {
 setTimeout(() => { btn.textContent = originalText; btn.disabled = false; }, 2500);
 }
 });
}

function wireOrderForm() {
 const form = document.querySelector('.tracking form, .tracking- form');
 if (!form) return;
 form.addEventListener('submit', async (e) => {
 e.preventDefault();
 const inputs = form.querySelectorAll('input');
 const orderNumber = inputs[0].value;
 const email = inputs[1].value;
 try {
 const res = await fetch(`${API}/api/orders/${encodeURIComponent(orderNumber)}?email=${encodeURIComponent(e const data = await res.json();
 alert(res.ok ? `Status: ${data.status}` : (data.msg || 'Order not found'));
 } catch (err) {
 alert('Could not reach the store server.');
 }
 });
}
