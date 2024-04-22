(function (){
    window.addEventListener("load", init);

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
            const popup = window.open('', '', 'width=600,height=600');
            images.forEach(image => {
                // Create a div element for each image
                const div = popup.document.createElement('div');
                // Create an img element for each image
                const img = popup.document.createElement('img');
                img.src = '/uploads/' + image; // adjust the path as needed
                img.style.width = '100px'; // adjust as needed
                img.style.height = '100px'; // adjust as needed
                // Create a label for each image
                const label = popup.document.createElement('p');
                label.textContent = image;
                // Add the img and label elements to the div
                div.appendChild(img);
                div.appendChild(label);
                // Add the div element to the pop-up window
                popup.document.body.appendChild(div);
            });
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