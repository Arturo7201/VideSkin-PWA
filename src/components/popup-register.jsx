import React, { useState, useEffect } from 'react';

import ValidationPage from '../components/validation-code';

import axios from 'axios';
import { userConfig } from '../js/config';


import Swal from 'sweetalert2';


import { 
  Page,
  Navbar,
  List,
  ListInput,
  Block,
  BlockTitle,
  Button,
  Icon,
  Popup,
  Link
} from 'framework7-react';

/**
* @module PopUpRegistrarse
*/

/**
* PopUp Registrarse
*
* Este componente representa el PopUp para ampliar los resultados de una lesión.
* @component
* @param {boolean} props.showPopup - Indica si el PopUp está visible.
* @param {function} props.closePopup - Función para cerrar el PopUp.
* @returns {JSX.Element} 
*/


const RegisterPage = ({ showPopup, closePopup}) => {
  /**
  * Formulario de registro.
  * @const {Object} formData 
  */
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    username: '',
    email: '',
    password: '',
    password2: '',
  });
  /**
  * Control de formulario de registro completo.
  * @const {boolean} isFormComplete 
  */
  const [isFormComplete, setIsFormComplete] = useState(false);
  /**
  * Control de password valida.
  * @const {boolean} isValidPassword 
  */
  const [isValidPassword, setIsValidPassword] = useState(true);
  /**
  * Control de renderizado de popup de validacion.
  * @const {boolean} showPopupVal 
  */
  const [showPopupVal, setShowPopupVal] = useState(false);
  const closePopupVal = () => {
    // Cerrar el popup
    setShowPopupVal(false);
  };

  /**
  * Efecto que las contraseñas son iguales y los campos estan completos.
  *
  * @method
  * @memberof module:PopUpRegistrarse
  * @param {Object} formData
  * @name useEffect
  */
  useEffect(() => {
    const isComplete = Object.values(formData).every(value => value !== '');
    if(formData.password === formData.password2){
      setIsFormComplete(isComplete);
    }
  }, [formData]);

  
  /**
  * Manejadora que establece contraseña valida cuando estas son iguales.
  *
  * @method
  * @memberof module:PopUpRegistrarse
  * @name handlePasswordConfirmation
  */
  const handlePasswordConfirmation = (e) => {
    const inputValue = e.target.value;

    if (formData.password === inputValue) {
      setIsValidPassword(true);
      setFormData({ ...formData, password2: inputValue });

    } else {
      setIsValidPassword(false)
      setIsFormComplete(false)
    }

  };

  /**
  * Pide registrar usuario a la API.
  *
  * @async
  * @method
  * @param {Object} formData
  * @returns {boolean} 
  * @throws {Error} - Si ocurre un error durante la solicitud.
  * @memberof module:PopUpRegistrarse
  * @name handleSubmit
  */ 
  const handleSubmit = () => {
    
    console.log('Formulario enviado:', formData);
  
    axios.post(`http://${userConfig.serverIP}:${userConfig.serverPort}/add`, { form: formData })

    .then((response) => {

      setShowPopupVal(true)

    })
    .catch((error) => {
      try{

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.response.data.error
        })
        
      }catch{

        console.error(error.message)
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message
        })

      }
    });
};

  return (
    <Popup className="popup-tablet-fullscreen" opened={showPopup} onClose={closePopup}>
      <Page name="reg" style={showPopupVal ? { filter: 'blur(5px)' } : {}}>
        <Navbar> 
          <Link onClick={closePopup} back iconIos="f7:arrow_left" iconMd="material:arrow_back"></Link>
          <span style={{ fontSize: '1.5rem' }}>Registro</span>  
        </Navbar> 
        
        <Block>
          
          <BlockTitle style={{marginLeft: '1.2rem', fontWeight: 'bold', color: '#336699'}}>Por favor, complete el formulario de registro:</BlockTitle>  
        

          <List strongIos dividersIos insetIos form >

            <ListInput
              id="nombre"
              label="Nombre"
              type="text"
              placeholder="Enter name"
              info=""
              pattern="^[A-Za-záéíóúÁÉÍÓÚñÑ\- ']+$"
              errorMessage="¡Solo se permiten letras, espacios, apóstrofes y guiones!"
              required
              validate
              value={formData.name}
              clearButton
              onInput={(e) => setFormData({ ...formData, name: e.target.value })}
              >
              <Icon ios="f7:person" md="material:person" slot='media'/>
            </ListInput>
  
            <ListInput
              id="apellido"
              label="Apellido"
              type="text"
              placeholder="Enter surname"
              info=""
              pattern="^[A-Za-záéíóúÁÉÍÓÚñÑ\- ']+$"
              errorMessage="¡Solo se permiten letras, espacios, apóstrofes y guiones!"
              required
              validate
              value={formData.surname}
              clearButton
              onInput={(e) => setFormData({ ...formData, surname: e.target.value })}
              >
              <Icon ios="f7:person" md="material:person" slot='media'/>
            </ListInput>
 
            <ListInput
              id="username"
              label="Nombre de usuario"
              type="text"
              placeholder="Nombre de usuario"
              info=""
              pattern="^[A-Za-záéíóúÁÉÍÓÚñÑ0-9_.]+$"
              errorMessage="¡Solo se permiten letras, números, puntos y guiones bajos!"
              required
              validate
              value={formData.username}
              clearButton
              onInput={(e) => setFormData({ ...formData, username: e.target.value })}
              >
              <Icon material="badge" slot='media'/>
            </ListInput>
  
            <ListInput
              id="apellido"
              label="Correo electrónico"
              type="email"
              placeholder="Correo electrónico"
              info=""
              required
              validate
              value={formData.email}
              clearButton
              onInput={(e) => setFormData({ ...formData, email: e.target.value })}
              >
              <Icon material="alternate_email" slot='media'/>
            </ListInput>

            <ListInput
              id="contraseña"
              label="Contraseña"
              type="password"
              placeholder="Contraseña"
              info=""
              pattern="^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$"
              errorMessage="¡Entre 8 y 16 caracteres, dígitos, minúsculas y mayúsculas!"
              required
              validate
              value={formData.password}
              clearButton
              onInput={(e) => setFormData({ ...formData, password: e.target.value })}
              >
              <Icon material="password" slot='media'/>
            </ListInput>

            <ListInput
              id="confirmeContraseña"
              label="Confirme Contraseña"
              type="password"
              placeholder="Repeat password"
              info=""
              errorMessage="¡Las contraseñas son distitas!"
              errorMessageForce={!isValidPassword}
              clearButton
              onInput={handlePasswordConfirmation}
              >
              <Icon material="password" slot='media'/>
            </ListInput>
            

            <Block>
              <Button fill disabled={!isFormComplete} onClick={handleSubmit}>Registrarse</Button>
            </Block>


            </List>

        </Block>
      </Page>
      <ValidationPage showPopup={showPopupVal} closePopup={closePopupVal} id="val-popup" user={formData.username} closeRegisterPopup={closePopup  }/>
    </Popup>
  );
};

export default RegisterPage;