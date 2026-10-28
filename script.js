const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('is-open', !expanded);
  });

  navLinks.addEventListener('click', (event) => {
    if (!event.target.closest('a')) return;
    navToggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('is-open');
  });
}

const imageDialog = document.querySelector('.image-dialog');

if (imageDialog && typeof imageDialog.showModal === 'function') {
  const dialogImage = imageDialog.querySelector('img');
  const dialogCaption = imageDialog.querySelector('p');
  const closeButton = imageDialog.querySelector('.dialog-close');
  const projectImages = document.querySelectorAll('.project-media img');

  projectImages.forEach((image) => {
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', `${image.alt}. Open larger preview.`);

    const openPreview = () => {
      dialogImage.src = image.src;
      dialogImage.alt = image.alt;
      dialogCaption.textContent = image.closest('figure')?.querySelector('figcaption')?.textContent || '';
      imageDialog.showModal();
    };

    image.addEventListener('click', openPreview);
    image.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openPreview();
      }
    });
  });

  closeButton?.addEventListener('click', () => imageDialog.close());
  imageDialog.addEventListener('click', (event) => {
    if (event.target === imageDialog) imageDialog.close();
  });
  imageDialog.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') imageDialog.close();
  });
}
