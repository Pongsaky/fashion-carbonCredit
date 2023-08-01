// Stage of page

var productInfo = document.querySelector(".product-info");
var shirtOption = document.querySelector(".shirt-option");
var optionParts = document.querySelectorAll(".option-part");

let nextStepBtn = document.getElementById("next-step-btn");
let prevStepBtn = document.getElementById("prev-step-btn");
let orderBtn = document.getElementById("order-btn");

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
        orderBtn.style.visibility = "visible";
    } else {
        nextStepBtn.style.visibility = "visible";
        orderBtn.style.visibility = "hidden"
    }
}

showPart(1); // Show the first part on page load


// Order T-shrit

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

var user_id = document.getElementById("user_id_placeholder").dataset.userId;
var product_id = urlParams.get("product_id");

orderBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    let formData = new FormData(document.getElementById('shirt-option-form'))
    console.log(formData)
    const formDataObj = {}
    formData.forEach((value, key) => {
        formDataObj[key] = value
    })
    console.log(formDataObj)

    const sizeOptions = ['xs', 's', "m", "l", "xl"]
    const col_name = ['fabric', "fit", "neckline", "sleeve"]

    const response = await fetch("/type/1", { method: "GET" })
    const type_res = await response.json()
    const property_template = JSON.parse(type_res['property'])
    var select_property = {}

    property_template["sleeve"] = property_template['sleeve-length']
    // Change like the form Data
    col_name.forEach((col) => {
        let values = property_template[col]
        let valueList = []
        values.forEach((value) => {
            valueList.push(value.toLowerCase().replace(" ", "-"))
        })
        property_template[col] = valueList
    })

    console.log(property_template)
    var sizeObj = {}
    for (size of sizeOptions) {
        let amount = formDataObj[`amount-${size}`]
        if (amount === "") amount=0
        sizeObj[size] = amount
    }

    select_property["size"] = sizeObj

    col_name.forEach((col) => {
        console.log(property_template[col], (formDataObj[col].toLowerCase()).replace(" ", "-"))
        let index = property_template[col].indexOf((formDataObj[col].toLowerCase()).replace(" ", "-"))            
        select_property[col] = index
    })

    console.log(select_property)

    // fetch
    const data = {}
    data["user_id"] = user_id
    data["product_id"] = product_id
    data["select_property"] = select_property
    data["neutral_mark"] = formDataObj["save-world"] == "on" ? 1 : 0
    data["status"] = 0


    console.log(JSON.stringify(data))
    fetch("/order/", {
        method : "POST",
        headers : {"Content-type": "application/json"},
        body : JSON.stringify(data)
    }).then((res) => {
        if (res.ok) {
            window.location.href = `/product?product_id=${urlParams.get("product_id")}`
        }
    })

})