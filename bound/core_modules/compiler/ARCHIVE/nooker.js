import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import he from "he";

export class NookProcessor {



//const srcDirectory = path.join(rootDir, 'src/routes');
//const buildDirectory = path.join(rootDir, 'build/routes');
// 
  constructor(directory) {
    const rootDir = process.cwd();
    this.directory = path.join(rootDir, 'build/routes');
    this.nookers={};
    this.nooks={};
    this.lineage = {};
    this.routesDirectory=path.join(rootDir, 'build/routes');
    this.componentNames={};

    //this.fileContent; // Declare the variable without assigning a value
    //this.dom;

      }

  // Method to handle processing of all files
processFiles() {
    //console.log("inside noker"+this.routesDirectory);

    const files = this.getAllFiles(this.routesDirectory);
    files.forEach(file => {
        if (file.endsWith('+page.smq.html')) {
            this.processPage(file);

            /*
            
            Object.keys(this.nooks).forEach(nookName => {
                this.extractNookWrapperHTML(nookName); 
              });

              */
        }
    });
}

  processPage(filePath) {
   // read contents
    //console.log(`Processing page: ${filePath}`);
    // Example:
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    //this.dom = new JSDOM(fileContent);
    //this.fileContent = fileContent;
    this.dom = new JSDOM(fileContent);
    this.fileContent = fileContent;
    this.filePath=filePath;
    this.handleNamedNooks(fileContent);

    
     // Assign dom to the newly created JSDOM instance
  }


        



 handleNamedNooks(fileContent) {
    //console.log("inside nooker ---");
    // Parse the HTML content using JSDOM
    const dom = new JSDOM(fileContent);

    // Extract elements with 'nook' attribute
    // Extract elements with 'nook' attribute
// Handle named nooks
const nookerElements = dom.window.document.querySelectorAll('[nook]');

// Initialize nookers object
const nookers = {};

// Iterate over each nooker element
nookerElements.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    const nookAttributeValue = element.getAttribute('nook');
    const attributes = {};
    Array.from(element.attributes).forEach(attr => {
        attributes[attr.name] = attr.value;
    });
    const innerText = element.textContent.trim();

    // If nookers[nookAttributeValue] doesn't exist yet, create an empty array
    if (!nookers[nookAttributeValue]) {
        nookers[nookAttributeValue] = [];
    }

    // Push the nooker object into the array corresponding to the nook attribute value
    nookers[nookAttributeValue].push({ tagName, attributes, innerText });
});

// Assign nookers to the class property
this.nookers = nookers;

//console.log("Nookers: ");
//console.log(JSON.stringify(this.nookers,null,2)); // only 1 object
//return;

  

    // Extract elements with 'nook' tag
    const nookTags = dom.window.document.getElementsByTagName('nook');
    const nookTagsArray = [...nookTags];

    // Extract nook details
    const nooks = {};
    nookTagsArray.forEach(nookTag => {
        const nookName = nookTag.getAttribute('name');
        const nookAttributes = {};
        Array.from(nookTag.attributes).forEach(attr => {
            nookAttributes[attr.name] = attr.value;
        });
        const nookInnerText = nookTag.textContent.trim();
        if (!nooks[nookName]) {
            nooks[nookName] = [];
        }
        nooks[nookName].push({ nookAttributes, nookInnerText });

        // Extract lineage for the current nookName
        //const nookTag = this.dom.window.document.querySelector(`nook[name="${nookName}"]`);
        if (!nookTag) {
            console.log(`No <nook> element found with name '${nookName}' in the DOM.`);
            return;
        }
        let parentElement = nookTag.parentElement;
        while (parentElement && !parentElement.hasAttribute('nookblock')) {
            parentElement = parentElement.parentElement;
        }
        if (parentElement && parentElement.hasAttribute('nookblock')) {
            const lineage = this.createLineageObject(parentElement, nookName);
            if (!this.lineage[nookName]) {
                this.lineage[nookName] = [];
            }

            this.lineage[nookName].push(lineage);
        }
    });

    // Assign nooks to the class property
    this.nooks = nooks;

/*
    for (const nookKey in this.nookers) {
  if (this.nookers.hasOwnProperty(nookKey)) {
    const nookValue = this.nookers[nookKey];
    console.log(nookValue);
    // Perform operations with nookKey and nookValue
}
}
*/

