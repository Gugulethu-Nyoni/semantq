import axios from "axios";
import AnyGrid from "anygridjs";
import Topbar from "$global/Topbar.smq";
import Sidebar from "$global/Sidebar.smq";
import Maincontent from "$global/Maincontent.smq";
import Footer from "$global/Footer.smq";
export function init() {
  const columns = [
    {
      name: "id",
      header: "ID",
      render: (value, row) => `<a href="/user/profile/${row.id}">${row.id}</a>`,
      sortable: true,
    },
    {
      name: "fullName",
      header: "FULL NAME",
      joinedColumns: ["first_name", "surname"],
    },
    {
      name: "mobile",
      header: "Mobile",
      sortable: true,
    },
    {
      name: "email",
      header: "Email",
    },
    {
      name: "country",
      header: "Country",
      sortable: true,
      actions: [
        {
          label: "EDIT",
          url: "edit/{id}",
          class: "edit",
          id: "edit-{id}",
        },
        {
          label: "DELETE",
          url: "delete/{id}",
          class: "delete",
          id: "delete-{id}",
          confirm: true,
        },
        {
          label: "View",
          url: "view/{id}",
          class: "view-btn",
          id: "view-{id}",
        },
      ],
    },
  ];
  const features = {
    initialItemsPerPage: 10,
    csvExport: true,
    excelExport: true,
    theme: "pink",
  };
  axios
    .get("http://localhost:3000/users/all", {
      headers: { "Content-Type": "application/json" },
    })
    .then((response) => {
      const message = response.data.message;
      const data = response.data.data;
      console.log("Message:", message);
      if (Array.isArray(data)) {
        const usersData = data;
        const dataGrid = new AnyGrid(usersData, columns, features);
      } else {
        console.error(
          "Fetched data is not in the expected array format.",
          data
        );
      }
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
    });
}

