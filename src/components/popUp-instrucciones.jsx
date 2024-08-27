import React from 'react';

import FilePicker from '../components/file-piker';

import { 
  Popup,
  Page,
  Block,
  Progressbar,
} from 'framework7-react';

import styled from "styled-components";
import { MdImageSearch} from "react-icons/md";
import { TbRulerMeasure } from "react-icons/tb";
import { MdArrowBack } from 'react-icons/md';
import { PiCubeFocusDuotone } from "react-icons/pi";
import { AiOutlineAim } from "react-icons/ai";




/**
* Instrucciones
* Este componente representa el PopUp con las instrucciones y sus componentes para el analisis de una imagen.
* @component
* @param {boolean} props.showPopup - Indica si el PopUp está visible.
* @param {function} props.closePopup - Función para cerrar el PopUp.
* @param {String} props.imagen - Variable que indica la imagen actual.
* @param {function} props.setImagen - Función para setear la imagen actual.
* @param {boolean} props.fileSelected - Variable que indica si se ha elegido una imagen.
* @param {function} props.setFileSelected - Función para setear el control sobre la eleccion de la imagen.
* @param {function} props.handleAnalizar - Función para realizar el analisis de la imagen.
* @returns {JSX.Element} 
*/

const InstruccionesPopup = ({ showPopup, closePopup, imagen, setImagen, fileSelected, setFileSelected, handleAnalizar}) => {


  const handleGoBack = () => {
    closePopup()
  }
  

  return (
    <Popup opened={showPopup} onClose={closePopup} closeByBackdropClick={false} style={{border: '1px solid teal'}} >
      <Page>

        <div className="navbar" style={{display: 'grid', gridTemplateColumns: '5% 1fr', background: 'teal', color: '#ffffff', textAlign: 'center', alignItems: 'center',  fontSize: '170%', lineHeight: '250%'}}>
          <MdArrowBack style={{ fontSize: '24px', marginLeft: '90%', cursor: 'pointer'}} onClick={handleGoBack} />
          <span style={{ marginLeft: '10%', marginRight: '15%', textAlign: 'center'}}>Añadir la Imagen</span>
        </div>

        <Container>

          <Block>
            <div className="Linkicon" style={{display: 'grid', gridTemplateColumns: '10% 90%', alignItems: 'center', margin:'5% 0'}}>
              <MdImageSearch  style={{width: '100%', fontSize: '30px'}}/>
              <div style={{width: '100%', fontWeight: 'bold', fontSize: '150%'}}>
                ¿Cómo elegir la imagen para el análisis?
              </div>
            </div>

            <div className="Linkicon" style={{display: 'grid', gridTemplateColumns: '10% 90%', alignItems: 'center', margin:'5% 0'}}>
              <PiCubeFocusDuotone style={{width: '100%', fontSize: '30px', color:'#006689'}}/>
              <div style={{width: '100%', fontSize: '120%'}}>
                Asegúrate de que el área de la fotografía esté bien iluminada y enfocada.
              </div>
            </div>

            <div className="Linkicon" style={{display: 'grid', gridTemplateColumns: '10% 90%', alignItems: 'center', margin:'5% 0'}}>
              <AiOutlineAim  style={{width: '100%', fontSize: '30px', color:'#006689'}}/>
              <div style={{width: '100%', fontSize: '120%'}}>
                Coloca la cámara del dispositivo sobre area de la piel donde esta la lesión y en dirección a esta.
              </div>
            </div>

            <div className="Linkicon" style={{display: 'grid', gridTemplateColumns: '10% 90%', alignItems: 'center', margin:'5% 0'}}>
              <TbRulerMeasure style={{width: '100%', fontSize: '30px', color:'#006689'}}/>
              <div style={{width: '100%', fontSize: '120%'}}>
                Mantén el dispositivo a una distancia de unos 10cm y asegurate de centrar la lesión en el medio de la imagen.
              </div>
            </div>

          </Block>

          <Progressbar progress={100} color="teal" id="demo-inline-progressbar" />

          <br/>

          <FilePicker imagen={imagen} setImagen={setImagen} fileSelected={fileSelected} setFileSelected={setFileSelected} handleAnalizar={handleAnalizar} />

        </Container>
      </Page>
    </Popup>
  );
};

export default InstruccionesPopup;


const Container = styled.div`
  height: auto;
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

const ImageContainer = styled.div`
  height: auto;
  width: 70%;


  max-width: 350px; /* Ancho máximo de 500px */
  margin: 1% auto;

  overflow: hidden;

  position: relative;

  
  border: 1px solid blue;
`

const Imagen = styled.img`
  width: 100%;
  height: auto;
  margin: 0 auto;
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

  border: 1px solid red;
`
