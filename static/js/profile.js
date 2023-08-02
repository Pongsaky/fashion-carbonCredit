let select_lists = document.querySelectorAll(".select-list");
let my_account = document.querySelector(".my-account")
let purchase_history = document.querySelector(".purchase-history")

select_lists.forEach((select_list, index) => {
    select_list.addEventListener("click", () => {
        select_lists.forEach(e => {
            e.classList.remove("current-list");
        })
        select_list.classList.add("current-list");

        if (index == 0) {
            purchase_history.classList.remove("current-content")
            my_account.classList.add("current-content")
        }
        else if (index == 2) {
            my_account.classList.remove("current-content")
            purchase_history.classList.add("current-content")
        }
    })
})

// Click overlay of upload text
// JavaScript function to trigger the file input on "Upload Image" click
document.getElementById("upload-text").addEventListener("click", function () {
    // console.log("Clicked")
    document.getElementById("profile-img-upload").click();
});

// JavaScript function to update the profile image on file selection
document.getElementById("profile-img-upload").addEventListener("change", function () {
    let fileInput = document.getElementById("profile-img-upload");
    let file = fileInput.files[0];

    if (file) {
        let reader = new FileReader();
        reader.onload = function (e) {
            // Display the selected image as the profile image
            document.getElementById("profile-image").src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});