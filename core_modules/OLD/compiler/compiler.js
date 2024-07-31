import * as fs from 'fs';
import * as path from 'path';
import { JSDOM } from 'jsdom';
import cheerio from 'cheerio';
import fse from 'fs-extra';


// defining directories

// Get the root directory of your application
const rootDir = process.cwd();

// Construct paths to the directories you need
const routesSrc = path.join(rootDir, 'src/routes');
const routesDest = path.join(rootDir, 'build/routes');
const componentsDest = path.join(rootDir, 'build/components');




/*
async function firstMethod() {
    return Promise.resolve()
        .then(() => {
            const result = 1 + 3; 
            console.log("First method busy");
            return result;
        })
        .then((result) => {
            console.log("Done. Result is: " + result);
            return result;
        })
        .then(() => {
            console.log("All code executed in firstMethod");
        });
}

firstMethod();

*/

function map() {
    return Promise.resolve()
        .then(() => {
            console.log('Mapping in progress');

            /* MAIN CODE HERE */

            /* LET'S MAP ROUTES AND FILTER OUT +page.smq pages */
            const filter = file => {
                // filter out
                const ext = path.basename(file);
                // skipped +page.smq files - we'll access these later
                return ext !== '+page.smq';
            };

            // Copy routes asynchronously and filter out +page.smq files
            return fse.copy(routesSrc, routesDest, { filter })
                .then(() => {
                    console.log("Copying of routes completed...");

                    /* DONE WITH ROUTES */

                    /* LET'S MAP  */
                    // Create components directory asynchronously
                    return fse.mkdir(componentsDest, { recursive: true });
                });
        });
}

map()
    .then(() => {
        console.log("Mapping of key directories completed...");

        // Call the next method only after both directories are created
        if (fs.existsSync(routesDest) && fs.existsSync(componentsDest)) {
            lex()
                .then(() => {
                    console.log("Lexing completed....");
                });
        }
    });





async function lex() {

    return Promise.resolve()
        .then(async () => {
            console.log("Lexing files:...");
            // Dynamic import of the lexer module
            const lexer = await import('./lexer.js');
            // Perform lexing operation here
            lexer.readRoutesRecursively();
            //console.log("Lexing completed...");
        })
        .then(() => {
            console.log("All code executed in lex");
// now call merger

  merge()
    .then(() => {
        console.log("Merging completed...");
    });



        });
}




async function merge() {
    return Promise.resolve()
        .then(async () => {
            console.log("Merging files:...");
            // Dynamic import of the merger module
            const merger = await import('./merger.js');
            // Perform merging operation here
            const merged = merger.loopFilesRecursively(routesDest);
            
        })
        .then(() => {
            console.log("Files merged...");
/// call next method here 
nook()
    .then(() => {
        console.log("Nooking completed...");
    });



        })
        .catch((error) => {
            console.error(error);
        });
}





async function nook() {
    return Promise.resolve()
        .then(async () => {
            console.log('Nooking the files now');
            // Dynamic import of the nooker module
            const nookerModule = await import('./nooker.js');
            // Instantiate the class NookProcessor
            const nookProcessor = new nookerModule.NookProcessor(routesDest);
            // Process files
            nookProcessor.processFiles();
            //return "Files nooked successfully";
        })
        .then(() => {
            console.log("Nooking completed");
/// call next method here 
/*
bind()
    .then(() => {
        console.log("Binding completed...");
    });
*/

        })
        .catch((error) => {
            console.log(error);
        });
}



/*

async function bind() {
    return Promise.resolve()
        .then(async () => {
            console.log('Binding files now');
            // Dynamic import of the binder module
            const binderModule = await import('./binder.js');
            // Traverse the directory
            binderModule.traverseDirectory(routesDest);
            //return "Files bound successfully";
        })
        .then(() => {
            console.log("Binding completed");
//call next method here 
bundler()
    .then(() => {
        console.log("Bundling completed...");
    });            
        })
        .catch((error) => {
            console.log(error);
        });
}

*/


async function bundler() {
    return Promise.resolve()
        .then(async () => {
            console.log('Bundling files now');
            // Dynamic import of the bundler module
            const bundlerModule = await import('./bundler.js');
            // Traverse the directory
            bundlerModule.traverseDirectory(routesDest);
            //return "Files bound successfully";
        })
        .then(() => {
            //console.log("Bundling completed");
        })
        .catch((error) => {
            console.log(error);
        });
}


