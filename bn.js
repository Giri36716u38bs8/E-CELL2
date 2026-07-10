const API = 'https://onrender.com';
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
 <button class="buy-btn">Add to Cart</button>
 </div>
 </div>
 `).join('');
 } catch (err) {
 container.innerHTML = '<p style="color:#fff">Could not reach the store server. Is the backend deployed and is  }
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

