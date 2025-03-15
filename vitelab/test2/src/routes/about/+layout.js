export default function layoutInit() {
  // Update the <head> section
  const head = document.head;

  // Add Bootstrap 5 CSS (if not already added)
  const existingBootstrapLink = document.querySelector('link[href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"]');
  if (!existingBootstrapLink) {
    const bootstrapLink = document.createElement('link');
    bootstrapLink.rel = 'stylesheet';
    bootstrapLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css'; // Bootstrap 5 CSS link
    bootstrapLink.integrity = 'sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM'; // Integrity hash for Bootstrap CSS
    bootstrapLink.crossOrigin = 'anonymous';
    head.appendChild(bootstrapLink);
  }

  // Add Formique CSS (if not already added)
  const existingFormiqueLink = document.querySelector('link[href="https://cdn.jsdelivr.net/npm/formique-css@1.0.7/formique.min.css"]');
  if (!existingFormiqueLink) {
    const formiqueLink = document.createElement('link');
    formiqueLink.rel = 'stylesheet';
    formiqueLink.href = 'https://cdn.jsdelivr.net/npm/formique-css@1.0.7/formique.min.css'; // Formique CSS link
    formiqueLink.setAttribute('formique-style', true); // Add the formique-style boolean attribute
    head.appendChild(formiqueLink);
  }

  // Add custom layout CSS (your original layout file)
  const existingCustomLayoutLink = document.querySelector('link[href="/path/to/layout.css"]');
  if (!existingCustomLayoutLink) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/path/to/layout.css'; // Custom layout file link
    head.appendChild(link);
  }

  // Update the <body> section
  const body = document.body;

  // Clean up and check if the body already has content
  if (body.innerHTML.trim() !== '') {
    body.innerHTML = ''; // Empty the body content
  }

  // Insert custom body content (you can customize this as needed)
  const appDiv = document.createElement('div');
  appDiv.id = 'app';
  appDiv.innerHTML = `
    <h1>Custom Body Content</h1>
    <br/>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="about/">About</a></li>
        <li><a href="/services/">Services</a></li>
        <li><a href="/services/asia">Asia Services</a></li>
        <li><a href="/services/asia/east">Asia East Services</a></li>
      </ul>
    </nav>
    <div id="formique"> </div>
  `;
  body.appendChild(appDiv);

  // Clean up and check if the footer already has content
  const footer = document.querySelector('footer');
  if (footer && footer.innerHTML.trim() !== '') {
    footer.innerHTML = ''; // Empty the footer content
  } else {
    // Create and insert custom footer if it's empty
    const newFooter = document.createElement('footer');
    newFooter.innerHTML = '<p>Custom Footer</p>';
    body.appendChild(newFooter);
  }

  // Add Bootstrap 5 JS before closing the body tag (only if it's not already added)
  const existingBootstrapJs = document.querySelector('script[src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"]');
  if (!existingBootstrapJs) {
    const bootstrapJs = document.createElement('script');
    bootstrapJs.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'; // Bootstrap 5 JS bundle (includes Popper.js)
    bootstrapJs.integrity = 'sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz'; // Integrity hash for Bootstrap JS
    bootstrapJs.crossOrigin = 'anonymous';
    body.appendChild(bootstrapJs);
  }
}