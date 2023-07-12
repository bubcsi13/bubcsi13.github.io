// imageViewer.js

(function () {
  // Create a namespace for the image viewer
  var imageViewer = {};

  // Get all the images on the page
  var images = document.getElementsByTagName("img");

  // Create an event listener for each image
  for (var i = 0; i < images.length; i++) {
    images[i].addEventListener("click", function () {
      openImageViewer(this.src);
    });
  }

  // Function to open the image viewer with zoom and pan functionality
  function openImageViewer(imageSrc) {
    // Create the image viewer overlay element
    var overlay = document.createElement("div");
    overlay.className = "image-viewer-overlay";
    document.body.appendChild(overlay);

    // Create the image container
    var imageContainer = document.createElement("div");
    imageContainer.className = "image-viewer-container";
    overlay.appendChild(imageContainer);

    // Create the image element
    var image = document.createElement("img");
    image.src = imageSrc;
    image.className = "image-viewer-image";
    imageContainer.appendChild(image);

    // Create the close button
    var closeButton = document.createElement("button");
    closeButton.className = "image-viewer-close";
    closeButton.innerHTML = "Close";
    overlay.appendChild(closeButton);

    // Set initial scale and position values
    var scale = 1;
    var posX = 0;
    var posY = 0;

    // Close the image viewer when the close button is clicked
    closeButton.addEventListener("click", function () {
      overlay.remove();
      document.body.style.overflow = "auto";
    });

    // Zoom and pan with mouse events
    var isDragging = false;
    var startX = 0;
    var startY = 0;

    image.addEventListener("mousedown", function (event) {
      event.preventDefault();
      isDragging = true;
      startX = event.clientX - posX;
      startY = event.clientY - posY;
    });

    image.addEventListener("mousemove", function (event) {
      if (!isDragging) return;
      posX = event.clientX - startX;
      posY = event.clientY - startY;
      updateImageTransform();
    });

    image.addEventListener("mouseup", function () {
      isDragging = false;
    });

    image.addEventListener("mouseleave", function () {
      isDragging = false;
    });

    imageContainer.addEventListener("wheel", function (event) {
      event.preventDefault();

      var delta = Math.sign(event.deltaY);
      var zoomIntensity = 0.1;
      var prevScale = scale;

      if (delta < 0) {
        scale += zoomIntensity;
      } else {
        scale -= zoomIntensity;
        scale = Math.max(0.1, scale);
      }

      var rect = image.getBoundingClientRect();
      var x = event.clientX - rect.left;
      var y = event.clientY - rect.top;
      posX = x - (x - posX) * (scale / prevScale);
      posY = y - (y - posY) * (scale / prevScale);

      updateImageTransform();
    });

    function updateImageTransform() {
      image.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
    }

    // Prevent scrolling on the body when the image viewer is open
    document.body.style.overflow = "hidden";
  }

  // Expose the imageViewer object to the global scope
  window.imageViewer = imageViewer;
})();
