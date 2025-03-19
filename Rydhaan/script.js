function setRole(role) {
    localStorage.setItem("userRole", role);
    window.location.href = role + ".html";  
}
function logout() {
    localStorage.removeItem("userRole");
    window.location.href = "index.html";
}
