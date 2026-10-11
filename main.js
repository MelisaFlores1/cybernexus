const $ = (selector) => document.querySelector(selector);

// Menú para celulares
const menuBtn = $("#menuBtn");
const menu = $("#menu");

menuBtn.addEventListener("click", () => {
  const abierto = menu.classList.toggle("open");
  menuBtn.textContent = abierto ? "×" : "☰";
  menuBtn.setAttribute("aria-expanded", String(abierto));
});

menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("open");
    menuBtn.textContent = "☰";
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

// Año automático
$("#year").textContent = new Date().getFullYear();

// Verificador educativo de contraseñas
const password = $("#password");
const strengthText = $("#strengthText");
const strengthBar = $("#strengthBar");

$("#showPassword").addEventListener("click", () => {
  password.type = password.type === "password" ? "text" : "password";
});

function verificarContraseña(valor) {
  const reglas = {
    length: valor.length >= 12,
    letter: /[a-z]/.test(valor) && /[A-Z]/.test(valor),
    number: /\d/.test(valor),
    symbol: /[^A-Za-z0-9]/.test(valor)
  };

  const checks = [
    ["checkLength", reglas.length, "12 caracteres o más"],
    ["checkCase", reglas.letter, "Mayúsculas y minúsculas"],
    ["checkNumber", reglas.number, "Incluye números"],
    ["checkSymbol", reglas.symbol, "Incluye símbolos"]
  ];

  checks.forEach(([id, cumple, texto]) => {
    const elemento = $("#" + id);
    elemento.classList.toggle("passed", cumple);
    elemento.textContent = (cumple ? "✓ " : "○ ") + texto;
  });

  const puntos = Object.values(reglas).filter(Boolean).length;
  const niveles = [
    { texto: "Débil", ancho: "25%", color: "#ff8191" },
    { texto: "Básica", ancho: "40%", color: "#ffca85" },
    { texto: "Buena", ancho: "65%", color: "#a5d9a1" },
    { texto: "Fuerte", ancho: "85%", color: "#51f2e3" },
    { texto: "Fuerte", ancho: "100%", color: "#51f2e3" }
  ];

  const nivel = valor.length === 0
    ? { texto: "Sin evaluar", ancho: "0%", color: "#51f2e3" }
    : niveles[puntos];


  strengthText.textContent = nivel.texto;
  strengthText.style.color = nivel.color;
  strengthBar.style.width = nivel.ancho;
  strengthBar.style.background = nivel.color;
}

password.addEventListener("input", () => {
  verificarContraseña(password.value);
});

// Generador de contraseñas aleatorias
const longitud = $("#length");
const longitudTexto = $("#lengthText");
const generada = $("#generated");
const mensajeCopia = $("#copyMessage");

const caracteres =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*?";

function numeroAleatorio(maximo) {
  if (window.crypto && window.crypto.getRandomValues) {
    const datos = new Uint32Array(1);
    const limite = Math.floor(4294967296 / maximo) * maximo;

    do {
      window.crypto.getRandomValues(datos);
    } while (datos[0] >= limite);

    return datos[0] % maximo;
  }

  return Math.floor(Math.random() * maximo);
}

function generarContraseña() {
  let resultado = "";

  for (let i = 0; i < Number(longitud.value); i++) {
    resultado += caracteres[numeroAleatorio(caracteres.length)];
  }

  generada.textContent = resultado;
  mensajeCopia.textContent = "✓ Generada en tu navegador.";
}

longitud.addEventListener("input", () => {
  longitudTexto.textContent = longitud.value;
});

$("#generate").addEventListener("click", generarContraseña);

$("#copy").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(generada.textContent);
    mensajeCopia.textContent = "✓ Contraseña copiada.";
  } catch {
    mensajeCopia.textContent =
      "No se pudo copiar automáticamente. Selecciona el texto y cópialo.";
  }
});

// Reto de detección de correos sospechosos
const respuestas = document.querySelectorAll(".answer");
const feedback = $("#feedback");

respuestas.forEach((boton) => {
  boton.addEventListener("click", () => {
    respuestas.forEach((opcion) => {
      opcion.classList.remove("correct", "wrong");
    });

    const correcta = boton.dataset.correct === "true";
    boton.classList.add(correcta ? "correct" : "wrong");

    feedback.className = correcta ? "feedback good" : "feedback bad";
    feedback.textContent = correcta
      ? "¡Correcto! Comprueba el remitente y visita el sitio oficial escribiendo tú mismo su dirección. Nunca compartas tu contraseña por correo."
      : "No es la opción más segura. Desconfía de los mensajes urgentes, no compartas tu contraseña y verifica la información por un canal oficial.";
  });
});

$("#reset").addEventListener("click", () => {
  respuestas.forEach((boton) => {
    boton.classList.remove("correct", "wrong");
  });

  feedback.className = "feedback";
  feedback.textContent =
    "Pista: desconfía de la urgencia y nunca compartas tu contraseña por correo.";
});
