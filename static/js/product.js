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

// test only

const product_name = ["T-shirt-1", "T-shirt-2", "T-shirt-3"]
const shop_img = ["/static/image/preview-product/green-shirt.jpg", "/static/image/preview-product/polyester-shirt.jpg", "/static/image/preview-product/mint-shirt.jpg"]
const description = ["A classic and versatile wardrobe staple, this cotton T-shirt offers unbeatable comfort and breathability. Crafted from 100% natural cotton fibers, it provides a soft and smooth texture against the skin, making it ideal for everyday wear. Whether you're heading to the gym or just relaxing with friends, this cotton T-shirt will keep you cool and comfortable throughout the day.",
    "Designed for active individuals, this polyester performance T-shirt is engineered to wick away moisture and promote quick drying. The lightweight and durable fabric ensure a snug fit without restricting movement, making it perfect for sports and outdoor activities. Its moisture-wicking properties keep you dry and comfortable even during intense workouts or hot weather.",
    "Indulge in the luxurious softness of a modal T-shirt. Made from sustainably sourced beech tree pulp, modal fabric offers excellent draping and a silky-smooth texture. It is known for its ability to resist shrinking, fading, and pilling, ensuring your T-shirt remains in top-notch condition for a long time."]

const productName = document.querySelector(".product-name")
const productPreivew = document.querySelector(".product-preview > img")
const productAbout = document.querySelector(".product-about")

console.log(productPreivew)
console.log(productAbout)

for (let i=1;i<4;i++) {
    if (urlParams.get("product_id") == i) {
        productName.innerText = product_name[i-1]
        productPreivew.src = shop_img[i-1]
        productAbout.innerText = description[i-1]
    }
}
// test only