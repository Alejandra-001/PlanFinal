  const form = document.getElementById('formRegistro');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (form.checkValidity()) {
      Swal.fire({
        icon: 'success',
        title: '¡ Usuario registrado !',
        text: '✅ Usuario Creado con exito',
        confirmButtonColor: '#3085d6'
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: '⚠️ Por favor completa todos los campos requeridos',
        confirmButtonColor: '#d33'
      });
    }
  });