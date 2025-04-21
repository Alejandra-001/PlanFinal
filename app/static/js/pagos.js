document.addEventListener('DOMContentLoaded', function () {
  
  document.addEventListener('DOMContentLoaded', function () {
    history.pushState(null, "", location.href); 
    history.back(); 
    history.forward();
});
  document.getElementById('cerrarSesionBtn').addEventListener('click', cerrarSesion);
  const paquete = JSON.parse(localStorage.getItem('paquete'));
  const numPersonas = parseInt(localStorage.getItem('numPersonas'));
  const clienteId = localStorage.getItem('id');
  const rol = localStorage.getItem('rol');

  // Validar datos esenciales
  if (!paquete || !numPersonas || !clienteId) {
    Swal.fire({
      icon: 'error',
      title: 'Datos faltantes',
      text: 'No se pudo cargar la información del paquete o usuario.',
    }).then(() => {
      window.location.href = '/home';
    });
    return;
  }

  const paqueteId = paquete.id;
  const precioPorPersona = parseFloat(paquete.precio);
  const precioTotalSinIVA = precioPorPersona * numPersonas;
  const impuesto = precioTotalSinIVA * 0.16;
  const totalConImpuesto = precioTotalSinIVA + impuesto;

  // Mostrar rol en el span si existe
  if (rol) {
    document.getElementById('usuario-rol').innerText = rol;
  }

  // Mostrar información del paquete
  const infoPaquete = `  
    <div class="mt-2"><strong>Descripción: <br></strong> <span class="text-secondary">${paquete.descripcion}</span></div>
    <div class="mt-2"><strong>Número de viajeros:</strong> <span class="text-secondary">${numPersonas}</span></div>
    <div class="mt-2"><strong>Origen:</strong> <span class="text-secondary">${paquete.origen}</span></div>
    <div class="mt-2"><strong>Destino:</strong> <span class="text-secondary">${paquete.destino}</span></div>
    <div class="mt-2"><strong>Hotel:</strong> <span class="text-secondary">${paquete.hotel}</span></div>
    <div class="mt-2"><strong>Aerolínea:</strong> <span class="text-secondary">${paquete.aerolinea}</span></div>
    <div class="mt-2"><strong>Fecha:</strong> <span class="text-secondary">${paquete.fecha}</span></div>
    <div class="mt-2"><strong>Precio por persona:</strong> <span class="text-secondary">$${precioPorPersona.toLocaleString()}</span></div>
  `;

  const totalTexto = `  
    <div class="mt-2"><strong>Total a pagar (16% IVA incluido):</strong>
    <span class="d-flex justify-content-center mt-3 h1 fw-bold">$${totalConImpuesto.toLocaleString()}</span></div>
  `;

  document.getElementById('campo8').innerHTML = infoPaquete;
  document.getElementById('campo9').innerHTML = totalTexto;

  // Botón cancelar
  document.getElementById('cancelarBtn').addEventListener('click', function () {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Se cancelará el proceso y se eliminarán los datos.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        const fechaReserva = new Date().toISOString().slice(0, 10);
        const estadoReserva = 'cancelado';

        fetch('/guardar_reserva', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            cliente_id: clienteId,
            paquete_id: paqueteId,
            fecha_reserva: fechaReserva,
            total: totalConImpuesto,
            estado: estadoReserva
          })
        })
        .then(response => response.json())
        .then(data => {
          console.log('Reserva cancelada guardada:', data);
        })
        .catch(error => {
          console.error('Error al guardar la reserva:', error);
        });

        localStorage.removeItem('paquete');
        localStorage.removeItem('numPersonas');
        localStorage.removeItem('voucher');
        window.location.href = '/home';
      }
    });
  });

  // Botón Confirmar y Pagar
  document.getElementById('confirmarBtn').addEventListener('click', function () {
    // Validar campos antes de procesar
    const nombre = document.getElementById("campo1").value.trim();
    const nTarjeta = document.getElementById("campo2").value.trim();
    const correo = document.getElementById("campo4").value.trim();
    const direccion = document.getElementById("campo5").value.trim();
    const ciudad = document.getElementById("campo6").value.trim();
  
    if (!nombre || !nTarjeta || !correo || !direccion || !ciudad) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos del formulario.',
      });
      return;
    }
  
    // Mostrar spinner
    new bootstrap.Modal(document.getElementById('spinnerModal')).show();
  
    setTimeout(function () {
      bootstrap.Modal.getInstance(document.getElementById('spinnerModal')).hide();
  
      // Verificar si el número de tarjeta es "1111111111"
      if (nTarjeta === '1111111111') {
        // Insertar la reserva con estado "pendiente"
        const fechaReserva = new Date().toISOString().slice(0, 10);
        const estadoReserva = 'pendiente';
  
        // Realizar la inserción en la base de datos para estado pendiente
        fetch('/guardar_reserva', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            cliente_id: clienteId,
            paquete_id: paqueteId,
            fecha_reserva: fechaReserva,
            total: totalConImpuesto,
            estado: estadoReserva,
            num_personas: numPersonas
          })
        })
        .then(response => response.json())
        .then(data => {
          console.log('Reserva pendiente guardada:', data);
        })
        .catch(error => {
          console.error('Error al guardar la reserva:', error);
        });
  
        // Mostrar mensaje de pago no exitoso
        Swal.fire({
          icon: 'error',
          title: 'Pago no exitoso',
          text: 'El número de tarjeta ingresado no es válido. verificalo e intenta nuevamente',
          confirmButtonText: 'OK'
        });
      } else {
        // Si la tarjeta es válida, procesamos el pago y lo marcamos como "aprobado"
        Swal.fire({
          icon: 'success',
          title: 'Pago exitoso',
          text: 'Su pago ha sido procesado exitosamente.',
          confirmButtonText: 'OK'
        }).then(() => {
          // Mostrar voucher
          document.getElementById("voucherNombre").textContent = nombre;
          document.getElementById("voucherCorreo").textContent = correo;
          document.getElementById("voucherDireccion").textContent = direccion;
          document.getElementById("voucherCiudad").textContent = ciudad;
          document.getElementById("voucherPaquete").textContent = paquete.descripcion;
          document.getElementById("voucherMonto").textContent = `$${totalConImpuesto.toLocaleString()}`;
          document.getElementById("voucherFecha").textContent = new Date().toLocaleString();
  
          new bootstrap.Modal(document.getElementById('modalVoucher')).show();
  
          const fechaReserva = new Date().toISOString().slice(0, 10);
          const estadoReserva = 'pagado'; // Cambiar estado a aprobado
  
          fetch('/guardar_reserva', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              cliente_id: clienteId,
              paquete_id: paqueteId,
              fecha_reserva: fechaReserva,
              total: totalConImpuesto,
              estado: estadoReserva,
              num_personas: numPersonas
            })
          })
          .then(response => response.json())
          .then(data => {
            console.log('Reserva aprobada guardada:', data);
          })
          .catch(error => {
            console.error('Error al guardar la reserva:', error);
          });
  
          // Limpiar localStorage
          localStorage.removeItem('paquete');
          localStorage.removeItem('numPersonas');
          localStorage.removeItem('voucher');
        });
      }
    }, 4000); // Tiempo de espera para simular la respuesta del pago
  });
  
  
  

  // Redirigir al home al cerrar modal del voucher
  const modalVoucher = document.getElementById('modalVoucher');
  modalVoucher.addEventListener('hidden.bs.modal', function () {
    window.location.href = '/home';
  });
});

// Cerrar sesión limpiando todo
function cerrarSesion(event) {
  event.preventDefault();

  localStorage.clear();
  sessionStorage.clear();

  document.cookie.split(";").forEach(function (c) {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });

  fetch('/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
    .then(response => {
      if (response.ok) {
        window.location.href = '/';
      } else {
        console.error('Error al cerrar sesión');
      }
    })
    .catch(error => console.error('Error al cerrar sesión:', error));

  setTimeout(() => {
    window.history.replaceState(null, '', window.location.href);
    window.location.href = '/';
  }, 100);
}
