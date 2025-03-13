import Formique from "svelte-formique";
export function init() {
  const formSchema = [
    ["text", "first_name", "Name", { required: true }],
    ["text", "surname", "Surname", { required: true }],
    [
      "number",
      "mobile",
      "Mobile",
      { required: true },
      {
        minlength: 10,
        maxlength: 10,
      },
    ],
    ["email", "email", "Email", { required: true }],
    ["password", "password", "Password", { required: true }],
    ["submit", "submit", "Submit", {}, { style: "width: 100%" }],
  ];
  const formParams = {
    method: "POST",
    id: "signup",
    action: "http://localhost:3000/users/register",
    style: "width: 100%;",
  };
  const formSettings = {
    submitOnPage: true,
    requiredFieldIndicator: true,
    theme: "midnight-blush",
  };
  const form = new Formique(formSchema, formParams, formSettings);
}

