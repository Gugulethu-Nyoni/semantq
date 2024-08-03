// dataGrid.js
let data = [
  { id: 1, name: 'John', surname: 'Doe', age: 30, role: 'Developer', salary: 50000 },
  { id: 2, name: 'Jane', surname: 'Doe', age: 28, role: 'Designer', salary: 45000 },
  { id: 3, name: 'Jack', surname: 'Smith', age: 34, role: 'Product Manager', salary: 60000 },
  { id: 4, name: 'Jill', surname: 'Johnson', age: 32, role: 'Data Analyst', salary: 55000 },
  { id: 5, name: 'Steve', surname: 'Brown', age: 29, role: 'Software Engineer', salary: 52000 },
  { id: 6, name: 'Sarah', surname: 'Williams', age: 27, role: 'Marketing Specialist', salary: 48000 },
  { id: 7, name: 'Mark', surname: 'Davis', age: 31, role: 'QA Engineer', salary: 50000 },
  { id: 8, name: 'Elizabeth', surname: 'Jones', age: 30, role: 'HR Manager', salary: 57000 },
  { id: 9, name: 'Michael', surname: 'Taylor', age: 35, role: 'Tech Lead', salary: 65000 },
  { id: 10, name: 'Emily', surname: 'Anderson', age: 26, role: 'UX Designer', salary: 44000 },
  { id: 11, name: 'Joseph', surname: 'Moore', age: 33, role: 'Business Analyst', salary: 53000 },
  { id: 12, name: 'Jennifer', surname: 'Lee', age: 28, role: 'Frontend Developer', salary: 51000 },
  { id: 13, name: 'David', surname: 'Allen', age: 37, role: 'Solutions Architect', salary: 68000 },
  { id: 14, name: 'Stephanie', surname: 'Collins', age: 29, role: 'Project Manager', salary: 54000 },
  { id: 15, name: 'Robert', surname: 'Johnson', age: 36, role: 'System Administrator', salary: 58000 },
  { id: 16, name: 'Amanda', surname: 'White', age: 27, role: 'Customer Support', salary: 47000 },
  { id: 17, name: 'Daniel', surname: 'Thompson', age: 32, role: 'Network Engineer', salary: 56000 },
  { id: 18, name: 'Rebecca', surname: 'Martinez', age: 26, role: 'Copywriter', salary: 45000 },
  { id: 19, name: 'Jason', surname: 'Parker', age: 34, role: 'Accountant', salary: 52000 },
  { id: 20, name: 'Heather', surname: 'Stewart', age: 29, role: 'Web Developer', salary: 49000 },
  { id: 21, name: 'Stephen', surname: 'Walker', age: 31, role: 'Sales Representative', salary: 51000 },
  { id: 22, name: 'Lauren', surname: 'Russell', age: 25, role: 'Intern', salary: 42000 },
  { id: 23, name: 'Ryan', surname: 'Bennett', age: 30, role: 'Operations Manager', salary: 55000 },
  { id: 24, name: 'Natalie', surname: 'Lewis', age: 28, role: 'Social Media Manager', salary: 48000 },
  { id: 25, name: 'Jonathan', surname: 'Peterson', age: 33, role: 'Security Analyst', salary: 53000 },
  { id: 26, name: 'Melissa', surname: 'Evans', age: 26, role: 'Graphic Designer', salary: 44000 },
  { id: 27, name: 'Brian', surname: 'Gray', age: 35, role: 'Consultant', salary: 61000 },
  { id: 28, name: 'Michelle', surname: 'Thomas', age: 29, role: 'Recruiter', salary: 50000 },
  { id: 29, name: 'Dylan', surname: 'Henderson', age: 28, role: 'Data Scientist', salary: 56000 },
  { id: 30, name: 'Rachel', surname: 'Green', age: 26, role: 'Office Manager', salary: 45000 }
];



const columns = [
  { name: 'id', header: 'ID' },
  { name: 'fullName', header: 'Full Name', joinedColumns: ['name', 'surname'] },
  { name: 'age', header: 'Age' },
  { name: 'role', header: 'Role' },
  { name: 'salary', header: 'Salary',
    actions: [
      {
        label: 'Edit',
        url: 'edit/{id}',
        class: 'edit',
        id: 'edit-{id}',
      },
      {
        label: 'Delete',
        url: 'delete/{id}',
        class: 'delete',
        id: 'delete-{id}',
        confirm: true,
      },
    ],
  },
];

const dataGrid = document.querySelector('#dataGrid');

if (dataGrid) {
  const htmlContent = `
    <input type="text" id="searchInput" oninput="searchTable()" placeholder="Search...">
    <select id="itemsPerPage" onchange="updateItemsPerPage(this.value)">
      <option value="5">5</option>
      <option value="10" selected>10</option>
      <option value="20">20</option>
      <option value="50">50</option>
      <option value="100">100</option>
    </select>
    
    <table id="dataTable">
      <thead>
        <tr>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
    <div id="pagination"></div>
  `;
  
  dataGrid.insertAdjacentHTML('afterbegin', htmlContent);
}


const tbody = document.querySelector('#dataTable tbody');
const searchInput = document.querySelector('#searchInput');
const itemsPerPage = document.querySelector('#itemsPerPage');
const paginationContainer = document.querySelector('#pagination');