//console.log(this.nookers.length);

    // Handle named nooks
// Handle named nooks
// Loop through each nooker key in this.nookers object
Object.keys(this.nookers).forEach((nookerName) => {
    // Retrieve the array of nooker objects for the current nookerName
    const nookerObjects = this.nookers[nookerName];

    // Iterate over the array of nooker objects for the current nookerName
    nookerObjects.forEach((nookerObject) => {
        // Add the nookerName as an additional property in each nooker object
        nookerObject.nookerName = nookerName;

        // Extract the nook attribute from the attributes object of the nookerObject
        const nookerAttribute = nookerObject.attributes.nook;

        // Log the modified nookerObject
        //console.log('object:');
        //console.log(nookerObject);

        // Check if the nook attribute exists in this.nooks
        if (this.nooks.hasOwnProperty(nookerAttribute)) {
            // Handle named nooks with corresponding keys in this.nooks
            //console.log(`Nook attribute ${nookerAttribute} has a corresponding key in this.nooks.`);
        } else {
            // Handle named nooks without corresponding keys in this.nooks
            //console.log(`Nook attribute ${nookerAttribute} does not have a corresponding key in this.nooks.`);
        }

        if (this.lineage.hasOwnProperty(nookerAttribute)) {
            const lineage = this.lineage[nookerAttribute];
            const nooker = nookerObjects.find((nooker) => nooker.attributes['nook'] === nookerAttribute);
            const nook = this.nooks[nookerAttribute];
            this.constructNookerMerger(nookerAttribute, nooker, nook, lineage);
        } else {
            const nooker = nookerObjects.find((nooker) => nooker.attributes['nook'] === nookerAttribute);
            const nook = this.nooks[nookerAttribute];
            this.constructNookerMerger(nookerAttribute, nooker, nook);
        }
    });



});


}




  // Method to handle Default Nooks
handleDefaultNooks() {
        
        //method wrapper nothing here
    }





  // Method to handle Dynamic Nooks
  handleDynamicNooks() {
    // Implementation for Dynamic Nooks
  }

  // Method to handle Nook Props
  handleNookProps() {
    // Implementation for Nook Props
  }

  // Method to handle Nook Events
  handleNookEvents() {
    // Implementation for Nook Events
  }

  // Method to handle Nook Fallback Content
  handleNookFallbackContent() {
    // Implementation for Nook Fallback Content
  }

  // Method to handle Scoped Nooks
  handleScopedNooks() {
    // Implementation for Scoped Nooks
  }




  // Helper method to get all files in a directory recursively
  getAllFiles(directory) {
    let files = [];
    fs.readdirSync(directory).forEach(file => {
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        files = files.concat(this.getAllFiles(filePath));
      } else {
        files.push(filePath);
      }
    });
    return files;
  }



// Method to extract wrapper HTML recursively for a specific <nook> element by name
 extractNookWrapperHTML(fileContent,nookName) {
    // Check if the specified nookName exists in this.nooks
    if (!this.nooks[nookName]) {
        //console.log(`No <nook> data found for '${nookName}'.`);
        return;
    }

    const dom = new JSDOM(fileContent);

// Get all <nook> tags with the specified name attribute value
const nookTags = this.dom.document.querySelectorAll(`nook[name="${nookName}"]`);

// Check if any <nook> tag was found
if (nookTags.length > 0) {
    //console.log(`A <nook> tag with the name attribute "${nookName}" exists.`);
} else {
    //console.log(`No <nook> tag with the name attribute "${nookName}" found.`);

    return;
}

// remove dhere 


    
    // Log the entire lineage object
    //console.log(this.lineage);
   //console.log(JSON.stringify(this.lineage));
}



 createLineageObject(element, nookName) {
    const lineage = {
        tagName: element.tagName.toLowerCase(),
        innerText:'',
        attributes: {},
        children: [],
    };

    // Get all attributes and their values of the element
    Array.from(element.attributes).forEach((attr) => {
        lineage.attributes[attr.name] = attr.value;
    });

    // If the element has child nodes, recursively process them
    if (element.childNodes.length > 0) {
        element.childNodes.forEach((child) => {
            if (child.nodeType === 1) { // Check if it's an element node
                const childLineage = this.createLineageObject(child, nookName);
                lineage.children.push(childLineage);
            } else if (child.nodeType === 3 && child.nodeValue.trim() !== '') { // Check if it's a text node
                // Ignore empty text nodes
                lineage.innerText += child.nodeValue.trim() + ' '; // Accumulate inner text
            }
        });
        lineage.innerText = lineage.innerText.trim(); // Trim the accumulated inner text
    }

    // If the element is <nook>, replace its children with its own inner text
    if (lineage.tagName === 'nook') {
        lineage.children = lineage.innerText;
        lineage.innerText =  element.textContent.trim(); // Clear innerText for <nook> element
        lineage.attributes.name = nookName;
    }
   
    //console.log(lineage);
    return lineage;
}







