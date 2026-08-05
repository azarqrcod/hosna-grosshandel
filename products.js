const config = window.HOSNA_CONFIG || { products: [] };
const productGrid = document.getElementById('productGrid');
const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif'];
const configuredProducts = Array.isArray(config.products) ? config.products : [];
const maxProductNumber = Number.isInteger(config.maxProductNumber) ? config.maxProductNumber : 9999;

function createProductTile(src, index) {
  const card = document.createElement('article');
  const image = document.createElement('img');

  card.className = 'temu-product-card';
  image.src = src;
  image.alt = `Produktbild ${index}`;
  image.loading = 'lazy';
  image.decoding = 'async';

  card.appendChild(image);
  productGrid.appendChild(card);
}

function testImage(src) {
  return new Promise((resolve) => {
    const image = new Image();

    image.onload = () => resolve(src);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

async function findNumberedProduct(number) {
  const paddedNumber = String(number).padStart(3, '0');

  for (const extension of imageExtensions) {
    const src = `products/${paddedNumber}.${extension}`;
    const foundImage = await testImage(src);

    if (foundImage) {
      return foundImage;
    }
  }

  return null;
}

async function loadNumberedProducts() {
  let visibleIndex = 1;

  for (let number = 1; number <= maxProductNumber; number += 1) {
    const src = await findNumberedProduct(number);

    if (src) {
      createProductTile(src, visibleIndex);
      visibleIndex += 1;
    }
  }
}

function loadConfiguredProducts() {
  configuredProducts
    .filter((product) => /\.(avif|gif|jpe?g|png|webp)$/i.test(product))
    .forEach((product, index) => createProductTile(`products/${product}`, index + 1));
}

if (productGrid) {
  if (configuredProducts.length > 0) {
    loadConfiguredProducts();
  } else {
    loadNumberedProducts();
  }
}
