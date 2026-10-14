// Data Produk Toko
const products = [
    {
        id: 1,
        name: "Wireless Headphone Pro",
        category: "Elektronik",
        price: 750000,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
        description: "Headphone nirkabel dengan kualitas suara jernih, bass mendalam, dan daya tahan baterai hingga 30 jam pemutaran."
    },
    {
        id: 2,
        name: "Smartwatch Sport Edition",
        category: "Elektronik",
        price: 1250000,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
        description: "Jam tangan pintar pemantau kesehatan, detak jantung, notifikasi pesan, serta tahan air untuk olahraga harian."
    },
    {
        id: 3,
        name: "Casual Hoodie Denim Blue",
        category: "Fashion",
        price: 320000,
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop&q=60",
        description: "Hoodie kasual berbahan cotton fleece lembut dan nyaman dipakai untuk aktivitas sehari-hari maupun santai."
    },
    {
        id: 4,
        name: "Minimalist Leather Wallet",
        category: "Aksesoris",
        price: 180000,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=60",
        description: "Dompet kulit sintetis premium dengan desain tipis, slot kartu terorganisir, dan proteksi RFID."
    },
    {
        id: 5,
        name: "Mechanical Keyboard RGB",
        category: "Elektronik",
        price: 890000,
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60",
        description: "Keyboard mekanikal gaming dengan pencahayaan RGB kustom dan switch responsif untuk produktivitas maksimal."
    },
    {
        id: 6,
        name: "Classic Sunglasses",
        category: "Aksesoris",
        price: 210000,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop&q=60",
        description: "Kacamata hitam gaya klasik dengan lensa anti UV untuk melindungi mata dari terik matahari sekaligus tampil stylish."
    },
    {
        id: 7,
        name: "Sneakers Streetwear Urban",
        category: "Fashion",
        price: 650000,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60",
        description: "Sepatu sneakers dengan desain modern dan sol empuk yang memberikan kenyamanan ekstra sepanjang hari."
    },
    {
        id: 8,
        name: "Backpack Travel Waterproof",
        category: "Fashion",
        price: 450000,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60",
        description: "Tas ransel anti air dengan kompartemen laptop luas, cocok untuk bekerja, sekolah, maupun traveling."
    }
];

// State Aplikasi
let cart = [];
let currentCategory = 'all';
let searchQuery = '';

// DOM Elements
const productGrid = document.getElementById('productGrid');
const productCount = document.getElementById('productCount');
const sectionTitle = document.getElementById('sectionTitle');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const catButtons = document.querySelectorAll('.cat-btn');

const cartToggleBtn = document.getElementById('cartToggleBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotalPrice = document.getElementById('cartTotalPrice');
const checkoutBtn = document.getElementById('checkoutBtn');

const productModal = document.getElementById('productModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalBody = document.getElementById('modalBody');

// Format Rupiah
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
}

// Render Produk
function renderProducts() {
    let filtered = products.filter(product => {
        const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              product.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    productCount.textContent = `Menampilkan ${filtered.length} produk`;

    if (filtered.length === 0) {
        productGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem;">Produk tidak ditemukan.</p>`;
        return;
    }

    productGrid.innerHTML = filtered.map(product => `
        <div class="product-card">
            <div class="product-img-container" onclick="openProductModal(${product.id})">
                <span class="product-tag">${product.category}</span>
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h4 class="product-title" onclick="openProductModal(${product.id})">${product.name}</h4>
                <div class="product-price">${formatRupiah(product.price)}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    <i class="fa-solid fa-cart-plus"></i> Tambah
                </button>
            </div>
        </div>
    `).join('');
}

// Filter Kategori
catButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        catButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        currentCategory = e.target.getAttribute('data-category');
        sectionTitle.textContent = currentCategory === 'all' ? 'Semua Produk' : currentCategory;
        renderProducts();
    });
});

// Fitur Pencarian
searchBtn.addEventListener('click', () => {
    searchQuery = searchInput.value.trim();
    renderProducts();
});

searchInput.addEventListener('keyup', (e) => {
    searchQuery = searchInput.value.trim();
    renderProducts();
    if(e.key === 'Enter') {
        renderProducts();
    }
});

// Fungsi Keranjang Belanja
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    openCart();
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-cart-text">Keranjangmu masih kosong.</p>`;
        cartTotalPrice.textContent = formatRupiah(0);
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item-card">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${formatRupiah(item.price)}</div>
                <div class="cart-item-actions">
                    <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item-btn" onclick="removeFromCart(${item.id})">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </div>
    `).join('');

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalPrice.textContent = formatRupiah(totalPrice);
}

function changeQuantity(productId, amount) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += amount;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
    }
    updateCartUI();
}

function removeFromCart(productId) {
    cart = cart.filter(i => i.id !== productId);
    updateCartUI();
}

// Buka/Tutup Drawer Keranjang
function openCart() {
    cartDrawer.classList.add('open');
    overlay.classList.add('active');
}

function closeCart() {
    cartDrawer.classList.remove('open');
    overlay.classList.remove('active');
}

cartToggleBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
overlay.addEventListener('click', () => {
    closeCart();
    closeProductModal();
});

// Checkout Action
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert("Keranjang belanjaanmu masih kosong!");
        return;
    }
    alert("Terima kasih! Pesanan Anda berhasil diproses.");
    cart = [];
    updateCartUI();
    closeCart();
});

// Modal Detail Produk
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    modalBody.innerHTML = `
        <div class="modal-body-grid">
            <img src="${product.image}" alt="${product.name}" class="modal-img">
            <div class="modal-details">
                <span class="product-tag" style="position:static; display:inline-block; margin-bottom:0.5rem;">${product.category}</span>
                <h2>${product.name}</h2>
                <div class="price">${formatRupiah(product.price)}</div>
                <p>${product.description}</p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id}); closeProductModal();" style="width:100%; padding:0.8rem;">
                    <i class="fa-solid fa-cart-plus"></i> Tambah ke Keranjang
                </button>
            </div>
        </div>
    `;
    productModal.classList.add('active');
    overlay.classList.add('active');
}

function closeProductModal() {
    productModal.classList.remove('active');
    overlay.classList.remove('active');
}

closeModalBtn.addEventListener('click', closeProductModal);

// Inisialisasi awal saat halaman dimuat
renderProducts();