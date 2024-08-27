import React, { useState, useEffect } from 'react';

import FilePicker from '../components/file-piker';
import ResultPopUp from '../components/popup-result';


import styled from "styled-components";


import { MdImageSearch} from "react-icons/md";
import { TbRulerMeasure } from "react-icons/tb";
import { PiCubeFocusDuotone } from "react-icons/pi";
import { AiOutlineAim } from "react-icons/ai";
import { MdNetworkWifi } from "react-icons/md";
import { IoMenu } from "react-icons/io5";


import URLPicker from '../components/url-piker';

import {
  Progressbar,
  Block,
  BlockTitle,
  f7
} from 'framework7-react';

/**
* @module Cribado
*/

/**
* Cribado Page
*
* Este componente representa la página del cribado de la aplicación.
*
* @returns {JSX.Element} 
*/
export function Analizar () {

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
  * @memberof module:Cribado
  * @name useEffect
  */
  useEffect(() => { 
    // Función para comprobar si la pantalla es lo suficientemente estrecha 
    const checkIfMobile = () => {
        const containerWidth = document.getElementById('container').offsetWidth;
        //console.log(containerWidth)
        setIsMobile(containerWidth <= 800); // Ajusta este valor 
    };

    // Llama a la función de comprobación cuando se carga la página y cada vez que se redimensiona la ventana
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    // Limpia el event listener al desmontar el componente para evitar fugas de memoria
    return () => {
        window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  /**
  * Efecto que verifica si la pantalla ha cambiado de tamaño
  * lo suficiente para pasar del modo escritorio al modo smartphone
  *
  * @method
  * @memberof module:Cribado
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

  //#region ------ PANEL                ------------------------------------------------------------------------

  const handleMenu = () => {
    f7.panel.open('#home');
  }

  //#endregion

  
  /**
  * Imagem seleccionada.
  * @const {string} imagen 
  */
  const [imagen, setImagen] = useState(null)
  /**
  * Variable de control de la seleccion de la imagen.
  * @const {boolean} fileSelected 
  */
  const [fileSelected, setFileSelected] = useState(false);
  const [resultPopUp, setResultPopUp] = useState(false)
  const [analizar, setAnalizar] = useState(false)
  const [analizado, setAnalizado] = useState(false)

  const handleCerrar = () => {
    setImagen(null)
    setFileSelected(false)
    setResultPopUp(false)
    closePopup()
  }

  /**
  * Manejadora para cerrar el popup del analisis.
  *
  * @method
  * @memberof module:Cribado
  * @name closeResultPopUp
  */
  const closeResultPopUp = () => {
    setResultPopUp(false)
    setAnalizar(false)
    setAnalizado(false)
  }

  /**
  * Manejadora para analizar la imagen.
  *
  * @method
  * @memberof module:Cribado
  * @name handleAnalizar
  */
  const handleAnalizar = () => {
    //closeAvisoPopup()
    setResultPopUp(true)
    setAnalizar(true)
  }
  /**
  * Imagem seleccionada.
  * @const {string} imagenUrl 
  */
  const [imagenUrl, setImagenUrl] = useState(null);
  /**
  * Variable de control de la seleccion de la imagen.
  * @const {boolean} fileSelectedUrl 
  */
  const [fileSelectedUrl, setFileSelectedUrl] = useState(false);
  const [resultPopUpUrl, setResultPopUpUrl] = useState(false)
  const [analizarUrl, setAnalizarUrl] = useState(false)
  const [analizadoUrl, setAnalizadoUrl] = useState(false)

  /**
  * Manejadora para cerrar el popup del analisis de la imagen URL.
  *
  * @method
  * @memberof module:Cribado
  * @name handleCerrarUrl
  */
  const handleCerrarUrl = () => {
    setImagenUrl(null)
    setFileSelectedUrl(false)
    setResultPopUpUrl(false)
    closePopupUrl()
  }

  /**
  * Manejadora para analizar la imagen URL.
  *
  * @method
  * @memberof module:Cribado
  * @name closeResultPopUpUrl
  */  
  const closeResultPopUpUrl = () => {
    setImagenUrl(null)
    setFileSelectedUrl(false)
    setResultPopUpUrl(false)
    setAnalizarUrl(false)
    setAnalizadoUrl(false)
  }

  const handleAnalizarUrl = () => {
    //closeAvisoPopup()
    setResultPopUpUrl(true)
    setAnalizarUrl(true)
  }



  return(
    <div>

      { isMobile ? (

        <div class="page">

          { isMobile2 ? (
            <div class="navbar" style={{display: 'grid', gridTemplateColumns: ' 1% 40px 20% 70%', background: 'teal', color: '#ffffff', textAlign: 'center', alignItems: 'center',  fontSize: '170%', lineHeight: '250%'}}>
          
              <div/>
              <IoMenu onClick={handleMenu} style={{width: '100%', fontSize: '40px', color:'white'}}/>
              
              <div onClick={handleMenu} style={{width: '100%', fontSize: '120%'}}>
                Analizar
              </div>


            </div>
          ):(
            <div class="navbar" style={{display: 'grid', gridTemplateColumns: '1fr', background: 'teal', color: '#ffffff', textAlign: 'center',alignContent: 'center', fontSize: '170%'}}>
              <span style={{}}>Analizar</span>
            </div>
          )}  

          <div class="page-content">
            

            <Container>
              
              <BlockTitle large>Realizar un análisis rapido</BlockTitle>
              <Block strong outline inset>
                <p style={{fontWeight: '600', fontSize: '120%'}}>
                Siga las instrucciones para comprobar el estado dermatológico de una lesión sin añadirlo al seguimiento.
                </p>
              </Block>
              
              <Block strong outline inset>
                <p style={{fontWeight: '600', fontSize: '120%'}}>
                Se recuerda que el análisis completo se debe respaldar con un profesional, esta herramienta realiza un cribado general y sensible con el fin de descartar lesiones malignas.            
                </p>
              </Block>

              <BlockTitle large>Imagen del dispositivo</BlockTitle>


              <Container2 style={{borderRadius: '20px'}}>

                <Block>
                <div className="Linkicon" style={{display: 'grid', gridTemplateColumns: '10% 90%', alignItems: 'center', margin:'5% 0'}}>
                  <MdImageSearch  style={{width: '100%', fontSize: '30px'}}/>
                  <div style={{width: '100%', fontWeight: 'bold', fontSize: '150%'}}>
                    Cómo elegir la imagen para el análisis:
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

                <br/>

                <Progressbar progress={0} color="teal" id="demo-inline-progressbar" />

                <br/>

                <Container>
                  <FilePicker imagen={imagen} setImagen={setImagen} fileSelected={fileSelected} setFileSelected={setFileSelected} handleAnalizar={handleAnalizar} />
                </Container>

                <br/>

              </Container2>

              <ResultPopUp showPopup={resultPopUp} cerrarTodo={handleCerrar} closePopup={closeResultPopUp} imagen={imagen} analizar={analizar} analizado={analizado} setAnalizado={setAnalizado} simple={1}/>

              <BlockTitle large>Imagen de internet</BlockTitle>

              <Container2 style={{borderRadius: '20px'}}>
                <div className="Linkicon" style={{display: 'grid', gridTemplateColumns: '10% 90%', alignItems: 'center', margin:'5% 0'}}>
                  <MdNetworkWifi mageSearch  style={{width: '100%', fontSize: '30px'}}/>
                  <div style={{width: '100%', fontWeight: 'bold', fontSize: '150%'}}>
                    Cómo elegir una imagen de Internet:
                  </div>
                </div>

                <div className="Linkicon" style={{display: 'grid', gridTemplateColumns: '10% 90%', alignItems: 'center', margin:'5% 0'}}>
                  <TbRulerMeasure style={{width: '100%', fontSize: '30px', color:'#006689'}}/>
                  <div style={{width: '100%', fontSize: '120%'}}>
                    Elija una imagen donde se aprecie claramente la lesión, preferiblemente con dimensiones dermatoscopicas.
                  </div>
                </div>

                
                <URLPicker imagen={imagenUrl} setImagen={setImagenUrl} fileSelected={fileSelectedUrl} setFileSelected={setFileSelectedUrl} handleAnalizar={handleAnalizarUrl}/>

              </Container2>
              <br/>

              <ResultPopUp showPopup={resultPopUpUrl} cerrarTodo={handleCerrarUrl} closePopup={closeResultPopUpUrl} imagen={imagenUrl} analizar={analizarUrl} analizado={analizadoUrl} setAnalizado={setAnalizadoUrl} simple={1}/>

            </Container>

          </div>
        </div>


      ):(

        <div class="page">

          { isMobile2 ? (
            <div class="navbar" style={{display: 'grid', gridTemplateColumns: ' 1% 40px 20% 70%', background: 'teal', color: '#ffffff', textAlign: 'center', alignItems: 'center',  fontSize: '170%', lineHeight: '250%'}}>
          
              <div/>
              <IoMenu onClick={handleMenu} style={{width: '100%', fontSize: '40px', color:'white'}}/>
              
              <div onClick={handleMenu} style={{width: '100%', fontSize: '120%'}}>
                      VideSkin
              </div>


            </div>
          ):(
            <div class="navbar" style={{display: 'grid', gridTemplateColumns: '1fr', background: 'teal', color: '#ffffff', textAlign: 'center',alignContent: 'center', fontSize: '170%'}}>
              <span style={{}}>VideSkin</span>
            </div>
          )}

          <div class="page-content">

            
            <div class='analGrid'>
              <div className='columna2'>
                <BlockTitle large>Realizar un análisis rapido</BlockTitle>
                <Block style={{margin: '0px 20px 0px 20px'}} strong inset>
                  <p style={{fontWeight: '600', fontSize: '120%'}}>
                  Siga las instrucciones para comprobar el estado dermatológico de una lesión sin añadirlo al seguimiento.
                  </p>
                </Block>
                

                <Container2 style={{borderRadius: '20px'}}>
                <BlockTitle large>Imagen de internet</BlockTitle>

                  <div className="Linkicon" style={{display: 'grid', gridTemplateColumns: '10% 90%', alignItems: 'center', margin:'5% 0'}}>
                    <MdNetworkWifi mageSearch  style={{width: '100%', fontSize: '30px'}}/>
                    <div style={{width: '100%', fontWeight: 'bold', fontSize: '150%'}}>
                      Cómo elegir una imagen de Internet:
                    </div>
                  </div>

                  <div className="Linkicon" style={{display: 'grid', gridTemplateColumns: '10% 90%', alignItems: 'center', margin:'5% 0'}}>
                    <TbRulerMeasure style={{width: '100%', fontSize: '30px', color:'#006689'}}/>
                    <div style={{width: '100%', fontSize: '120%'}}>
                      Elija una imagen donde se aprecie claramente la lesión, preferiblemente con dimensiones dermatoscopicas.
                    </div>
                  </div>

                  
                  <URLPicker imagen={imagenUrl} setImagen={setImagenUrl} fileSelected={fileSelectedUrl} setFileSelected={setFileSelectedUrl} handleAnalizar={handleAnalizarUrl}/>

                </Container2>
              </div>
              <div className='columna2'>

                <Block style={{margin: '73px 20px 0px 20px'}} strong inset>
                  <p style={{fontWeight: '600', fontSize: '120%'}}>
                  Se recuerda que el análisis completo se debe respaldar con un profesional, esta herramienta realiza un cribado general y sensible con el fin de descartar lesiones malignas.            
                  </p>
                </Block>
                
                  

                <Container2 style={{borderRadius: '20px'}}>

                <BlockTitle large>Imagen del dispositivo</BlockTitle>

                  <Block>
                    <div className="Linkicon" style={{display: 'grid', gridTemplateColumns: '10% 90%', alignItems: 'center', margin:'5% 0'}}>
                      <MdImageSearch  style={{width: '100%', fontSize: '30px'}}/>
                      <div style={{width: '100%', fontWeight: 'bold', fontSize: '150%'}}>
                        Cómo elegir la imagen para el análisis:
                      </div>
                    </div>

                    <div className="Linkicon" style={{display: 'grid', gridTemplateColumns: '10% 90%', alignItems: 'center', margin:'3% 0'}}>
                      <PiCubeFocusDuotone style={{width: '100%', fontSize: '30px', color:'#006689'}}/>
                      <div style={{width: '100%', fontSize: '120%'}}>
                        Asegúrate de que el área de la fotografía esté bien iluminada y enfocada.
                      </div>
                    </div>

                    <div className="Linkicon" style={{display: 'grid', gridTemplateColumns: '10% 90%', alignItems: 'center', margin:'3% 0'}}>
                      <AiOutlineAim  style={{width: '100%', fontSize: '30px', color:'#006689'}}/>
                      <div style={{width: '100%', fontSize: '120%'}}>
                        Coloca la cámara del dispositivo sobre area de la piel donde esta la lesión y en dirección a esta.
                      </div>
                    </div>

                    <div className="Linkicon" style={{display: 'grid', gridTemplateColumns: '10% 90%', alignItems: 'center', margin:'3% 0'}}>
                      <TbRulerMeasure style={{width: '100%', fontSize: '30px', color:'#006689'}}/>
                      <div style={{width: '100%', fontSize: '120%'}}>
                        Mantén el dispositivo a una distancia de unos 10cm y asegurate de centrar la lesión en el medio de la imagen.
                      </div>
                    </div>

                  </Block>

                  <br/>

                  <Progressbar progress={0} color="teal" id="demo-inline-progressbar" />

                  <br/>

                  <Container>
                  <FilePicker imagen={imagen} setImagen={setImagen} fileSelected={fileSelected} setFileSelected={setFileSelected} handleAnalizar={handleAnalizar} />
                  </Container>

                  <br/>

                </Container2>

              </div>
            </div>
            
            <ResultPopUp showPopup={resultPopUp} cerrarTodo={handleCerrar} closePopup={closeResultPopUp} imagen={imagen} analizar={analizar} analizado={analizado} setAnalizado={setAnalizado} simple={1}/>


            <ResultPopUp showPopup={resultPopUpUrl} cerrarTodo={handleCerrarUrl} closePopup={closeResultPopUpUrl} imagen={imagenUrl} analizar={analizarUrl} analizado={analizadoUrl} setAnalizado={setAnalizadoUrl} simple={1}/>

          </div>
        </div>

      )}


      
    </div>
  );
}export default Analizar;

const Container =styled.div`
  height: auto;
  width: 90%;
  max-width: 700px; /* Ancho máximo de 500px */
  
  margin: 10px auto;
  
`

const Container2 = styled.div`
  height: auto;
  width: 95%;
  
  margin: 5% auto;

  border: 4px solid teal;
  
`
