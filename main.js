// Lớp Product để định nghĩa cấu trúc một sản phẩm
class Product {
    constructor(id, name, price, image, category, hot, description) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.category = category;
        this.hot = hot;
        this.description = description;
    }

    // Phương thức render HTML cho sản phẩm ngoài danh sách
    render() {
        return `
            <div class="product">
                <img src="${this.image}" alt="${this.name}">
                <a href="detail.html?id=${this.id}"><h4>${this.name}</h4></a>
                <p>Giá : ${new Intl.NumberFormat('vi-VN').format(this.price)} đ</p>
            </div>
        `;
    }

    // Phương thức render HTML cho trang chi tiết sản phẩm
    renderDetail() {
        const formattedPrice = new Intl.NumberFormat('vi-VN').format(this.price);
        return `
            <div class="detail-layout">
                <div class="detail-image-wrapper">
                    <img src="${this.image}" alt="${this.name}">
                </div>
                <div class="detail-info">
                    <div class="product-meta">
                        <span class="meta-category">${this.category}</span>
                        ${this.hot ? '<span class="meta-hot">🔥 HOT</span>' : ''}
                    </div>
                    <h1 class="product-title">${this.name}</h1>
                    <p class="product-description">${this.description}</p>     
                    <div class="price-block">
                        <span class="price-current">${formattedPrice} ₫</span>
                    </div>
                    <div class="action-block">
                        <div class="quantity-selector">
                            <button class="quantity-btn" id="decrease-qty">-</button>
                            <input type="number" id="quantity-input" value="1" min="1">
                            <button class="quantity-btn" id="increase-qty">+</button>
                        </div>
                        <button id="addCartBtn" class="add-to-cart-btn" data-product-id="${this.id}">Thêm vào giỏ hàng</button>
                    </div>
                    <div class="trust-signals">
                        <span>✓ Hàng chính hãng</span>
                        <span>✓ Giao hàng nhanh</span>
                    </div>
                </div>
            </div>
        `;
    }
}

//HIỂN THỊ DỮ LIỆU TRANG CHỦ 
const productHot = document.getElementById('product-hot');
const productLaptop = document.getElementById('product-laptop');
const productDienThoai = document.getElementById('product-dienthoai');

if (productHot) {
    fetch(`https://my-json-server.typicode.com/bpham9642/db/products`)
        .then(response => response.json())
        .then(data => {
            console.log("Dữ liệu trang chủ:", data);
            const dataHot = data.filter(p => p.hot == true);
            const dataLaptop = data.filter(p => p.category === "laptop");
            const dataPhone = data.filter(p => p.category === "điện thoại");
            
            renderProduct(dataHot, productHot);
            renderProduct(dataLaptop, productLaptop);
            renderProduct(dataPhone, productDienThoai);
        })
        .catch(error => console.error("Lỗi khi tải dữ liệu trang chủ:", error));
}

// HIỂN THỊ DỮ LIỆU TRANG SẢN PHẨM 
const productAll = document.getElementById('all-product');
const searchInput = document.getElementById('search-input');
const sortPrice = document.getElementById('sort-price');
let allProductsData = [];

if (productAll) {
    fetch(`https://my-json-server.typicode.com/bpham9642/db/products`)
        .then(response => response.json())
        .then(data => {
            console.log("Dữ liệu trang sản phẩm:", data);
            allProductsData = data;
            renderProduct(allProductsData, productAll); 
        })
        .catch(error => console.error("Lỗi khi tải dữ liệu trang sản phẩm:", error));

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const keyword = e.target.value.toLowerCase();
            const filteredProducts = allProductsData.filter(
                p => p.name.toLowerCase().includes(keyword)
            );
            renderProduct(filteredProducts, productAll);
        });
    }

    if (sortPrice) {
        sortPrice.addEventListener('change', (e) => {
            const sortedData = [...allProductsData]; // Tạo bản sao để không ảnh hưởng mảng gốc
            if (e.target.value === "asc") {
                sortedData.sort((a, b) => a.price - b.price);
            } else if (e.target.value === 'desc') {
                sortedData.sort((a, b) => b.price - a.price);
            }
            renderProduct(sortedData, productAll);
        });
    }
}

