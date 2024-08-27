import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { userConfig } from '../js/config';


import Swal from 'sweetalert2';
import { 
  Popup,
  Page, 
  Block, 
  Button, 
  List, 
  ListInput, 
  Icon
} from 'framework7-react';

import '../css/custom-styles.css'



/**
* @module CodeValidationPopup
*/
/**
* FilePicker Component
* @param {boolean} props.showPopup - Indica si el PopUp está visible.
* @param {function} props.closePopup - Función para cerrar el PopUp.
* @param {String} props.user -Nombre de ususario.
* @param {function} props.closeRegisterPopup -Funcion para cerrar el registro.
*
* Este componente renderiza y da funcionalidad a la parte encargada de elegir recortar y mandar a analizar las imagenes.
*
* @returns {JSX.Element} 
*/

const CodeValidationPopup = ({ showPopup, closePopup, user, closeRegisterPopup}) => {
  /**
  * Formulario de validación.
  * @const {Object} formData 
  */
  const [formData, setFormData] = useState({
    username: '',
    code: '',
  });
  /**
  * Efecto que a la carga del usuario actualiza el formulario.
  *
  * @method
  * @memberof module:CodeValidationPopup
  * @name useEffect
  */
  useEffect(() => {
    setFormData({ ...formData, username: user })
  }, [user]);


  /**
  * Pide la validación del usuario a la API.
  *
  * @async
  * @method
  * @param {Object} formData
  * @returns {boolean} 
  * @throws {Error} - Si ocurre un error durante la solicitud.
  * @memberof module:CodeValidationPopup
  * @name handleCodeSubmit
  */ 
  const handleCodeSubmit = () => {

    setFormData({ ...formData, username: user })

    console.log('Formulario enviado:', formData);

    axios.post(`http://${userConfig.serverIP}:${userConfig.serverPort}/validate`, { form: formData })
      .then((response) => {

        Swal.fire({
          icon: "success",
          title: "Tu cuenta ha sido validada "+formData.username,
          showConfirmButton: false,
          timer: 1500
        });

        closePopup()
        closeRegisterPopup()

        
      })
      .catch((error) => {
        console.error(error.message);
        try{
          console.error(error.response.data.error)
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.error,
            footer: '<a href="">Why do I have this issue?</a>'
          })
          closePopup()
          closeRegisterPopup()
        }catch{
          console.error(error.message)
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message,
            footer: '<a href="">Why do I have this issue?</a>'
          })
          closePopup()
          closeRegisterPopup()
        }
      });
  };

  return (
    <Popup tabletFullscreen opened={showPopup} onClose={closePopup} style={{
                                                            position: 'fixed',
                                                            top: '50%',    //ESTABLECE EL POPUP EN LA MITAD DEL CONTENEDOR(PANTALLA)
                                                            left: '50%',
                                                            //marginTop: '-35%', //SE DESPLACA HACIA ARRIBA 35% DEL CONTENEDRO(PANTALLA)
                                                            //marginLeft: '-35%',
                                                            marginTop: '-155px', // Mitad de la altura del Popup
                                                            marginLeft: '-35%',  // Mitad del ancho del Popup
                                                            //transform: 'translate(-50%, -50%)',
                                                            maxWidth: '70%',
                                                            maxHeight: '315px',
                                                            border: '2px solid #006689',
                                                            borderTop: '0',
                                                            borderRadius: '30px',
                                                          }}>
      <Page>

        <div className="navbar" style={{background: '#006689', color: '#ffffff', textAlign: 'center', fontSize: '170%', lineHeight: '250%'}}>
          Validar la cuenta
        </div>

        <Block style={{ margin: '0% 2%',}}>
          <p style={{margin: '2%', fontWeight: 'bold'}}>Introduzca el código que hemos enviado a su correo electrónico:</p>
        </Block>

        <List strongIos dividersIos insetIos form style={{ margin: '0% 2%',}} >

          <ListInput
                id="code"
                label="Código"
                type="text"
                placeholder="Enter code"
                info=""
                pattern="^\d{5}$"
                errorMessage="¡El código son 5 números!"
                required
                validate
                clearButton
                onInput={(e) => setFormData({ ...formData, code: e.target.value })}
              >
              <Icon ios="f7:person" md="material:person" slot='media'/>
          </ListInput>
        
          <Block>
            <Button fill onClick={handleCodeSubmit} >Validar Código</Button>
          </Block>
        </List>

      </Page>
    </Popup>
  );
};

export default CodeValidationPopup;