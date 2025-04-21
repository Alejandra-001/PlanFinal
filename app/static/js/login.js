document.querySelector('form').addEventListener('submit', function(event) {
  event.preventDefault();

  const usuario = document.querySelector('input[name="usuario"]').value;
  const contrasena = document.querySelector('input[name="contrasena"]').value;

  fetch('http://127.0.0.1:5000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      usuario,
      contrasena
    })
  })
  .then(response => {
    if (response.status === 200) {
      return response.json(); // Convertir la respuesta JSON a objeto
    } else {
      throw new Error('Credenciales incorrectas');
    }
  })
  .then(data => {
    // Guardar datos del usuario (puedes usar localStorage o sessionStorage)
    localStorage.setItem('rol', data.rol);
    localStorage.setItem('id', data.id);

    // Redirigir al home
    window.location.href = '/home';
  })
  .catch(error => {
    const errorAlert = document.getElementById('error-alert');
    errorAlert.textContent = 'Usuario y/o contraseña incorrecta.';
    errorAlert.style.display = 'block';

    // Ocultar después de 4 segundos
    setTimeout(() => {
      errorAlert.style.display = 'none';
    }, 3000);

    console.error('Error:', error);
  });
});
