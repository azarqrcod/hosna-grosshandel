const config = window.HOSNA_CONFIG || { links: {} };

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
