const AUTH_URL = "http://localhost:5000/api/auth";
const USER_URL = "http://localhost:5000/api/user";

export async function registerUser(userData) {
  const response = await fetch(`${AUTH_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return await response.json();
}

export async function loginUser(userData) {
  const response = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (response.ok && data.token) {
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("currentUser", JSON.stringify(data.user));
  }

  return data;
}

export async function forgotPassword(email) {
  const response = await fetch(`${AUTH_URL}/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  return await response.json();
}

export async function getProfile() {
  const token = sessionStorage.getItem("token");

  const response = await fetch(`${USER_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
}

export async function updateProfile(profileData) {
  const token = sessionStorage.getItem("token");

  const response = await fetch(`${USER_URL}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  return await response.json();
}

export async function getAllUsers() {
  const token = sessionStorage.getItem("token");

  const response = await fetch(`${USER_URL}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
}

export async function createUserByManager(userData) {
  const token = sessionStorage.getItem("token");

  const response = await fetch(`${USER_URL}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  return await response.json();
}

export async function updateUserByManager(id, userData) {
  const token = sessionStorage.getItem("token");

  const response = await fetch(`${USER_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  return await response.json();
}

export async function deleteUserByManager(id) {
  const token = sessionStorage.getItem("token");

  const response = await fetch(`${USER_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
}

export async function approveUser(id) {
  const token = sessionStorage.getItem("token");

  const response = await fetch(`${USER_URL}/approve/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
}

export async function rejectUser(id) {
  const token = sessionStorage.getItem("token");

  const response = await fetch(`${USER_URL}/reject/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
}

export function getCurrentUser() {
  const user = sessionStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
}

export function setCurrentUser(user) {
  sessionStorage.setItem("currentUser", JSON.stringify(user));
}

export function logoutUser() {
  sessionStorage.removeItem("currentUser");
  sessionStorage.removeItem("token");
}