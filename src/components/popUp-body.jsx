import React, { useState } from 'react';

import ResultPopUp from '../components/popup-result';

import { MdArrowBack } from 'react-icons/md';

import InstruccionesPopup from '../components/popUp-instrucciones'

import { 
  f7,
  Popup,
  Page,
  Button,
  Progressbar,} from 'framework7-react';
import '../css/custom-styles.css'
import { TransformWrapper, TransformComponent  } from 'react-zoom-pan-pinch';

import styled from "styled-components";
import { MdTouchApp, MdCameraAlt } from "react-icons/md";



/**
* @module PopUpBody
*/

/**
* PopUp Body
* Este componente representa el PopUp para seleccionar la localización de una lesión en el seguimiento.
* @component
* @param {boolean} props.showPopup - Indica si el PopUp está visible.
* @param {function} props.closePopup - Función para cerrar el PopUp.
* @param {function} props.handleCambiarDelante - Función para cambiar a la imagen frontal del cuerpo.
* @param {function} props.handleCambiarDetras - Función para cambiar a la imagen trasera del cuerpo.
* @param {Object} props.currentImage - Variable que indica la imagen (frontal/trasera) que esta visible.
* @returns {JSX.Element} 
*/

const BodyPopup = ({ showPopup, closePopup, closePopupGuardado, handleCambiarDelante, handleCambiarDetras, currentImage, paciente}) => {

  /**
  * Marcador de posicion actual.
  * @const {String} marker 
  */
  const [marker, setMarker] = useState(null);
  /**
  * Imagem seleccionada.
  * @const {String} imagen 
  */
  const [imagen, setImagen] = useState(null)
  const [avisoPopup, setAvisoPopup] = useState(false);
  /**
  * Manejadora para cerrar el popup de las instrucciones del analisis.
  *
  * @method
  * @memberof module:PopUpBody
  * @name closeAvisoPopup
  */
  const closeAvisoPopup = () => {
    setAvisoPopup(false)
  }

  /**
  * Manejadora para procesar la eleccion del lugar de la lesion.
  *
  * @method
  * @param {Object} event
  * @returns {Object} -Retorna el Marker con las corrdenadas y el lugar de la lesión.
  * @memberof module:PopUpBody
  * @name handleImageClick
  */
  const handleImageClick = (event) => {
    // OBTENER CORDENADAS DEL EVENTO CLICK => TARGET ES LA IMAGEN
    const { offsetX, offsetY, target } = event.nativeEvent;

    // DIMENSIONES DE LA IMAGEN
    const image = target
    const width = image.offsetWidth;
    const height = image.offsetHeight;

    console.log(width,height)

    // RESTAR 10 PX PARA CENTRAR SOBRE EL CURSOR

    const adjustedX = offsetX - 10; 
    const adjustedY = offsetY - 10; 
    //CALCULAR LAS COORDENADAS EN PORCENTAJE
    const xPercent = (adjustedX / width) * 100;
    const yPercent = (adjustedY / height) * 100;

    //console.log(width,height,adjustedX,adjustedY,xPercent,yPercent)

    let lugar = '';

    if (currentImage === "/images/BODY1.png") {
      if (yPercent < 13) {
        if(xPercent > 33 && xPercent < 62){
          lugar = 'Cabeza';
        }
      } else if (yPercent < 15) {
        if(xPercent > 33 && xPercent < 62){
          lugar = 'Cuello';
        }
      } else if (yPercent < 30) {
        if(xPercent >= 30 && xPercent <= 63){
          lugar = 'Pecho';
        }else if(xPercent > 14 && xPercent < 30){
          lugar = 'Hombro Derecho';
        }else if(xPercent > 63 && xPercent < 81){
          lugar = 'Hombro Izquierdo';
        }
      }else if (xPercent > 21 && xPercent < 71){
        if (yPercent < 48) {
          lugar = 'Torso';
        } else if (yPercent < 54) {
          if(xPercent > 21 && xPercent < 74){
            lugar = 'Pelvis';
          }
        } else if (yPercent < 90) {
          if (xPercent > 21 && xPercent < 50) {
            lugar = 'Pierna Derecha';
          } else if  (xPercent > 50 && xPercent < 74) {
            lugar = 'Pierna Izquierda';
          }
        } else {
          if (xPercent > 21 && xPercent < 50) {
            lugar = 'Pie Derecho';
          } else if  (xPercent > 50 && xPercent < 74) {
            lugar = 'Pie Izquierdo';
          }
        }
      }else if (xPercent <= 21){
        if (yPercent < 46){
          lugar = 'Brazo Derecho';
        }else if (yPercent < 58){
          lugar = 'Mano Derecha';
        }
      }else if (xPercent >= 71){
        if (yPercent < 46){
          lugar = 'Brazo Izquierdo';
        }else if (yPercent < 58){
          lugar = 'Mano Izquierda';
        }
    
      }
    }else{
      if (yPercent < 13) {
        if(xPercent > 33 && xPercent < 62){
          lugar = 'Cabeza';
        }
      } else if (yPercent < 15) {
        if(xPercent > 33 && xPercent < 62){
          lugar = 'Cuello';
        }
      } else if (yPercent < 30) {
        if(xPercent >= 30 && xPercent <= 63){
          lugar = 'Espalda';
        }else if(xPercent > 14 && xPercent < 30){
          lugar = 'Hombro Izquierdo';
        }else if(xPercent > 63 && xPercent < 81){
          lugar = 'Hombro Derecho';
        }
      }else if (xPercent > 21 && xPercent < 71){
        if (yPercent < 48) {
          lugar = 'Espalda';
        } else if (yPercent < 54) {
          if(xPercent > 21 && xPercent < 74){
            lugar = 'Pelvis';
          }
        } else if (yPercent < 90) {
          if (xPercent > 21 && xPercent < 50) {
            lugar = 'Pierna Izquierda';
          } else if  (xPercent > 50 && xPercent < 74) {
            lugar = 'Pierna Derecha';
          }
        } else {
          if (xPercent > 21 && xPercent < 50) {
            lugar = 'Pie Izquierdo';
          } else if  (xPercent > 50 && xPercent < 74) {
            lugar = 'Pie Derecho';
          }
        }
      }else if (xPercent <= 21){
        if (yPercent < 46){
          lugar = 'Brazo Izquierdo';
        }else if (yPercent < 58){
          lugar = 'Mano Izquierda';
        }
      }else if (xPercent >= 71){
        if (yPercent < 46){
          lugar = 'Brazo Derecho';
        }else if (yPercent < 58){
          lugar = 'Mano Derecha';
        }
    
      }
    }
    //console.log('Lugar:', lugar, currentImage);

    // ESTABLECER COORDENADAS MARCADOR
    setMarker({ x: xPercent, y: yPercent, lugar: lugar });
  };


  /**
  * Manejadora para cerrar el popup actual.
  *
  * @method
  * @memberof module:PopUpBody
  * @name handleCerrar
  */
  const handleCerrar = () => {
    setMarker(null)
    setImagen(null)
    setFileSelected(false)
    closeResultPopUp()
    closePopupGuardado()
  }

  /**
  * Manejadora para cambiar imagen del cuarpo a delantera.
  *
  * @method
  * @memberof module:PopUpBody
  * @name handleBotonDelante
  */
  const handleBotonDelante = () => {
    setMarker(null)
    handleCambiarDelante()
  }

  /**
  * Manejadora para cambiar imagen del cuarpo a trasera.
  *
  * @method
  * @memberof module:PopUpBody
  * @name handleBotonDetras
  */
  const handleBotonDetras = () => {
    setMarker(null)
    handleCambiarDetras()
  }

  /**
  * Control de Imagen elegida.
  * @const {boolean} fileSelected 
  */
  const [fileSelected, setFileSelected] = useState(false);

  /**
  * Manejadora para cambiar elegir imagen.
  *
  * @method
  * @memberof module:PopUpBody
  * @name handleLunar
  */  
  const handleLunar = () => {
    if (marker === null) {
      f7.dialog.alert('Por favor, añada el lugar del lunar.');
    } else {
      setAvisoPopup(true)
    }
  }

  /**
  * Control de renderizado del popup del analisis.
  * @const {boolean} fileSelected 
  */
  const [resultPopUp, setResultPopUp] = useState(false)
  const [analizar, setAnalizar] = useState(false)
  const [analizado, setAnalizado] = useState(false)

  /**
  * Manejadora para cerrar el popup de resultados.
  *
  * @method
  * @memberof module:PopUpBody
  * @name closeResultPopUp
  */  
  const closeResultPopUp = () => {
    setResultPopUp(false)
    setAnalizar(false)
    setAnalizado(false)
  }

  /**
  * Manejadora para abrir el popup de resultados y activar el analisis.
  *
  * @method
  * @memberof module:PopUpBody
  * @name handleAnalizar
  */ 
  const handleAnalizar = () => {
    closeAvisoPopup()
    setResultPopUp(true)
    setAnalizar(true)
  }
  

  return (
    <Popup tabletFullscreen opened={showPopup} onClose={closePopup} destroyOnClose={true} style={{ filter: (avisoPopup||resultPopUp) ? 'blur(7px)' : 'none'}}>
      <Page>

        <div className="navbar" style={{display: 'grid', gridTemplateColumns: '5% 1fr', background: '#006689', color: '#ffffff', textAlign: 'center', alignItems: 'center',  fontSize: '170%', lineHeight: '250%'}}>
          <MdArrowBack style={{ fontSize: '24px', marginLeft: '90%', cursor: 'pointer'}} onClick={closePopup} />
          <span style={{ marginLeft: '10%', marginRight: '15%', textAlign: 'center'}}>Añadir Lunar</span>
        </div>


        <Container>

          <TextIcon>

            <div className="Linkicon" style={{maxWidth: '900px', margin: 'auto', fontWeight: 'bold', fontSize: '120%'}}>
              <MdTouchApp style={{fontSize: '25px'}}/>
              Toca una parte del cuerpo para añadir un nuevo lunar
            </div>
      
          </TextIcon>
          <Progressbar progress={100} color="teal" id="demo-inline-progressbar" />
    
            <ContainerBorder>          
              <ImageContainer onClick={handleImageClick}>
                <TransformWrapper >
                  <TransformComponent >
                    
                    <Imagen src={currentImage} alt="Imagen" className="body-image"/>
                    
                    {/* Renderizar los marcadores */}
                    {marker && (
                      <Marker x={marker.x} y={marker.y} />
                    )}

                  </TransformComponent>
                </TransformWrapper> 
              </ImageContainer>
            </ContainerBorder>

          <ContainerButton>
            <Button tonal onClick={handleBotonDelante}>Delante</Button>
            <Button tonal onClick={handleBotonDetras}>Detras</Button>
          </ContainerButton>


          <Button fill onClick={handleLunar} color="teal" style={{ fontSize: '20px'}}><MdCameraAlt style={{margin: 'auto 1% 9px', fontSize: '20px'}}/>Añadir Lunar</Button>

        </Container>

        <InstruccionesPopup showPopup={avisoPopup} closePopup={closeAvisoPopup} imagen={imagen} setImagen={setImagen} fileSelected={fileSelected} setFileSelected={setFileSelected} handleAnalizar = {handleAnalizar} />
        <ResultPopUp showPopup={resultPopUp} cerrarTodo={handleCerrar} closePopup={closeResultPopUp} imagen={imagen} analizar={analizar} analizado={analizado} setAnalizado={setAnalizado} marker={marker} body={currentImage} simple={0} paciente={paciente}/>

      </Page>
    </Popup>

  );
};

export default BodyPopup;

const Container = styled.div`
  height: 83vh;
  width: 90%;
  
  max-width: 700px; /* Ancho máximo de 500px */
  margin: 1% auto;
`

const TextIcon = styled.div`
  display: felx;
  align-items: center;              /* Centrar verticalmente los elementos */

  width: 90%;
  margin: 1% auto;
`

const ContainerBorder = styled.div`
  height: 70%;
  
  width: 99%;
  
  margin: 1% auto;

  border-radius: 16px;
  border: 4px solid teal;
`

const ImageContainer = styled.div`
  aspect-ratio: 600 / 1332;
  height: 98%; 
  max-width: 340px;

  margin: 5px auto;
  overflow: hidden;
  position: relative;
  
`

const Imagen = styled.img`
  width: 100%;
`
const Marker = styled.div`
  position: absolute;

  top: ${({ y }) => `${y}%`};
  left: ${({ x }) => `${x}%`};  
  
  width: 15px; 
  height: 15px; 
  background-color: red; 
  border-radius: 50%; 
`
const ContainerButton = styled.div`
  height: auto;
  width: 100%;
  max-width: 700px; /* Ancho máximo de 500px */

  margin: 10px auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2%;

`
