const API = 'https://onrender.com';

document.addEventListener('DOMContentLoaded', () => {
    const activePage = window.location.pathname.split('/').pop();
    if (activePage === 'shop.html' || activePage === 'categories.html' || activePage === '') {
        loadStoreCatalog();
    }
});

async function loadStoreCatalog() {
    const grid = document.getElementById('shop-box');
    if (!grid) return;
    
    try {
        const response = await fetch(`${API}/products`);
        if (!response.ok) return;
        
        const products = await response.json();
        
        if (products.length === 0) {
            grid.innerHTML = '<p>No stock currently active in your database collection.</p>';
            return;
        }
        
        grid.innerHTML = products.map(item => `
            <div class="card" style="border:1px solid #ccc; padding:15px; margin:10px; border-radius:5px; text-align:center; display:inline-block; width:200px;">
                <img src="${item.img || 'placeholder.jpg'}" style="width:100%; max-width:120px;">
                <h3>${item.name}</h3>
                <p>$${(item.price / 100).toFixed(2)}</p>
                <button style="background-color:#222; color:#fff; padding:8px 12px; border:none; cursor:pointer;">Add</button>
            </div>
        `).join('');
    } catch (err) {
        grid.innerHTML = '<p>Cannot reach server layout right now.</p>';
    }
}
