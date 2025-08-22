// Load configuration and update email links
fetch('/config.json')
  .then(response => response.json())
  .then(config => {
    const domain = config.domain;
    const salesEmail = config.email.sales;
    const supportEmail = config.email.support;
    
    // Update all mailto links
    document.querySelectorAll('a[href*="@retailaer.com"]').forEach(link => {
      const href = link.getAttribute('href');
      const newHref = href.replace('@retailaer.com', `@${domain}`);
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