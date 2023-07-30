var productInfo = document.querySelector(".product-info");
var shirtOption = document.querySelector(".shirt-option");
var optionParts = document.querySelectorAll(".option-part");

let nextStepBtn = document.getElementById("next-step-btn");
let prevStepBtn = document.getElementById("prev-step-btn");

prevStepBtn.addEventListener("click", () => {
    let id = parseInt(document.querySelector(".option-part.current-part").getAttribute("id").substring(6));
    if (id - 1 > 0)
        showPart(id - 1);
});

nextStepBtn.addEventListener("click", () => {
    let id = parseInt(document.querySelector(".option-part.current-part").getAttribute("id").substring(6));
    if (id + 1 <= optionParts.length)
        showPart(id + 1);
});

function showPart(id) {
    optionParts.forEach(optionPart => {
        optionPart.classList.remove("current-part");
    });

    stepBtnAppearance(id);
    document.getElementById(`stage-${id}`).classList.add("current-part");
}

function stepBtnAppearance(id) {
    if (id === 1) {
        prevStepBtn.style.visibility = "hidden";
        shirtOption.classList.add("hidden")
    } else {
        prevStepBtn.style.visibility = "visible";
        shirtOption.classList.remove("hidden")
    }

    if (id === optionParts.length) {
        nextStepBtn.style.visibility = "hidden";
    } else {
        nextStepBtn.style.visibility = "visible";
    }
}

showPart(1); // Show the first part on page load