// Hàm chung để render danh sách sản phẩm ra một div
const renderProduct = (array, targetDiv) => {
    let html = "";
    if (array.length === 0) {
        html = "<p>Không tìm thấy sản phẩm nào.</p>";
    } else {
        array.forEach((item) => {
            const product = new Product(
                item.id, item.name, item.price, item.image,
                item.category, item.hot, item.description
            );
            html += product.render();
        });
    }
    targetDiv.innerHTML = html;
}

// === HIỂN THỊ CHI TIẾT SẢN PHẨM ===
const productDetailDiv = document.getElementById('product-detail');
if (productDetailDiv) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        fetch(`https://my-json-server.typicode.com/bpham9642/db/products/${id}`)
            .then(response => response.json())
            .then(item => {
                console.log("Dữ liệu chi tiết:", item);
                const product = new Product(
                    item.id, item.name, item.price, item.image,
                    item.category, item.hot, item.description
                );
                productDetailDiv.innerHTML = product.renderDetail();

                // Gắn sự kiện cho nút +/- và input số lượng
                const decreaseBtn = document.getElementById('decrease-qty');
                const increaseBtn = document.getElementById('increase-qty');
                const quantityInput = document.getElementById('quantity-input');

                decreaseBtn.addEventListener('click', () => {
                    let currentValue = parseInt(quantityInput.value, 10);
                    if (currentValue > 1) {
                        quantityInput.value = currentValue - 1;
                    }
                });

                increaseBtn.addEventListener('click', () => {
                    let currentValue = parseInt(quantityInput.value, 10);
                    quantityInput.value = currentValue + 1;
                });

                quantityInput.addEventListener('change', () => {
                    if (parseInt(quantityInput.value, 10) < 1 || isNaN(parseInt(quantityInput.value, 10))) {
                        quantityInput.value = 1;
                    }
                });
            })
            .catch(error => {
                console.error("Lỗi khi tải chi tiết sản phẩm:", error);
                productDetailDiv.innerHTML = "<p>Không thể tải thông tin sản phẩm. Vui lòng thử lại.</p>";
            });
    }
}

// === QUẢN LÝ GIỎ HÀNG (CART) ===
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
    }

    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    addItem(productToAdd, quantityToAdd = 1) {
        const numQuantity = parseInt(quantityToAdd, 10) || 1;
        const existingItem = this.items.find(item => item.id === productToAdd.id);

        if (existingItem) {
            existingItem.quantity += numQuantity;
        } else {
            this.items.push({ ...productToAdd, quantity: numQuantity });
        }
        this.save();
    }

    getTotalQuantity() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }
    
    increaseQuantity(id) {
        const item = this.items.find(item => item.id == id);
        if (item) {
            item.quantity++;
        }
        this.save();
        this.render();
        updateCartCount();
    }

    decreaseQuantity(id) {
        const item = this.items.find(item => item.id == id);
        if (item && item.quantity > 1) {
            item.quantity--;
            this.save();
        } else {
            // Nếu số lượng là 1 thì xóa luôn
            this.removeItem(id);
        }
        this.render();
        updateCartCount();
    }
    
    removeItem(id) {
        this.items = this.items.filter(item => item.id != id);
        this.save();
        this.render();
        updateCartCount();
    }
    
    render() {
        const cartDisplayArea = document.getElementById('cart-display-area');
        if (!cartDisplayArea) return;

        if (this.items.length === 0) {
            cartDisplayArea.innerHTML = '<p>Giỏ hàng của bạn đang trống.</p>';
            return;
        }

        const formatCurrency = (number) => new Intl.NumberFormat('vi-VN').format(number);
        let totalAmount = 0;
        let tableRows = '';

        this.items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalAmount += itemTotal;
            tableRows += `
                <tr>
                    <td><img src="${item.image}" alt="${item.name}" class="cart-item-image"></td>
                    <td>${item.name}</td>
                    <td>${formatCurrency(item.price)} ₫</td>
                    <td>
                        <div class="quantity-control">
                            <button class="btn-decrease" data-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="btn-increase" data-id="${item.id}">+</button>
                        </div>
                    </td>
                    <td>${formatCurrency(itemTotal)} ₫</td>
                    <td>
                        <button class="btn-remove" data-id="${item.id}">Xóa</button>
                    </td>
                </tr>
            `;
        });

        const tableHTML = `
            <table class="cart-table">
                <thead>
                    <tr>
                        <th>Hình ảnh</th>
                        <th>Tên sản phẩm</th>
                        <th>Giá</th>
                        <th class="text-center">Số lượng</th>
                        <th>Thành tiền</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="4" style="text-align:right;"><strong>Tổng cộng</strong></td>
                        <td colspan="2"><strong>${formatCurrency(totalAmount)} ₫</strong></td>
                    </tr>
                </tfoot>
            </table>
        `;
        cartDisplayArea.innerHTML = tableHTML;
    }
}

