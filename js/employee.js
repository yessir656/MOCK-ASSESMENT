// =========================
// Employee Data
// =========================

let employee = [];
let filteredEmployee = [];
let currentPage = 1;
const rowsPerPage = 5;

//skeleton loading references
const dashboardSkeleton = document.getElementById("dashboardSkeleton");
const dashboardContent = document.getElementById("dashboardContent");
//table header content eto din yung nag sasabi pag ang admin ay nag login dun lang lalabas yung function
const tableHeader = document.getElementById("tableHeader");

tableHeader.innerHTML = `
    <th>ID</th>
    <th>Full Name</th>
    <th>Email</th>
    <th>Age</th>
    ${currentUser.role === "Admin" ? "<th>Actions</th>" : ""}
`;


// Load EmployeesA tinawag ko yung getEmployees nanandon sa api.js para mag load sila
// =========================

async function loadEmployees() {

    try {

       dashboardSkeleton.hidden = false;
        dashboardContent.hidden = true;

        //temporary delay lang to
        await new Promise(resolve => setTimeout(resolve, 2000));

        employee = await getEmployees();

        filteredEmployee = [...employee];

       RenderEmployees();

        dashboardSkeleton.hidden = true;
        dashboardContent.hidden = false;

    } catch (error) {

        console.error("Error loading employees:", error);

        alert("failed to load Employees. please try again. ")

        dashboardSkeleton.hidden = true;
        dashboardContent.hidden = false;

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

    //duplicate sya
    const emailExists = employee.some(user =>
        user.email.toLowerCase() === emailInput.toLowerCase() && user.id !== Number(employeeID));
    if(emailExists){
        alert("email already exists");
        return

    }

    //add or edit employe

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
    currentPage = 1;
    RenderEmployees();

    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("email").value = "";
    document.getElementById("age").value = "";
    document.getElementById("employeeId").value = "";

    employeeModal.classList.remove("show");

});

// =========================
// Render Employees  -eto naman yung nag didisplay ng data sa loob ng table
// =========================

function RenderEmployees() {

    const tableBody = document.getElementById("employeeTableBody");

    tableBody.innerHTML = "";

    const startIndex = (currentPage - 1) * rowsPerPage;

    if(filteredEmployee.length === 0){
        tableBody.innerHTML = `
        <tr>
          <td colspan ="6">
            No Employees Found.
          </td>
        </tr>
        `;
        document.getElementById("currentPage").textContent = "1 / 1";
        return;
    }
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
            <button class="btn btn-warning btn-sm me-2 edit-button"
                    data-id="${user.id}">
                ✏ Edit
            </button>

            <button class="btn btn-danger btn-sm delete-button"
                    data-id="${user.id}">
                🗑 Delete
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

    const employeeExists = employee.some(user => user.id === id);

    if (!employeeExists) {
        alert("Employee Not Found");
        return;
    }

    if (currentUser.role !== "Admin") {
        alert("Access Denied");
        return;
    }

    employee = employee.filter(user => user.id !== id);

    filteredEmployee = [...employee];

    const totalPage = Math.ceil(filteredEmployee.length / rowsPerPage);

    if (currentPage > totalPage) {
        currentPage = totalPage || 1;
    }

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

    if(!selectedEmployee){
        alert("Employee not Found.");

        return;
    }

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

    currentPage = 1;
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
    currentPage =  1;
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

    
