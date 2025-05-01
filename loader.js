// Pastikan gambar selesai dimuat sebelum menghilangkan loader
        window.addEventListener("load", function() {
            const ImageData = document.getElementById("ImageData");

            if (ImageData.complete) {
                document.querySelector("#loading-screen").style.display = "none";
                document.querySelector(".container").style.display = "block";
            } else {
                ImageData.onload = function() {
                    document.querySelector("#loading-screen").style.display = "none";
                    document.querySelector(".container").style.display = "block";
                };
            }
        });