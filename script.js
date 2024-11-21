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
// Función para reconectar al broker MQTT
void reconnectMQTT() {
    while (!client.connected()) {
        Serial.print("Intentando conectar al broker MQTT...");
        
        // Intentamos conectar con usuario y contraseña
        if (client.connect("ESP32_Client", mqtt_user, mqtt_pass)) {
            Serial.println("Conectado al broker MQTT");
        } else {
            Serial.print("Falló, rc=");
            Serial.print(client.state());
            Serial.println(" Intentando nuevamente en 5 segundos...");
            delay(5000);
        }
    }
}

void setup() {
    Wire.begin();  // Pines I2C personalizados
    Serial.begin(115200);
    delay(100); // Retardo para permitir que el puerto serie se ajuste

    // Conectar a WiFi
    setupWiFi();

    // Configurar el cliente MQTT
    client.setServer(mqtt_server, 1883);

    // Inicialización de la pantalla OLED
    u8g2.begin();

    // Verificar la dirección I2C del sensor SHT
    Wire.beginTransmission(0x40);
    if (Wire.endTransmission() == 0) {
        Serial.println("Sensor SHT encontrado en la dirección 0x40");
    } else {
        Serial.println("Sensor SHT no encontrado en la dirección 0x40");
    }

    if (sht.init()) {
        Serial.println("init(): Exitoso");
    } else {
        Serial.println("init(): Fallido");
    }
    sht.setAccuracy(SHTSensor::SHT_ACCURACY_MEDIUM);

    pinMode(pirPin, INPUT); // Configurar el pin del sensor PIR como entrada
}