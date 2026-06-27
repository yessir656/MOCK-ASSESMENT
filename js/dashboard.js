// Get the logged-in user from localStorage
const currentUser = JSON.parse(localStorage.getItem("user"));

// If no user is logged in, redirect back to login page
if (!currentUser) {
    window.location.href = "index.html";
}

// Display username
const welcomeMessage = document.getElementById("welcomeMessage");
welcomeMessage.textContent = `Welcome, ${currentUser.username}!`;

// Display role
const roleMessage = document.getElementById("roleMessage");
roleMessage.textContent = `Role: ${currentUser.role}`;

const employeeModal = document.getElementById("employeeModal");

const addEmployeeButton = document.getElementById("addEmployeeButton");

const cancelButton = document.getElementById("cancelButton");

addEmployeeButton.addEventListener("click", function () {
    document.getElementById("modalTitle").textContent = "Add Employee";
    document.getElementById("employeeId").value = "";
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("email").value = "";
    document.getElementById("age").value = "";
    employeeModal.classList.add("show");
});

cancelButton.addEventListener("click", function () {
    employeeModal.classList.remove("show");
});


// Logout button
const logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("click", function () {

    // Remove user session
    localStorage.removeItem("user");

    // Redirect back to login
    window.location.href = "index.html";

});

let employee = [];
let filteredEmployee = [];

async function loadEmployees() {
    try {
        const response = await fetch("https://dummyjson.com/users");
        const data = await response.json();
        employee = data.users;
        filteredEmployees = [...employee]; // Initialize filteredEmployee with all employees

        RenderEmployees();

        const saveEmployeeButton = document.getElementById("saveEmployeeButton");
        saveEmployeeButton.addEventListener("click", function () {
            const firstNameInput = document.getElementById("firstName").value;
            const lastNameInput = document.getElementById("lastName").value;
            const emailInput = document.getElementById("email").value;
            const ageInput = document.getElementById("age").value;
       
        const newEmployee = {
            id: employee.length + 1,
            firstName: firstNameInput,
            lastName: lastNameInput,
            email: emailInput,
            age: parseInt(ageInput)
        };
        
        filteredEmployee.push(newEmployee);
        RenderEmployees();
        document.getElementById("firstName").value = "";
        document.getElementById("lastName").value = "";
        document.getElementById("email").value = "";
        document.getElementById("age").value = "";
    });
    }
    catch (error) {
        console.error("Error loading employees:", error);
    }
}
loadEmployees(); 

function RenderEmployees() {
     const tableBody = document.getElementById("employeeTableBody");
        tableBody.innerHTML = ""; // Clear existing rows
        filteredEmployees.forEach((user,index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.email}</td>
                <td>${user.age}</td>
                <td>
                    <button class="btn btn-danger btn-sm delete-button" data-id="${user.id}">Delete</button>
                </td>
                <td>
                    <button class="btn btn-primary btn-sm edit-button" data-id="${user.id}">Edit</button>
                </td>
            `;
            tableBody.appendChild(row);
    
});
}

document.addEventListener("click", function (event) {

    if (event.target.classList.contains("delete-button")) {

        const id = Number(event.target.dataset.id);

        deleteEmployee(id);

    }

});

function deleteEmployee(id) {
    employee = filteredEmployee.filter(user => user.id !== id);
    RenderEmployees();
}

document.addEventListener("click", function (event) {

    if (event.target.classList.contains("edit-button")) {
        const id = Number(event.target.dataset.id);
        
        EditEmployee(id);
    }
});

function EditEmployee(id) {

    const selectedEmployee =
        employee.find(user => user.id === id);

    document.getElementById("employeeId").value =
        selectedEmployee.id;

    document.getElementById("firstName").value =
        selectedEmployee.firstName;

    document.getElementById("lastName").value =
        selectedEmployee.lastName;

    document.getElementById("email").value =
        selectedEmployee.email;

    document.getElementById("age").value =
        selectedEmployee.age;

    document.getElementById("modalTitle").textContent = "Edit Employee";
    employeeModal.classList.add("show");

}

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.toLowerCase();
    filteredEmployees = employee.filter(user =>{
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        return(
            fullName.includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.age.toString().includes(searchTerm)
        );
    });
    RenderEmployees();
});

    


    