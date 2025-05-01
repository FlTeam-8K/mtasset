document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const showRegister = document.getElementById("showRegister");
    const showLogin = document.getElementById("showLogin");
    const authContainer = document.querySelector(".auth-container");

    // Tampilkan form register dan sembunyikan form login
    showRegister.addEventListener("click", function (e) {
        e.preventDefault();
        authContainer.innerHTML = document.getElementById("registerForm").outerHTML;
    });

    // Tampilkan form login dan sembunyikan form register
    showLogin.addEventListener("click", function (e) {
        e.preventDefault();
        authContainer.innerHTML = document.getElementById("loginForm").outerHTML;
    });

    // Handle login form submission
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        fetch("/api/login.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert("Login berhasil!");
                    window.location.href = "/"; // Redirect ke halaman utama
                } else {
                    alert(data.error);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    });

    // Handle register form submission
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const username = document.getElementById("registerUsername").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;

        fetch("/api/register.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert("Registrasi berhasil! Silakan login.");
                    window.location.href = "/login"; // Redirect ke halaman login
                } else {
                    alert(data.error);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    });
});