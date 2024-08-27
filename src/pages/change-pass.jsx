import React, { useState} from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';

import axios from 'axios';
import { userConfig } from '../js/config';

import {
  List,
  ListInput,
  Icon
} from 'framework7-react';

/**
* @module ChangePasswd
*/

/**
* ChangePasswd Page
*
* Este componente representa la página para cambiar la contraseña del usuario.
*
* @returns {JSX.Element} 
*/
export function CahngePasswd  ()  {
  /**
  * Token de autenticación.
  * @const {string} token 
  */
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
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

  //------------------------------ CHECK BOX -------------------------------------------------------------------------------------------------------------------------
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

 //------------------------------ VARIABLES CONTRASEÑA -------------------------------------------------------------------------------------------------------------------------
  /**
  * Formulario de las contraseñas.
  * @const {string} userData 
  */ 
  const [userData, setUserData] = useState({
    password: '',
    password2: ''
  });
  
  //------------------------------ CONTRASEÑAS IGUALES -------------------------------------------------------------------------------------------------------------------------
  const [isValidPassword, setIsValidPassword] = useState(true);
  const handlePasswordConfirmation = (e) => {
    const inputValue = e.target.value;

    if (userData.password === inputValue) {
      setIsValidPassword(true);
      //setUserData({ ...userData, password2: inputValue });

    } else {
      setIsValidPassword(false)
    }

  };

  //------------------------------ CAMBIAR CONTRASEÑA -------------------------------------------------------------------------------------------------------------------------
  /**
  * Manejadora para comprobar la validez de la contraseña.
  *
  * @method
  * @param {String} password
  * @returns {boolean}
  * @memberof module:Galeria
  * @name isPasswordValidFormat
  */  
  const isPasswordValidFormat = (password) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;
    return regex.test(password);
  };

  /**
  * Manejadora para cambiar la contraseña.
  *
  * @method
  * @memberof module:Galeria
  * @name handleSubmit
  */ 
  const handleSubmit = () => {
    if (isChecked) {
      if(userData.password === userData.password2){
        if(isPasswordValidFormat(userData.password)){
          console.log(userData)
          cahngePasswd()
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Opss...',
            text: "Formato de contraseña invalido."
          })
        }
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Opss...',
          text: "Las contraseñas no coinciden."
        })
      }
    } else {
      Swal.fire({
        icon: 'info',
        text: "Confirme que desea cambiar la contraseña"
      })
    }
  }

  /**
  * Peticion de cambioo de contraseña a la API.
  *
  * @async
  * @method
  * @param {Object} userData
  * @throws {Error} - Si ocurre un error durante la solicitud de autenticación.
  * @memberof module:Galeria
  */   
  async function cahngePasswd() {
    try {
      const response = await axios.post(`http://${userConfig.serverIP}:${userConfig.serverPort}/changePassword`, userData, config );
      Swal.fire({
        icon: 'success',
        text: response.data.mensage
      })
      setUserData({
        password: '',
        password2: ''
      })
        
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
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.error
          })
        }
      }catch{
        console.error(error.message)
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message
        })
      }
    }
  }

  
return(

  <div >  





    <div class="cardS" >

        <h5 class="card-header">Cambiar contraseña</h5>
        <div class="card-bodyS" style={{paddingTop: '0px'}}>
            <div>
                <div class="cardS-orange">
                    <h6 class="header-orange">¿Estas seguro de que deseas cambiar la contraseña?</h6>
                    <p class="body-orange">Asegurate de guardar la nueva contraseña y confirma que deseas cambiarla.</p>
                </div>
            </div>
            <List>


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
                value={userData.password}
                clearButton
                onInput={(e) => setUserData({ ...userData, password: e.target.value })}
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
                value={userData.password2}
                onInput={(e) => {
                  setUserData({ ...userData, password2: e.target.value });
                  handlePasswordConfirmation(e);
                }}
                >
                <Icon material="password" slot='media'/>
              </ListInput>


            </List>
            <form id="formAccountDeactivation" onSubmit={(e) => e.preventDefault()}>
                <div class="fot-orange">
                    <input class="form-check-input" type="checkbox" name="accountActivation" id="accountActivation" checked={isChecked} onChange={handleCheckboxChange}/>
                    <label class="form-check-label" for="accountActivation">Confirmo que deseo cambiar la contraseña</label>
                </div>
                <button type="submit" onClick={handleSubmit} class="butonS2">Cambiar Contraseña</button>
            </form>
        </div>
    </div>


  </div>
  
);
}
export default CahngePasswd;

const Container =styled.div`

  max-width: 700px; /* Ancho máximo de 500px */
  height: auto;
  margin: auto;
`
