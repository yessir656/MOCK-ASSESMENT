// =========================
// Employee Data
// =========================

let employee = [];
let filteredEmployee = [];
let currentPage = 1;
const rowsPerPage = 5;

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
    const firstNameInput = document.getElementById("firstName").value.trim();
    const lastNameInput = document.getElementById("lastName").value.trim();
    const emailInput = document.getElementById("email").value.trim();
    const ageInput = document.getElementById("age").value.trim();

    const employeeID = document.getElementById("employeeId").value;

    if(currentUser.role !== "Admin"){
        alert("Access Denied! Only Admin can Save or edit Employees")
        return;
    }

    
    if(
       firstNameInput === ""||
       lastNameInput === ""||
       emailInput === ""||
       ageInput === ""
    ){
        alert("Please all the Fields");

        return;

    }
    const emailPattern =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailPattern.test(emailInput)){
        alert("Please Enter a valid Email")
        
        return;
    }

    if(Number(ageInput) <=0 ){
        alert("Age mmust greater than zero");

        return;
    }else if(Number(ageInput)>150){
        alert("Age must not passed 150");

        return;
    };

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

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

        const employeesToDisplay = filteredEmployee.slice(startIndex, endIndex);

        employeesToDisplay.forEach(user => {

        const row = document.createElement("tr");

       row.innerHTML = `
    <td>${user.id}</td>
    <td>${user.firstName} ${user.lastName}</td>
    <td>${user.email}</td>
    <td>${user.age}</td>

    ${currentUser.role === "Admin" ? `
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
    ` : ""}
`;

        tableBody.appendChild(row);

    });

    const totalPage = Math.ceil(filteredEmployee.length / rowsPerPage);

    document.getElementById("currentPage").textContent = `${currentPage} / ${totalPage}`;

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

    if(currentUser.role !== "Admin"){
        alert("Access Denied");

        return;
    }

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

    if(currentUser.role !== "Admin"){
        alert("Access Denied");

        return;
    }

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

const sortSelect = document.getElementById("sortSelect");

sortSelect.addEventListener("change", function () {

    const sortBy = sortSelect.value;

    if (sortBy === "firstName") {

        filteredEmployee.sort((a, b) => a.firstName.localeCompare(b.firstName));
    } else if (sortBy === "lastName") {

        filteredEmployee.sort((a, b) => a.lastName.localeCompare(b.lastName));
    } else if (sortBy === "age") {

        filteredEmployee.sort((a, b) => a.age - b.age);

    }else if (sortBy === "ageDesc") {

        filteredEmployee.sort((a, b) => b.age - a.age);


    }else if (sortBy === "email") {

        filteredEmployee.sort((a, b) => a.email.localeCompare(b.email));
    }else if (sortBy === "id") {
        filteredEmployee.sort((a, b) => a.id - b.id);
    }

    RenderEmployees();
 });

 const prevPageButton = document.getElementById("prevPageButton");

 prevPageButton.addEventListener("click", function () {
 
    if (currentPage > 1) {
        currentPage--;
        RenderEmployees();
    }
});

 const nextPageButton = document.getElementById("nextPageButton");
 nextPageButton.addEventListener("click", function () {
    const totalPage = Math.ceil(filteredEmployee.length/ rowsPerPage);

    if (currentPage < totalPage) {
        currentPage++;

        RenderEmployees();
}
});  