let currentPage = 1;
let totalPages = Math.ceil(data.length / itemsPerPage.value);

function renderData(filteredData) {
  tbody.innerHTML = '';
  const headerRow = document.querySelector('#dataTable thead tr');
  headerRow.innerHTML = '';

  columns.forEach((column, index) => {
    if (!column.hidden) {
      const headerCell = document.createElement('th');
      headerCell.textContent = column.label || column.header;
      // Add sorting handle
      if (column.joinedColumns) {
        headerCell.setAttribute('colspan', column.joinedColumns.length); // Set colspan for joined columns
      } else {
        headerCell.dataset.index = index;
        headerCell.addEventListener('click', () => sortTable(index));
      }
      headerRow.appendChild(headerCell);
    }
  });

  // Render action headers for the last column
  const actionColumn = columns[columns.length - 1];
  actionColumn.actions.forEach((action) => {
    const headerCell = document.createElement('th');
    headerCell.textContent = action.label;
    headerRow.appendChild(headerCell);
  });

  const startIndex = (currentPage - 1) * itemsPerPage.value;
  const endIndex = Math.min((currentPage) * itemsPerPage.value, filteredData.length);
  filteredData.slice(startIndex, endIndex).forEach((item) => {
    const row = document.createElement('tr');

    columns.forEach((column) => {
      if (!column.hidden) {
        if (column.joinedColumns) {
          // Concatenate values from joined columns
          const joinedValue = column.joinedColumns.map(col => item[col]).join(' ');
          const cell = document.createElement('td');
          cell.textContent = joinedValue;
          cell.setAttribute('colspan', column.joinedColumns.length); // Set colspan for joined columns
          row.appendChild(cell);
        } else {
          const cell = document.createElement('td');
          cell.textContent = item[column.name];
          row.appendChild(cell);
        }
      }
    });

    // Render actions for the last column
actionColumn.actions.forEach((action) => {
  const actionCell = document.createElement('td');
  const actionLink = document.createElement('a');
  actionLink.textContent = action.label;
  actionLink.href = action.url.replace('{id}', item.id);
  
  // Check if class and id parameters exist in the action object
  if (action.class) {
    actionLink.classList.add(action.class); // Add class if it exists
  }
  if (action.id) {
    actionLink.id = action.id.replace('{id}', item.id); // Add id if it exists
  }
  
  // Add onclick attribute for confirmation
  if (action.confirm) {
    actionLink.setAttribute('onclick', "return confirm('Are you sure?')");
  }

  actionCell.appendChild(actionLink);
  row.appendChild(actionCell);
});


    tbody.appendChild(row);
  });
}

// ... other function calls and initial rendering ...

function searchTable() {
  const searchValue = searchInput.value.toLowerCase();
  const filteredData = data.filter((item) => {
    // Search through each column defined in the columns array
    for (const column of columns) {
      // If the column name maps to an actual data key and contains the search value, return true
      if (item.hasOwnProperty(column.name) && item[column.name].toString().toLowerCase().includes(searchValue)) {
        return true;
      }
      // If the column is a joined column, check if any of the joined columns contain the search value
      if (column.joinedColumns) {
        const joinedValue = column.joinedColumns.map(col => item[col]).join(' ').toLowerCase();
        if (joinedValue.includes(searchValue)) {
          return true;
        }
      }
    }
    // If no match found in any column, return false
    return false;
  });
  renderData(filteredData);
  updatePagination();
}



// Define an object to keep track of the sorting order for each column
const sortingOrder = {};

function sortTable(n) {
  // Get the column header label and use it to sort the data
  const columnHeader = columns[n].name; // Use the column name instead of the label or header

  // Check the current sorting order for this column
  if (!sortingOrder[columnHeader] || sortingOrder[columnHeader] === 'desc') {
    // If the current sorting order is descending or not set, switch to ascending
    sortingOrder[columnHeader] = 'asc';
  } else {
    // Otherwise, switch to descending
    sortingOrder[columnHeader] = 'desc';
  }

  // Sort the data based on the current sorting order for this column
  const sortedData = [...data].sort((a, b) => {
    const valueA = typeof a[columnHeader] === 'string' ? a[columnHeader].toLowerCase() : a[columnHeader];
    const valueB = typeof b[columnHeader] === 'string' ? b[columnHeader].toLowerCase() : b[columnHeader];

    // Compare the values based on the sorting order
    if (sortingOrder[columnHeader] === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  renderData(sortedData);
  updatePagination();
}




function updateItemsPerPage(value) {
  itemsPerPage.value = value;
  renderData(data);
  updatePagination();
}

function updatePagination() {
  totalPages = Math.ceil(data.length / itemsPerPage.value); // Recalculate total pages

  const startPage = Math.max(1, currentPage - 5);
  const endPage = Math.min(startPage + 10, totalPages);

  paginationContainer.innerHTML = '';

  for (let i = startPage; i <= endPage; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.classList.add('pagination-button');
    button.onclick = () => {
      currentPage = i;
      renderData(data);
      updatePagination();
    };
    paginationContainer.appendChild(button);
  }
}

// Set the default value
itemsPerPage.value = 10;

// Add this line to render the initial data
renderData(data);
updatePagination();

/*
export { renderData, searchTable, sortTable, updateItemsPerPage };
*/
