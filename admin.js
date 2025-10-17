const API_URL = 'https://my-json-server.typicode.com/bpham9642/db/products';
const productListBody = document.getElementById('admin-product-list');
const addProductBtn = document.getElementById('add-product-btn');
const modal = document.getElementById('product-modal');
const productForm = document.getElementById('product-form');
const modalTitle = document.getElementById('modal-title');

const productIdInput = document.getElementById('product-id');
const productNameInput = document.getElementById('product-name');
const productPriceInput = document.getElementById('product-price');
const productImageUpload = document.getElementById('product-image-upload');
const productImageOldUrl = document.getElementById('product-image-old-url');
const productCategoryInput = document.getElementById('product-category');
const productDescriptionInput = document.getElementById('product-description');
const productHotInput = document.getElementById('product-hot');

class Course { 
    constructor(id, name, price, image, category) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.category = category;
    }
    // Render giao diện của SẢN PHẨM
    render() {
        const formatter = new Intl.NumberFormat('vi-VN');
        return `
            <tr>
                <td>${this.id}</td>
                <td><img src="${this.image}" alt="${this.name}" style="width: 60px; height: 60px; object-fit: cover;"></td>
                <td>${this.name}</td>
                <td>${formatter.format(this.price)} ₫</td>
                <td>${this.category}</td>
                <td class="action-buttons">
                    <button class="admin-button btn-edit" data-id="${this.id}">Sửa</button>
                    <button class="admin-button danger btn-delete" data-id="${this.id}">Xóa</button>
                </td>
            </tr>
        `;
    }
}
// 3. CÁC HÀM XỬ LÝ
function getAndRenderProducts() {
    fetch(API_URL)
        .then(response => response.json())
        .then(products => {
            let html = "";
            products.forEach(item => {
                // Sử dụng 'new Course' để tạo đối tượng
                const course = new Course(item.id, item.name, item.price, item.image, item.category);
                html += course.render();
            });
            productListBody.innerHTML = html;
        })
        .catch(error => console.error("Lỗi khi tải sản phẩm: ", error));
}
// 4. XỬ LÝ SỰ KIỆN (GIỮ NGUYÊN LOGIC CŨ CỦA BẠN)


// Mở Modal
if (addProductBtn) {
    addProductBtn.addEventListener('click', () => {
        modalTitle.textContent = 'Thêm sản phẩm mới';
        productForm.reset();
        productForm.removeAttribute('data-mode');
        modal.style.display = 'block';
    });
}

// Xử lý submit form (Thêm hoặc Sửa)
if (productForm) {
    productForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const file = productImageUpload.files[0];
        let imageUrl = productImageOldUrl.value;
        if (file) {
            imageUrl = `img/${file.name}`;
        }
        
        const productData = {
            name: productNameInput.value,
            price: parseInt(productPriceInput.value),
            image: imageUrl,
            category: productCategoryInput.value,
            description: productDescriptionInput.value,
            hot: productHotInput.checked,
        };

        if (productForm.getAttribute('data-mode') === 'edit') {
            const id = productIdInput.value;
            fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            })
            .then(() => location.reload())
            .catch(error => console.error("Lỗi khi cập nhật: ", error));
        } else {
            fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            })
            .then(() => location.reload())
            .catch(error => console.error("Lỗi khi thêm mới: ", error));
        }
    });
}

// Bấm nút Sửa hoặc Xóa trên danh sách
if (productListBody) {
    productListBody.addEventListener('click', (event) => {
        const editButton = event.target.closest('.btn-edit');
        const deleteButton = event.target.closest('.btn-delete');

        if (editButton) {
            const id = editButton.getAttribute('data-id');
            productForm.setAttribute('data-mode', 'edit');
            modalTitle.textContent = 'Chỉnh sửa sản phẩm';

            fetch(`${API_URL}/${id}`)
                .then(response => response.json())
                .then(product => {
                    productIdInput.value = product.id;
                    productNameInput.value = product.name;
                    productPriceInput.value = product.price;
                    productImageOldUrl.value = product.image;
                    productCategoryInput.value = product.category;
                    productDescriptionInput.value = product.description;
                    productHotInput.checked = product.hot;
                    modal.style.display = "block";
                });
        }

        if (deleteButton) {
            const id = deleteButton.getAttribute('data-id');
            if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
                fetch(`${API_URL}/${id}`, { method: 'DELETE' })
                .then(() => location.reload())
                .catch(error => console.error("Lỗi khi xóa: ", error));
            }
        }
    });
}

// Đóng modal khi bấm ra ngoài
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
        productForm.removeAttribute('data-mode');
        productForm.reset();
    }
});

// 5. CHẠY HÀM LẦN ĐẦU KHI TẢI TRANG
getAndRenderProducts();