const STORAGE_KEY = "simpleAdsStorage";
let ads = [
    { id: 1, title: "BMW E46 - 5000лв", category: "Cars", createdAt: "2026-06-10T09:15:00.000Z" },
    { id: 2, title: "Audi A4 2008", category: "Cars", createdAt: "2026-06-12T14:20:00.000Z" },
    { id: 3, title: "iPhone 13 Pro", category: "Phones", createdAt: "2026-06-15T08:45:00.000Z" },
    { id: 4, title: "PS5 конзола", category: "Games", createdAt: "2026-06-18T17:30:00.000Z" },
    { id: 5, title: "Лаптоп Lenovo i5", category: "Laptops", createdAt: "2026-06-20T11:00:00.000Z" }
];
let nextAdId = 6;

const container = document.getElementById("ads");
const resultCount = document.getElementById("resultCount");
const search = document.getElementById("search");
const newAdInput = document.getElementById("newAd");
const categoryFilter = document.getElementById("category");
const categorySelect = document.getElementById("categorySelect");
const sortOrder = document.getElementById("sortOrder");
const themeToggle = document.getElementById("themeToggle");
const editModal = document.getElementById("editModal");
const editTitleInput = document.getElementById("editTitle");
const editCategoryInput = document.getElementById("editCategory");
let currentEditId = null;
const THEME_KEY = "simpleAdsTheme";

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
}

function showAds(list) {
    container.innerHTML = "";
    if (list.length === 0) {
        container.innerHTML = `<div class="no-results">No ads found.</div>`;
        updateResultCount(0);
        return;
    }

    list.forEach(ad => {
        container.innerHTML += `
            <div class="ad">
                <div class="ad-title">${ad.title}</div>
                <div class="ad-date">Създадено: ${formatDate(ad.createdAt)}</div>
                <div class="ad-category">${ad.category}</div>
                <div class="ad-buttons">
                    <button class="ad-button edit" onclick="openEditModal(${ad.id})">Редактирай</button>
                    <button class="ad-button delete" onclick="deleteAd(${ad.id})">Изтрий</button>
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

    showAds(sortAds(filtered));
}

function addAd() {
    const value = newAdInput.value;

    if (value.trim() === "") return;

    const newAd = {
        id: nextAdId++,
        title: value,
        category: categorySelect.value,
        createdAt: new Date().toISOString()
    };

    ads.unshift(newAd);
    saveAds();
    newAdInput.value = "";
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
    if (updatedTitle === "") return;

    const ad = ads.find(ad => ad.id === currentEditId);
    if (!ad) return;

    ad.title = updatedTitle;
    ad.category = updatedCategory;
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
filterAds();

search.addEventListener("input", filterAds);
categoryFilter.addEventListener("change", filterAds);
sortOrder.addEventListener("change", filterAds);
themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
    applyTheme(nextTheme);
});