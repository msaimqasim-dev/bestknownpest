const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#primary-nav');
const mobileLayout = matchMedia('(max-width: 84rem)');
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

const pestField = document.querySelector('#pest');
let suggestedPest = '';
pestField.addEventListener('change', () => { suggestedPest = ''; });
document.querySelector('#services').addEventListener('click', event => {
  const link = event.target.closest('[data-pest]');
  if (link && (!pestField.value || pestField.value === suggestedPest)) {
    suggestedPest = link.dataset.pest;
    pestField.value = suggestedPest;
  }
});

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

const serviceMarquee = document.querySelector('.service-marquee');
const serviceList = serviceMarquee.querySelector('.service-cards');
const serviceCopy = serviceList.cloneNode(true);
const marqueeToggle = document.querySelector('.service-marquee-toggle');
serviceCopy.hidden = true;
serviceCopy.setAttribute('aria-hidden', 'true');
serviceCopy.querySelectorAll('a').forEach(link => { link.tabIndex = -1; });
serviceCopy.addEventListener('mousedown', event => {
  if (event.button === 0) event.preventDefault();
});
serviceList.after(serviceCopy);

let marqueePaused = false;
let marqueeHovered = false;
let marqueeFocused = false;
let marqueeVisible = !('IntersectionObserver' in window);
let marqueeFrame = 0;
let previousFrame = null;
let marqueeOffset = 0;
let marqueeCycle = 0;

function advanceMarquee(time) {
  if (previousFrame !== null) {
    const elapsed = Math.min(time - previousFrame, 50);
    marqueeOffset = (marqueeOffset + elapsed * .045) % marqueeCycle;
    serviceMarquee.scrollLeft = marqueeOffset;
  }
  previousFrame = time;
  marqueeFrame = requestAnimationFrame(advanceMarquee);
}

function updateMarquee() {
  const playing = marqueeVisible && !reducedMotion.matches && marqueeCycle > 0
    && !marqueePaused && !marqueeHovered && !marqueeFocused;
  if (playing && !marqueeFrame) {
    marqueeOffset = serviceMarquee.scrollLeft;
    marqueeFrame = requestAnimationFrame(advanceMarquee);
  } else if (!playing && marqueeFrame) {
    cancelAnimationFrame(marqueeFrame);
    marqueeFrame = 0;
    previousFrame = null;
  }
}

function measureMarquee() {
  marqueeCycle = serviceCopy.hidden ? 0 : serviceCopy.getBoundingClientRect().left - serviceList.getBoundingClientRect().left;
  updateMarquee();
}

function updateMarqueeMotion() {
  serviceCopy.hidden = reducedMotion.matches;
  marqueeToggle.hidden = reducedMotion.matches;
  measureMarquee();
}

function setMarqueePaused(paused) {
  marqueePaused = paused;
  marqueeToggle.textContent = paused ? 'Resume' : 'Pause';
  updateMarquee();
}

marqueeToggle.addEventListener('click', () => setMarqueePaused(!marqueePaused));
serviceMarquee.addEventListener('pointerenter', event => {
  marqueeHovered = event.pointerType !== 'touch';
  updateMarquee();
});
serviceMarquee.addEventListener('pointerleave', () => {
  marqueeHovered = false;
  updateMarquee();
});
serviceMarquee.addEventListener('pointerdown', event => {
  if (event.pointerType === 'touch') setMarqueePaused(true);
});
serviceMarquee.addEventListener('focusin', () => {
  marqueeFocused = true;
  updateMarquee();
});
serviceMarquee.addEventListener('focusout', event => {
  marqueeFocused = serviceMarquee.contains(event.relatedTarget);
  updateMarquee();
});
window.addEventListener('resize', measureMarquee);
reducedMotion.addEventListener('change', updateMarqueeMotion);
if ('IntersectionObserver' in window) {
  const marqueeObserver = new IntersectionObserver(([entry]) => {
    marqueeVisible = entry.isIntersecting;
    updateMarquee();
  });
  marqueeObserver.observe(serviceMarquee);
}
updateMarqueeMotion();

const reviewControls = document.querySelector('.review-controls');
const reviewButtons = [...reviewControls.querySelectorAll('button')];
const testimonials = reviewButtons.map(button => document.getElementById(button.getAttribute('aria-controls')));

reviewControls.addEventListener('click', event => {
  const selectedIndex = reviewButtons.indexOf(event.target);
  if (selectedIndex === -1) return;

  reviewButtons.forEach((button, index) => {
    const selected = index === selectedIndex;
    button.setAttribute('aria-pressed', String(selected));
    testimonials[index].hidden = !selected;
  });
});
reviewControls.hidden = false;

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

const revealTargets = document.querySelectorAll('[data-reveal]');

if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const target = entry.target;
      revealObserver.unobserve(target);
      if (target.contains(document.activeElement)) continue;

      target.classList.add('reveal-in');
    }
  }, { rootMargin: '0px 0px 12px' });

  revealTargets.forEach(target => revealObserver.observe(target));

  // A keyboard user can interact with a card immediately, even mid-reveal.
  document.addEventListener('focusin', event => {
    const target = event.target.closest('[data-reveal]');
    if (!target) return;
    revealObserver.unobserve(target);
    target.classList.remove('reveal-in');
  });

  reducedMotion.addEventListener('change', event => {
    if (!event.matches) return;
    revealObserver.disconnect();
    revealTargets.forEach(target => target.classList.remove('reveal-in'));
  });
}
