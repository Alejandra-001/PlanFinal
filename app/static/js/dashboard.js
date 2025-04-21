// Función para obtener los datos del dashboard

document.getElementById('cerrarSesionBtn').addEventListener('click', cerrarSesion);

document.addEventListener('DOMContentLoaded', function () {
  history.pushState(null, "", location.href); 
  history.back(); 
  history.forward();
});

async function obtenerDatosDashboard() {
    try {
      const response = await fetch('/api/dashboard');
  
      if (!response.ok) {
        throw new Error('No se pudieron obtener los datos del dashboard');
      }
  
      const data = await response.json();
  
      // Mostrar solo el rol desde localStorage
      const rol = localStorage.getItem('rol'); // Obtener rol desde localStorage
      const spanRol = document.getElementById('usuario-rol');
      if (rol && spanRol) {
        spanRol.innerText = rol; // Mostrar solo el rol
      }
  
      // Mostrar ventas totales
      const ventasTotales = document.getElementById('ventas-totales');
      const totalNegrita = document.createElement('strong');
      totalNegrita.innerText = `$${Number(data.ventas_totales).toLocaleString()}`;
      ventasTotales.innerHTML = '';
      ventasTotales.appendChild(totalNegrita);
  
      // Paquetes más vendidos
      const paquetesList = document.getElementById('paquetes-mas-vendidos');
      paquetesList.innerHTML = '';
      data.paquetes_mas_vendidos.forEach(paquete => {
        const li = document.createElement('li');
        const nombrePaquete = document.createElement('strong');
        nombrePaquete.innerText = paquete.nombre;  // Cambié paquete[0] a paquete.nombre
        li.appendChild(nombrePaquete);
        li.innerHTML += ` (${paquete.veces_vendido} ventas)`;  // Cambié paquete[1] a paquete.veces_vendido
        paquetesList.appendChild(li);
      });
  
      // Ocupación de vuelos
      const ocupacionVuelos = document.getElementById('ocupacion-vuelos');
      ocupacionVuelos.innerHTML = '';
      const ocupacionVuelosNegrita = document.createElement('strong');
      ocupacionVuelosNegrita.innerText = `${data.ocupacion_vuelos}% Promedio`;
      ocupacionVuelos.appendChild(ocupacionVuelosNegrita);
  
      // Ocupación de hoteles
      const ocupacionHoteles = document.getElementById('ocupacion-hoteles');
      ocupacionHoteles.innerHTML = '';
      const ocupacionHotelesNegrita = document.createElement('strong');
      ocupacionHotelesNegrita.innerText = `${Math.round(data.ocupacion_hoteles)}% General`;
      ocupacionHoteles.appendChild(ocupacionHotelesNegrita);
  
      // Promociones activas
      const promocionesList = document.getElementById('promociones-activas');
      promocionesList.innerHTML = '';
      data.promociones_activas.forEach(promo => {
        const li = document.createElement('li');
        const nombre = document.createElement('strong');
        nombre.innerText = `${promo.nombre}`;
        const fechas = document.createElement('p');
        fechas.innerHTML = `<strong>Desde:</strong> ${promo.fecha_inicio} - <strong>Hasta:</strong> ${promo.fecha_fin}`;
        li.appendChild(nombre);
        li.appendChild(fechas);
        promocionesList.appendChild(li);
      });
  
    } catch (error) {
      console.error('Error al obtener los datos del dashboard:', error);
    }
  }
  
  // Función reutilizable para cerrar sesión
  function cerrarSesion(event) {
    if (event) event.preventDefault();
  
    localStorage.clear();
    sessionStorage.clear();
  
    document.cookie.split(";").forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  
    fetch('/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
      .then(response => {
        window.location.href = '/login';
      })
      .catch(error => {
        console.error('Error al cerrar sesión:', error);
        window.location.href = '/login';
      });
  
    setTimeout(() => {
      window.history.replaceState(null, '', window.location.href);
      window.location.href = '/';
    }, 100);
  }
  
  // Al cargar la página
  document.addEventListener('DOMContentLoaded', function () {
    obtenerDatosDashboard();
  
    // Asociar el botón de cerrar sesión
    const cerrarSesionBtn = document.getElementById('cerrar-sesion');
    if (cerrarSesionBtn) {
      cerrarSesionBtn.addEventListener('click', cerrarSesion);
    }
  });
  