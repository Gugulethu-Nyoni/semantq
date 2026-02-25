## 📄 Documentation: File Uploads in Node.js (HTML to Server)

File uploading is a client-server process that uses a special encoding called `multipart/form-data` to bundle text fields and binary file data into a single request.

### Step 1: The Client (HTML & JavaScript) 💻

The client's job is to select the file and package it correctly for transmission.

#### 1\. HTML Form Setup

The HTML form must use three specific attributes to enable file upload:

| Attribute | Value | Purpose |
| :--- | :--- | :--- |
| `method` | `POST` | Specifies the HTTP method to send the data. |
| `enctype` | `multipart/form-data` | **Crucial:** Tells the browser to encode the data so it can stream the file contents. |
| `type` | `file` | The input must be of type `file` to open the file selection dialog. |

```html
<form id="excel-form" action="/students/upload/1" method="POST" enctype="multipart/form-data">
    <input type="file" name="exceldata" required /> 
    <input type="hidden" name="eventId" value="1" /> 
    <input type="submit" value="Upload" />
</form>
```

#### 2\. JavaScript Payload Creation (`FormData`)

When submitting the form via JavaScript (using `fetch` or a library like Axios), the **`FormData`** object is used to capture all form data, including the file stream.

```javascript
// JavaScript submission handler
form.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    
    // 1. Create the FormData object
    const formData = new FormData(form); 
    
    // 2. Define the URL (including the event ID from the route parameter)
    const url = `http://localhost:3003/student/students/upload/1`;

    // 3. Send the request
    await fetch(url, {
        method: 'POST',
        body: formData, // The FormData object is the payload
        // IMPORTANT: DO NOT set the 'Content-Type' header. The browser does it automatically.
    });
});
```

-----

### Step 2: The Server (Express & Multer) ⚙️

The server's job is to accept the incoming `multipart/form-data` stream, separate the file from the text fields, and save the file temporarily. This is handled by **Multer**.

#### 1\. Multer Initialization (Server Root)

Multer must be initialized once in your main server file (`server.js`) and configured to save files to a temporary location.

```javascript
// server.js
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

// 1. Define the temporary destination directory
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// 2. Ensure the directory exists (CRITICAL STEP)
// ... (code to check and create UPLOAD_DIR) ...

// 3. Initialize Multer middleware instance
const uploadMiddleware = multer({ dest: UPLOAD_DIR });

// 4. Store the instance on the Express app for use in routes
app.set('uploadMiddleware', uploadMiddleware);
```

#### 2\. Route Definition and Middleware Application

In your route file (`studentRoutes.js`), you insert the Multer middleware to process the incoming request **before** it reaches your controller.

```javascript
// studentRoutes.js

// ... (getUploadMiddleware helper to retrieve the instance) ...

// Multer must be inserted here:
router.post(
    '/students/upload/:eventId', 
    getUploadMiddleware, // Retrieves Multer instance
    (req, res, next) => {
        // Calls the specific Multer handler: .single()
        // 'exceldata' MUST match the 'name' attribute from the HTML input field.
        req.upload.single('exceldata')(req, res, next);
    },
    studentController.excelUploads // Final destination
);
```

#### 3\. Controller Access and Data Separation

After Multer runs successfully, it separates the incoming request data and places it in specific objects on the request (`req`):

| Data Type | Request Location | Example Value |
| :--- | :--- | :--- |
| **File** | `req.file` | An object containing `{ path: 'uploads/temp-uuid', originalname: 'file.xlsx', ... }` |
| **URL Params** | `req.params` | `{ eventId: '1' }` |
| **Text Fields** | `req.body` | `{ eventId: '1' }` (If sent in the body, but usually empty when using URL params for IDs) |

Your controller must look in the correct locations:

```javascript
// studentController.js

async excelUploads(req, res) {
    // 1. Get the file object from Multer
    const file = req.file; 
    
    // 2. Get the ID from the URL parameter
    const eventId = req.params.eventId; 
    
    if (!file || !eventId) {
        // Error handling if data is missing
    }
    
    // Pass the two pieces of information to the service layer
    const result = await studentService.createByExcel(file, eventId);
    // ...
}
```

-----

### Step 3: File Processing and Cleanup (Service/Model) 🗑️

The final step is for the application logic (Service/Model) to use the temporary file and then delete it.

#### 1\. Reading the Temporary File

The model uses the temporary file path provided by Multer (`req.file.path`) to access the binary data.

```javascript
// StudentModel.js (Inside createBatch)

// Read the file from the temporary location
await workbook.xlsx.readFile(file.path); 

// ... (Process Excel data) ...
```

#### 2\. Cleanup

Since Multer is only for temporary storage, you must manually delete the file after you've finished processing it (or if an error occurs). This is best done in a `finally` block to ensure it runs every time.

```javascript
// StudentModel.js (Inside createBatch)

// ... (processing logic) ...

} finally {
    // CRITICAL: Delete the temporary file
    if (file && file.path) {
        await fs.unlink(file.path);
    }
}
```

This completes the entire file lifecycle, from client selection to temporary storage, processing, and final deletion.