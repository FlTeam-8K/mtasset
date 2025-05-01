
function toggleDarkMode() {
    let darkModeEnabled = document.body.classList.toggle("dark-mode");
    
    localStorage.setItem("dark-mode", darkModeEnabled ? "enabled" : "disabled");

    // Update ikon di semua tombol
    updateDarkModeIcons(darkModeEnabled);
}
function updateDarkModeIcons(isDarkMode) {
    let icon = isDarkMode ? "☀️" : "🌙";

    let desktopToggle = document.getElementById("darkModeToggle");
    let mobileToggle = document.getElementById("darkModeToggleMobile");

    if (desktopToggle) desktopToggle.innerHTML = icon;
    if (mobileToggle) mobileToggle.innerHTML = `<i class="bi bi-${isDarkMode ? 'sun' : 'moon-stars'}"></i><br>Tema`;
}
function searchAnime(inputId, resultId, moreButtonId, historyContainerId) {
    let query = document.getElementById(inputId).value.trim();
    let resultsContainer = document.getElementById(resultId);
    let moreButton = document.getElementById(moreButtonId);
    let historyContainer = document.getElementById(historyContainerId);

    if (query.length < 2) {
        resultsContainer.style.display = "none";
        resultsContainer.innerHTML = "";
        moreButton.style.display = "none";
        historyContainer.style.display = "block"; // Tampilkan history saat pencarian kosong
        return;
    }

    fetch(`/api/search.php?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            resultsContainer.innerHTML = "";
            resultsContainer.style.display = "block";

            if (data.results.length > 0) {
                data.results.forEach(anime => {
                    let item = document.createElement("a");
                    item.href = `/anime/${anime.mal_id}`;
                    item.classList.add("search-item");
                    item.innerHTML = `<img src="${anime.cover_image}" alt="${anime.title}"> <span>${anime.title}</span>`;
                    resultsContainer.appendChild(item);
                });

                if (data.results.length >= 5) {
                    moreButton.href = `/search/${encodeURIComponent(query)}`;
                    moreButton.style.display = "block";
                } else {
                    moreButton.style.display = "none";
                }

                saveSearchHistory(query);
            } else {
                resultsContainer.innerHTML = "<p class='no-result'>Anime tidak ditemukan.</p>";
                moreButton.style.display = "none";

                if (data.suggestion) {
                    let suggestionItem = document.createElement("p");
                    suggestionItem.classList.add("suggestion");
                    suggestionItem.innerHTML = `Mungkin maksud Anda: <a href="#" onclick="correctSearch('${data.suggestion}', '${inputId}', '${resultId}', '${moreButtonId}', '${historyContainerId}')">${data.suggestion}</a>`;
                    resultsContainer.appendChild(suggestionItem);
                }
            }
        })
        .catch(error => console.error("Error fetching search results:", error));
}

function correctSearch(correctedWord, inputId, resultId, moreButtonId, historyContainerId) {
    document.getElementById(inputId).value = correctedWord;
    setTimeout(() => {
        searchAnime(inputId, resultId, moreButtonId, historyContainerId);
    }, 100); // Tambahkan delay agar browser sempat memperbarui nilai input
}

// Event Listener untuk Desktop & Mobile
document.getElementById("searchInputDesktop").addEventListener("keyup", function() {
    searchAnime("searchInputDesktop", "searchResultsDesktop", "searchMoreDesktop", "searchHistoryDesktop");
    
});
document.getElementById("searchInputDesktop").addEventListener("focus", function() {
    console.log("Input pencarian fokus. Nilai saat ini:", this.value);
});
document.getElementById("searchInputMobile").addEventListener("keyup", function() {
    searchAnime("searchInputMobile", "searchResultsMobile", "searchMoreMobile", "searchHistoryMobile");
});
function getRecaptchaToken(formType) {
    let recaptchaElement;
    
    if (formType === "register") {
        recaptchaElement = document.querySelector("#recaptcha-register");
    } else {
        recaptchaElement = document.querySelector("#recaptcha-login");
    }

    if (!recaptchaElement) {
        console.error("Elemen reCAPTCHA tidak ditemukan untuk:", formType);
        return "";
    }

    return grecaptcha.getResponse(recaptchaElement);
}

function showRegister() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "block";
}

function showLogin() {
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
}
async function register() {
    const username = document.getElementById("registerUsername").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
    const registerButton = document.getElementById("registerButton"); // Ambil tombol register

    if (!username || !email || !password) {
        Swal.fire("Gagal!", "Harap isi semua kolom.", "warning");
        return;
    }

    // Nonaktifkan tombol dan ubah teksnya jadi "Loading..."
    registerButton.disabled = true;
    registerButton.innerHTML = "Loading...";

    try {
        const response = await fetch("/api/register.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
            credentials: "include"
        });

        const result = await response.json();

        if (result.success) {
            Swal.fire("Registrasi Berhasil!", "Silakan cek email untuk verifikasi.", "success")
                .then(() => window.location.href = "/login");
        } else {
            Swal.fire("Registrasi Gagal!", result.error, "error");
        }
    } catch (error) {
        console.error("Error:", error);
        Swal.fire("Terjadi Kesalahan!", "Coba lagi nanti.", "error");
    } finally {
        // Aktifkan kembali tombol dan kembalikan teks aslinya
        registerButton.disabled = false;
        registerButton.innerHTML = "Register";
    }
}
async function login() {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const loginButton = document.getElementById("loginButton");

    if (!username || !password) {
        Swal.fire("Gagal!", "Harap isi semua kolom.", "warning");
        return;
    }

    loginButton.disabled = true;
    loginButton.innerHTML = "Loading...";

    try {
        const response = await fetch("/api/login.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
            credentials: "include"
        });

        const result = await response.json();

        if (result.success) {
            let roleMessage = "";
            switch (result.role) {
                case "Owner":
                    roleMessage = "Selamat datang Owner!";
                    break;
                case "Admin":
                    roleMessage = "Selamat datang Admin!";
                    break;
                case "Mod":
                    roleMessage = "Selamat datang Moderator!";
                    break;
                case "VIP":
                    roleMessage = "Selamat datang VIP!";
                    break;
                case "Oni-chan":
                default:
                    roleMessage = "Selamat datang Oni-chan!";
                    break;
            }

            Swal.fire("Login Berhasil!", `${roleMessage} ${result.username}`, "success")
                .then(() => window.location.href = "/");
        } else {
            Swal.fire("Login Gagal!", result.error, "error");
        }
    } catch (error) {
        console.error("Error:", error);
        Swal.fire("Terjadi Kesalahan!", "Coba lagi nanti.", "error");
    } finally {
        loginButton.disabled = false;
        loginButton.innerHTML = "Login";
    }
}

async function logout() {
    const result = await Swal.fire({
        title: "Yakin ingin logout?",
        text: "Anda harus login kembali untuk mengakses akun!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, Logout"
    });

    if (result.isConfirmed) {
        try {
            const response = await fetch("/api/logout.php", {
                method: "POST", // Gunakan POST agar lebih aman
                credentials: "include"
            });

            const result = await response.json();

            if (result.success) {
                Swal.fire("Logout Berhasil!", "Anda telah keluar.", "success")
                    .then(() => window.location.href = "/");
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire("Terjadi Kesalahan!", "Coba lagi nanti.", "error");
        }
    }
}
