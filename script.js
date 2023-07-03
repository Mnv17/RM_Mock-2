function redirectToAdmin() {
    window.location.href = "admin.html";
  }
  
  function redirectToUser() {
    window.location.href = "user.html";
  }
  
  function registerUser(event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const place = document.getElementById("place").value;
    const batch = document.getElementById("batch").value;
    const profession = document.getElementById("profession").value;
  
    const newUser = {
      name,
      age,
      place,
      batch_name: batch,
      profession,
    };
  
    fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Successfully registered!");
        console.log(data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  
    document.getElementById("registrationForm").reset();
  }
  
  document.getElementById("registrationForm").addEventListener("submit", registerUser);

// Check if the user is logged in
function checkLoginStatus() {
    const token = localStorage.getItem("token"); // Assuming you store the token in localStorage after successful login
    if (!token) {
      // If the token doesn't exist, redirect to the login page
      window.location.href = "login.html";
    }
  }
  
  // Call the checkLoginStatus function when the "Data" and "Reports" pages are loaded
  if (window.location.pathname.includes("data.html") || window.location.pathname.includes("reports.html")) {
    checkLoginStatus();
  }
  