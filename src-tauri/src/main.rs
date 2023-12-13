#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::path::PathBuf;
use image::{ GenericImageView};
use std::fs;
use open::that;


use tauri::{CustomMenuItem, Menu, Submenu};

fn menuapp() -> Menu {
    return Menu::new().add_submenu(Submenu::new(
        "Tauri",
        Menu::new().add_item(CustomMenuItem::new("univo", "About")),
    ));
}

#[tauri::command]
fn get_image_dimensions(imagebuffer: Vec<u8>) -> Result<(u32, u32), String> {
  
    let image = image::load_from_memory(&imagebuffer).map_err(|e| e.to_string())?;
    let dimensions = image.dimensions();
    Ok(dimensions)
}



#[tauri::command]
fn image_resize(img_path: String, height: u32, width: u32, dest: String, nameimage: String) -> Result<(), String> {
    println!("Redimensionando imagen...");
    println!("img_path: {}", img_path);
    println!("height: {}", height);
    println!("width: {}", width);
    println!("dest: {}", dest);
    println!("nameimage: {}", nameimage);

    let img = match image::open(&img_path) {
        Ok(img) => img,
        Err(_) => return Err("Error al abrir la imagen existente".to_string()),
    };

    let resized_img = img.resize_exact(width, height, image::imageops::FilterType::Triangle);

    if let Err(_) = fs::create_dir_all(&dest) {
        return Err("Error al crear la carpeta de destino".to_string());
    }

    let dest_path = format!("{}/{}", dest, nameimage);
    
    match resized_img.save(&dest_path) {
        Ok(_) => {
            println!("Imagen redimensionada y guardada con éxito en: {}", dest_path);
            
            if let Err(err) = that(dest) {
                eprintln!("Error al abrir el directorio: {:?}", err);
            }
            
            Ok(())
        }
        Err(err) => {
            eprintln!("Error al guardar la nueva imagen: {:?}", err);
            Err("Error al guardar la nueva imagen".to_string())
        }
    }
}




#[tauri::command]
fn get_file_path(fne: String) -> Result<String, String> {
    let current_dir = std::env::current_dir()
        .map_err(|_| "Error al obtener el directorio de trabajo".to_string())?;

    let full_path = current_dir.join(&fne);

    if fs::metadata(&full_path).is_ok() {
        let canonical_path = full_path.canonicalize()
            .map_err(|err| {
                eprintln!("Error al obtener la ruta canónica del archivo: {:?}", err);
                "Error al obtener la ruta canónica del archivo".to_string()
            })?;

        Ok(canonical_path.to_string_lossy().to_string())
    } else {
        Err("El archivo no existe en la ruta especificada".to_string())
    }
}



#[tauri::command]
fn oshomedir() -> Result<String, String> {
    
    let homedir = dirs::home_dir();
    match homedir {
        Some(path) => Ok(path.to_str().unwrap().to_string()),
        None => Err("Error al obtener el directorio principal".to_string()),
    }
}
#[tauri::command]
fn get_output_path(oshomedir: String) -> Result<String, String> {
    let homedir = PathBuf::from(oshomedir);
    let output_path = homedir.join("imagen_univo");
    
    Ok(output_path.to_str().unwrap().to_string())
}




#[tauri::command]
fn main() {
    tauri::Builder::default()  .menu(menuapp())
    
        .invoke_handler(tauri::generate_handler![
            oshomedir,
            get_output_path,
            image_resize,
            get_file_path,
            get_image_dimensions
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}