## Router API Documentation

### Introduction
- Overview of the Router API and its functionalities.

### Usage
1. File Based Routes
   - Automatically computed routes for pages.
   - Option to define the resource to be rendered (e.g., page or component).
   
2. Declared Routes
   - Loading pages or components based on declared routes.
   
3. Pop State Changes
   - Listening to changes in the browser's history (pop state events).
   - Updating the UI based on changes in the URL.

4. 404 Error Handling
   - Handling invalid routes or routes without corresponding resources to render.
   - Customizing error messages or UI elements for 404 errors.

5. Dynamic Routing
   - Handling dynamic routes with parameters (e.g., user/:id/profile).
   - Making parameters available to components (e.g., via `componentDataId` variable).

6. Routes with Search Parameters
   - Supporting routes with search parameters (e.g., shop?product=shirt&price=100&size=m).
   - Handling both click event navigation and pop state navigation events with search parameters.

7. Canonical URLs
   - Handling canonical URLs (e.g., https://google.com).
   - Ensuring consistency and redirection to canonical URLs.

8. Nested Routes
   - Supporting nested routes (e.g., /services/, services/asia, services/asia/basic).
   - Automatically managing nested routes for organized page structure.

### Examples
- Sample code snippets or usage examples for each functionality.

### Configuration Options
- Options to customize router behavior or settings.

### Error Handling
- Handling errors or unexpected behaviors in the Router API.

### Compatibility
- Browser compatibility and dependencies.

### Resources
- Additional resources or references for further reading.

### Support and Feedback
- How to get support or provide feedback on the Router API.

### Version History
- History of changes and updates to the Router API.

### License
- Information about the license and terms of use for the Router API.

---




File-Based Routes

File-based routing allows developers to create routes based on the file structure of their project.

Option 1: Manual Creation
---------------------------
Creating Directories and Files Manually
-----
Step 1: Create the Directory
Create an "about" directory inside ./src/routes

Step 2: Create the Entry File
Create a +page.smq file inside the "about" directory

### Important
This is the entry file for that route. If the file doesn't exist and there is no declared route for the "about" path in ./src/routes/routes.js, the router will yield a "Page Not Found" 404 error.

Option 2: Command Line
-------------------------
Using the Command Line
-----
Command
semantq make:route about
Result
This will create the necessary files and directories for the "about" route.
Let me know if this meets your requirements!

At compilation Semantq will compute file based routes based on the strcture of the directories and sub directories of your routes.




Declared Routes
------------------
Defining Routes
In the file ./src/routes.json, you can declare routes by defining the path, which matches the href value in your links.
Example
Link
<a href="/about"> About Us </a>
Route Definition
{
"path": "/about",
"page": "about"
}
Important Notes
-----
Required Files

    +page.smq file is a required file as it is the entry file in file-based routing.

Page Locations

    For pages located directly in ./src/routes, you do not need to define the full path, just the name of that route is sufficient.
    If it is a nested route like ./src/routes/services/marketing, and you intend to define the route for .../marketing, you will need to define the route resource as: "page": "services/marketing"

Resource Reference

    Page or component resources to be rendered against defined paths must be referenced relative to the ./src/routes path for pages and ./src/components for components.

Rendering Components
Component Definition
{
"path": "/about",
"component": "About"
}
Nested Components

    For nested components, you will need to define the full path to the component relative to the ./src/components directory. For example, for the path defined as "path": "about/contacts", to render the respective component, the resource (data to be rendered) must be defined as "component": "about/Contacts"

The "exact" Parameter (Optional)
Exact Matching

    true means that the route will only match if the path is an exact match of the target route, without any additional parameters or trailing characters, etc.

Examples
With exact: true

    /home matches
    /home/something doesn't match
    /home?query=param doesn't match

With exact: false (or omitted)

    /home matches
    /home/something matches
    /home?query=param matches

Let me know if this meets your requirements!