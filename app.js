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
const imageExtensions = /\.(avif|gif|jpe?g|png|webp)$/i;

function openImage(src, alt) {
  largeImage.src = src;
  largeImage.alt = alt;
  imageDialog.showModal();
}

(config.products || [])
  .filter((product) => imageExtensions.test(product))
  .forEach((product, index) => {
    const src = `products/${product}`;
    const button = document.createElement('button');
    const image = document.createElement('img');
    const alt = `Produktbild ${index + 1}`;

    button.className = 'product-button';
    button.type = 'button';
    button.setAttribute('aria-label', `${alt} öffnen`);

    image.src = src;
    image.alt = alt;
    image.loading = 'lazy';

    button.appendChild(image);
    button.addEventListener('click', () => openImage(src, alt));
    productGrid.appendChild(button);
  });

closeDialog.addEventListener('click', () => imageDialog.close());

imageDialog.addEventListener('click', (event) => {
  if (event.target === imageDialog) {
    imageDialog.close();
  }
});
