// Filtro por una ciudad concreta
const ciudadSeleccionada = "Madrid";
const eventosEnCiudad = eventosCulturales.filter(
  (e) => e.ciudad === ciudadSeleccionada
);

// Cálculo de la media de asistentes
const totalAsistentes = eventosEnCiudad.reduce(
  (acc, evento) => acc + evento.asistentes,
  0
);
const mediaAsistentes =
  eventosEnCiudad.length > 0 ? totalAsistentes / eventosEnCiudad.length : 0;

// Mostrar el resultado
console.log(
  `La media de asistentes en ${ciudadSeleccionada} es: ${mediaAsistentes.toFixed(
    2
  )}`
);
