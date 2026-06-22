let ads = [
    { title: "BMW E46 - 5000лв", category: "Cars" },
    { title: "Audi A4 2008", category: "Cars" },
    { title: "iPhone 13 Pro", category: "Phones" },
    { title: "PS5 конзола", category: "Games" },
    { title: "Лаптоп Lenovo i5", category: "Laptops" }
];

const container = document.getElementById("ads");
const search = document.getElementById("search");
const newAdInput = document.getElementById("newAd");
const categoryFilter = document.getElementById("category");
const categorySelect = document.getElementById("categorySelect");

function showAds(list) {
    container.innerHTML = "";
    list.forEach(ad => {
        container.innerHTML += `<div class="ad"><div class="ad-title">${ad.title}</div><div class="ad-category">${ad.category}</div></div>`;
    });
}

function filterAds() {
    const searchTerm = search.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filtered = ads.filter(ad => {
        const matchesSearch = ad.title.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === "All" || ad.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    showAds(filtered);
}

function addAd() {
    const value = newAdInput.value;

    if (value.trim() === "") return;

    const newAd = {
        title: value,
        category: categorySelect.value
    };

    ads.unshift(newAd);
    newAdInput.value = "";
    categoryFilter.value = "All";
    search.value = "";
    filterAds();
}

filterAds();

search.addEventListener("input", filterAds);
categoryFilter.addEventListener("change", filterAds);