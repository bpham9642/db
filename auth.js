// File: auth.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Xử lý form Đăng nhập
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                // Tìm kiếm user dựa trên email
                const response = await fetch(`http://localhost:3000/users?email=${email}`);
                const users = await response.json();

                if (users.length > 0) {
                    const user = users[0];
                    // Kiểm tra mật khẩu
                    if (user.password === password) {
                        alert('Đăng nhập thành công!');
                        
                        // Lưu thông tin người dùng vào sessionStorage
                        sessionStorage.setItem('loggedInUser', JSON.stringify(user));

                        // Chuyển hướng dựa trên vai trò (role)
                        if (user.role === 'admin') {
                            window.location.href = 'admin.html';
                        } else {
                            window.location.href = 'index.html';
                        }
                    } else {
                        alert('Mật khẩu không chính xác.');
                    }
                } else {
                    alert('Email không tồn tại.');
                }
            } catch (error) {
                console.error('Lỗi khi đăng nhập:', error);
                alert('Đã có lỗi xảy ra. Vui lòng thử lại.');
            }
        });
    }

    // Xử lý form Đăng ký
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Kiểm tra xem email đã tồn tại chưa
            const checkEmail = await fetch(`http://localhost:3000/users?email=${email}`);
            const existingUsers = await checkEmail.json();

            if (existingUsers.length > 0) {
                alert('Email này đã được sử dụng. Vui lòng chọn email khác.');
                return;
            }
            
            // Tạo user mới
            const newUser = {
                fullname,
                email,
                password,
                role: 'customer' // Mặc định tất cả user mới là customer
            };

            try {
                const response = await fetch('http://localhost:3000/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newUser),
                });

                if (response.ok) {
                    alert('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
                    window.location.href = 'login.html';
                } else {
                    alert('Đăng ký thất bại. Vui lòng thử lại.');
                }
            } catch (error) {
                console.error('Lỗi khi đăng ký:', error);
                alert('Đã có lỗi xảy ra. Vui lòng thử lại.');
            }
        });
    }
});