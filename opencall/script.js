let currentImageIndex = 0;
const images = ["https://onlineviewingroom.com/image-viewer-default-rectangle-12/", "https://onlineviewingroom.com/sample-to-cage-2image2texta/", "https://onlineviewingroom.com/group-40-desktop/"]; // Add your image URLs here

function updateImage() {
    const imageElement = document.querySelector(".image-viewer-section .image");
    imageElement.src = images[currentImageIndex];
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateImage();
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateImage();
}

function show() {
    document.querySelector('.hamburger').classList.toggle('open');
    document.querySelector('.navigation').classList.toggle('active');
}

updateImage(); // Show the initial image
