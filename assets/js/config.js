// Palette management functions
function setPalette(palette) {
  const body = document.body;
  
  // Remove existing palette classes
  body.classList.remove('palette-chartreuse', 'palette-dynamic-flight', 'palette-retailair-classic');
  
  // Add new palette class
  if (palette === 'dynamic-flight') {
    body.classList.add('palette-dynamic-flight');
  } else if (palette === 'retailair-classic') {
    body.classList.add('palette-retailair-classic');
  } else {
    body.classList.add('palette-chartreuse');
    palette = 'chartreuse'; // normalize the value
  }
  
  // Store preference
  localStorage.setItem('retailair-palette', palette);
  
  // Update active states if palette controls exist
  const buttons = document.querySelectorAll('.palette-controls button, .btn-select');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  const cards = document.querySelectorAll('.palette-card');
  cards.forEach(card => card.classList.remove('active'));
  
  if (palette === 'dynamic-flight') {
    const dynamicBtn = document.getElementById('btn-dynamic') || document.getElementById('btn-dynamic-flight');
    const dynamicCard = document.getElementById('card-dynamic-flight');
    if (dynamicBtn) {
      dynamicBtn.classList.add('active');
      if (dynamicBtn.classList.contains('btn-select')) {
        dynamicBtn.textContent = 'Selected';
      }
    }
    if (dynamicCard) dynamicCard.classList.add('active');
  } else if (palette === 'retailair-classic') {
    const classicBtn = document.getElementById('btn-retailair-classic');
    const classicCard = document.getElementById('card-retailair-classic');
    if (classicBtn) {
      classicBtn.classList.add('active');
      if (classicBtn.classList.contains('btn-select')) {
        classicBtn.textContent = 'Selected';
      }
    }
    if (classicCard) classicCard.classList.add('active');
  } else {
    const chartreuseBtn = document.getElementById('btn-chartreuse');
    const chartreuseCard = document.getElementById('card-chartreuse');
    if (chartreuseBtn) {
      chartreuseBtn.classList.add('active');
      if (chartreuseBtn.classList.contains('btn-select')) {
        chartreuseBtn.textContent = 'Selected';
      }
    }
    if (chartreuseCard) chartreuseCard.classList.add('active');
  }
}

// URL-based palette routing
function checkPaletteFromURL() {
  const path = window.location.pathname;
  if (path === '/v1.b.html' || path === '/v1.b') {
    setPalette('dynamic-flight');
  } else if (path === '/v1.a.html' || path === '/v1.a') {
    setPalette('chartreuse');
  } else if (path === '/v1.c.html' || path === '/v1.c') {
    setPalette('retailair-classic');
  } else {
    // Load from localStorage or default
    const saved = localStorage.getItem('retailair-palette');
    setPalette(saved || 'chartreuse');
  }
}

// Handle browser back/forward buttons
window.addEventListener('popstate', function(event) {
  if (event.state && event.state.palette) {
    setPalette(event.state.palette);
  } else {
    checkPaletteFromURL();
  }
});

// Initialize palette on page load  
document.addEventListener('DOMContentLoaded', function() {
  // Apply palette class to body (the critical script sets it on documentElement)
  const htmlClass = document.documentElement.className;
  if (htmlClass) {
    document.body.className = htmlClass;
  }
  checkPaletteFromURL();
});

// Make setPalette globally available for inline onclick handlers
window.setPalette = setPalette;

// Load configuration and update email links
fetch('/config.json')
  .then(response => response.json())
  .then(config => {
    const domain = config.domain;
    const salesEmail = config.email.sales;
    const supportEmail = config.email.support;
    
    // Update all mailto links
    document.querySelectorAll('a[href*="@retailair.com"]').forEach(link => {
      const href = link.getAttribute('href');
      const newHref = href.replace('@retailair.com', `@${domain}`);
      link.setAttribute('href', newHref);
    });
    
    // Update sales and support email links specifically
    document.querySelectorAll('a[href*="sales+"]').forEach(link => {
      const href = link.getAttribute('href');
      const newHref = href.replace(/sales\+([^@]+)@[^.]+\.[^"']+/, `${salesEmail}+$1@${domain}`);
      link.setAttribute('href', newHref);
    });
    
    document.querySelectorAll('a[href*="support@"]').forEach(link => {
      const href = link.getAttribute('href');
      const newHref = href.replace(/support@[^.]+\.[^"']+/, `${supportEmail}@${domain}`);
      link.setAttribute('href', newHref);
    });
  })
  .catch(error => {
    console.warn('Could not load config.json, using default email addresses:', error);
  });