// Khởi tạo giỏ hàng
const cart = new Cart();

// === CÁC SỰ KIỆN VÀ HÀM CHUNG ===

// Cập nhật số lượng sản phẩm trên icon giỏ hàng
function updateCartCount() {
    const cartCountBadge = document.getElementById('cartCount');
    if (cartCountBadge) {
        cartCountBadge.textContent = cart.getTotalQuantity();
    }
}

// Sự kiện click chung cho toàn bộ trang
document.addEventListener('click', function (e) {
    // Xử lý nút "Thêm vào giỏ hàng"
    if (e.target && e.target.id === 'addCartBtn') {
        const productId = e.target.getAttribute('data-product-id');
        const quantityInput = document.getElementById('quantity-input');
        const quantity = quantityInput ? parseInt(quantityInput.value, 10) : 1;

        fetch(`https://my-json-server.typicode.com/bpham9642/db/products/${productId}`)
            .then(response => response.json())
            .then(item => {
                const product = new Product(
                    item.id, item.name, item.price, item.image,
                    item.category, item.hot, item.description
                );
                cart.addItem(product, quantity);
                alert(`Đã thêm ${quantity} sản phẩm "${item.name}" vào giỏ hàng!`);
                updateCartCount();
            });
    }
});

// Sự kiện khi trang đã tải xong
document.addEventListener('DOMContentLoaded', () => {
    // Tự động chèn Header và Footer
    const headerHTML = `
        <div class="container header-inner">
            <a class="logo" href="index.html">pham<span>Shop</span></a>
            <nav class="nav">
                <a href="index.html">Trang chủ</a>
                <a href="products.html">Tất cả sản phẩm</a>
                <a href="cart.html">Giỏ hàng</a>
            </nav>
            <div class="header-actions">
                <a aria-label="Giỏ hàng" class="cart" href="cart.html">
                    🛒 <span class="badge" id="cartCount">0</span>
                </a>
            </div>
        </div>
    `;
    const header = document.createElement('header');
    header.innerHTML = headerHTML;
    document.body.prepend(header);

    const footerHTML = `<p>&copy; 2025 phamshop. All rights reserved.</p>`;
    const footer = document.createElement('footer');
    footer.innerHTML = footerHTML;
    document.body.appendChild(footer);

    // Cập nhật số lượng giỏ hàng ban đầu
    updateCartCount();

    // Xử lý trang giỏ hàng
    const cartDisplayArea = document.getElementById('cart-display-area');
    if (cartDisplayArea) {
        cart.render(); // Hiển thị giỏ hàng lần đầu
        
        // Thêm bộ lắng nghe sự kiện cho toàn bộ khu vực giỏ hàng
        cartDisplayArea.addEventListener('click', (e) => {
            const target = e.target;
            const productId = target.getAttribute('data-id');

            if (target.classList.contains('btn-increase')) {
                cart.increaseQuantity(productId);
            }
            if (target.classList.contains('btn-decrease')) {
                cart.decreaseQuantity(productId);
            }
            if (target.classList.contains('btn-remove')) {
                if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
                    cart.removeItem(productId);
                }
            }
        });
    }
});