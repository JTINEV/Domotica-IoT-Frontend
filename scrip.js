// Credenciales simuladas
const credenciales = {
    usuario: "admin",
    contrasena: "1234"
};

// Evento para el formulario de login
document.getElementById("formLogin").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === credenciales.usuario && password === credenciales.contrasena) {
        document.getElementById("loginForm").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
    } else {
        const error = document.getElementById("loginError");
        error.style.display = "block";
        setTimeout(() => (error.style.display = "none"), 3000);
    }
});