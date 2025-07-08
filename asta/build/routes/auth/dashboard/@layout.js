

function layoutInit() {

const layoutBlocks = {
  head: `<head><link rel="stylesheet" href="/dashboard/css/dashboard.css" /><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" /><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" /></head>`,
  body: ``,
  footer: ``
  };


  if (layoutBlocks) {

    // Step 1: Update <head> if header exists
    if (layoutBlocks.head) {
      updateHead(layoutBlocks.head);
    }

    // Step 2: Update <body> if body exists
    if (layoutBlocks.body) {
      updateBody(layoutBlocks.body);
    }

    // Step 3: Append <footer> to <body> if footer exists
    if (layoutBlocks.footer) {
      appendFooter(layoutBlocks.footer);
    }

  
// Utility function to load scripts and ensure they execute
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }


function updateHead(headerHTML) {
  const head = document.head;

  // Create a template for the new header content
  const template = document.createElement('template');
  template.innerHTML = headerHTML;

  // Preserve only Vite-injected scripts and modulepreload links
  const preservedElements = [];
  head.querySelectorAll("script, link[rel='modulepreload']").forEach(el => {
    if (
      (el.tagName === "SCRIPT" && el.type === "module") || 
      (el.tagName === "LINK" && el.rel === "modulepreload") ||
      el.src?.includes("/assets/router-") ||  
      el.href?.includes("/assets/modulepreload-polyfill")
    ) {
      preservedElements.push(el.outerHTML); 
    }
  });

  // Remove all existing head content
  while (head.firstChild) {
    head.removeChild(head.firstChild);
  }

  // Append new head content
  const newElements = template.content.cloneNode(true);
  head.appendChild(newElements);

  // Re-add preserved Vite scripts
  preservedElements.forEach(scriptHTML => {
    const temp = document.createElement("template");
    temp.innerHTML = scriptHTML;
    head.appendChild(temp.content.firstChild);
  });

  console.log("Updated head with layout content while preserving Vite scripts.");
}



function updateBody(bodyHTML) {
  const body = document.body;

  // Create a template for the body content
  const template = document.createElement('template');
  template.innerHTML = bodyHTML;

  // Replace the body content with the cloned template
  body.innerHTML = ''; // Clear existing content
  body.appendChild(template.content.cloneNode(true));
}

function appendFooter(footerHTML) {
  const body = document.body;

  // Create a template for the footer content
  const template = document.createElement('template');
  template.innerHTML = footerHTML;

  // Append the cloned template content to the body
  body.appendChild(template.content.cloneNode(true));
}

}

}

// initiate it 
layoutInit(); 

