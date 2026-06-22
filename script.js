const STORAGE_KEY = "simpleAdsStorage";
let ads = [
    { id: 1, title: "BMW E46 - 5000лв", category: "Cars", price: "5000лв", imageUrl: "https://picsum.photos/seed/bmw/800/500", createdAt: "2026-06-10T09:15:00.000Z" },
    { id: 2, title: "Audi A4 2008", category: "Cars", price: "6200лв", imageUrl: "https://picsum.photos/seed/audi/800/500", createdAt: "2026-06-12T14:20:00.000Z" },
    { id: 3, title: "iPhone 13 Pro", category: "Phones", price: "1200лв", imageUrl: "https://picsum.photos/seed/iphone/800/500", createdAt: "2026-06-15T08:45:00.000Z" },
    { id: 4, title: "PS5 конзола", category: "Games", price: "900лв", imageUrl: "https://picsum.photos/seed/ps5/800/500", createdAt: "2026-06-18T17:30:00.000Z" },
    { id: 5, title: "Лаптоп Lenovo i5", category: "Laptops", price: "1500лв", imageUrl: "https://picsum.photos/seed/lenovo/800/500", createdAt: "2026-06-20T11:00:00.000Z" }
];
let nextAdId = 6;

const container = document.getElementById("ads");
const resultCount = document.getElementById("resultCount");
const totalAdsEl = document.getElementById("totalAds");
const visibleAdsEl = document.getElementById("visibleAds");
const totalCategoriesEl = document.getElementById("totalCategories");
const search = document.getElementById("search");
const newAdInput = document.getElementById("newAd");
const newPriceInput = document.getElementById("newPrice");
const newImageInput = document.getElementById("newImage");
const categoryFilter = document.getElementById("category");
const categorySelect = document.getElementById("categorySelect");
const sortOrder = document.getElementById("sortOrder");
const themeToggle = document.getElementById("themeToggle");
const editModal = document.getElementById("editModal");
const editTitleInput = document.getElementById("editTitle");
const editPriceInput = document.getElementById("editPrice");
const editImageInput = document.getElementById("editImage");
const editCategoryInput = document.getElementById("editCategory");
let currentEditId = null;
const THEME_KEY = "simpleAdsTheme";
const CART_KEY = "simpleAdsCart";

const cartToggle = document.getElementById("cartToggle");
const cartModal = document.getElementById("cartModal");
const cartItemsContainer = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const successModal = document.getElementById("successModal");

let cart = [];

const categoryIcons = {
    Cars: "🚗",
    Phones: "📱",
    Laptops: "💻",
    Games: "🎮"
};

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}

function loadCart() {
    const stored = localStorage.getItem(CART_KEY);
    if (!stored) return;
    try {
        cart = JSON.parse(stored);
    } catch (e) {
        console.error("Failed to load cart", e);
        cart = [];
    }
}

function updateCartCount() {
    cartCountEl.textContent = cart.length;
}

function addToCart(adId) {
    const ad = ads.find(a => a.id === adId);
    if (!ad) return;
    
    const existingItem = cart.find(item => item.id === adId);
    if (existingItem) {
        alert("This item is already in your cart!");
        return;
    }
    
    cart.push({
        id: ad.id,
        title: ad.title,
        category: ad.category,
        price: ad.price
    });
    
    saveCart();
}

function removeFromCart(adId) {
    cart = cart.filter(item => item.id !== adId);
    saveCart();
    displayCartItems();
}

