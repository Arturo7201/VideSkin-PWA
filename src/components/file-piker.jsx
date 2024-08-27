import React, { useEffect, useState }  from 'react';

import { useFilePicker } from 'use-file-picker';
import PopUpCropper from '../components/popup-recortar.jsx';
import Swal from 'sweetalert2';

import { MdCameraAlt } from "react-icons/md";


import {
  f7,
  Button
} from 'framework7-react';

/**
* @module FilePicker
*/
/**
* FilePicker Component
* @param {String} imagen -Imagen que va a ser elegida del dispositivo.
* @param {function} setImagen -Funcion para setear la imagen.
* @param {function} setFileSelected -Funcion para setear la variable de control de eleccion de archivo.
* @param {function} handleAnalizar -Funcion para activar y proceder con el analisis.
*
* Este componente renderiza y da funcionalidad a la parte encargada de elegir recortar y mandar a analizar las imagenes.
*
* @returns {JSX.Element} 
*/

const FilePicker = ({imagen, setImagen, fileSelected, setFileSelected, handleAnalizar}) => {
  
  //#region DECLARACION FILE PICKER ------------------------------------------------------------------------

 /**
 * Declaracion del componente selector de archivos.
 *
 * @method
 * @param {Object} openFilePicker - Función para abrir el selector de archivos.
 * @param {Array<Object>} filesContent - Contenido de los archivos seleccionados.
 * @param {boolean} loading - Estado de carga mientras se seleccionan los archivos.
 * @param {Array<Object>} errors - Errores encontrados durante la selección de archivos.
 * @returns {{openFilePicker: function, filesContent: Array<Object>, loading: boolean, errors: Array<Object>}} - Retorna los parámetros de la selección de archivos.
 * @memberof module:FilePicker
 * @name useFilePicker
 */
  const { openFilePicker, filesContent, loading, errors } = useFilePicker({
    readAs: 'DataURL',
    accept: 'image/*',
    multiple: true,
    limitFilesConfig: { max: 1 },
    // minFileSize: 0.1, // in megabytes
    maxFileSize: 20,
    imageSizeRestrictions: {
      maxWidth: 5000,
      minWidth: 768,
      maxHeight: 5000, // in pixels
      minHeight: 600,
    },

  });

  if (errors.length) {
    console.log(errors)
    for (const error in errors){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.name,
      })  
    }
  }

  /**
  * Efecto que se activa cada vez que cambia FilesContent,
  * es decir cada vez que el usuario elige un archivo nuevo.
  * Se guarda como Imagen el archivo elegido para renderizarlo.
  *
  * @method
  * @param {Array<Object>} filesContent - Contenido de los archivos seleccionados.
  * @returns {Image} - Imagen elegida.
  * @memberof module:FilePicker
  * @name useEffect
  */
  useEffect(() => {    
    if (filesContent && filesContent.length > 0) {
      //console.log(filesContent[0].content)
      setImagen(filesContent[0].content)
      setFileSelected(true)
      setImagenRecortada(false)
    }
  },[filesContent])
  //#endregion

  //#region DECLARACION POP-UP CENTRAR ------------------------------------------------------------------------
  /**
  * Variable de control del popup de centrado.
  * @const {boolean} popUpCentrar 
  */
  const [popUpCentrar, setPopUpCentrar] = useState(false)
  /**
  * Variable de control de la imagen recortada.
  * @const {boolean} imagenRecortada 
  */
  const [imagenRecortada, setImagenRecortada] = useState(false)

  /**
  * Alerta para centrar imagen.
  *
  * @method
  * @memberof module:FilePicker
  * @name alertRecorte
  */
  const alertRecorte = () => {
    f7.dialog.alert('Por favor, centre la imagen antes de analizar.');
  };
  /**
  * Manejadora para abrir recortar imagen.
  *
  * @method
  * @memberof module:FilePicker
  * @name handleCentrar
  */
  const handleCentrar = () => {
    setPopUpCentrar(true)
  }
  /**
  * Manejadora para cerrar recortar imagen.
  *
  * @method
  * @memberof module:FilePicker
  * @name closePopUpCentrar
  */
  const closePopUpCentrar = () => {
    setPopUpCentrar(false)
  }
  //#endregion

  //#region HANDLE ANALIZAR -----------------------------------------------------------------------------------
  /**
  * Manejadora para analizar imagen.
  *
  * @method
  * @memberof module:FilePicker
  * @name handleAnalizarClick
  */
  const handleAnalizarClick = () => {
    handleAnalizar()
  };

  //#endregion
  
  //#region RETURN CODE ---------------------------------------------------------------------------------------
  return (
    <div>
     
     {!fileSelected && (
        <Button fill onClick={openFilePicker} color="teal" style={{ fontSize: '20px', margin: '5% 0' }}>
          <MdCameraAlt style={{ margin: '0 5px', fontSize: '20px' }} />
          Seleccionar Imagen
        </Button>
      )}

      {fileSelected && (
        <div style={{display: 'grid', gridTemplateColumns: '35% 65%', alignItems: 'center'}}>
          <img src={imagen}  style={{ borderRadius: '8px', width: "100%", height: '180px', objectFit:'cover', border: '2px solid teal' }}/>
          <div style={{width: '95%', margin:'0 5%'}}> 
            <Button fill onClick={openFilePicker} color="teal" >Cambiar Imagen</Button>
            <Button fill onClick={handleCentrar}  color="teal" style={{margin:'7% 0'}}>Centrar Imagen</Button>
            <Button fill
                    onClick={imagenRecortada ? handleAnalizarClick : alertRecorte} 
                    style={{backgroundColor: imagenRecortada ? "#006689" : "gray"}}
                    >Analizar</Button>  
          </div>
        </div>

      )}
      <PopUpCropper showPopup={popUpCentrar} closePopup={closePopUpCentrar} imagen={imagen} setImagen={setImagen} setRecortado={setImagenRecortada}/>
    </div>    
  );
  //#endregion
}
export default FilePicker