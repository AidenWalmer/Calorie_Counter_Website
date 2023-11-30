(function (){
    window.addEventListener("load", init);

    function init () {
        const form = document.getElementById("image-form");
        form.addEventListener("submit", ()=>{
            console.log("working!");
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
    }

    function showImage(data) {
        const viewImage = document.getElementById("pictureFromCamera");
        viewImage.src = data["image_url"];
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