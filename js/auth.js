
// =============================
// TASKZEN AUTH SYSTEM
// =============================

// ---------- REGISTER ----------

function registerUser(event){

    event.preventDefault();

    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const confirm =
        document.getElementById("confirmPassword").value;

    if(password !== confirm){

        alert("Passwords do not match.");

        return;

    }

    const user = {

name,

email,

password,

role: "user"

};
    localStorage.setItem("taskzenUser", JSON.stringify(user));

    alert("Registration Successful!");

    window.location.href = "login.html";

}



// ---------- LOGIN ----------

function loginUser(event){

    event.preventDefault();

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;
        
    // Built-in Administrator Account

const admin = {

    email: "arby@taskzen.com",

    password: "admin123"

};

// Check Administrator

if(

    email === admin.email &&

    password === admin.password

){

    localStorage.setItem("loggedIn","true");

    localStorage.setItem("userRole","admin");

    window.location.href = "admin.html";

    return;

}

// Check Registered User

const user = JSON.parse(localStorage.getItem("taskzenUser"));

if(!user){

    alert("No account found.");

    return;

}

if(

    email === user.email &&

    password === user.password

){

    localStorage.setItem("loggedIn","true");

    localStorage.setItem("userRole","user");

    window.location.href = "dashboard.html";

}

else{

    alert("Incorrect email or password.");

}

}


// ---------- LOGOUT ----------

function logout(){

    localStorage.removeItem("loggedIn");

    localStorage.removeItem("userRole");

    window.location.href = "index.html";

}


// ---------- PROTECT USER DASHBOARD ----------

if(window.location.pathname.includes("dashboard.html")){

    if(

        localStorage.getItem("loggedIn") !== "true" ||

        localStorage.getItem("userRole") !== "user"

    ){

        window.location.href = "login.html";

    }

}

// ---------- PROTECT ADMIN DASHBOARD ----------

if(window.location.pathname.includes("admin.html")){

    if(

        localStorage.getItem("loggedIn") !== "true" ||

        localStorage.getItem("userRole") !== "admin"

    ){

        window.location.href = "login.html";

    }

}