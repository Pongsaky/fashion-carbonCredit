// Get the 'Add +' button and the 'product-info' element
const addButton = document.getElementById('add-btn');
const productInfo = document.getElementById('product-info');

const contentSet1 = productInfo.innerHTML;

// Define your custom product-info content
const customContent = `
  <h1 class="product-name">Custom Product Name</h1>
  <h2 class="shop-name">By Custom Shop</h2>
  <h3 class="product-about">Custom description for your product.</h3>
  <div class="tags">
    <span class="tag">Tags: </span>
    <div class="category-group">
      <span class="category">Custom Tag 1</span>
      <span class="category">Custom Tag 2</span>
    </div>
  </div>
`;

// Function to slide up the element
function slideUp(element) {
    element.style.transition = 'max-height 0.4s ease-out';
    element.style.maxHeight = '0';
    element.style.paddingTop = '0';
    element.style.paddingBottom = '0';
}

// Function to slide down the element
function slideDown(element) {
    element.style.transition = 'max-height 0.4s ease-out';
    element.style.maxHeight = element.scrollHeight + 'px';
    element.style.paddingTop = '0px'; // Adjust this value to your desired padding
    element.style.paddingBottom = '515px'; // Adjust this value to your desired padding
}

// Keep track of the current state
let showCustomContent = false;

// Function to toggle between your custom content and contentSet1 with slide-up and slide-down animation
function toggleContent() {
    showCustomContent = !showCustomContent;
    const newContent = showCustomContent ? customContent : contentSet1;

    // Slide up animation before changing the content
    slideUp(productInfo);

    setTimeout(() => {
        // Change the content inside the product-info element
        productInfo.innerHTML = newContent;

        // Slide down animation after changing the content
        slideDown(productInfo);
    }, 400); // 300ms is the duration of the CSS transition
}

// Add a click event listener to the 'Add +' button
addButton.addEventListener('click', toggleContent);