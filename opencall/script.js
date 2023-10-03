// Define the show function globally
function show() {
    document.querySelector('.hamburger').classList.toggle('open');
    document.querySelector('.navigation').classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const body = document.querySelector('body');
    const dynamicImage = document.getElementById('dynamic-image');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const imageDescription = document.getElementById('image-description'); // Added this line

    hamburger.addEventListener('click', function() {
        body.classList.toggle('menu-open');
    });

    const images = [
        'https://onlineviewingroom.com/wp-content/uploads/2023/10/Rectangle-12-1.png',
        'https://onlineviewingroom.com/wp-content/uploads/2023/10/Rectangle-12-2.png',
        'https://onlineviewingroom.com/wp-content/uploads/2023/10/Rectangle-12-4.png'
        // Add more image URLs here
    ];

    const imageDescriptions = [ // Added an array of descriptions
        '<div style="width: 100%; height: 100%; text-align: center"><span style="color: black; font-size: 18px; font-family: Space Grotesk; font-weight: 700; letter-spacing: 1.25px; word-wrap: break-word">VILLA MASSIMO<br></span><span style="color: black; font-size: 16px; font-family: Space Grotesk; font-weight: 300; letter-spacing: 1.25px; word-wrap: break-word">Rome</span></div>',
        '<div style="width: 100%; height: 100%; text-align: center"><span style="color: black; font-size: 18px; font-family: Space Grotesk; font-weight: 700; letter-spacing: 1.25px; word-wrap: break-word">MOSTYN<br></span><span style="color: black; font-size: 16px; font-family: Space Grotesk; font-weight: 300; letter-spacing: 1.25px; word-wrap: break-word">Wales</span></div>',
        '<div style="width: 100%; height: 100%; text-align: center"><span style="color: black; font-size: 18px; font-family: Space Grotesk; font-weight: 700; letter-spacing: 1.25px; word-wrap: break-word">GLASSYARD GALLERY<br></span><span style="color: black; font-size: 16px; font-family: Space Grotesk; font-weight: 300; letter-spacing: 1.25px; word-wrap: break-word">Budapest</span></div>'
        // Add more descriptions here corresponding to the images
    ];

    let currentIndex = 0;

    function updateImage() {
        dynamicImage.setAttribute('xlink:href', images[currentIndex]);
        imageDescription.textContent = imageDescriptions[currentIndex]; // Update the text
        imageDescription.innerHTML = imageDescriptions[currentIndex]; // Use innerHTML
    }

    prevButton.addEventListener('click', () => {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = images.length - 1;
        }
        updateImage();
    });

    nextButton.addEventListener('click', () => {
        currentIndex++;
        if (currentIndex >= images.length) {
            currentIndex = 0;
        }
        updateImage();
    });

    // Initialize with the first image and description
    updateImage();
});
