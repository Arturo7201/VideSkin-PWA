import React, { useState, useEffect } from 'react';

import PopUpCropper from '../components/popup-recortar.jsx';
import Swal from 'sweetalert2';

import { MdInsertPhoto } from "react-icons/md";



import axios from 'axios';
import { userConfig } from '../js/config';


import { 
  Input,
  Block,
  Button,
  Icon,
  f7
 } from 'framework7-react'; 



/**
* @module URLPicker
*/
/**
* URLPicker Component
*
* @param {String} imagen -Imagen que va a ser elegida del dispositivo.
* @param {function} setImagen -Funcion para setear la imagen.
* @param {String} fileSelected -Variable de control de eleccion de archivo.
* @param {function} setFileSelected -Funcion para setear la variable de control de eleccion de archivo.
* @param {function} handleAnalizar -Funcion para activar y proceder con el analisis.
*
* Este componente renderiza y da funcionalidad a la parte encargada de elegir a traves de URL, recortar y mandar a analizar las imagenes.
*
* @returns {JSX.Element} 
*/

const URLPicker = ({imagen, setImagen, fileSelected, setFileSelected, handleAnalizar}) => {
  
  /**
  * Formulario con la URL.
  * @const {String} urlValue 
  */
  const [urlValue, setUrlValue] = useState(''); 
  /**
  * Control de la validez de la URL.
  * @const {String} inputValid 
  */
  const [inputValid, setInputValid] = useState(false);

  /**
  * Función de devolución de llamada que se ejecutará cuando se valide la entrada.
  *
  * @method
  * @memberof module:URLPicker
  * @name handleCerrarUrl
  */ 
  const handleValidate = (isValid) => {
    setInputValid(isValid);
  };

  const alertValid = () => {
    f7.dialog.alert('Por favor, introduce una URL.');
  };
  
  //#region PROCESAR URL ------------------------------------------------------------------------
  /**
  * Manejadora para selecionar la URL del formulario.
  *
  * @method
  * @memberof module:URLPicker
  * @name handleSeleccionar
  */
  const handleSeleccionar = () => {

    if (urlValue) {

      if (typeof urlValue === 'string' && urlValue.startsWith('data:image/')) {
        setImagen(urlValue);
        setFileSelected(true);
        return
      }else{
        handleProcesarClick()
      }  

    } else {
      console.error('No se ha seleccionado ningún archivo.');
    }

  }

  const handleCancelar = () => {
    setImagen(null)
    setFileSelected(false)
  }

 
  /**
  * Token de autenticación.
  * @const {string} token 
  */
  const token = localStorage.getItem('token');
  /**
  * Configuración para las solicitudes HTTP que requieren autenticación.
  * @const {object} config
  * @property {object} headers - Cabeceras de la solicitud HTTP.
  * @property {string} headers.Authorization - Cabecera de autorización con el token.
  */ 
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };


  /**
  * Pide procesar la URL a la API.
  *
  * @async
  * @method
  * @param {String} url
  * @returns {String} 
  * @throws {Error} - Si ocurre un error durante la solicitud de autenticación.
  * @memberof module:URLPicker
  */ 
  const handleProcesarClick = async () => {
    
    console.log(urlValue);

    try {

      const response = await axios.post(`http://${userConfig.serverIP}:${userConfig.serverPort}/procesar_url`, { url: urlValue }, config)
      
      console.log(response.data);                                     //QUITAR
      setImagen(`data:image/png;base64, ${response.data.imagen}`)
      setFileSelected(true)
        
    } catch (error) {
      try{
        if (error.response.status == 401){
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "La sesión ha caducado"
          })
          window.location.reload();

        }else{
          if (error.response.data.error){
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error.response.data.error
            })
          }else{
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error.message
            })
          }
        }
      }catch{
        console.error(error)
      }

    }
  }

  /**
  * Manejadora del evento de cambio de la URL del formulario.
  *
  * @method
  * @param {Event} event
  * @returns {String}
  * @memberof module:URLPicker
  * @name handleUrlChange
  */
  const handleUrlChange = (event) => {
    setUrlValue(event.target.value); // Actualiza el estado con el valor ingresado por el usuario

  };
  //#endregion

  //#region DECLARACION POP-UP CENTRAR ------------------------------------------------------------------------
  /**
  * Control del popUp de recorte.
  * @const {boolean} popUpCentrar 
  */
  const [popUpCentrar, setPopUpCentrar] = useState(false)
  /**
  * Control para saber si la imagen ha sido recortada..
  * @const {boolean} imagenRecortada 
  */
  const [imagenRecortada, setImagenRecortada] = useState(false)

  useEffect(() => {    
    setImagenRecortada(false)
  },[fileSelected])

  const alertRecorte = () => {
    f7.dialog.alert('Por favor, centre la imagen antes de analizar.');
  };
  /**
  * Manejadora para abrir el popUp de recorte.
  *
  * @method
  * @memberof module:URLPicker
  * @name handleCentrar
  */
  const handleCentrar = () => {
    setPopUpCentrar(true)
  }
  /**
  * Manejadora para cerrar el popUp de recorte.
  *
  * @method
  * @memberof module:URLPicker
  * @name handleCentrar
  */
  const closePopUpCentrar = () => {
    setPopUpCentrar(false)
  }
  //#endregion



  return (
    <Block>
      <div className="grid grid-cols-2 grid-gap">
        <Input
            label="URL"
            type="url"
            placeholder="Your URL"
            info="Introduce una URL"
            required
            validate
            onValidate={handleValidate}
            clearButton
            onChange={handleUrlChange}
        >
            <Icon icon="demo-list-icon" slot="media" />
        </Input> 

        <Button fill onClick={inputValid ? handleSeleccionar : alertValid} color="teal" style={{ fontSize: '20px' }}>
          <MdInsertPhoto style={{ margin: '0 5px', fontSize: '20px' }} />
          Seleccionar
        </Button>    
        
        <br/>  
      </div>

      <div>
      {fileSelected && (
        <div style={{display: 'grid', gridTemplateColumns: '35% 65%', alignItems: 'center'}}>
          <img src={imagen}  style={{ borderRadius: '8px', width: "100%", height: '170px', objectFit:'cover', border: '2px solid teal' }}/>
          <div style={{width: '95%', margin:'0 5%'}}> 
            <Button fill  color="pink" onClick={handleCancelar} style={{margin:'0'}}>Cancelar</Button>
            <Button fill  color="teal" onClick={handleCentrar} style={{margin:'7% 0'}}>Centrar Imagen</Button>
            <Button fill
                    onClick={imagenRecortada ? handleAnalizar : alertRecorte} 
                    style={{backgroundColor: imagenRecortada ? "#006689" : "gray"}}
                    >Analizar</Button>  
          </div>
        </div>

      )}
      <PopUpCropper showPopup={popUpCentrar} closePopup={closePopUpCentrar} imagen={imagen} setImagen={setImagen} setRecortado={setImagenRecortada}/>
    </div>    


    </Block> 
  );
};
export default URLPicker;