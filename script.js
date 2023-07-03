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
    const role = document.getElementById("role").value; // Assuming you have a role field in your registration form
  
    const newUser = {
      name,
      age,
      place,
      batch_name: batch,
      profession,
      role,
    };
  
    fetch("https://rich-erin-calf-wrap.cyclic.app/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Successfully registered!");
  
        // Redirect based on the role
        if (role === "admin") {
          redirectToAdmin();
        } else {
          redirectToUser();
        }
  
        console.log(data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  
    document.getElementById("registrationForm").reset();
  }
  

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

// Function to handle login form submission
function login(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    // Make a POST request to the login endpoint
    fetch("https://reqres.in/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: username,
        password: password,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Login failed. Please check your credentials.");
        }
      })
      .then((data) => {
        // Store the login token in localStorage
        localStorage.setItem("token", data.token);
  
        // Redirect to the data page
        window.location.href = "data.html";
      })
      .catch((error) => {
        alert(error.message);
      });
  }
  
  document.getElementById("loginForm").addEventListener("submit", login);
  
  


const cardsContainer = document.getElementById('cardsContainer');
const searchInput = document.getElementById('searchInput');
const filterSelect = document.getElementById('filterSelect');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const pageCount = document.getElementById('pageCount');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const editName = document.getElementById('editName');
const editAge = document.getElementById('editAge');
const editProfession = document.getElementById('editProfession');

let users = [];
let filteredUsers = [];
let currentPage = 1;
const usersPerPage = 5;

// Fetch users from the server
function fetchUsers() {
  // Replace this with your API endpoint to fetch the user data
  fetch('https://rich-erin-calf-wrap.cyclic.app/users')
    .then(response => response.json())
    .then(data => {
      users = data;
      filteredUsers = users;
      renderUsers();
    })
    .catch(error => console.error(error));
}

// Render users in the UI
function renderUsers() {
  const start = (currentPage - 1) * usersPerPage;
  const end = start + usersPerPage;
  const visibleUsers = filteredUsers.slice(start, end);

  cardsContainer.innerHTML = '';

  for (const user of visibleUsers) {
    const card = createCard(user);
    cardsContainer.appendChild(card);
  }

  updatePagination();
}

// Create a card element for a user
function createCard(user) {
  const card = document.createElement('div');
  card.className = 'card';

  const image = document.createElement('img');
  image.src = 'dummy-image.jpg'; // Replace with the user's image URL
  card.appendChild(image);

  const name = document.createElement('h3');
  name.textContent = user.name;
  card.appendChild(name);

  const age = document.createElement('p');
  age.textContent = `Age: ${user.age}`;
  card.appendChild(age);

  const profession = document.createElement('p');
  profession.textContent = `Profession: ${user.profession}`;
  card.appendChild(profession);

  const editButton = document.createElement('button');
  editButton.innerHTML = '&#9998;';
  editButton.addEventListener('click', () => openEditModal(user));
  card.appendChild(editButton);

  const deleteButton = document.createElement('button');
  deleteButton.innerHTML = '&#128465;';
  deleteButton.addEventListener('click', () => deleteUser(user.id));
  card.appendChild(deleteButton);

  return card;
}

// Update the pagination buttons and page count
function updatePagination() {
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (currentPage === 1) {
    prevButton.disabled = true;
  } else {
    prevButton.disabled = false;
  }

  if (currentPage === totalPages) {
    nextButton.disabled = true;
  } else {
    nextButton.disabled = false;
  }

  pageCount.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Search users by name
function searchUsers() {
  const searchTerm = searchInput.value.toLowerCase();

  filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm)
  );
  currentPage = 1;
  renderUsers();
}

// Filter users by profession
function filterUsers() {
  const selectedProfession = filterSelect.value;

  if (selectedProfession === '') {
    filteredUsers = users;
  } else {
    filteredUsers = users.filter(user =>
      user.profession === selectedProfession
    );
  }
  currentPage = 1;
  renderUsers();
}

// Sort users by age
function sortUsers() {
  filteredUsers.sort((a, b) => a.age - b.age);
  currentPage = 1;
  renderUsers();
}

// Go to the previous page
function previousPage() {
  if (currentPage > 1) {
    currentPage--;
    renderUsers();
  }
}

// Go to the next page
function nextPage() {
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (currentPage < totalPages) {
    currentPage++;
    renderUsers();
  }
}

// Open the edit modal with user data
function openEditModal(user) {
  editName.value = user.name;
  editAge.value = user.age;
  editProfession.value = user.profession;

  editModal.style.display = 'block';
  editForm.addEventListener('submit', event => {
    event.preventDefault();
    updateUser(user.id);
  });
}

// Close the edit modal
function closeModal() {
  editModal.style.display = 'none';
  editForm.reset();
}

// Update the user data
function updateUser(userId) {
  const updatedUser = {
    name: editName.value,
    age: parseInt(editAge.value),
    profession: editProfession.value
  };

  // Replace this with your API endpoint to update the user data
  fetch(`https://rich-erin-calf-wrap.cyclic.app/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedUser)
  })
    .then(response => response.json())
    .then(data => {
      const index = users.findIndex(user => user.id === userId);
      users[index] = data;
      filteredUsers = users;
      renderUsers();
      closeModal();
    })
    .catch(error => console.error(error));
}

// Delete a user
function deleteUser(userId) {
  // Replace this with your API endpoint to delete the user data
  fetch(`https://example.com/users/${userId}`, {
    method: 'DELETE'
  })
    .then(() => {
      users = users.filter(user => user.id !== userId);
      filteredUsers = users;
      renderUsers();
    })
    .catch(error => console.error(error));
}

// Fetch users when the page loads
fetchUsers();

  