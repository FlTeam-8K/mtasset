document.addEventListener("DOMContentLoaded", function () {
    let loader = document.getElementById("loading-screen");
    let content = document.getElementById("content");

    const sliderContainer = document.querySelector(".swiper-wrapper");

    let isAnimeLoaded = false;
    let isEpisodeLoaded = false;

    function checkIfAllLoaded() {
        if (isAnimeLoaded && isEpisodeLoaded) {
            setTimeout(() => {
                loader.style.opacity = "0";
                setTimeout(() => {
                    loader.style.display = "none";
                    content.style.display = "block";
                }, 500);
            }, 500);
        }
    }

    // Fetch Anime
    fetch("./api/latest-anime.php")
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("Error:", data.error);
                return;
            }

            data.forEach(anime => {
                const slide = document.createElement("div");
                slide.classList.add("swiper-slide");

                slide.innerHTML = `
                    <div class="box_item">
                        <a href="/anime/${anime.mal_id}" class="bg_item">
                            <img alt="${anime.title}" height="787" width="500" loading="lazy" src="${anime.banner_image}"/>
                        </a>
                        <div class="content_item">
                            <div class="content_item_chapter">Season ${anime.season} (${anime.season_type})</div>
                            <div class="content_item_title">
                                <a title="${anime.title}" href="/anime/${anime.mal_id}">${anime.title}</a>
                            </div>
                            <div class="content_item_details">
                                <div class="content_item_details_des">${anime.synopsis.substring(0, 150)}...</div>
                                <div class="content_item_details_genre">
                                    ${anime.genres ? anime.genres.split(",").map(genre => `<span>${genre.trim()}</span>`).join("") : ""}
                                </div>
                            </div>
                            <div class="content_item_buttons">
                                <a href="/anime/${anime.mal_id}" class="content_item_buttons_view">View Info</a>
                            </div>
                        </div>
                    </div>
                `;

                sliderContainer.appendChild(slide);
            });

            // Inisialisasi Swiper setelah elemen ditambahkan
             // Tunggu elemen masuk ke DOM sebelum menginisialisasi Swiper
        setTimeout(() => {
            var swiper = new Swiper(".slider_Manga_Reader", {
                effect: "fade",
                navigation: {
                    nextEl: ".swiper-bt-prev",
                    prevEl: ".swiper-bt-next",
                },
                loop: true,
                lazy: true,
                disableOnInteraction: false,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false, // Pastikan autoplay tidak berhenti setelah interaksi
                },
                observer: true, // Pantau perubahan dalam swiper
                observeParents: true, // Pantau perubahan dalam parent swiper
            });

            swiper.autoplay.start(); // Paksa autoplay untuk berjalan
        }, 100); // Beri jeda kecil agar elemen benar-benar siap
            isAnimeLoaded = true;
            checkIfAllLoaded();
            
        })
        .catch(error => console.error("Fetch error:", error));

    // Fetch Episode
    fetch("./api/latest-episodes.php")
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("Error:", data.error);
                return;
            }
            const episodeContainer = document.querySelector(".row.g-3");
            episodeContainer.innerHTML = ""; // Kosongkan container sebelum menambahkan data baru

            data.forEach(episode => {
                const col = document.createElement("div");
                col.classList.add("col");

                const episodeUrl = `/watch/${episode.mal_id}-${episode.episode_number}`;

                col.innerHTML = `
                    <div class="card episode-card" data-url="${episodeUrl}">
                        <img src="${episode.thumbnail}" class="card-img-top" alt="Episode ${episode.episode_number}">
                        <div class="section-desc">
                            Ep ${episode.episode_number} - <strong>${episode.title}</strong>
                        </div>
                        <div class="section-desc">
                            Anime: ${episode.anime_title}
                        </div>
                        <div class="section-desc">
                            Tanggal rilis: ${new Date(episode.created_at).toLocaleDateString()}
                        </div>
                    </div>
                `;

                episodeContainer.appendChild(col);
            });

            // Tambahkan event listener agar seluruh card bisa diklik
            document.querySelectorAll(".episode-card").forEach(card => {
                card.addEventListener("click", function () {
                    const url = this.getAttribute("data-url");
                    if (url) {
                        window.location.href = url;
                    }
                });
            });

            isEpisodeLoaded = true;
            checkIfAllLoaded();
        })
        .catch(error => console.error("Fetch error:", error));
        fetch("./api/latest-ongoing-anime.php")
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error("Error:", data.error);
            return;
        }

        const animeContainer = document.getElementById("latest-ongoing-list");

        animeContainer.innerHTML = ""; // Kosongkan container sebelum menambahkan data baru

        if (data.latest_ongoing.length === 0) {
            animeContainer.innerHTML = `<p>Onii-Chan... Saat ini tidak ada anime yang sedang ongoing.</p>`;
            return;
        }

        data.latest_ongoing.forEach(anime => {
            const col = document.createElement("div");
            col.classList.add("col");

            const animeUrl = `/anime/${anime.mal_id}`;

            col.innerHTML = `
                <div class="card anime-card" data-url="${animeUrl}">
                    <img src="${anime.cover_image}" class="card-img-top" alt="${anime.title}">
                    <div class="section-desc">
                        <strong>${anime.title}</strong>
                    </div>
                    <div class="section-desc">
                        Season ${anime.season} (${anime.season_type})
                    </div>
                </div>
            `;

            animeContainer.appendChild(col);
        });

        // Tambahkan event listener agar seluruh card bisa diklik
        document.querySelectorAll(".anime-card").forEach(card => {
            card.addEventListener("click", function () {
                const url = this.getAttribute("data-url");
                if (url) {
                    window.location.href = url;
                }
            });
        });

        isAnimeLoaded = true;
        checkIfAllLoaded();
    })
    .catch(error => console.error("Fetch error:", error));
    fetch("./api/latest-completed-anime.php")
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error("Error:", data.error);
            return;
        }

        const animeContainer = document.getElementById("latest-completed-list");

        animeContainer.innerHTML = ""; // Kosongkan container sebelum menambahkan data baru

        if (data.latest_completed.length === 0) {
            animeContainer.innerHTML = `<div class="section-desc">Onii-Chan...  Saat ini tidak ada anime yang selesai tayang.</div>`;
            return;
        }

        data.latest_completed.forEach(anime => {
            const col = document.createElement("div");
            col.classList.add("col");

            const animeUrl = `/anime/${anime.mal_id}`;

            col.innerHTML = `
                <div class="card anime-card" data-url="${animeUrl}">
                    <img src="${anime.cover_image}" class="card-img-top" alt="${anime.title}">
                    <div class="section-desc">
                        <strong>${anime.title}</strong>
                    </div>
                    <div class="section-desc">
                        Season ${anime.season} (${anime.season_type})
                    </div>
                </div>
            `;

            animeContainer.appendChild(col);
        });

        // Tambahkan event listener agar seluruh card bisa diklik
        document.querySelectorAll(".anime-card").forEach(card => {
            card.addEventListener("click", function () {
                const url = this.getAttribute("data-url");
                if (url) {
                    window.location.href = url;
                }
            });
        });

        isAnimeLoaded = true;
        checkIfAllLoaded();
    })
    .catch(error => console.error("Fetch error:", error));


});