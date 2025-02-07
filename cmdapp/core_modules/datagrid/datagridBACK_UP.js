export class DataGrid {
  constructor(initialData, initialColumns, initialItemsPerPage) {
    this.data = initialData;
    this.columns = initialColumns;
    this.itemsPerPage = initialItemsPerPage;
    this.tbody = null;
    this.searchInput = null;
    this.paginationContainer = null;
    this.currentPage = 1;

    const dataGrid = document.querySelector('#dataGrid');
    if (dataGrid) {
      this.initializeDataGrid();
    } else {
      console.error('Failed to find dataGrid element in the DOM.');
    }
  }

  initializeDataGrid() {
    const htmlContent = `
      <input type="text" id="searchInput" oninput="this.searchTable()" placeholder="Search...">
      <select id="itemsPerPage" onchange="this.updateItemsPerPage(this.value)">
        <option value="5">5</option>
        <option value="10" selected>10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
      
      <table id="dataTable">
        <thead>
          <tr></tr>
        </thead>
        <tbody></tbody>
      </table>
      <div id="pagination"></div>
    `;

    const dataGrid = document.querySelector('#dataGrid');
    dataGrid.insertAdjacentHTML('afterbegin', htmlContent);

    this.itemsPerPage = document.querySelector('#itemsPerPage');
    if (this.itemsPerPage) {
      this.itemsPerPage.value = this.initialItemsPerPage;
    }

    this.tbody = document.querySelector('#dataTable tbody');
    console.log(JSON.stringify(this.tbody,null,2));

    this.searchInput = document.querySelector('#searchInput');
    this.paginationContainer = document.querySelector('#pagination');

    this.renderData();
    this.updatePagination();
  }

  renderData() {
    
    console.log("data"+ JSON.stringify(this.data, null,2));

    //this.tbody.innerHTML = '';
    const headerRow = document.querySelector('#dataTable thead tr');
    headerRow.innerHTML = '';

    this.columns.forEach((column, index) => {
      if (!column.hidden) {
        const headerCell = document.createElement('th');
        headerCell.textContent = column.label || column.header;
        // Add sorting handle
        if (column.joinedColumns) {
          headerCell.setAttribute('colspan', column.joinedColumns.length); // Set colspan for joined columns
        } else {
          headerCell.dataset.index = index;
          headerCell.addEventListener('click', () => this.sortTable(index));
        }
        headerRow.appendChild(headerCell);
      }
    });

    // Render action headers for the last column
    const actionColumn = this.columns[this.columns.length - 1];
    actionColumn.actions.forEach((action) => {
      const headerCell = document.createElement('th');
      headerCell.textContent = action.label;
      headerRow.appendChild(headerCell);
    });

    const startIndex = (this.currentPage - 1) * this.itemsPerPage.value;
    const endIndex = Math.min((this.currentPage) * this.itemsPerPage.value, this.data.length);
    this.data.slice(startIndex, endIndex).forEach((item) => {
      const row = document.createElement('tr');

      this.columns.forEach((column) => {
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

      this.tbody.appendChild(row);
    });

    this.updatePagination();
  }

  searchTable() {
    const searchValue = this.searchInput.value.toLowerCase();
    const filteredData = this.data.filter((item) => {
      // Search through each column defined in the columns array
      for (const column of this.columns) {
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
    this.renderData(filteredData);
  }

  sortTable(n) {
    // Get the column header label and use it to sort the data
    const columnHeader = this.columns[n].name; // Use the column name instead of the label or header

    // Sort the data based on the current sorting order for this column
    const sortedData = [...this.data].sort((a, b) => {
      const valueA = typeof a[columnHeader] === 'string' ? a[columnHeader].toLowerCase() : a[columnHeader];
      const valueB = typeof b[columnHeader] === 'string' ? b[columnHeader].toLowerCase() : b[columnHeader];

      // Compare the values based on the sorting order
      if (this.sortingOrder[columnHeader] === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    this.renderData(sortedData);
  }

  updateItemsPerPage(value) {
    this.itemsPerPage.value = value;
    this.renderData();
  }

  updatePagination() {
    const totalPages = Math.ceil(this.data.length / this.itemsPerPage.value); // Recalculate total pages

    const startPage = Math.max(1, this.currentPage - 5);
    const endPage = Math.min(startPage + 10, totalPages);

    this.paginationContainer.innerHTML = '';

    for (let i = startPage; i <= endPage; i++) {
      const button = document.createElement('button');
      button.textContent = i;
      button.classList.add('pagination-button');
      button.onclick = () => {
        this.currentPage = i;
        this.renderData();
      };
      this.paginationContainer.appendChild(button);
    }
  }
}

// Usage
//const dataGrid = new DataGrid(data, columns, 10);
