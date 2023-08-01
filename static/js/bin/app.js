let count = document.getElementById("count")
let plus_btn = document.getElementById("plus-btn")
let minus_btn = document.getElementById("minus-btn")

plus_btn.addEventListener("click", () => {
    let num = count.value
    count.value = (parseInt(num) + 1).toString()
})
minus_btn.addEventListener("click", () => {
    if (count.value > 1)
        count.value -= 1
})
