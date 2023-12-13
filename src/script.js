const invoke = window.__TAURI__.invoke
const path = window.__TAURI__.path
const fs = window.__TAURI__.fs;


const form = document.querySelector('#img-form');
const widthInput = document.querySelector('#width');
const heightInput = document.querySelector('#height');
const filename = document.querySelector('#filename');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
var fne;
var fileNamePath
var filePath
const fileInput = document.getElementById('fileInput');


async function cargarImagen(e) {

    console.log('Éxito');

    const oshomedir = await invoke('oshomedir');
    const outputPath = await invoke('get_output_path', { oshomedir });
    filePath = await window.__TAURI__.dialog.open({
        filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }],
        multiple: false,
    });
    fileNamePath = await path.basename(filePath);
    const fileContent = await fs.readBinaryFile(filePath);

    
    const imageBuffer = Array.from(new Uint8Array(fileContent));
    
    
    const dimensions = await invoke("get_image_dimensions", { imagebuffer: imageBuffer });
   
    console.log(dimensions[0])
    console.log(dimensions[1])
    form.style.display = 'block';
    filename.innerHTML = fileNamePath;
    widthInput.value=dimensions[0]
    heightInput.value=dimensions[1]


    const outputPathElement = document.getElementById('output-path');
    outputPathElement.innerHTML = outputPath;
    
}

function getImageSize(path, callback) {
    
    const img = new Image();

    
    img.onload = function () {
       
        callback({
            width: img.width,
            height: img.height
        });
    };

    
    img.onerror = function () {
        
        callback({
            error: 'No se pudo cargar la imagen'
        });
    };

    
    img.src = path;
}

async function enviarImagen(e) {
    e.preventDefault();

    if (widthInput.value === '' || heightInput.value === '') {

        alertError("Por favor introduzca Ancho y Alto")


    } else {
        const oshomedir = await invoke('oshomedir');
        const outputPath = await invoke('get_output_path', { oshomedir });
        const nameImage = fileNamePath
        invoke('image_resize', {
            imgPath: filePath.replace(/\\/g, '/'),
            height: parseInt(heightInput.value, 10),
            width: parseInt(widthInput.value, 10),
            dest: outputPath.replace(/\\/g, '/'),
            nameimage: nameImage
        })
        alertSuccess(`Imagen redimensionada a ${widthInput.value} x ${heightInput.value}`)
        
        


    }

}



function esImagen(file) {
    const formatosAceptados = ['image/gif', 'image/jpeg', 'image/jpg', 'image/png'];
    return file && formatosAceptados.includes(file['type']);
}


document.addEventListener('tauri://event', (event) => {
    const eventData = event.detail;

    if (eventData.event === 'image:done') {
        alertSuccess(`Imagen redimensionada a ${heightInput.value} x ${widthInput.value}`);
    }
});

function alertSuccess(message) {
    Toastify({
        text: message,
        className: "info",
        position: "center",
        duration: 5000,
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",

        }
    }).showToast();
}

function alertError(message) {
    Toastify({
        text: message,
        position: "center",
        duration: 2000,
        style: {
            background: "red",

        }
    }).showToast();
}

img.addEventListener('click', cargarImagen);
form.addEventListener('submit', enviarImagen);


