function successRegi() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let fName = document.getElementById("name").value;
  let lName = document.getElementById("lName").value;
  let email = document.getElementById("email").value;
  let submitRegi = document.getElementById("submitRegi");
  if (
    username != "" &&
    password != "" &&
    lName != "" &&
    email != "" &&
    fName != ""
  ) {
    submitRegi.disabled = false;
  } else {
    submitRegi.disabled = true;
  }
}

function successLogin() {
  let usernameL = document.getElementById("username").value;
  let passwordL = document.getElementById("password").value;
  let submit = document.getElementById("submit");
  if (username != "" && password != "") {
    submitLogin.disabled = false;
  } else {
    submitLogin.disabled = true;
  }
}

function register(event) {
  event.preventDefault();
  let username = document.getElementById("username").value.toLowerCase();
  let password = document.getElementById("password").value;
  let fName = document.getElementById("name").value.toLowerCase();
  let lName = document.getElementById("lName").value.toLowerCase();
  let email = document.getElementById("email").value.toLowerCase();
  let register_info = document.getElementById("register_info");

  fetch("http://localhost:5000/register", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ username, password, fName, lName, email }),
  })
    .then((res) => res.json())
    .then((str) => {
      console.log("sent request received detail");
      register_info.innerText = str;
    })
    .catch((err) => console.log(err));
}

function login(event) {
  event.preventDefault();
  let username = document.getElementById("usernameL").value.toLowerCase();
  let password = document.getElementById("passwordL").value;
  let login_info = document.getElementById("login_info");
  fetch("http://localhost:5000/login", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("sent request received detail");
      login_info.innerText = res;
    })
    .catch((err) => {
      console.log(err);
      login_info.innerText =
        "login information was not ok username or password not exist";
    });
}

let regiCount = 0;
let logiCount = 0;

function displayLogin() {
  let login = document.getElementById("login");
  let needToRegi = document.getElementById("needToRegi");
  if (logiCount % 2 == 0) {
    login.style.display = "block";
    needToRegi.style.display = "block";
    login.style.margin = "auto";
    logiCount++;
  } else {
    login.style.display = "none";
    needToRegi.style.display = "none";
    logiCount++;
  }
}

function displayRegister() {
  let register = document.getElementById("register");
  let needTologi = document.getElementById("needTologi");
  if (regiCount % 2 == 0) {
    register.style.display = "block";
    needTologi.style.display = "block";
    register.style.margin = "auto";
    regiCount++;
  } else {
    register.style.display = "none";
    needTologi.style.display = "none";
    regiCount++;
  }
}

function switchForm() {
  displayLogin();
  displayRegister();
}
