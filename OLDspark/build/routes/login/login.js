import Formique from "svelte-formique";
export function init() {
  const formSchema = [
    ["email", "email", "Email", { required: true }],
    ["password", "password", "Password", { required: true }],
    ["submit", "submit", "Login", {}, { style: "width: 100%" }],
  ];
  const formParams = {
    method: "POST",
    id: "signup",
    action: "http://localhost:3000/users/login",
  };
  const formSettings = {
    submitOnPage: true,
    requiredFieldIndicator: true,
    theme: "midnight-blush",
  };
  const form = new Formique(formSchema, formParams, formSettings);
}

