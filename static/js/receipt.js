const queryString = window.location.search
const UrlParams = new URLSearchParams(queryString);
const checkoutId = UrlParams.get("checkoutId")

var all_product_price = 0;
var all_product_item = 0;

const shop_header = ` `

const product_template = `
                    <!-- Shop Name -->
                    <div class="item-head">
                        <div class="shop-name">
                            <p>%shop_name</p>
                        </div>
                    </div>
                    <!-- Shop Name -->
                    
                    <div class="gray-line"></div>

                    <div class="item-info">
                        <!-- Product Image -->
                        <div class="item-pic">
                            <img src=%product_image alt="" class="imgs">
                        </div>
                        <!-- Product Image -->
                
                        <!-- Name and Tag Product -->
                        <div class="item-detail">
                            <div class="item-name">
                                <p>%product_name</p>
                            </div>
                            $product_tag
                        </div>
                        <!-- Name and Tag Product -->
                
                        <!-- Product Price -->
                        <div class="price-per-item">
                            <div class="price-per">
                                <span>300</span> THB
                            </div>
                        </div>
                        <!-- Product Price -->
                
                        <!-- Size Amount -->
                        $item_amount
                        <!-- Size Amount -->
                
                        <!-- Conclude price and number of item -->
                        <div class="item-sub">
                            <div class="item-allamount">
                                %total-product Item
                            </div>
                            <div class="item-allprice">
                                %total-price THB
                            </div>
                            <div class="item-allprice-notetzero">
                                %total-netzero-price THB ( Not Net-Zero )
                            </div>
                        </div>
                        <!-- Conclude price and number of item -->
                
                    </div>
                
                    <div class="gray-line"></div>
                    <!-- END 1 Product -->`

footer_template = `<div class="sub-price">
                        <div></div>
                        <div></div>
                        <div class="product-price">
                            Product Price : %product_price THB
                        </div>
                        <div class="carbon-credit-price">
                            <div class="sub-cc">
                                Carbon Credit support : %cc_price THB
                            </div>
                            <div class="per-cc">
                                Carbon Credit support : %cc_price_per_item THB / item
                            </div>
                        </div>
                        <div class="order-total">
                            Order total:
                        </div>
                        <div class="total-price">
                            %total_price THB
                        </div>
                    </div>`

function getProductHTML(shop_name, product_name, product_image, categoryHTML, sizeHTML) {
    // select property
    return product_template.replace("%shop_name", shop_name)
        .replace("%product_image", product_image)
        .replace("%product_name", product_name)
        .replace("$product_tag", categoryHTML)
        .replace("$item_amount", sizeHTML)
}

function getCategoryHTML(select_property, property_template, isNetZero) {
    // console.log("Cate", select_property)
    // console.log(isNetZero)
    const categoryGroup = document.createElement("div");
    categoryGroup.classList.add("item-tags")

    Object.entries(select_property).forEach((entry, idx) => {
        const [key, value] = entry;
        const childCategory = document.createElement("div");
        childCategory.classList.add("tag")

        if (property_template[key][value] != undefined) {
            // Encode from select_property to Text for category
            childCategory.innerHTML = property_template[key][value]
            categoryGroup.appendChild(childCategory)
        }
        // console.log(idx)
        if (idx==4 && isNetZero==1) {
            const childCategory = document.createElement("div");
            childCategory.classList.add("tag")
            childCategory.classList.add("net-zero")
            childCategory.innerHTML = "net-zero"
            categoryGroup.appendChild(childCategory)
        }
        
    })
    // return Category HTML and replace it
    return categoryGroup.outerHTML
}

function getSizeHTML(select_property) {
    // console.log(select_property)
    const amountDiv = document.createElement("div");
    amountDiv.classList.add("item-amount")

    Object.entries(select_property['size']).forEach(entry => {
        const [size, size_amount] = entry;
        if (size_amount > 0) {
            // console.log(key, value)
            const sizeDiv = document.createElement("div");
            sizeDiv.classList.add("size-amount")

            const childSpan = document.createElement("div");
            childSpan.classList.add("size-icon")
            childSpan.innerHTML = size

            const amountSize = document.createElement("div");
            amountSize.classList.add("amount")
            amountSize.innerHTML = size_amount

            sizeDiv.appendChild(childSpan)
            sizeDiv.appendChild(amountSize)

            amountDiv.appendChild(sizeDiv)
        }
    })
    // return Category HTML and replace it
    return amountDiv.outerHTML
}

