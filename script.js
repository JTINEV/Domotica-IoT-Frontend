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

// Conexión al broker MQTT
const brokerUrl = "ws://192.168.8.84:9001"; // Dirección del broker MQTT con WebSocket
const client = mqtt.connect(brokerUrl);

client.on("connect", function () {
    console.log("Conectado al broker MQTT");
    client.subscribe("casa/temperatura");
    client.subscribe("casa/humedad");
    client.subscribe("casa/pir");
});

client.on("error", function (err) {
    console.error("Error al conectar con MQTT: ", err);
});

client.on("message", function (topic, message) {
    const payload = message.toString();

    switch (topic) {
        case "casa/temperatura":
            document.getElementById("temperaturaValue").innerText = `${payload} °C`;
            agregarRegistro("tablaTemperatura", "temperatura", `${payload} °C`);
            break;

        case "casa/humedad":
            document.getElementById("humedadValue").innerText = `${payload} %`;
            agregarRegistro("tablaHumedad", "humedad", `${payload} %`);
            break;

        case "casa/pir":
            console.log("Mensaje PIR recibido:", payload);  // Verifica el valor recibido
            const estadoMovimiento = payload === "1" ? "Movimiento No Detectado" : "Movimiento Detectado";
            document.getElementById("movimientoValue").innerText = estadoMovimiento;
            agregarRegistro("tablaMovimiento", "movimiento", estadoMovimiento);
            break;

        default:
            console.warn("Topic desconocido: ", topic);
    }
});