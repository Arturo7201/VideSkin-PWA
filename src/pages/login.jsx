import React, { useEffect, useState } from 'react';

import RegisterPage from '../components/popup-register'
import ValidationPage from '../components/validation-code';

import { MdArrowBack } from 'react-icons/md';

import axios from 'axios';
import { userConfig } from '../js/config';

import Swal from 'sweetalert2';

import {
  f7,
  Page,
  LoginScreen,
  LoginScreenTitle,
  View,
  List,
  ListInput,
  Icon,
  BlockFooter,
  ListItem,
  Button,
  Checkbox,
  Navbar,
  Block,
  Popup
} from 'framework7-react';


import '../css/app.css';

/**
* @module Login
*/

/**
* Login Page
*
* Este componente representa la página inicio de sesión de la aplicación.
*
* @returns {JSX.Element} 
*/
const LogIn = () => {

  //#region --------------- RESPONSIVE RENDER ------------------------------------------------------------------------------------------------------------------------

  const [isMobile, setIsMobile] = useState(false);
  /**
  * Efecto que verifica si la pantalla es lo suficientemente estrecha
  * y ajusta el estado `isMobile` en consecuencia. También agrega un listener
  * para el evento `resize` que vuelve a verificar el tamaño de la pantalla
  * cada vez que la ventana se redimensiona.
  *
  * @method
  * @returns {boolean} 
  * @memberof module:Login
  * @name useEffect
  */
  useEffect(() => { 

    const checkIfMobile = () => {
        setIsMobile(window.innerWidth <= 500); // Ajusta este valor 
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
        window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  //#endregion
  
  /**
  * Formulario de inicio de sesión.
  * @const {string} formData 
  */
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  

  const [showPopupVal, setShowPopupVal] = useState(false);
  /**
  * Manejadora para cerrar el popup de validación.
  *
  * @method
  * @memberof module:Login
  * @name closePopupVal
  */ 
  const closePopupVal = () => {
    setShowPopupVal(false)
  }

  const [showPopupReg, setShowPopupReg] = useState(false);
  /**
  * Manejadora para cerrar el popup de registro.
  *
  * @method
  * @memberof module:Login
  * @name closePopupVal
  */ 
  const closePopupReg = () => {
    // Cerrar el popup
    setShowPopupReg(false);
  };

  /**
  * Petición de inicio de sesión a la API.
  *
  * @async
  * @method
  * @returns {String} 
  * @throws {Error} - Si ocurre un error durante la solicitud de autenticación.
  * @memberof module:Login
  */ 
  const handleLogin = () => {

    axios.post(`http://${userConfig.serverIP}:${userConfig.serverPort}/login`, { form: formData })
      .then((response) => {

        localStorage.removeItem('token');
        sessionStorage.removeItem('token')

        //localStorage.setItem('token', response.data.access_token);
        if (isChecked) {
          localStorage.setItem('token', response.data.access_token);
        } else {
          sessionStorage.setItem('token', response.data.access_token);
        }

        window.location.reload()
      })
      .catch((error) => {
        //console.error('Error al enviar los datos:', error);
        //console.error(error.message);
        console.error(error.message);
        try{
          if (error.response && error.response.status === 403) {
            // Si el error es 403, mostrar un popup con un mensaje de error
            setShowPopupVal(true)
          }else{
            console.error(error.response.data.error)
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error.response.data.error,
            })
          }
        }catch{
          console.error(error.message)
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message,
          })
        }
      });
  }
  
  /**
  * Manejadora para abrir el popup de registro.
  *
  * @method
  * @memberof module:Login
  * @name handleSignUp
  */ 
  const handleSignUp = () => {
    setShowPopupReg(true)
  };

  const [isChecked, setIsChecked] = useState(false)
  //MANEJADORA REMEMBER ME
  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked)
  };

  //#region ---- FORGOT PASSWORD -----------------------------------------------------------------------------------------------------------------------------------------------

  //POPUP --------------------------------------------------------------------
 
  const [popUpForgotPassword, setPopUpForgotPassword] = useState(false)
  /**
  * Manejadora para cerrar el popup de recuperación.
  *
  * @method
  * @memberof module:Login
  * @name closePopUpForgotPassword
  */ 
  const closePopUpForgotPassword = () => {
    setPopUpForgotPassword(false)
  }
  /**
  * Manejadora para abrir el popup de recuperación.
  *
  * @method
  * @memberof module:Login
  * @name handleForgotPassword
  */ 
  const handleForgotPassword = () => {
    setPopUpForgotPassword(true)
  };

  /**
  * Formulario de recuperacion de contraseña.
  * @const {Object} userData 
  */
  const [userData, setUserData] = useState({
    user: '',
    code: '',
    password: '',
    password2: ''
  });

  //ENVIAR CODIGO ------------------------------------------------------------

  const handleCodigo = () => {
    if(userData.user === ''){
      Swal.fire({
        icon: 'error',
        text: 'Introduce el nombre de usuario'
      })
    }else {
      enviarCodigo()
    }
  }
  /**
  * Petición a la API para enviar el código al usuario.
  *
  * @async
  * @method
  * @param {Object} userData
  * @throws {Error} - Si ocurre un error durante la solicitud de autenticación.
  * @memberof module:Login
  */ 
  async function enviarCodigo() {
    try {
      const response = await axios.post(`http://${userConfig.serverIP}:${userConfig.serverPort}/enviarCodigo`, {user: userData.user});

      Swal.fire({
        icon: 'success',
        text: response.data.mesage
      })
      
    }catch (error) {
      try{

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.response.data.error
        })
      
      }catch{
        console.error(error)
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error
        })
      }
    }
  }

  //CAMBIAR CONTRASEÑA -----------------------------------------------------------------
  const [isValidPassword, setIsValidPassword] = useState(true);
  const handlePasswordConfirmation = (e) => {
    const inputValue = e.target.value;

    if (userData.password === inputValue) {
      setIsValidPassword(true);

    } else {
      setIsValidPassword(false)
    }

  };

  const handleCambiarContraseña = () => {
    if(userData.user === '' || userData.code === '' || userData.password === ''){
      Swal.fire({
        icon: 'error',
        text: 'Faltan datos'
      })
    }else{
      cambiarContraseña()
    }
  }
  /**
  * Petición a la API para cambiar la contraseña con el codigo del usuario.
  *
  * @async
  * @method
  * @param {Object} userData
  * @throws {Error} - Si ocurre un error durante la solicitud de autenticación.
  * @memberof module:Login
  */ 
  async function cambiarContraseña() {
    try {
      const response = await axios.post(`http://${userConfig.serverIP}:${userConfig.serverPort}/forgotPasswd`, {user: userData.user, code: userData.code, password: userData.password});

      Swal.fire({
        icon: 'success',
        text: response.data.mesage
      })
      closePopUpForgotPassword()
      
    }catch (error) {
      try{

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.response.data.error
        })
      
      }catch{
        console.error(error)
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error
        })
      }
    }
  }

  //#endregion


  return(

    <Page loginScreen>
      <Navbar backLink="Back" class='navbar-custom1'/>

          <LoginScreenTitle style={{marginTop: '-70px'}}>Login</LoginScreenTitle>
          <List form>
            <ListInput
              type="text"
              name="username"
              placeholder="Your username"
              required
              value={formData.username || ''} 
              onInput={(e) => setFormData({ ...formData, username: e.target.value })}
            ></ListInput>
            <ListInput
              type="password"
              name="password"
              placeholder="Your password"
              required
              value={formData.password || ''}
              onInput={(e) => setFormData({ ...formData, password: e.target.value })}
            ></ListInput>
          </List>
          <List>
            <Block strongIos outlineIos className="grid grid-cols-2 grid-gap">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <p style={{ marginLeft: '10px', marginTop: '-2px'}} ><Checkbox name="my-checkbox" onChange={handleCheckboxChange}/> Keep me signed in</p> 
              </div>
              <Button title="ForgotPassword" onClick={handleForgotPassword} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '-10px'}}>Forgot Password?</Button>
            </Block>

            <Block strongIos outlineIos>
              <Button fill title="Sign In" onClick={() => handleLogin()} style={{ marginTop: '-20px', borderBottom: '1px solid #ccc', fontSize: '20px'}}>Sign In</Button>
              <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <hr style={{ flex: '1', borderTop: '1px solid #ccc' }} />
                <span style={{ padding: '10px' }}>or</span>
                <hr style={{ flex: '1', borderTop: '1px solid #ccc' }} />
              </div>
            </Block>
            
            <BlockFooter>
              <p>Don't have an account? <a onClick={handleSignUp}>Sign Up</a></p>
            </BlockFooter>
          </List>

  
      <RegisterPage showPopup={showPopupReg} closePopup={closePopupReg} id="reg-popup"/>

      <ValidationPage showPopup={showPopupVal} closePopup={closePopupVal} id="val-popup" user={formData.username} closeRegisterPopup={closePopupReg}/>

      <Popup opened={popUpForgotPassword} onClose={closePopUpForgotPassword} id="forgot-popup">
        <div className='page'>
          <div className="navbar" style={{display: 'grid', gridTemplateColumns: '15% 1fr', background: 'teal', color: '#ffffff', textAlign: 'center', alignItems: 'center',  fontSize: '170%', lineHeight: '250%'}}>
            <Button onClick={closePopUpForgotPassword} ><MdArrowBack style={{ fontSize: '24px', color: 'white'}}/></Button>
            <span style={{ marginLeft: '0%', marginRight: '15%', textAlign: 'center'}}>Recuperar Contraseña</span>
          </div>

          <div className='page-content' style={{padding: '5%'}}>


            <div class="cardS-orange" style={{ margin: '60px 3% 0px 3%', marginTop: '60px'}}>
                <h6 class="header-orange">Introduce tu correo eléctronico</h6>
                <p class="body-orange">Te enviaremos un código para que puedas cambiar tu contraseña.</p>
            </div>

            <List>
              <ListInput
                id="user"
                label="Username"
                type="text"
                name="user"
                placeholder="Nombre de Usuario"

                value={userData.user}
                clearButton
                onInput={(e) => setUserData({ ...userData, user: e.target.value })}
              />
              <Button fill onClick={handleCodigo} style={{width: '95%', margin: '5px auto'}}>Enviar Código</Button>
            </List>

            { isMobile ? (
              <List style={{marginBottom: '0px'}}>
              
                <ListInput
                  label="Código"
                  type="text"
                  placeholder="Código"
                  info=""
                  
                  value={userData.code}
                  clearButton
                  onInput={(e) => setUserData({ ...userData, code: e.target.value })}
                  >
                  <Icon material="password" slot='media'/>
                </ListInput>
            
                <ListInput
                  label="Contraseña"
                  type="password"
                  placeholder="Contraseña"
                  info=""
                  pattern="^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$"
                  errorMessage="¡Entre 8 y 16 caracteres, dígitos, minúsculas y mayúsculas!"
                  
                  validate
                  value={userData.password}
                  clearButton
                  onInput={(e) => setUserData({ ...userData, password: e.target.value })}
                  >
                  <Icon material="password" slot='media'/>
                </ListInput>
          
                <ListInput
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
            ):(
              <List style={{marginBottom: '0px'}}>
              
                <ListInput
                  label="Código"
                  type="text"
                  placeholder="Código"
                  info=""

                  
                  value={userData.code}
                  clearButton
                  onInput={(e) => setUserData({ ...userData, code: e.target.value })}
                  >
                  <Icon material="password" slot='media'/>
                </ListInput>

                <div style={{display: 'grid', gridTemplateColumns: '50% 50%'}}>
                  <List style={{marginTop: '0px'}}>
                    <ListInput
                      label="Contraseña"
                      type="password"
                      placeholder="Contraseña"
                      info=""
                      pattern="^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$"
                      errorMessage="¡Entre 8 y 16 caracteres, dígitos, minúsculas y mayúsculas!"
                      
                      validate
                      value={userData.password}
                      clearButton
                      onInput={(e) => setUserData({ ...userData, password: e.target.value })}
                      >
                      <Icon material="password" slot='media'/>
                    </ListInput>
                  </List>
                  <List style={{marginTop: '0px'}}>
                    <ListInput
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
                </div>
                <button  onClick={handleCambiarContraseña}  class="butonS2">Cambiar Contraseña</button>                      
              </List>
            )}

              

          </div>
        </div>
      </Popup>

    </Page> 

  );
}
export default LogIn;