const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#primary-nav');
const mobileLayout = matchMedia('(max-width: 70rem)');
const navGroups = [...nav.querySelectorAll('details')];

function setMenu(open) {
  const mobile = mobileLayout.matches;
  menuButton.hidden = !mobile;
  menuButton.setAttribute('aria-expanded', String(mobile && open));
  nav.hidden = mobile && !open;
}

function closeGroups(except) {
  navGroups.forEach(group => {
    if (group !== except) group.open = false;
  });
}

setMenu(false);
mobileLayout.addEventListener('change', () => {
  const focusedNav = nav.contains(document.activeElement);
  const focusedButton = document.activeElement === menuButton;
  closeGroups();
  setMenu(false);
  if (mobileLayout.matches && focusedNav) menuButton.focus();
  if (!mobileLayout.matches && focusedButton) nav.querySelector('a').focus();
});

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  if (isOpen) closeGroups();
  setMenu(!isOpen);
});

nav.addEventListener('click', event => {
  const summary = event.target.closest('summary');
  if (summary) closeGroups(summary.parentElement);

  const link = event.target.closest('a');
  if (!link) return;
  closeGroups();
  if (mobileLayout.matches) setMenu(false);

  // Move focus to the destination after closing a mobile or dropdown menu.
  if (link.hash && link.getAttribute('href').startsWith('#')) {
    const target = document.getElementById(link.hash.slice(1));
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  }
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  const openGroup = navGroups.find(group => group.open);
  if (openGroup && nav.contains(document.activeElement)) {
    openGroup.open = false;
    openGroup.querySelector('summary').focus();
  } else if (menuButton.getAttribute('aria-expanded') === 'true') {
    closeGroups();
    setMenu(false);
    menuButton.focus();
  }
});

document.addEventListener('click', event => {
  if (!nav.contains(event.target)) closeGroups();
});

const cards = document.querySelector('#service-cards');
const controls = document.querySelector('.carousel-controls');
const [previous, next] = controls.querySelectorAll('button');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

function updateCarousel() {
  const end = cards.scrollWidth - cards.clientWidth;
  controls.hidden = end <= 2;
  previous.setAttribute('aria-disabled', String(cards.scrollLeft <= 2));
  next.setAttribute('aria-disabled', String(cards.scrollLeft >= end - 2));
}

controls.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button || button.getAttribute('aria-disabled') === 'true') return;
  const step = cards.children[1].offsetLeft - cards.children[0].offsetLeft;
  cards.scrollBy({
    left: step * Number(button.dataset.step),
    behavior: reducedMotion.matches ? 'instant' : 'smooth'
  });
});
cards.addEventListener('scroll', updateCarousel, { passive: true });
new ResizeObserver(updateCarousel).observe(cards);
updateCarousel();

const requiredTextFields = document.querySelectorAll('.contact-form input[required]:not([type])');
requiredTextFields.forEach(field => {
  field.addEventListener('input', () => {
    const whitespaceOnly = field.value.length > 0 && field.value.trim() === '';
    field.setCustomValidity(whitespaceOnly ? 'Please enter a value.' : '');
  });
});

const phone = document.querySelector('#phone');
phone.addEventListener('input', () => {
  const digits = phone.value.replace(/\D/g, '');
  phone.setCustomValidity(phone.value && digits.length < 7 ? 'Enter a phone number with at least seven digits.' : '');
});

// Netlify removes data-netlify when it successfully detects the static form.
document.querySelectorAll('form[data-netlify]').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const status = form.querySelector('.form-status');
    status.hidden = false;
    status.textContent = 'Form submission is unavailable on this preview. For service, call (781) 333-1998.';
  });
});
