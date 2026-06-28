// Authentication
const currentUser = JSON.parse(localStorage.getItem("user"));

if (!currentUser) {
    window.location.href = "index.html";
}

// Welcome message
document.getElementById("welcomeMessage").textContent =
    `Welcome, ${currentUser.username}!`;

// Role
document.getElementById("roleMessage").textContent =
    `Role: ${currentUser.role}`;

if (currentUser.role == "User"){
    document.getElementById("addEmployeeButton").style.display = "none";
}

// Modal
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

// Logout
document.getElementById("logoutButton").addEventListener("click", function () {

    localStorage.removeItem("user");

    window.location.href = "index.html";

});