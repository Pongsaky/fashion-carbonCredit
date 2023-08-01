// Switch form

let sign_in_btn = document.querySelector(".sign-in-btn");
let sign_up_btn = document.querySelector(".sign-up-btn");

let sign_in_form = document.querySelector(".sign-in-form")
let sign_up_form = document.querySelector(".sign-up-form")

let sign_in_mode = document.querySelector(".sign-in-mode")
let sign_up_mode = document.querySelector(".sign-up-mode")

sign_in_btn.addEventListener("click", () => {
    sign_up_form.classList.remove("current-form");
    sign_in_form.classList.add("current-form");

    sign_up_mode.classList.remove("current-mode")
    sign_in_mode.classList.add("current-mode")
})

sign_up_btn.addEventListener("click", () => {
    sign_in_form.classList.remove("current-form");
    sign_up_form.classList.add("current-form");

    sign_in_mode.classList.remove("current-mode")
    sign_up_mode.classList.add("current-mode")
})

// Sign in form
document.getElementById("sign-in-form").addEventListener("submit", (event) => {
    event.preventDefault()

    let formData = new FormData(event.target)
    let username = formData.get("sign-in-username") 
    let password = formData.get("sign-in-password")
    formData.append("username", username)
    formData.append("password", password)
    console.log(username)
    console.log(password)
    // Make a POST request to the /login endpoint
    fetch("/login", {
        method: "POST",
        body: new URLSearchParams(formData),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
        .then(response => {
            if (response.ok) {
                // If login successful, redirect to the main page
                window.location.href = "/";
            } else if (response.status === 401) {
                // If login failed, show the warning message on the login page
                document.getElementById("sign-in-info").innerHTML = `<h3 class="alert-title">Sign in</h3>
                                                                    <p class="alert-content">Username or Password incorrect</p>`
                document.getElementById("sign-in-info").classList.add("alert")
            } else {
                // Handle other errors here (if necessary)
                console.error("Login error:", response.statusText);
            }
        })
        .catch(error => {
            console.error("Error connecting to the server:", error);
        });
})

// Sign up form
document.getElementById("sign-up-form").addEventListener("submit", (event) => {
    event.preventDefault()

    let formData = new FormData(event.target)
    let username = formData.get("sign-up-username")
    let password = formData.get("sign-up-password")
    let confirmPassword = formData.get("sign-up-confirmpassword")
    let firstname = formData.get("sign-up-firstname")
    let lastname = formData.get("sign-up-lastname")
    let email = formData.get("sign-up-email")

    formData.append("username", username)
    formData.append("password", password)
    formData.append("confirmPassword", confirmPassword)
    formData.append("firstname", firstname)
    formData.append("lastname", lastname)
    formData.append("email", email)

    // Make a POST request to the /login endpoint
    fetch("/register", {
        method: "POST",
        body: new URLSearchParams(formData),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
        .then(response => {
            if (response.ok) {
                // If login successful, redirect to the main page
                window.location.href = "/login";
            } else if (response.status === 401) {
                // If login failed, show the warning message on the login page
                document.getElementById("sign-up-info").innerHTML = `<h3 class="alert-title">Sign up</h3>
                                                                    <p class="alert-content">Password don't match.</p>`
                document.getElementById("sign-up-info").classList.add("alert")
            } else {
                // Handle other errors here (if necessary)
                // console.error("Login error:", response.statusText);
            }
        })
        .catch(error => {
            console.error("Error connecting to the server:", error);
        });
})