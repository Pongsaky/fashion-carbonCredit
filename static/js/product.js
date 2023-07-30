var productInfo = document.querySelector(".product-info");
var shirtOption = document.querySelector(".shirt-option");

let next_step_btn = document.getElementById("next-step-btn");
let prev_step_btn = document.getElementById("prev-step-btn");
let option_parts = document.querySelectorAll(".option-part");

prev_step_btn.addEventListener("click", () => {
    let id = parseInt(document.querySelector(".option-part.current-part").getAttribute("id").substring(6));
    if (id - 1 > 0)
        show_part(id - 1);
})
next_step_btn.addEventListener("click", () => {
    let id = parseInt(document.querySelector(".option-part.current-part").getAttribute("id").substring(6));
    if (id + 1 <= option_parts.length)
        show_part(id + 1);
})


function show_part(id) {
    option_parts.forEach(option_part => {
        option_part.classList.remove("current-part");
    })

    step_btn_appearance(id)
    document.getElementById(`stage-${id}`).classList.add("current-part");
}

function step_btn_appearance(id) {
    if (id === 1) {
        prev_step_btn.style.visibility = "hidden";
        shirtOption.classList.add("hidden")
    } else {
        shirtOption.classList.remove("hidden")
        prev_step_btn.style.visibility = "visible";
    }

    if (id === option_parts.length) next_step_btn.style.visibility = "hidden"
    else next_step_btn.style.visibility = "visible"
}

step_btn_appearance(1)
