/*
 * Author: Aiden Walmer
 * Description: Basic login, using username and password
 */

window.addEventListener('load', init);    // when window is loaded, it will call init
var loggedIn = false;

function init() {
    console.log("Profile Session: " + loggedIn);
    let btnElement = document.querySelector('button');      // select the button by query
    btnElement.addEventListener('click', authenticate);     // on button click, redirect to adminMembersPage
 
    /* Button Color Changes */
    btnElement.addEventListener('mousemove', () => {        // when hovering over the button, perform hover color change
       btnElement.classList.add('hover');
    });


    const togglePassword = document.getElementById('togglePassword');
    const password = document.getElementById('password');
    togglePassword.addEventListener('click', () => {
        // toggle the type attribute
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        // toggle the eye slash icon
        togglePassword.classList.toggle('fa-eye-slash');
    });

    /* Store values of username and password then prompt the login function  */
    function authenticate() {
        let password = document.getElementById('password').value;
        let username = document.getElementById('username').value;

        loggedIn = login(username, password);
        loginStatus();
    }
}
 
/* If login successful, transfer user to new page
 * If login unsuccessful, display the correct error message
 */
function login(username, password) {
    var storedUsername = 'Aiden'; 
    var storedPassword = 'Walmer'; 

    console.log(username);
    console.log(password);

    if (username == storedUsername) {
        return password == storedPassword;
    }
}

function loginStatus() {
    if (loggedIn) {
        console.log("Profile Session: " + loggedIn);
        window.location.href = "file:///C:/xampp/htdocs/capstone/Calorie_Counter_Website/web/index.html";
    }
    else {
        console.log('Incorrect username and password!');
        // Error Message reveal 
        let errorDiv = document.getElementById("error-div");
        errorDiv.classList.remove("hidden");

        // Red styliziation around username/password field 
        var style = document.createElement('style');
        style.innerHTML = ` 
        #username::placeholder, #password::placeholder {
            color: red;
        }
        
        #username, #password {
            border-color: red;
        }
        `;
        document.head.appendChild(style);

        // Clear Password Field
        document.getElementById('password').value = '';
    }
}