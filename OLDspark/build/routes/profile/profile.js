export function init() {
  class RegistrationForm {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) {
        console.error(`Container with ID '${containerId}' not found.`);
        return;
      }
      this.createForm();
    }
    createForm() {
      const form = document.createElement("form");
      form.id = "registrationForm";
      form.addEventListener("submit", this.handleSubmit.bind(this));
      const nameLabel = this.createLabel("Name:", "nameInput");
      const nameInput = this.createInput("text", "nameInput", "name");
      const surnameLabel = this.createLabel("Surname:", "surnameInput");
      const surnameInput = this.createInput("text", "surnameInput", "surname");
      const submitBtn = document.createElement("button");
      submitBtn.type = "submit";
      submitBtn.textContent = "Register";
      form.appendChild(nameLabel);
      form.appendChild(nameInput);
      form.appendChild(document.createElement("br"));
      form.appendChild(surnameLabel);
      form.appendChild(surnameInput);
      form.appendChild(document.createElement("br"));
      form.appendChild(submitBtn);
      this.container.appendChild(form);
    }
    createLabel(text, forId) {
      const label = document.createElement("label");
      label.htmlFor = forId;
      label.textContent = text;
      return label;
    }
    createInput(type, id, name) {
      const input = document.createElement("input");
      input.type = type;
      input.id = id;
      input.name = name;
      input.required = true;
      return input;
    }
    handleSubmit(event) {
      event.preventDefault();
      const name = document.getElementById("nameInput").value;
      const surname = document.getElementById("surnameInput").value;
      alert(`Registered: ${name} ${surname}`);
    }
  }
  document.addEventListener("DOMContentLoaded", () => {
    new RegistrationForm("regForm");
  });
  console.log("nothing");
}

