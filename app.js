const API = 'https://onrender.com';

document.addEventListener('DOMContentLoaded', () => {
    const activePage = window.location.pathname.split('/').pop();
    if (activePage === 'shop.html' || activePage === 'categories.html' || activePage === '') {
        loadCatalog();
    }
});

async function loadCatalog() {
    const container = document.getElementById('shop-box');
    if (!container) return;
    
    try {
        const res = await fetch(`${API}/products`);
        if (!res.ok) return;
        
        const data = await res.json();
        
        if (data.length === 0) {
            container.innerHTML = '<p>Your MongoDB database is currently empty.</p>';
            return;
        }
        
        container.innerHTML = data.map(item => `
            <div class="card" style="border: 1px solid #ccc; padding: 20px; margin: 10px; border-radius: 8px; text-align: center; display: inline-block; width: 220px;">
                <img src="${item.img || 'placeholder.jpg'}" style="width: 100%; max-width: 150px; height: auto;">
                <h3>${item.name}</h3>
                <p>$${(item.price / 100).toFixed(2)}</p>
                <button style="background: #000; color: #fff; padding: 10px 20px; border: none; cursor: pointer;">Buy Now</button>
            </div>
        `).join('');
    } catch (err) {
        container.innerHTML = '<p>Could not connect to the live Render server.</p>';
    }
}