constructNookerMerger (nookerName, nooker, nook, lineage = null) {

//console.log('Within: ');
//console.log(lineage);

if (lineage !== null)
{

//console.log("lineage area");

// here you reconstruct the nook with wrapper html back into html markup
// not necessary though because the nook is imported together with wrapper html
// so you can just target the nook only - unless you want to do something with parent html 
// in the merge 


//const lineageMarkup = this.buildHtmlMarkup(lineage);
//console.log(ineageMarkup);


/* START MAGIC */

// Build the HTML tag string from stored nooker objects
// so that you can remove it from the file

const originalNookerTag = `<${nooker.tagName} ${Object.entries(nooker.attributes).map(([key, value]) => `${key}="${value}"`).join(' ')}>${nooker.innerText}</${nooker.tagName}>`;
const fileContent = fs.readFileSync(this.filePath, 'utf8');
const dom = new JSDOM(fileContent);

const originalNookerElement = dom.window.document.querySelector(`${nooker.tagName}[nook="${nookerName}"]`);


if (originalNookerElement) {
 originalNookerElement.remove();
}

let modifiedContent = dom.serialize();
//let modifiedContent = dom.window.document.documentElement.innerHTML; // Use innerHTML instead of serialize()

// Remove <html> opening and closing tags
modifiedContent = modifiedContent.replace(/<html[^>]*>/, '');
modifiedContent = modifiedContent.replace(/<\/html>/, '');

// Remove <head> opening and closing tags
modifiedContent = modifiedContent.replace(/<head[^>]*>/, '');
modifiedContent = modifiedContent.replace(/<\/head>/, '');

// Remove <body> opening and closing tags
modifiedContent = modifiedContent.replace(/<body[^>]*>/, '');
modifiedContent = modifiedContent.replace(/<\/body>/, '');

fs.writeFileSync(this.filePath, modifiedContent, 'utf8');


// Build the new nookerTag string
// which takes nooker tag and inherits nook attributes excluding the name='nook" 
// new tag then replaces nook tag
// we fetch template attributes in the nook and not nooker 
// usually nooker has no attributes 
let nookerTag = `<${nooker.tagName}`;
for (const [key, value] of Object.entries(nook[0].nookAttributes)) {
    if (key !== 'name') { // Skip adding the 'name=nook' attribute
        nookerTag += ` ${key}="${value}"`;
    }
}
nookerTag += `>${nook[0].nookInnerText}</${nooker.tagName}>`;



/* MAGIC HAPPENS HERE */

// Read the file content

const nookElementToReplace = dom.window.document.querySelector(`nook[name="${nookerName}"]`);

//console.log(nookElementToReplace);
//return;

if (nookElementToReplace) {
  //nookElementToReplace.remove();
  nookElementToReplace.replaceWith(nookerTag);
  //console.log("we sure moving");
  //return;
}

modifiedContent = dom.serialize();
modifiedContent = he.decode(modifiedContent);

// Remove <html> opening and closing tags
modifiedContent = modifiedContent.replace(/<html[^>]*>/, '');
modifiedContent = modifiedContent.replace(/<\/html>/, '');

// Remove <head> opening and closing tags
modifiedContent = modifiedContent.replace(/<head[^>]*>/, '');
modifiedContent = modifiedContent.replace(/<\/head>/, '');

// Remove <body> opening and closing tags
modifiedContent = modifiedContent.replace(/<body[^>]*>/, '');
modifiedContent = modifiedContent.replace(/<\/body>/, '');

fs.writeFileSync(this.filePath, modifiedContent, 'utf8');





/* END MAGIC */



// reconstruct the lineage mark up 

} else {


// Build the HTML tag string from stored nooker objects
// so that you can remove it from the file

const originalNookerTag = `<${nooker.tagName} ${Object.entries(nooker.attributes).map(([key, value]) => `${key}="${value}"`).join(' ')}>${nooker.innerText}</${nooker.tagName}>`;
const fileContent = fs.readFileSync(this.filePath, 'utf8');
const dom = new JSDOM(fileContent);

const originalNookerElement = dom.window.document.querySelector(`${nooker.tagName}[nook="${nookerName}"]`);


if (originalNookerElement) {
 originalNookerElement.remove();
}

let modifiedContent = dom.serialize();

//let modifiedContent = dom.window.document.documentElement.innerHTML; // Use innerHTML instead of serialize()

// Remove <html> opening and closing tags
modifiedContent = modifiedContent.replace(/<html[^>]*>/, '');
modifiedContent = modifiedContent.replace(/<\/html>/, '');

// Remove <head> opening and closing tags
modifiedContent = modifiedContent.replace(/<head[^>]*>/, '');
modifiedContent = modifiedContent.replace(/<\/head>/, '');

// Remove <body> opening and closing tags
modifiedContent = modifiedContent.replace(/<body[^>]*>/, '');
modifiedContent = modifiedContent.replace(/<\/body>/, '');

fs.writeFileSync(this.filePath, modifiedContent, 'utf8');


// Build the new nookerTag string
// which takes nooker tag and inherits nook attributes excluding the name='nook" 
// new tag then replaces nook tag
let nookerTag = `<${nooker.tagName}`;
for (const [key, value] of Object.entries(nooker.attributes)) {
    if (key !== 'nook') { // Skip adding the 'nook' attribute
        nookerTag += ` ${key}="${value}"`;
    }
}
nookerTag += `>${nooker.innerText}</${nooker.tagName}>`;



/* MAGIC HAPPENS HERE */

// Read the file content

const nookElementToReplace = dom.window.document.querySelector(`nook[name="${nookerName}"]`);

//console.log(nookElementToReplace);
//return;

if (nookElementToReplace) {
  //nookElementToReplace.remove();
  nookElementToReplace.replaceWith(nookerTag);
  //console.log("we sure moving");
  //return;
}

modifiedContent = dom.serialize();
modifiedContent = he.decode(modifiedContent);

// Remove <html> opening and closing tags
modifiedContent = modifiedContent.replace(/<html[^>]*>/, '');
modifiedContent = modifiedContent.replace(/<\/html>/, '');

// Remove <head> opening and closing tags
modifiedContent = modifiedContent.replace(/<head[^>]*>/, '');
modifiedContent = modifiedContent.replace(/<\/head>/, '');

// Remove <body> opening and closing tags
modifiedContent = modifiedContent.replace(/<body[^>]*>/, '');
modifiedContent = modifiedContent.replace(/<\/body>/, '');

fs.writeFileSync(this.filePath, modifiedContent, 'utf8');

/* END OF MAGIC */



}


/// when all mark up merging is done 
// trigger the next module 
// which is the defaultNookHandler

const nookProcessor = new NookProcessor();


}


buildHtmlMarkup(lineage) {
    let html = '';
    for (const node of lineage) {
        // Opening tag with attributes
        html += `<${node.tagName}`;
        if (typeof node.attributes === 'object' && node.attributes !== null) {
            for (const [key, value] of Object.entries(node.attributes)) {
                html += ` ${key}="${value}"`;
            }
        }
        html += '>';

        // Include inner text if available
        if (node.innerText && node.innerText.trim() !== '') {
            html += node.innerText.trim();
        }

        // Check if node has children
        if (Array.isArray(node.children) && node.children.length > 0) {
            html += this.buildHtmlMarkup(node.children);
        } else if (typeof node.children === 'string') {
            // Handle text content if children is a string
            html +='';// node.children;
        } else if (node.tagName === 'nook') {
            // Handle empty nook tag
            html += '';
        }

        // Closing tag
        html += `</${node.tagName}>`;
    }
    return html;
}









  // class wrapper - nothing below 
}

//let directory ='./build/routes';
//const nookProcessor = new NookProcessor(directory);
//nookProcessor.processFiles();



