import React, { useState, useEffect, useRef, useContext } from 'react';


import styled from "styled-components";


import AmpliarPopUp from '../components/popup-ampliar-galeria';


import { MdImageSearch} from "react-icons/md";
import { PiCubeFocusDuotone } from "react-icons/pi";
import { IoMenu } from "react-icons/io5";

import axios from 'axios';
import Swal from 'sweetalert2';

import { userConfig } from '../js/config';

import {
  Block,
  BlockTitle,
  f7
} from 'framework7-react';


/**
* @module Galeria
*/

/**
* Galeria Page
*
* Este componente representa la página del cribado de la aplicación.
*
* @returns {JSX.Element} 
*/
export function Galeria () {

  //#region ---------------------- RENDER RESPONSIVE ------------------------------------------------------------------------------------------------------------------------------------------

  const [isMobile, setIsMobile] = useState(false);
  const [isMobile2, setIsMobile2] = useState(window.innerWidth <= 768); 

  /**
  * Efecto que verifica si la pantalla es lo suficientemente estrecha
  * y ajusta el estado `isMobile` en consecuencia. También agrega un listener
  * para el evento `resize` que vuelve a verificar el tamaño de la pantalla
  * cada vez que la ventana se redimensiona.
  *
  * @method
  * @returns {boolean} 
  * @memberof module:Galeria
  * @name useEffect
  */
  useEffect(() => { 

    const checkIfMobile = () => {
        const containerWidth = document.getElementById('container').offsetWidth;
        setIsMobile(containerWidth <= 1200); // Ajusta este valor 
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
        window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  /**
  * Efecto que verifica si la pantalla ha cambiado de tamaño
  * lo suficiente para pasar del modo escritorio al modo smartphone
  *
  * @method
  * @memberof module:Galeria
  * @param {boolean} isMobile2
  * @name useEffect
  */
  useEffect(() => {
    const handleResize = () => {
      const currentlyMobile = (window.innerWidth <= 768);
      if (currentlyMobile !== isMobile2) {
        setIsMobile2(currentlyMobile);
        console.log("Reload due to device change");
        window.location.reload();
      }
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile2]);

  //#endregion

  //#region ------ PANEL                ------------------------------------------------------------------------

  const handleMenu = () => {
    f7.panel.open('#home');
  }

  //#endregion

  //#region ---------------------- AUTENTICAR Y CARGAR ---------------------------------------------------------------------------------------------------------------------------------------------
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
  
  /**
  * Efecto que a la carga de la pagina carga y renderiza las imagenes.
  *
  * @method
  * @memberof module:Calendario
  * @name useEffect
  */
  useEffect(() => {
    async function checkAuthentication() {
      f7.dialog.progress()
      fetchGaleria()
      fetchGaleriaSimple()
      f7.dialog.close()
    }

    checkAuthentication();
  }, []);

  //#endregion

  //#region -------------------------- FECHT GALERIAS -----------------------------------------------------------------------------------------------------------------------------------------
  /**
  * Marcadores de las lesiones.
  * @const {Object[]} markers 
  */
  const [markers, setMarkers] = useState([])
  /**
  * Marcador la lesion seleccionada.
 * @const {Object | null} marker - Objeto que representa la lesión seleccionada con sus datos asociados, o null si no hay ninguna lesión seleccionada.
 * @example
 * {
 *   probabilidad: 0.75,
 *   imagen: 'base64',
 *   predicciones: [0.12,0.01,0.03,0.05,0.6,0.18],
 *   color: 'red'
 * }
  */
  const [marker, setMarker] = useState(null);
  /**
  * Marcadores de las lesiones simples.
  * @const {Object} markersSimple 
  */
  const [markersSimple, setMarkersSimple] = useState([])
  /**
  * Variable de control del popup Ampliar.
  * @const {boolean} showPopupAmpliar
  */
  const [showPopupAmpliar, setShowPopupAmpliar] = useState(false);
  /**
  * Modo del popup Ampliar.
  * @const {boolean} modo
  */
  const [modo, setModo] = useState(false);

  /**
  * Pide los marcadores a la API.
  *
  * @async
  * @method
  * @returns {Promise<Object>} 
  * @throws {Error} - Si ocurre un error durante la solicitud de autenticación.
  * @memberof module:Galeria
  */ 
  async function fetchGaleria() {

    try {
      const response = await axios.post(`http://${userConfig.serverIP}:${userConfig.serverPort}/markers`, {id: null}, config);
      
      const newMarkers = response.data.markers.map(marker => ({
        x: marker.x,
        y: marker.y,
        body: marker.body,
        probabilidad: marker.probabilidad,
        predicciones: marker.predicciones,
        imagen: marker.imagen,
        color: marker.color,
        opened: false
      }));

      setMarkers(newMarkers);

      } catch (error) {
        try{
          if (error.response.status == 404){
            return
          }
          if (error.response.status == 401){
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: "La sesión ha caducado"
            })
            f7.dialog.close()
            window.location.reload();
          }else{
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error.response.data.error
            })
          }
          f7.dialog.close()
        }catch{
          console.error(error.message)
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message
          })
          f7.dialog.close()
        }
      }
  }

  /**
  * Pide los marcadores simples a la API.
  *
  * @async
  * @method
  * @returns {Promise<Object>} 
  * @throws {Error} - Si ocurre un error durante la solicitud de autenticación.
  * @memberof module:Galeria
  */ 
  async function fetchGaleriaSimple() {

    try {
      const response = await axios.get(`http://${userConfig.serverIP}:${userConfig.serverPort}/galeriaSimple`, config);
      
      const newMarkersSimple = response.data.markers.map(marker => ({
        id: marker.id,
        probabilidad: marker.probabilidad,
        predicciones: marker.predicciones,
        imagen: marker.imagen,
        color: marker.color
      }));

      setMarkersSimple(newMarkersSimple);

      } catch (error) {
        try{
          if (error.response.status == 404){
            return
          }
          if (error.response.status == 401){
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: "La sesión ha caducado"
            })
            f7.dialog.close()
            window.location.reload();
          }else{
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error.response.data.error
            })
          }
          f7.dialog.close()
        }catch{
          console.error(error.message)
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message
          })
          f7.dialog.close()
        }
      }
  }

  //#endregion

  //#region ------------ ELIMINAR SIMPLE -------------------------------------------------------------------------------------------------------------------------------------
  const handleEliminarSimple = () => {
    handleBorrarMarkerSimple(marker)
  }
  /**
  * Pide a la API borrar la lesion guardada como simple.
  *
  * @async
  * @method
  * @param {Object} registro
  * @returns {Object} 
  * @throws {Error} 
  * @memberof module:PopUpAmpliarGaleria
  */ 
  async function handleBorrarMarkerSimple(registro) {

    try {
      console.log(registro)
      const response = await axios.post(`http://${userConfig.serverIP}:${userConfig.serverPort}/deleteSimple`, {id: registro.id}, config);
      console.log(response.data.mesage)
      
      setMarkersSimple((prevMarkers) => prevMarkers.filter(marker => marker.id !== registro.id));
      closePopupAmpliar()
      
    } catch (error) {
      try{
        if (error.response.status == 404){
          return
        }
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
  
  //#region ------------ CONTROL POPUP AMPLIAR ---------------------------------------------------------------------------------------------------

  /**
  * Manejadora para ampliar el popup del resultado.
  *
  * @method
  * @memberof module:Galeria
  * @name handleAmpliar
  */ 
  const handleAmpliar = (marker,modoApertura) => {
    setModo(modoApertura)
    setMarker(marker)
    setShowPopupAmpliar(true)
  }

  /**
  * Manejadora para cerrar el popup del resultado.
  *
  * @method
  * @memberof module:Galeria
  * @name handleAmpliar
  */ 
  const closePopupAmpliar = () => {
    setShowPopupAmpliar(false)
  }

  //#endregion

  return(
    <div>
      <div class="page">

          { isMobile2 ? (
            <div class="navbar" style={{display: 'grid', gridTemplateColumns: ' 1% 40px 20% 70%', background: 'teal', color: '#ffffff', textAlign: 'center', alignItems: 'center',  fontSize: '170%', lineHeight: '250%'}}>
          
              <div/>
              <IoMenu onClick={handleMenu} style={{width: '100%', fontSize: '40px', color:'white'}}/>
              
              <div onClick={handleMenu} style={{width: '100%', fontSize: '120%'}}>
                      Galeria
              </div>


            </div>
          ):(
            <div class="navbar" style={{display: 'grid', gridTemplateColumns: '1fr', background: 'teal', color: '#ffffff', textAlign: 'center',alignContent: 'center', fontSize: '170%'}}>
              <span style={{}}>Galeria</span>
            </div>
          )} 

        <div class="page-content">

          { isMobile ? (
            <div>
              <ContainerPc>
                <br/>

                <Container style={{borderRadius: '20px', border: '8px solid teal'}}>

                  <Block>
                  <div className="Linkicon" style={{display: 'grid', gridTemplateColumns: '10% 90%', alignItems: 'center', margin:'20px 0'}}>
                    <MdImageSearch  style={{width: '100%', fontSize: '30px'}}/>
                    <div style={{width: '100%', fontWeight: 'bold', fontSize: '150%'}}>
                      Explora la galeria de las lesiones
                    </div>
                  </div>

                  <div className="Linkicon" style={{display: 'grid', gridTemplateColumns: '10% 90%', alignItems: 'center', margin:'40px 0'}}>
                    <PiCubeFocusDuotone style={{width: '100%', fontSize: '30px', color:'#006689'}}/>
                    <div style={{width: '100%', fontSize: '120%'}}>
                      IMPLEMENTAR POPUP SOBRE LOS RESULTADOS GUARDADOS DE CADA IMAGEN
                    </div>
                  </div>
                  </Block>

                </Container>

                <div>      
                  <BlockTitle style={{height: '35px', fontSize: '25px'}} large>Galeria del seguimiento</BlockTitle>

                  {/* Renderizar imágenes */}
                  <div className='cardS' style={{padding: '30px', paddingBottom: '50px'}}>
                    <ImagenesList>
                      {markers.map((marker, index) => (
                        <ImageContainer key={index} onClick={() => handleAmpliar(marker,0)}>
                          <Imagen src={`data:image/png;base64, ${marker.imagen}`} alt={`Imagen ${index}`} />
                        </ImageContainer>
                      ))}
                    </ImagenesList>
                  </div>
                </div>

                <div>
                  <BlockTitle style={{height: '35px', fontSize: '25px'}} large>Galeria del normal</BlockTitle>

                  {/* Renderizar imágenes */}
                  <div className='cardS' style={{padding: '30px', paddingBottom: '50px'}}>
                    <ImagenesList>
                      {markersSimple.map((marker, index) => (
                        <ImageContainer key={index} onClick={() => handleAmpliar(marker,1)}>
                          <Imagen src={`data:image/png;base64, ${marker.imagen}`} alt={`Imagen ${index}`} />
                        </ImageContainer>
                      ))}
                    </ImagenesList>
                  </div>
                </div>



              </ContainerPc>

            </div>

          ):(

            <div>
              <ContainerPc>
                <br/>

                <Container style={{borderRadius: '20px', border: '8px solid teal'}}>

                  <Block>
                  <div className="Linkicon" style={{display: 'grid', gridTemplateColumns: '10% 90%', alignItems: 'center', margin:'20px 0'}}>
                    <MdImageSearch  style={{width: '100%', fontSize: '30px'}}/>
                    <div style={{width: '100%', fontWeight: 'bold', fontSize: '150%'}}>
                      Explora la galeria de las lesiones
                    </div>
                  </div>

                  <div className="Linkicon" style={{display: 'grid', gridTemplateColumns: '10% 90%', alignItems: 'center', margin:'40px 0'}}>
                    <PiCubeFocusDuotone style={{width: '100%', fontSize: '30px', color:'#006689'}}/>
                    <div style={{width: '100%', fontSize: '120%'}}>
                      IMPLEMENTAR POPUP SOBRE LOS RESULTADOS GUARDADOS DE CADA IMAGEN
                    </div>
                  </div>
                  </Block>

                </Container>

                <div style={{display: 'grid', gridTemplateColumns: '50% 50%'}}>
                  <div>      
                    <BlockTitle style={{height: '35px', fontSize: '25px'}} large>Galeria del seguimiento</BlockTitle>

                    {/* Renderizar imágenes */}
                    <div className='cardS' style={{padding: '30px'}}>
                      <ImagenesList2>
                        {markers.map((marker, index) => (
                          <ImageContainer2 key={index} onClick={() => handleAmpliar(marker,0)}>
                            <Imagen src={`data:image/png;base64, ${marker.imagen}`} alt={`Imagen ${index}`} />
                          </ImageContainer2>
                        ))}
                      </ImagenesList2>
                    </div>
                  </div>
                  <div>
                    <BlockTitle style={{height: '35px', fontSize: '25px'}} large>Galeria normal</BlockTitle>

                    {/* Renderizar imágenes */}
                    <div className='cardS' style={{padding: '30px'}}>
                      <ImagenesList2>
                        {markersSimple.map((marker, index) => (
                          <ImageContainer2 key={index} onClick={() => handleAmpliar(marker,1)}>
                            <Imagen src={`data:image/png;base64, ${marker.imagen}`} alt={`Imagen ${index}`} />
                          </ImageContainer2>
                        ))}
                      </ImagenesList2>
                    </div>
                  </div>
                </div>


              </ContainerPc>

            </div>


          )}


        <AmpliarPopUp showPopup={showPopupAmpliar} closePopup={closePopupAmpliar} marker={marker} handleEliminarSimple={handleEliminarSimple} simple={modo}/>
        </div>

      </div>
    </div>
);
}export default Galeria;

const Container =styled.div`

  height: auto;
  width: 100%;
  
  margin: 10px auto;
  
`
const ContainerPc =styled.div`

  height: auto;
  width: 90%;
  margin: 10px auto;
`

const Container2 = styled.div`

  height: auto;
  width: 100%;
  margin: 20px auto;
  border: 8px solid teal;
  padding-bottom: 90px;
  
`


const ImagenesList = styled.div`
  width: 93%;
  height: auto;
  margin: 2% auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(30% , 1fr));
  gap: 3%;
  max-width: 700px;
`
const ImagenesList2 = styled.div`
  width: 93%;
  height: auto;
  margin: 2% auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px , 1fr));
  gap: 2%;
`

const ImageContainer = styled.div`
  width: 95%;
  padding-top: 95%;  /* Establece la relacion de aspecto 1:1 */

  position: relative;
  border-radius: 10%;

  overflow: hidden;
  border: 5px solid teal;
`

const ImageContainer2 = styled.div`
  height: 200px;

  position: relative;
  border-radius: 10%;

  overflow: hidden;
  border: 5px solid teal;
`

const Imagen = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;        /* Mantiene la proporcion y cubre todo el contenedor */
  transition: transform 0.5s ease;
  &:hover {
    transform: scale(1.2);
  }

`;



