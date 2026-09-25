console.log("===MATERI 5 - CONSUME API ===");

const API_URL = "https://dummyjson.com/products";
const loadingState = document.getElementById('loading-state');
const productGrid = document.getElementById('product-grid');
const resultSummary = document.getElementById('result-summary');
const categorySelect = document.getElementById('category-select');
const sortSelect = document.getElementById('sort-select');
const searchInput = document.getElementById('search-input');
const resetBtn = document.getElementById('reset-btn');

// Menyimpan data master (asli) hasil fetch dari API
let originalProducts = [];

function renderProduct(dataProducts) {
  productGrid.innerHTML = '';
  dataProducts.forEach((dataProduct) => {
    const {title, price, rating, category, thumbnail, id} = dataProduct;
    loadingState.hidden = true;
    resultSummary.hidden = true;
    productGrid.hidden = false;
    productGrid.innerHTML += `
      <article class="product-card">
        <div class="product-image-wrap">
          <img class="product-image" src="${thumbnail}" alt="${title}" loading="lazy">
        </div>

        <div class="product-body">
          <span class="product-category">
            ${category}
          </span>

          <h3 class="product-title">
            ${title}
          </h3>

          <div class="product-meta">
            <span class="product-price">
              $${price.toFixed(2)}
            </span>

            <span class="product-rating">
              ⭐️ ${rating}
            </span>
          </div>

          <button type="button" class="detail-btn" data-id="${id}">
            Lihat Detail
          </button>
        </div>
      </article>
    `;
  });
}

const getProductApi = async (category) => {
  const targetUrl = category && category !== 'all' ? `${API_URL}/category/${category}` : API_URL;
  const response = await fetch(targetUrl);
  const data = await response.json();
  const {products} = data;

  // Simpan data asli dari API
  originalProducts = products;

  sortSelect.value = 'default';
  renderProduct(originalProducts);
}

const getProductCategoriesApi = async () => {
  const response = await fetch(`${API_URL}/categories`);
  const data = await response.json();
  categorySelect.innerHTML = '<option value="all">semua kategori</option>';
  data.forEach((item) => {
    const {slug, name} = item;
    categorySelect.innerHTML += `<option value="${slug}">${name}</option>`;
  });
}

categorySelect.addEventListener('change', () => {
  const selectedCategory = categorySelect.value;
  getProductApi(selectedCategory);
});

resetBtn.addEventListener('click', () => {
  categorySelect.value = 'all';
  sortSelect.value = 'default';
  searchInput.value = '';
  getProductApi();
});

const searchProductsApi = async (query) => {
  loadingState.hidden = false;
  productGrid.hidden = true;
  const response = await fetch(`${API_URL}/search?q=${query}`);
  const data = await response.json();
  
  // Simpan data asli hasil pencarian
  originalProducts = data.products;
  
  sortSelect.value = 'default';
  renderProduct(originalProducts);
};

searchInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    const query = this.value.trim();
    
    if (query) {
      searchProductsApi(query);
    } else {
      getProductApi();
    }
  }
});

// Event Handler Sorting yang diperbaiki
sortSelect.addEventListener('change', () => {
  const sortValue = sortSelect.value;
  // Buat salinan baru dari data asli (originalProducts)
  let sortedProducts = [...originalProducts];

  if (sortValue === 'price-asc') {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortValue === 'price-desc') {
    sortedProducts.sort((a, b) => b.price - a.price);
  } else if (sortValue === 'rating-desc') {
    sortedProducts.sort((a, b) => b.rating - a.rating);
  } else if (sortValue === 'name-asc') {
    sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortValue === 'default') {
    // Kembali ke urutan awal dari API
    sortedProducts = [...originalProducts];
  }

  renderProduct(sortedProducts);
});

getProductCategoriesApi();
getProductApi();