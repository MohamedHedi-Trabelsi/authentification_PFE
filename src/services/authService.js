const API_URL = "http://localhost:5000/api";

export async function registerUser(data) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function loginUser(data) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const response = await res.json();


  if (response.token) {
    localStorage.setItem("token", response.token);
    localStorage.setItem("currentUser", JSON.stringify(response.user));
  }

  return response;
}

export async function getProfile() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/user/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");
}

export function getCurrentUser() {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
}