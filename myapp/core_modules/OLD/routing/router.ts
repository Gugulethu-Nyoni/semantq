
let indexFileHash ='';

async function calculateHash(content: string): Promise<string> {
    // Convert the content to an ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(content);

    // Create a hash of the content
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convert the hash ArrayBuffer to a hexadecimal string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    return hashHex;
}

// Function to fetch the content of a file
async function fetchFileContent(filePath: string): Promise<string> {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error('File not found');
        }
        const html = await response.text();
        return html;
    } catch (error) {
        console.error('Error:', error);
        throw error; // Propagate the error
    }
}

// Example usage:
// make this dynamic 
const indexFile = 'http://localhost:5173/index.html'; // Replace with your file path

fetchFileContent(indexFile)
    .then(html => {
        // Call the hash function with the file content
        return calculateHash(html);
    })
    .then(hash => {

        indexFileHash=hash;
        //console.log('Hash of the file content:', hash);
    })
    .catch(error => {
        console.error('Error fetching or hashing file:', error);
    });




// Define the array of routes
const routes: string[] = ['/','about', 'contacts','binder']; // Use a watcher to log new file-based routes

// Define the root URL dynamically
const root: string = 'http://localhost:5173/';
const routesBase: string = root + 'src/routes/';

// Initialize pathName variable
let pathName: string = '';

// Function to validate URL format
function isValidURL(url: string): boolean {
    // Regular expression to validate URL
    const pattern: RegExp = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', // fragment locator
        'i'
    );

    return !!pattern.test(url);
}


function createRouteErrorAlert(routeName) {
    // Create the alert markup
    const alertMarkup = `
        <div id="routeErrorAlert" class="hidden">
            <div class="alert-overlay"></div>
            <div class="alert-content">
                <h3><span id="routeErrorTitle">Route Error</span></h3>
                <p id="routeErrorMessage">Route ${routeName} is undefined as there are no corresponding files for the route.</p>
                <button id="confirmButton">OK</button>
            </div>
        </div>
    `;

    // Create the container div with the specified class name
    const container = document.createElement('div');
    container.className = 'routeErrorContainer';
    container.innerHTML = alertMarkup;

    // Append the alert to the document body
    document.body.appendChild(container);

    // Access elements after they are appended to the DOM
    const alert = document.getElementById('routeErrorAlert');
    const confirmButton = document.getElementById('confirmButton');

    // Remove the hidden class to display the alert
    alert.classList.remove('hidden');

    // Define the click event listener function
    function confirmButtonClickHandler() {
        // Hide the main container by setting its display property to 'none'
        container.style.display = 'none';
        
        // Remove the event listener
        confirmButton.removeEventListener('click', confirmButtonClickHandler);
    }

    // Add click event listener to confirmButton
    confirmButton.addEventListener('click', confirmButtonClickHandler);
}




// Event listener for click events on document
document.addEventListener('click', (event: MouseEvent) => {
  const href = (event.target as HTMLAnchorElement)?.closest('a')?.href;
      if (href) {
        // Extract pathName from href

        if (href === root) 
        
        {
          window.location.href = root;
          return; 
        }


        pathName = href.replace(root, '');

        

        // Remove both leading and trailing slashes from the pathName
        if (pathName.startsWith('/') && pathName.endsWith('/')) {
            pathName = pathName.slice(1, -1);
        } else if (pathName.startsWith('/')) {
            pathName = pathName.slice(1);
        } else if (pathName.endsWith('/')) {
            pathName = pathName.slice(0, -1);
        }

        // Check if the pathName is included in the routes array
        if (routes.includes(pathName)) {
            event.preventDefault();
            // Handle the custom pathName
            handlePath(href);
        } else {
            if (isValidURL(pathName)) {
                // pathName is a valid URL - must be external
                window.location.href = pathName;
            } else {
                event.preventDefault();
                // Route is not an internal URL but not defined
                //alert("Route: " + pathName + " is not defined!");

                createRouteErrorAlert(pathName);
            }
        }
    }
});

// Function to handle the path
function handlePath(href: string): void {
    let newURL = '';

    // Construct the new URL
    if (root.endsWith('/') && !root.includes('http')) {
        newURL = root.replace('/', '') + pathName;
    } else {
        newURL = `${root}${pathName}`;
    }

    // Update the browser history
    window.history.pushState({}, "", newURL);

    // Construct the full path to the JavaScript file
    const fullPath: string = `${routesBase}${pathName}/${pathName}.js`;

    // Fetch and evaluate the JavaScript file
    if (fullPath) {
        fetch(fullPath)
            .then(response => response.text())
            .then(jsCode => {
                alert("within");
                eval(jsCode);
            })
            .catch(error => {
                console.error('Error fetching JavaScript file:', error);
                // Render the 404 error page
                render404Page();
            });
    } else {
        // Fetch the 404 error page
        const errorPath: string = `${routesBase}/+404.smq`;
        fetch(errorPath)
            .then(response => response.text())
            .then(html => {
                // Render the 404 error page
                renderErrorPage(html);
            })
            .catch(error => {
                console.error('Error fetching 404 page:', error);
                // Render the 404 error page
                render404Page();
            });
    }
}

// Function to render the 404 error page
function render404Page(): void {
    alert('404 Error');
}

// Function to render an error page with custom HTML content
function renderErrorPage(htmlContent: string): void {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // Extract script content
    const script = doc.querySelector('script');
    const scriptContent = script ? script.textContent : '';

    // Extract style content
    const style = doc.querySelector('style');
    const styleContent = style ? style.textContent : '';

    // Create and append the script element without wrapping the JS code
    const newScript = document.createElement('script');
    newScript.textContent = scriptContent;
    document.head.appendChild(newScript);

    // Create and append the style element
    const newStyle = document.createElement('style');
    newStyle.textContent = styleContent;
    document.head.appendChild(newStyle);

    // Replace the entire <body> content with the fetched HTML
    document.body.innerHTML = doc.body.innerHTML;
}
