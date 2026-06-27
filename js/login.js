console.log("login.js loaded!");
const users = [
    {
        username: "admin",
        password: "1234",
        role: "Admin"
    },
    {
        username: "user",
        password: "1234",
        role: "User"
    }
];

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(event) {
    event.preventDefault();
    
    const usernameInput = document.getElementById("username").value;
    const passwordInput = document.getElementById("password").value;   
    console.log("Login button clicked!"); 


    const user = users.find(u => u.username === usernameInput && u.password === passwordInput);
    
    
    if (user) {

        alert("Login Success!");
        
        // Save the logged-in user
        localStorage.setItem("user", JSON.stringify(user));

        // Redirect to dashboard
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid username or password. Please try again.");
    }
});
