import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';

import axios from 'axios';
import { userConfig } from '../js/config';


/**
* @module Contacto
*/

/**
* Contact Page
*
* Este componente representa la página para que un usuario contacte con la administración.
*
* @returns {JSX.Element} 
*/

export function ContactPage  ()  {
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

  //#region --------- FECHT DATA PERFIL ------------------------------------------------------------------------------------------------------------
  /**
  * imagen selecionada por el usuario.
  * @const {String} perfilImage 
  */
  const [perfilImage, setPerfilImage] = useState(null);
  /**
  * Datos de perfil del usuario.
  * @const {object} userData 
  */
  const [userData, setUserData] = useState({
    name: '',
    surname: '',
    email: '',
    username: ''
  });
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
  * @memberof module:Contacto
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

      const response2 = await axios.post(`http://${userConfig.serverIP}:${userConfig.serverPort}/perfilImage`, {imagen: perfilImage}, config);
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
  //#endregion

  //#region ---------- ENVIAR  -------------------------------------------------------------------------------------------------------------
  /**
  * Mensaje del usuario.
  * @const {string} mensaje 
  */
  const [mensaje, setMensaje] = useState(null)
  const handleInputChange = (e) => {
    console.log(e.target.value)
    const { name, value } = e.target;
    setMensaje(e.target.value)
  };

  /**
  * Manejadora de envio del mensaje.
  *
  * @method
  * @memberof module:Contacto
  * @name handleEnviar
  */
  const handleEnviar = () => {
    uploadInfo()

  }

  /**
  * Peticion a la API de envio del mensaje de contacto.
  *
  * @async
  * @method
  * @throws {Error} - Si ocurre un error durante la solicitud de autenticación.
  * @memberof module:Contacto
  */ 
  async function uploadInfo() {
    try {
      const response = await axios.post(`http://${userConfig.serverIP}:${userConfig.serverPort}/contactUs`, {mensaje: mensaje}, config );

      Swal.fire({
        icon: 'success',
        text: response.data.mensage
      })
      setMensaje("")
      //setPerfilImage(response2.data.imagen);
        
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

  //#endregion

return(

  
  <div>

    <div className='cardS'>
        <div class="card-bodyS">
            <div class="d-flexS" >

                <img src={`data:image/png;base64, ${perfilImage}`} class="imgS" height="100" width="100" id="uploadedAvatar"/>

                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <div className="rowS" style={{marginTop: '15px'}}>
                    <div className="bloqueInput">
                      <label htmlFor="name" className="form-label">Nombre</label>
                      <div className="form-control-static">{userData.name}</div>
                    </div>
                    <div className="bloqueInput">
                      <label htmlFor="surname" className="form-label">Apellidos</label>
                      <div className="form-control-static">{userData.surname}</div>
                    </div>
                  </div>
                  <p class="textS">Contacta con nosotros mandandonos un correo electrónico.</p>
                </div>

            </div>
        </div>
    </div>

      <div className="cardS">
        <div className="card-bodyS">
          <div className="rowS">


            <div className="bloqueInput">
              <label htmlFor="email" className="form-label">E-mail</label>
              <div className="form-control-static">{userData.email}</div>
            </div>

            <div className="bloqueInput">
              <label htmlFor="username" className="form-label">Usuario</label>
              <div className="form-control-static">{userData.username}</div>
            </div>

            <div className="bloqueInput" style={{ gridColumn: 'span 2' }}>
              <label htmlFor="message" className="form-label">Mensaje</label>
              <textarea
                className="form-control"
                id="message"
                name="message"
                value={mensaje}
                onChange={handleInputChange}
                rows="4"
                placeholder="Escribe tu mensaje aquí..."
              ></textarea>
            </div>
          </div>

          <div>
            <button onClick={handleEnviar} className="butonS" style={{ marginBottom: '0' }}>
              Enviar
            </button>
          </div>
        </div>
      </div> 
  </div>

);
}
export default ContactPage;

const Container =styled.div`

  max-width: 700px; /* Ancho máximo de 500px */
  height: auto;
  margin: auto;
`
