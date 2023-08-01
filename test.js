function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function getRandomItemFromArray(arr) {
//     const randomIndex = Math.floor(Math.random() * arr.length);
//     return arr[randomIndex];
// }

function getRandomItemsFromArray(arr, count) {
    const shuffled = arr.slice(); // Create a copy of the original array
    const randomItems = [];

    // Fisher-Yates (aka Knuth) Shuffle to shuffle the array
    for (let i = shuffled.length - 1; i >= 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
    }

    // Take the first 'count' items from the shuffled array
    for (let i = 0; i < count; i++) {
        randomItems.push(shuffled[i]);
    }

    return randomItems;
}

function generateRandomProduct() {
    const fabricOptions = ['Cotton', 'Polyester'];
    const necklineOptions = ['Crew neck', 'V-neck', 'Scoop neck'];
    const sleeveLengthOptions = ['Sleeveless', 'Short sleeves', 'Long sleeves'];
    const fitOptions = ['Slim fit', 'Regular fit', 'Oversized'];
    const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', '2XL'];

    const randomFabrics = getRandomItemsFromArray(fabricOptions, getRandomInt(1, fabricOptions.length));
    const randomNeckline = getRandomItemsFromArray(necklineOptions, getRandomInt(1, necklineOptions.length));
    const randomSleeveLength = getRandomItemsFromArray(sleeveLengthOptions, getRandomInt(1, sleeveLengthOptions.length));
    const randomFit = getRandomItemsFromArray(fitOptions, getRandomInt(1, fitOptions.length));
    const randomSize = getRandomItemsFromArray(sizeOptions, getRandomInt(1, sizeOptions.length));

    const randomProduct = {
        fabric: randomFabrics,
        neckline: randomNeckline,
        sleeveLength: randomSleeveLength,
        fit: randomFit,
        size: randomSize,
    };

    return randomProduct;
}

function convertToBinary (arr) {
    
}

const randomProduct = generateRandomProduct();
console.log(randomProduct);