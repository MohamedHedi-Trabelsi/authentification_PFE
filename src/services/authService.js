export function getRegisteredUser() {
  const user = localStorage.getItem("registeredUser");
  return user ? JSON.parse(user) : null;
}

export function saveRegisteredUser(user) {
  localStorage.setItem("registeredUser", JSON.stringify(user));
}

export function loginUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

export function getCurrentUser() {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
}

export function logoutUser() {
  localStorage.removeItem("currentUser");
}