document.addEventListener(("DOMContentLoaded"), async () => {
    const checkoutRes = await fetch(`/checkout/${checkoutId}`)
    const checkout = await checkoutRes.json()
    console.log(JSON.parse(checkout['data']))

    const propertyResponse = await fetch("/type/1", { method: "GET" })
    const type_res = await propertyResponse.json()
    const property_template = JSON.parse(type_res['property'])
    property_template["sleeve"] = property_template['sleeve-length']
    console.log("Property Template : ", property_template)

    const productContainer = document.getElementById("product-container")

    Object.entries(JSON.parse(checkout['data'])).forEach(async (entry, idx) => {

        const itemDiv = document.createElement("div")
        itemDiv.classList.add("items")

        const [key, value] = entry
        let orderList = []

        for (data of value) {
            orderList.push(data['orderId'])
        }

        // console.log(orderList)

        const response = await fetch(`/service/fetch-checkout/`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(orderList)
        })

        const checkouts = await response.json()
        console.log(checkouts)
        let index = -1;
        let i = 0;

        let HTML_render = ``
        const pricePerItem = 300;

        checkouts.forEach((checkout) => {

            console.log(checkout)

            if (index !== checkout['shop_id']) {

                if (i != 0) HTML_render += '</div>'
                // Add header when shop change
                HTML_render += shop_header.replace("%shop_name", checkout['shop_name'])
                index = checkout['shop_id']
            }

            // Add catrgory
            let categoryHTML = getCategoryHTML(JSON.parse(checkout['select_property']), property_template, checkout['neutral_mark'])
            // console.log(categoryHTML)

            // Add size amount
            let sizeHTML = getSizeHTML(JSON.parse(checkout['select_property']))
            // console.log(sizeHTML)

            let HTML_image
            if (checkout['order_image']) {
                // console.log("HELLO")
                HTML_image = checkout['order_image'].replace(/"/g, "")
            } else {
                HTML_image = JSON.parse(checkout['product_image'])[1].replace(/"/g, "")
            }

            // Add checkout product
            HTML_render += getProductHTML(checkout['shop_name'], checkout['product_name'],
                HTML_image, categoryHTML, sizeHTML)

            // HTML_render += getProductHTML(checkout['shop_name'], checkout['product_name'],
            //     JSON.parse(checkout['product_image'])[1].replace(/"/g, ""), categoryHTML, sizeHTML)
            
            i += 1
            // This if have problem in case of have two shop
            // put </div> only last order but when shop change?
            if (i == checkout.length) {
                HTML_render += '</div>'
            }

        })

        itemDiv.innerHTML = HTML_render
        console.log(itemDiv);
        // Update Price
        itemDiv.querySelectorAll(".item-amount").forEach(amountDiv => {
            console.log(amountDiv)
            let total_price = 0;
            let total_item = 0;
            const itemProduct = amountDiv.closest(".item-info")
            console.log(itemProduct)

            amountDiv.querySelectorAll(".size-amount").forEach((amountPerSize) => {
                const amount = parseInt(amountPerSize.querySelector(".amount").innerText);
                const price = parseInt(itemProduct.querySelector(".price-per > span").innerText)
                total_item += amount
                total_price += price * amount

                all_product_item += amount
                all_product_price += price * amount
            })

            itemProduct.innerHTML = itemProduct.innerHTML.replace("%total-product", total_item)
                                                         .replace("%total-netzero-price", total_price)
                .replace("%total-price", total_price + total_item * 0.2)
        })

        productContainer.appendChild(itemDiv)

        if (Object.keys(JSON.parse(checkout['data'])).length == idx+1) {
            // Add footer part
            const footerDiv = document.createElement("div")
            footerDiv.classList.add("footer")
            footerDiv.innerHTML = footer_template.replace("%product_price", all_product_price)
                                                 .replace("%cc_price", all_product_item * 0.2)
                                                 .replace("%cc_price_per_item", 0.2)
                                                 .replace("%total_price", all_product_price + all_product_item * 0.2)
            productContainer.append(footerDiv)

        }
        
    })
})

document.querySelector(".semi-header").innerText = `Hi Test`