// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function () {
  mostrarRolUsuario();
  configurarEventos();
  cargarPromociones();
});

// Mostrar el rol del usuario almacenado en localStorage
function mostrarRolUsuario() {
  const rol = localStorage.getItem('rol');
  if (rol) {
    const rolElemento = document.getElementById('usuario-rol');
    if (rolElemento) rolElemento.textContent = rol;
  }
}

// Configurar eventos: botón de búsqueda y cierre de sesión
function configurarEventos() {
  const btnBuscar = document.getElementById('btnBuscar');
  if (btnBuscar) {
    btnBuscar.addEventListener('click', buscarPaquetes);
  }

  const cerrarSesionBtn = document.getElementById('cerrar-sesion');
  if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener('click', cerrarSesion);
  }
}

// Delegación para los botones "Adquirir"
document.getElementById('resultados').addEventListener('click', function (event) {
  if (event.target && event.target.classList.contains('btn-adquirir')) {
    const btn = event.target;

    const paquete = {
      id: btn.getAttribute('data-id'),
      nombre: btn.getAttribute('data-nombre'),
      descripcion: btn.getAttribute('data-descripcion'),
      origen: btn.getAttribute('data-origen'),
      destino: btn.getAttribute('data-destino'),
      hotel: btn.getAttribute('data-hotel'),
      fecha: btn.getAttribute('data-fecha'),
      aerolinea: btn.getAttribute('data-aerolinea'),
      precio: btn.getAttribute('data-precio')
    };

    const numPersonas = document.getElementById('campo3').value;

    localStorage.setItem('paquete', JSON.stringify(paquete));
    localStorage.setItem('numPersonas', numPersonas);
    window.location.href = '/pagos';
  }
});

// Buscar paquetes o vuelos según los campos
function buscarPaquetes() {
  const origen = document.getElementById('campo1').value;
  const destino = document.getElementById('campo2').value;
  const personas = document.getElementById('campo3').value;
  const fecha = document.getElementById('campo4').value;
  const precio = document.getElementById('campo5').value;

  // Validación rápida
  if (!origen || !destino || !personas || !fecha || !precio) {
    alert("Por favor complete todos los campos.");
    return;
  }

  const filtros = { origen, destino, personas, fecha, precio };

  console.log("Datos enviados al servidor:", filtros); 

  fetch('/api/paquetes/filtrar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filtros)
  })
    .then(res => res.json())
    .then(mostrarResultados)
    .catch(err => console.error('Error:', err));
}

// Mostrar los resultados devueltos por el backend
function mostrarResultados(data) {
  const contenedor = document.getElementById('contenedorResultados');
  const resultados = document.getElementById('resultados');
  resultados.innerHTML = '';

  // Obtener el número de personas desde el campo de filtro
  const numPersonas = document.getElementById('campo3').value;
  const numPersonasInt = parseInt(numPersonas); // Convertir a número entero

  if (data.length > 0) {
    contenedor.style.display = 'block';
    data.forEach(paquete => {
      const precioTotal = paquete.precio_total * numPersonasInt; // Multiplicar el precio por el número de personas

      resultados.innerHTML += `
        <div class="col-md-4 mb-4">
          <div class="card shadow-sm">
            <h5 class="card-header text-center">Paquete ${paquete.nombre}</h5>
            <div class="card-body">
              <p class="card-text"><strong>Descripción:</strong> ${paquete.descripcion}</p>
              <p class="card-text"><strong>Origen:</strong> ${paquete.origen_ciudad}</p>
              <p class="card-text"><strong>Destino:</strong> ${paquete.destino_ciudad}</p>
              <p class="card-text"><strong>hotel:</strong> ${paquete.hotel}</p>
              <p class="card-text"><strong>Aerolínea:</strong> ${paquete.aerolinea}</p>
              <p class="card-text"><strong>Fecha:</strong> ${new Date(paquete.fecha).toLocaleDateString()}</p>
              <p class="card-text"><strong>Hora:</strong> ${paquete.hora_salida}</p>
              <p class="card-text"><strong>Precio:</strong> $${precioTotal.toLocaleString()}</p>
              <div class="col-md-12 text-center">
                <button class="btn btn-primary btn-adquirir"
                        data-id="${paquete.id}"
                        data-nombre="${paquete.nombre}" 
                        data-descripcion="${paquete.descripcion}" 
                        data-origen="${paquete.origen_ciudad}" 
                        data-destino="${paquete.destino_ciudad}"
                        data-hotel="${paquete.hotel}" 
                        data-fecha="${paquete.fecha}" 
                        data-aerolinea="${paquete.aerolinea}" 
                        data-precio="${precioTotal}">
                  Adquirir
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    });
  } else {
    resultados.innerHTML = '<p class="text-muted">No se encontraron resultados para tu búsqueda.</p>';
    contenedor.style.display = 'block';
  }
}

// Cargar nombres de promociones (solo los primeros 3)
function cargarPromociones() {
  fetch('/api/promociones')
    .then(response => response.json())
    .then(promociones => {
      promociones.slice(0, 3).forEach((promo, index) => {
        const titulo = document.getElementById(`promo-title-${index + 1}`);
        if (titulo) {
          titulo.textContent = promo.nombre;
        }
      });
    })
    .catch(error => console.error('Error cargando promociones:', error));
}

// Cerrar sesión limpiando todo
function cerrarSesion(event) {
  event.preventDefault();

  // Limpiar almacenamiento local y de sesión
  localStorage.clear();
  sessionStorage.clear();

  // Borrar cookies
  document.cookie.split(";").forEach(function (c) {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });

  // Cierre de sesión backend
  fetch('/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
    .then(response => {
      if (response.ok) {
        window.location.href = '/';
      } else {
        console.error('Error al cerrar sesión');
      }
    })
    .catch(error => console.error('Error al cerrar sesión:', error));

  // Refuerzo de redirección
  setTimeout(() => {
    window.history.replaceState(null, '', window.location.href);
    window.location.href = '/';
  }, 100);
}

// Evita que el usuario use la flecha hacia atrás
window.history.pushState(null, "", window.location.href);
window.onpopstate = function () {
    window.history.pushState(null, "", window.location.href);
};