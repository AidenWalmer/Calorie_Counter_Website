(function (){
    // Load starter functions
    window.addEventListener("load", init);

    // On load remove all photos from the Uploads directory
    window.onload = function() {
        fetch('/clear-uploads');
    };

    function init () {
        const form = document.getElementById("image-form");
        form.addEventListener("submit", submitImage);

        // Previous photo button
        document.getElementById('previous-photo').addEventListener('click', function(event) {
            event.preventDefault(); // prevent the default action
            displayUploadsInPopup();
        });
    }

    function submitImage(event) {
        const image_file = document.getElementById("cameraFileInput"); 
        console.log(image_file);
        const url = "/profile-upload-single";
        const form = document.getElementById("image-form");
        const data = new FormData(form);
        const options = {
            "method": "POST", 
            "body": data
        };
        fetch(url, options)
        .then(checkStatus)
        .then(showImage);
        event.preventDefault();

        // Remove text from h1 tag within camera-div after image is uploaded
        const textElement = document.querySelector('.camera-div h1');
        if (textElement) {
            textElement.style.display = 'none';
        }
    }

    function showImage(data) {
        const viewImage = document.getElementById("pictureFromCamera");
        viewImage.src = data["image_url"];
        // Set the width to 50% snd height to 100% of the img display div
        viewImage.style.width = '50%';
        viewImage.style.height = '100%';
    }

    function displayUploadsInPopup() {
        fetch('/get-images')
        .then(response => response.json())
        .then(images => {
            // Create a pop-up window
            const popup = window.open('', '', 'width=2000,height=2000');    // Pop up size
            // Create a container for the images
            const container = popup.document.createElement('div');
            container.style.display = 'grid';
            container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(150px, 1fr))'; // Grid image sizes
            container.style.gridGap = '50px';         // Space between images
            images.forEach(image => {
                // Create a div element for each image
                const div = popup.document.createElement('div');
                div.style.border = '1px solid black'; // Border around images
                // Create an img element for each image
                const img = popup.document.createElement('img');
                img.src = '/uploads/' + image; 
                img.style.width = '100%';
                img.style.height = '100%';
                // Create a label for each image
                const label = popup.document.createElement('p');
                label.textContent = image;
                label.style.fontSize = '12px';        // Label font size
                // Add the img and label elements to the div
                div.appendChild(img);
                div.appendChild(label);
                // Add the div element to the container
                container.appendChild(div);
            });
            // Add the container to the pop-up window
            popup.document.body.appendChild(container);
        });
    }

    function checkStatus(response) {
        if (response.ok) {
            return response.json();
        }
        else {
            console.log(response);
        }
    }

})();