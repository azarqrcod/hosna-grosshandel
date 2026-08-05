const config = window.HOSNA_CONFIG || { links: {}, products: [] };

const linkMap = {
  whatsappLink: config.links.whatsapp,
  instagramLink: config.links.instagram,
  emailLink: config.links.email,
  mapsLink: config.links.maps
};

Object.entries(linkMap).forEach(([id, href]) => {
  const link = document.getElementById(id);

  if (link && href) {
    link.href = href;
  }
});

const productGrid = document.getElementById('productGrid');
const imageDialog = document.getElementById('imageDialog');
const largeImage = document.getElementById('largeImage');
const closeDialog = document.getElementById('closeDialog');
const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif'];
const configuredProducts = Array.isArray(config.products) ? config.products : [];
const maxProductNumber = Number.isInteger(config.maxProductNumber) ? config.maxProductNumber : 999;

function openImage(src, alt) {
  largeImage.src = src;
  largeImage.alt = alt;
  imageDialog.showModal();
}

function createProductTile(src, index) {
  const button = document.createElement('button');
  const image = document.createElement('img');
  const alt = `Produktbild ${index}`;

  button.className = 'product-button is-loaded';
  button.type = 'button';
  button.setAttribute('aria-label', `${alt} öffnen`);

  image.src = src;
  image.alt = alt;
  image.loading = 'lazy';
  image.decoding = 'async';

  button.appendChild(image);
  button.addEventListener('click', () => openImage(src, alt));
  productGrid.appendChild(button);
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

if (configuredProducts.length > 0) {
  loadConfiguredProducts();
} else {
  loadNumberedProducts();
}

closeDialog.addEventListener('click', () => imageDialog.close());

imageDialog.addEventListener('click', (event) => {
  if (event.target === imageDialog) {
    imageDialog.close();
  }
});
