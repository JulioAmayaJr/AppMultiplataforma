// main.js

const { tauri } = require('tauri/api/tauri');

// Seleccionar archivo listener
document.getElementById('img').addEventListener('change', cargarImagen);

// Formulario listener
document.getElementById('img-form').addEventListener('submit', enviarImagen);

function cargarImagen(e) {
    const file = e.target.files[0];

    if (!esImagen(file)) {
        alertError('Por favor seleccionar una imagen!');
        return;
    }

    console.log('Exito');

    // Obtener dimensiones
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = function () {
        document.getElementById('width').value = this.width;
        document.getElementById('height').value = this.height;
    }

    document.getElementById('img-form').style.display = 'block';
    document.getElementById('filename').innerHTML = file.name;
    document.getElementById('output-path').innerHTML = tauri.invoke('path.join', {
        args: [tauri.invoke('os.homedir'), 'imagen_univo'],
    });
}

function enviarImagen(e) {
    e.preventDefault();

    const imgPath = document.getElementById('img').files[0].path;
    const width = document.getElementById('width').value;
    const height = document.getElementById('height').value;

    tauri.invoke('image_resize', {
        imgPath,
        height,
        width,
        dest: tauri.invoke('path.join', {
            args: [tauri.invoke('os.homedir'), 'imagen_univo'],
        }),
    }).then(() => {
        alertSuccess(`Imagen redimensionada a ${height} x ${width}`);
    }).catch(err => {
        console.error(err);
        alertError('Error al redimensionar la imagen');
    });
}

function esImagen(file) {
    const formatosAceptados = ['image/gif', 'image/jpeg', 'image/jpg', 'image/png'];
    return file && formatosAceptados.includes(file['type']);
}

function alertSuccess(message) {
    tauri.invoke('Toastify.toast', {
        text: message,
        duration: 5000,
        close: false,
        style: {
            background: 'green',
            color: 'white',
            textAlign: 'center',
        },
    });
}

function alertError(message) {
    tauri.invoke('Toastify.toast', {
        text: message,
        duration: 5000,
        close: false,
        style: {
            background: 'red',
            color: 'white',
            textAlign: 'center',
        },
    });
}