function displayCartItems() {
    cartItemsContainer.innerHTML = "";
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<div style="padding: 20px; text-align: center; color: #6b7280;">Your cart is empty</div>`;
        document.getElementById("cartTotalPrice").textContent = "$0";
        return;
    }
    
    let total = 0;
    cart.forEach(item => {
        const priceNum = parseInt(item.price.replace(/[^\d]/g, '')) || 0;
        total += priceNum;
        
        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h3 class="cart-item-title">${item.title}</h3>
                    <p class="cart-item-category">${item.category}</p>
                </div>
                <div class="cart-item-price">${item.price}</div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
    });
    
    document.getElementById("cartTotalPrice").textContent = `${total}`;
}

function openCart() {
    displayCartItems();
    cartModal.classList.remove("hidden");
}

function closeCart() {
    cartModal.classList.add("hidden");
}

function clearCart() {
    if (confirm("Are you sure you want to clear your cart?")) {
        cart = [];
        saveCart();
        displayCartItems();
    }
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    
    closeCart();
    successModal.classList.remove("hidden");
    cart = [];
    saveCart();
}

function closeSuccess() {
    successModal.classList.add("hidden");
}


function saveAds() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ads));
}

function loadAds() {
    const storedAds = localStorage.getItem(STORAGE_KEY);
    if (!storedAds) return;

    try {
        const parsed = JSON.parse(storedAds);
        if (Array.isArray(parsed) && parsed.length > 0) {
            ads = parsed.map(ad => ({
                id: ad.id,
                title: ad.title,
                category: ad.category,
                price: ad.price || "",
                imageUrl: ad.imageUrl || "",
                createdAt: ad.createdAt || new Date().toISOString()
            }));
            nextAdId = Math.max(...ads.map(ad => ad.id)) + 1;
        }
    } catch (e) {
        console.error("Failed to load ads from localStorage", e);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}

function updateResultCount(count) {
    resultCount.textContent = `Showing ${count} ads`;
    visibleAdsEl.textContent = count;
}

function updateStats(filtered) {
    totalAdsEl.textContent = ads.length;
    visibleAdsEl.textContent = filtered.length;
    totalCategoriesEl.textContent = new Set(ads.map(ad => ad.category)).size;
}

function showAds(list) {
    container.innerHTML = "";
    const noResults = document.getElementById("noResults");
    if (list.length === 0) {
        noResults.classList.remove("hidden");
        updateResultCount(0);
        return;
    }
    noResults.classList.add("hidden");

    list.forEach(ad => {
        const icon = categoryIcons[ad.category] || "";
        const imageHtml = ad.imageUrl ? `<img class="ad-image" src="${ad.imageUrl}" alt="${ad.title}">` : `<div class="ad-image placeholder">No image</div>`;
        const priceHtml = ad.price ? `<div class="ad-price">${ad.price}</div>` : '';
        container.innerHTML += `
            <div class="ad">
                ${imageHtml}
                <div class="ad-top">
                    <span class="ad-icon">${icon}</span>
                    <div>
                        <div class="ad-category ${ad.category.toLowerCase()}">${ad.category}</div>
                        <h3 class="ad-title">${ad.title}</h3>
                    </div>
                </div>
                <div class="ad-date">Created: ${formatDate(ad.createdAt)}</div>
                ${priceHtml}
                <div class="ad-buttons">
                    <button class="ad-button add-to-cart" onclick="addToCart(${ad.id})">Add to Cart</button>
                    <button class="ad-button edit" onclick="openEditModal(${ad.id})">Edit</button>
                    <button class="ad-button delete" onclick="deleteAd(${ad.id})">Delete</button>
                </div>
            </div>
        `;
    });
    updateResultCount(list.length);
}

function sortAds(list) {
    const sorted = [...list];
    const order = sortOrder.value;

    if (order === "oldest") {
        sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (order === "az") {
        sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (order === "za") {
        sorted.sort((a, b) => b.title.localeCompare(a.title));
    } else {
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return sorted;
}

function filterAds() {
    const searchTerm = search.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filtered = ads.filter(ad => {
        const matchesSearch = ad.title.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === "All" || ad.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const sorted = sortAds(filtered);
    updateStats(sorted);
    showAds(sorted);
}

function addAd() {
    const value = newAdInput.value;

    if (value.trim() === "") return;

    const newAd = {
        id: nextAdId++,
        title: value,
        category: categorySelect.value,
        price: newPriceInput ? newPriceInput.value.trim() : "",
        imageUrl: newImageInput ? newImageInput.value.trim() : "",
        createdAt: new Date().toISOString()
    };

    ads.unshift(newAd);
    saveAds();
    newAdInput.value = "";
    if (newPriceInput) newPriceInput.value = "";
    if (newImageInput) newImageInput.value = "";
    categoryFilter.value = "All";
    search.value = "";
    filterAds();
}

function deleteAd(id) {
    ads = ads.filter(ad => ad.id !== id);
    saveAds();
    filterAds();
}

function openEditModal(id) {
    const ad = ads.find(ad => ad.id === id);
    if (!ad) return;

    currentEditId = id;
    editTitleInput.value = ad.title;
    if (editPriceInput) editPriceInput.value = ad.price || "";
    if (editImageInput) editImageInput.value = ad.imageUrl || "";
    editCategoryInput.value = ad.category;
    editModal.classList.remove("hidden");
}

function closeEditModal() {
    currentEditId = null;
    editModal.classList.add("hidden");
}

function saveEdit() {
    if (currentEditId === null) return;

    const updatedTitle = editTitleInput.value.trim();
    const updatedCategory = editCategoryInput.value;
    const updatedPrice = editPriceInput ? editPriceInput.value.trim() : "";
    const updatedImage = editImageInput ? editImageInput.value.trim() : "";
    if (updatedTitle === "") return;

    const ad = ads.find(ad => ad.id === currentEditId);
    if (!ad) return;

    ad.title = updatedTitle;
    ad.category = updatedCategory;
    ad.price = updatedPrice;
    ad.imageUrl = updatedImage;
    saveAds();
    closeEditModal();
    filterAds();
}

function applyTheme(theme) {
    const body = document.body;
    if (theme === "dark") {
        body.classList.add("dark");
        themeToggle.textContent = "Light Mode";
    } else {
        body.classList.remove("dark");
        themeToggle.textContent = "Dark Mode";
    }
    localStorage.setItem(THEME_KEY, theme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || "light";
    applyTheme(savedTheme);
}

loadTheme();
loadAds();
loadCart();
filterAds();

search.addEventListener("input", filterAds);
categoryFilter.addEventListener("change", filterAds);
sortOrder.addEventListener("change", filterAds);
themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
    applyTheme(nextTheme);
});

cartToggle.addEventListener("click", openCart);
cartModal.addEventListener("click", (e) => {
    if (e.target === cartModal) {
        closeCart();
    }
});
successModal.addEventListener("click", (e) => {
    if (e.target === successModal) {
        closeSuccess();
    }
});