import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';

import axios from 'axios';
import { userConfig } from '../js/config';



/**
* @module PerfilPage
*/

/**
* PerfilPage Page
*
* Este componente representa la página del perfil de la aplicación.
*
* @returns {JSX.Element} 
*/

export function PerfilPage  ()  {
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

  //region --------- DATA PERFIL ------------------------------------------------------------------------------------------------------------
  const [fileImagen, setFileImagen] = useState(null)
  /**
  * Imagen de perfil.
  * @const {String} perfilImage 
  */
  const [perfilImage, setPerfilImage] = useState(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log(e)
    console.log(file)
    if (file) {
      setFileImagen(file);

      // Crear una URL de vista previa para la imagen seleccionada
      const reader = new FileReader();
      reader.onloadend = () => {
        setPerfilImage(reader.result.split(',')[1]);
      };
      reader.readAsDataURL(file);
      console.log(file)
      console.log(perfilImage)
    }
  };
  /**
  * Datos del perfil del usuario.
  * @const {String} perfilImage 
  */
  const [userData, setUserData] = useState({
    name: '',
    surname: '',
    email: '',
    username: ''
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  useEffect(() => {
    
    const fetchUserData = async () => {
      try {
        fetchPerfil()
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
    console.log(userData)
  }, []);

  /**
  * Peticion a la API de los datos del usuario.
  *
  * @async
  * @method
  * @returns {Promise<Object>} -Perfil del usuario
  * @throws {Error} - Si ocurre un error durante la solicitud de autenticación.
  * @memberof module:PerfilPage
  */   
 async function fetchPerfil() {
    try {
      const response = await axios.get(`http://${userConfig.serverIP}:${userConfig.serverPort}/userData`, config );
      setUserData({
        name: response.data.data.name,
        surname: response.data.data.surname,
        email: response.data.data.email,
        username: response.data.data.username
      });

      const response2 = await axios.post(`http://${userConfig.serverIP}:${userConfig.serverPort}/perfilImage`, {id: null}, config);
      setPerfilImage(response2.data.imagen);
        
    } catch (error) {
      console.log(error)
      try{
        if (error.response.status == 401){
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "La sesión ha caducado"
          })
          //window.location.reload();

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
  //region ---------- MOD PERFIL  -------------------------------------------------------------------------------------------------------------


  const handleMod = () => {
    console.log(userData)
    uploadInfo()

  }

  /**
  * Peticion a la API de modificación los datos del usuario.
  *
  * @async
  * @method
  * @param {Promise<Object>} userData -Perfil del usuario
  * @throws {Error} - Si ocurre un error durante la solicitud de autenticación.
  * @memberof module:PerfilPage
  */  
  async function uploadInfo() {
    try {
      const response = await axios.post(`http://${userConfig.serverIP}:${userConfig.serverPort}/setPerfilImage`, {imagen: perfilImage}, config );

      const response2 = await axios.post(`http://${userConfig.serverIP}:${userConfig.serverPort}/userData`, userData, config);
      Swal.fire({
        icon: 'success',
        text: response2.data.mensage
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

  //region ---------- ELIMINAR CUENTA ---------------------------------------------------------------------------------------------------------

  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleBorrar = (event) => {
    event.preventDefault();
    if (isChecked) {
        eliminarCuenta()
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        window.location.reload();
    } else {
      Swal.fire({
        icon: 'warning',
        text: "Confirme que desea BORRAR la cuenta."
      })
    }
  }
  /**
  * Peticion a la API de borrar la cuenta del usuario.
  *
  * @async
  * @method
  * @throws {Error} - Si ocurre un error durante la solicitud de autenticación.
  * @memberof module:PerfilPage
  */ 
  async function eliminarCuenta() {
    try {
      const response = await axios.get(`http://${userConfig.serverIP}:${userConfig.serverPort}/delete`, config);

      console.log(response);
      localStorage.removeItem('token');
      window.location.reload();
      
    }catch (error) {
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
        console.error(error)
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error
        })
      }
    }
  }

return(
  
  <div >  
  <div className='cardS'>
          <div class="card-bodyS">
              <div class="d-flexS">
                  <img src={`data:image/png;base64, ${perfilImage}`} class="imgS" height="100" width="100" id="uploadedAvatar"/>
                  
                  <div>

                    <label class="butonS" style={{display: 'inline-block'}}>
                      <span style={{fontSize: '1.25rem'}}>Upload new photo</span>
                      <i class=""></i>
                      <input style={{ margin:'0', fontFamily: 'inherit', fontSize: 'inherit', lineHeight: 'inherit'}}
                        type="file"
                        id="upload"
                        class="account-file-input"
                        hidden
                        accept="image/png, image/jpeg"
                        onChange={handleImageChange}
                      />
                    </label>
                    
        


                    <p class="textS">Allowed JPG, GIF or PNG. Max size of 800K</p>
                  </div>

                
              </div>
          </div>
      </div>

      <div>
          <div>
              <div class="cardS" >     

                  <div class="card-bodyS">
                
                          <div class="rowS">

                              <div class="bloqueInput">
                                  <label  class="form-label">Nombre</label>
                                  <input class="form-control"
                                      type="text" 
                                      id="name" 
                                      name="name" 
                                      value={userData.name} 
                                      onChange={handleInputChange}/>
                              </div>

                              <div class="bloqueInput">
                                  <label  class="form-label">Apellidos</label>
                                  <input class="form-control" type="text" name="surname" id="surname" value={userData.surname} onChange={handleInputChange}/>
                              </div>

                              <div class="bloqueInput">
                                  <label class="form-label">E-mail</label>
                                  <input class="form-control" type="text" id="email" name="email" value={userData.email} onChange={handleInputChange} placeholder="john.doe@example.com"/>
                              </div>
                              <div class="bloqueInput">
                                  <label class="form-label">Usuario</label>
                                  <input type="text" class="form-control" id="username" name="username" value={userData.username} readOnly/>
                              </div>


                            
                          </div>
                          <div >
                              <button onClick={handleMod} class="butonS" style={{marginBottom: '0'}}>Guardar cambios</button>
                          </div>
                      
                  </div>

              </div>

              <div class="cardS">

                  <h5 class="card-header">Borrar cuenta</h5>
                  <div class="card-bodyS" style={{paddingTop: '0px'}}>
                      <div>
                          <div class="cardS-orange">
                              <h6 class="header-orange">¿Estas seguro de que deseas borrar la cuenta?</h6>
                              <p class="body-orange">No podra ser recuperada una vez borrada, porfavor confirma que deseas eliminarla.</p>
                          </div>
                      </div>
                      <form id="formAccountDeactivation" onSubmit={(e) => e.preventDefault()}>
                          <div class="fot-orange">
                              <input class="form-check-input" type="checkbox" name="accountActivation" checked={isChecked} onChange={handleCheckboxChange}/>
                              <label class="form-check-label" >Confirmo que deseo borrar la cuenta</label>
                          </div>
                          <button type="submit" onClick={handleBorrar} class="butonS2">Borrar cuenta</button>
                      </form>
                  </div>
              </div>
          </div>
      </div>

  </div>
  
);
}
export default PerfilPage;

const Container =styled.div`

  max-width: 700px; /* Ancho máximo de 500px */
  height: auto;
  margin: auto;
`
