// =========================
// Employee Data
// =========================

let employee = [];
let filteredEmployee = [];

// =========================
// Load Employees
// =========================

async function loadEmployees() {

    try {

        employee = await getEmployees();

        filteredEmployee = [...employee];

        RenderEmployees();

    } catch (error) {

        console.error("Error loading employees:", error);

    }

}

loadEmployees();

// =========================
// Save Employee
// =========================

const saveEmployeeButton = document.getElementById("saveEmployeeButton");

saveEmployeeButton.addEventListener("click", function () {

    const firstNameInput = document.getElementById("firstName").value;
    const lastNameInput = document.getElementById("lastName").value;
    const emailInput = document.getElementById("email").value;
    const ageInput = document.getElementById("age").value;

    const employeeID = document.getElementById("employeeId").value;

    if (employeeID === "") {
        const newEmployee = {
            id: employee.length + 1,
            firstName: firstNameInput,
            lastName: lastNameInput,
            email: emailInput,
            age: Number(ageInput)
        };

        employee.push(newEmployee);
    } else {
        const selectedEmployee = employee.find(user => user.id === Number(employeeID));
        selectedEmployee.firstName = firstNameInput;
        selectedEmployee.lastName = lastNameInput;
        selectedEmployee.email = emailInput;
        selectedEmployee.age = Number(ageInput);
    }


    filteredEmployee = [...employee];

    RenderEmployees();

    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("email").value = "";
    document.getElementById("age").value = "";
    document.getElementById("employeeId").value = "";

    employeeModal.classList.remove("show");

});

// =========================
// Render Employees
// =========================

function RenderEmployees() {

    const tableBody = document.getElementById("employeeTableBody");

    tableBody.innerHTML = "";

    filteredEmployee.forEach(user => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.age}</td>

            <td>
                <button class="delete-button" data-id="${user.id}">
                    Delete
                </button>
            </td>

            <td>
                <button class="edit-button" data-id="${user.id}">
                    Edit
                </button>
            </td>
        `;

        tableBody.appendChild(row);

    });

}

// =========================
// Delete Employee
// =========================

document.addEventListener("click", function (event) {

    if (event.target.classList.contains("delete-button")) {

        const id = Number(event.target.dataset.id);

        deleteEmployee(id);

    }

});

function deleteEmployee(id) {

    employee = employee.filter(user => user.id !== id);

    filteredEmployee = [...employee];

    RenderEmployees();

}

// =========================
// Edit Employee
// =========================

document.addEventListener("click", function (event) {

    if (event.target.classList.contains("edit-button")) {

        const id = Number(event.target.dataset.id);

        EditEmployee(id);

    }

});

function EditEmployee(id) {

    const selectedEmployee = employee.find(user => user.id === id);

    document.getElementById("employeeId").value = selectedEmployee.id;

    document.getElementById("firstName").value = selectedEmployee.firstName;

    document.getElementById("lastName").value = selectedEmployee.lastName;

    document.getElementById("email").value = selectedEmployee.email;

    document.getElementById("age").value = selectedEmployee.age;

    document.getElementById("modalTitle").textContent = "Edit Employee";

    employeeModal.classList.add("show");

}

// =========================
// Search
// =========================

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function () {

    const searchTerm = searchInput.value.toLowerCase();

    filteredEmployee = employee.filter(user => {

        const fullName =
            `${user.firstName} ${user.lastName}`.toLowerCase();

        return (

            fullName.includes(searchTerm) ||

            user.email.toLowerCase().includes(searchTerm) ||

            user.age.toString().includes(searchTerm)

        );

    });

    RenderEmployees();

});