const productGrid = document.getElementById('productGrid');
const productsApi = 'https://api.github.com/repos/azarqrcod/hosna-grosshandel/contents/products?ref=main';
const supportedImage = /\.(?:jpe?g|png|webp)$/i;

function showStatus(message) {
  productGrid.replaceChildren();
  const status = document.createElement('p');
  status.className = 'gallery-status';
  status.textContent = message;
  productGrid.appendChild(status);
}

function productNumber(filename) {
  const match = filename.match(/\d+/);
  return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER;
}

function showProducts(files) {
  productGrid.replaceChildren();

  files.forEach((file, index) => {
    const card = document.createElement('div');
    const image = document.createElement('img');
    card.className = 'product-card';
    image.src = file.download_url;
    image.alt = `Produktbild ${index + 1}`;
    image.loading = 'lazy';
    image.decoding = 'async';
    card.appendChild(image);
    productGrid.appendChild(card);
  });
}

async function loadProducts() {
  try {
    const response = await fetch(productsApi, { headers: { Accept: 'application/vnd.github+json' } });
    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);

    const contents = await response.json();
    const images = contents
      .filter((item) => item.type === 'file' && supportedImage.test(item.name))
      .sort((a, b) => productNumber(a.name) - productNumber(b.name) || a.name.localeCompare(b.name, undefined, { numeric: true }));

    if (images.length === 0) {
      showStatus('Noch keine Produkte verfügbar.');
      return;
    }

    showProducts(images);
  } catch (error) {
    console.error('Produkte konnten nicht geladen werden.', error);
    showStatus('Produkte konnten nicht geladen werden.');
  }
}

if (productGrid) loadProducts();
