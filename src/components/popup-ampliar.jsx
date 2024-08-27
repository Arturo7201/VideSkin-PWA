import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { userConfig} from '../js/config';


import html2canvas from 'html2canvas';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

import 'react-circular-progressbar/dist/styles.css';

import { CgDanger } from "react-icons/cg";
import { PiWarningFill } from "react-icons/pi";
import { MdHealthAndSafety } from "react-icons/md";
import Swal from 'sweetalert2';

import { MdArrowBack } from 'react-icons/md';
import { FaRegArrowAltCircleDown } from "react-icons/fa";


import { 
  f7,
  Popup,
  Button,
  Page,
  Progressbar,
  CardHeader,
  CardContent,
} from 'framework7-react'; 

/**
* @module PopUpAmpliar
*/

/**
* PopUp Ampliar
*
* Este componente representa el PopUp para ampliar los resultados de una lesión.
* @component
* @param {boolean} props.showPopup - Indica si el PopUp está visible.
* @param {function} props.closePopup - Función para cerrar el PopUp.
* @param {Object} props.marker - El marcador de la lesión seleccionada.
* @param {function} props.setMarker - Función para actualizar el marcador de la lesión.
* @param {function} props.handleActualizar - Función para manejar la actualización del marcador.
* @param {boolean} props.simple - Indica si el PopUp está en modo simple.
* @returns {JSX.Element} 
*/

function AmpliarPopUp({ showPopup, closePopup, marker, setMarker, handleActualizar, simple }) {

  //#region --------------------- RENDERIZADO RESPONSIVE ------------------------------------------------------------------------------------------------------------------

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => { 
    // Función para comprobar si la pantalla es lo suficientemente estrecha 
    const checkIfMobile = () => {
        const containerWidth = document.getElementById('info').offsetWidth;
        //console.log(containerWidth)
        setIsMobile(containerWidth <= 400); // Ajusta este valor 
    };

    // Llama a la función de comprobación cuando se carga la página y cada vez que se redimensiona la ventana
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    // Limpia el event listener al desmontar el componente para evitar fugas de memoria
    return () => {
        window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  //#endregion

  const tiposLesion = ["Melanoma","Nevus","Carcinoma basocelular","Queratosis actínica","Lesión benigna de queratosis","Dermatofibroma","Lesiones vasculares"]
  const riskLesion =["alto","medio","alto","medio","bajo","bajo","bajo"]
  const colorRisk = ["#ac3939","#ffc34d","#ac3939","#ffc34d","#00802b","#00802b","#00802b"]
  const infoLesion = ["Cáncer de piel altamente agresivo.", "Lunares benignos, puede transformarse.", "El tipo más común de cáncer de piel.", "Lesión precancerosa causada por la exposición al sol.", "También llamadas manchas de la edad, benignas.", "Lesión benigna, pueden confundirse con melanoma.", "Son problemas en los vasos sanguíneos de la piel."]
  const [predicciones, setPredicciones] = useState([])
  const [clasificacion, setClasificacion] = useState([])

  //#region -------------------------- PROCESAR MARKER -----------------------------------------------------------------------------------------------------
  /**
  * Imagen seleccionada.
  * @const {String | null} imagen 
  */
  const [imagen, setImagen] = useState(null)
  /**
  * Peligrosidad de la lesión.
  * @const {String | null} probabilidad 
  */
  const [probabilidad, setProbabilidad] = useState(null)
  /**
  * Control sobre el analisis.
  * @const {boolean} analizado 
  */
  const analizado = useState(true)

  /**
  * Efecto que cuando el objeto marker cambia,
  * actualiza los valores del PopUp Ampliado.
  *
  * @method
  * @param {Object} marker
  * @memberof module:PopUpAmpliar
  * @name useEffect
  */
  useEffect(() => {
    if (marker != null) {
      //console.log(marker);
      setImagen(marker.imagen);
      setProbabilidad(marker.probabilidad);
      setPredicciones(marker.predicciones);
      fechthistorial(marker.id);
    }
  }, [marker]);
  
  /**
  * Efecto que cuando cambian los valores del PopUp Ampliado,
  * procesa y renderiza los resultados.
  *
  * @method
  * @param {String} imagen
  * @param {String} probabilidad
  * @param {String} predicciones
  * @memberof module:PopUpAmpliar
  * @name useEffect
  */
  useEffect(() => {
    if (imagen && probabilidad && predicciones) {
      procesarAnalisis();
    }
  }, [imagen, probabilidad, predicciones]);
  
  /**
  * Manejadora para procesar el renderizado del analisis.
  *
  * @method
  * @memberof module:PopUpAmpliar
  * @name procesarAnalisis
  */  
  const procesarAnalisis = () => {

    const prediccionesClon = [...predicciones].slice(1)

    // Ordenar las predicciones de mayor a menor
    prediccionesClon.sort((a, b) => b - a);


    // Tomar las tres primeras predicciones
    const tresPredicciones = prediccionesClon.slice(0, 3);


    // Llenar el array clasificacion con las tres predicciones y sus riesgos
    const nuevaClasificacion = tresPredicciones.map((prediccion) => {
      const index = predicciones.indexOf(prediccion) - 1
      const tipoLesion = tiposLesion[index]
      const riesgo = riskLesion[index]
      const color = colorRisk[index]
      const info = infoLesion[index]
    return { index, tipoLesion, riesgo, prediccion, color, info}
    });

    setClasificacion(nuevaClasificacion);

  }


  /**
  * Manejadora para procesar el renderizado de la RiskBar.
  *
  * @method
  * @param {Integer} risk
  * @memberof module:PopUpAmpliar
  * @name renderRiskBar
  */  
  const renderRiskBar = (risk) =>{
    if (risk < 40) {
      return (
        <div>
          <Progressbar color="green" progress={risk}
          style={{
            width: '100%', // Cambia el ancho de la barra de progreso
            height: '20px', // Ajusta la altura de la barra de progreso
            borderRadius: '10px', // Define el radio de borde para hacer la barra de progreso más redondeada
            backgroundColor: 'lightgray', // Cambia el color de fondo de la barra de progreso
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' // Agrega sombra para mejorar la apariencia
          }} /> 
        </div>
      );
    } else if (risk > 75) {
      return (
        <Progressbar color="pink" progress={risk}
        style={{
          width: '100%', // Cambia el ancho de la barra de progreso
          height: '20px', // Ajusta la altura de la barra de progreso
          borderRadius: '10px', // Define el radio de borde para hacer la barra de progreso más redondeada
          backgroundColor: 'lightgray', // Cambia el color de fondo de la barra de progreso
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' // Agrega sombra para mejorar la apariencia
        }} />
      );
    } else {
      return (
        <div>
        <Progressbar color='orange' progress={risk} 
          style={{
            width: '100%', // Cambia el ancho de la barra de progreso
            height: '20px', // Ajusta la altura de la barra de progreso
            borderRadius: '10px', // Define el radio de borde para hacer la barra de progreso más redondeada

            backgroundColor: 'lightgray', // Cambia el color de fondo de la barra de progreso
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' // Agrega sombra para mejorar la apariencia
          }} />
      </div>
      );
    }
  }

  /**
  * Manejadora para calificar el riesgo.
  *
  * @method
  * @param {Integer} probabilidad
  * @memberof module:PopUpAmpliar
  * @name clasificarRiesgo
  */  
  const clasificarRiesgo = (probabilidad) => {
    if (probabilidad >= 60) {
      return 'alto';
    } else if (probabilidad >= 40) {
      return 'medio';
    } else {
      return 'bajo';
    }
  };

  /**
  * Manejadora para procesar el renderizado de los iconos.
  *
  * @method
  * @param {Integer} risk
  * @memberof module:PopUpAmpliar
  * @name renderIcon
  */  
  const renderIcon = (risk) => {
    if (typeof risk === 'string') {
      switch (risk) {
        case 'alto':
          return <CgDanger style={{ width: '100%', fontSize: '20px', color: 'red' }} />;
        case 'medio':
          return <PiWarningFill style={{ width: '100%', fontSize: '20px', color: 'orange' }} />;
        case 'bajo':
          return <MdHealthAndSafety style={{ width: '100%', fontSize: '20px', color: 'green' }} />;
        default:
          return null; 
      }
    } else if (typeof risk === 'number') {
      if (risk >= 60) {
        return <CgDanger style={{ width: '100%', fontSize: '35px', color: 'red' }} />;
      } else if (risk >= 40) {
        return <PiWarningFill style={{ width: '100%', fontSize: '35px', color: 'orange' }} />;
      } else {
        return <MdHealthAndSafety style={{ width: '100%', fontSize: '35px', color: 'green' }} />;
      }
    } else {
      return null; // Manejar otros casos, si es necesario
    }
  };

  //#endregion
  
  //#region ------------------------ VER HISTORIAL ---------------------------------------------------------------------------------------------------------------------
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
  * Historial de la lesión.
  * @const {string} historial 
  */  
  const [historial, setHistorial] = useState([])
  const [subIdActual, setSubIdActual] = useState([])

  const [showHistorial, setShowHistorial] = useState(null)
  /**
  * Manejadora para cerrar el renderizado del historial.
  *
  * @method
  * @memberof module:PopUpAmpliar
  * @name closeResultPopUp
  */ 
  const closeHistorial = () => {
    setShowHistorial(false)
  }
  /**
  * Manejadora para abrir el renderizado del historial.
  *
  * @method
  * @memberof module:PopUpAmpliar
  * @name closeResultPopUp
  */ 
  const handleVerHistorial = () => {
    setShowHistorial(true)
  }
  /**
  * Pide el historial a la API.
  *
  * @async
  * @method
  * @param {Integer} id
  * @returns {Promise<Object>} 
  * @throws {Error} - Si ocurre un error durante la solicitud de autenticación.
  * @memberof module:PopUpAmpliar
  */ 
  async function fechthistorial(id) {
    try {
      const response = await axios.post(`http://${userConfig.serverIP}:${userConfig.serverPort}/historial`, {id: id}, config);
      //console.log(response.data.markers)
      const newHistorial = response.data.historial.map(registro => ({
        id: id,
        subId: registro.subId,
        dia: registro.dia,
        mes: registro.mes,
        año: registro.año,
        imagen: registro.imagen,
        probabilidad: registro.probabilidad,
        predicciones: registro.predicciones,
        color: registro.color
      }));
      console.log(newHistorial)
      setHistorial([...newHistorial]);

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
          //console.log(config)
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
  
  //#region ---------------------------- VER Y BORRAR DE HISTORIAL ----------------------------------------------------------------------------------------------------------------
  /**
  * Efecto para renderizar la información de la lesión
  * elegida del historial.
  *
  * @method
  * @param {Integer} subIdActual
  * @memberof module:PopUpAmpliar
  * @name useEffect
  */
  useEffect(() => {
    if (subIdActual != null) {
      const registroActual = historial.find(item => item.subId === subIdActual);
      if (registroActual) {
        setMarker(prevMarker => ({
          ...prevMarker,
          imagen: registroActual.imagen,
          probabilidad: registroActual.probabilidad,
          predicciones: registroActual.predicciones
        }));
      }
    }
  }, [subIdActual]);

  /**
  * Manejadora para abrir lesión del historial.
  *
  * @method
  * @memberof module:PopUpAmpliar
  * @name handleAmpliarMarkerHistorial
  */

  const handleAmpliarMarkerHistorial = (registro) => {
    

    setSubIdActual(registro.subId)

    setShowHistorial(false)
 
  }

  const openConfirmBorrar = (registro) => {
    f7.dialog.confirm('¿Esta seguro de que desea borrar el registro?', () => {
      handleBorrarMarkerHistorial(registro)
    });
  };
  /**
  * Pide a la API borrar el historial.
  *
  * @async
  * @method
  * @param {Object} registro
  * @returns {Object} 
  * @throws {Error} 
  * @memberof module:PopUpAmpliar
  */ 
  async function handleBorrarMarkerHistorial(registro) {
    try {
      const response = await axios.post(`http://${userConfig.serverIP}:${userConfig.serverPort}/delete_reg_historial`, {subId: registro.subId}, config);
      console.log(response.data.mesage)
      
      const newHistorial = historial.filter(item => item.subId !== registro.subId)
      setHistorial(newHistorial)

      setSubIdActual(newHistorial[newHistorial.length-1].subId)

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
          //console.log(config)
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

  //#region ------------------------ VER INFO ---------------------------------------------------------------------------------------------------------------------

  const [infoPopUp, setInfoPopUp] = useState(false)
  const closeInfoPopUp = () => {
    setInfoPopUp(false)
  }
  const [index, setIndex] = useState(null)
  const handleAmpliar = (index) => {
    setIndex(index)
    setInfoPopUp(true)
  }

  //#endregion
  
  //#region ---------- AMPLIAR IMAGEN --------------------------------------------------------------------------------------------------------------------------------------------------------
  const [imagenAmpliada, setImagenAmpliada] = useState(false)
  const handleAmpliarImagen = () => {
    setImagenAmpliada(true)
  }
  const handleCloseImagenAmpliada = () => {
     setImagenAmpliada(false)
  }

  //#endregion

  //#region --------------- DESCARGA INFORME ------------------------------------------------------------------------------------------------------------------------------------------
  const divRef = useRef(null);
  /**
  * Manejadora para descargar informe del analisis.
  *
  * @method
  * @memberof module:PopUpAmpliar
  * @name handleGenerateJPEG
  */
  const handleGenerateJPEG = async () => {


    const input = divRef.current;
    if (!input) {
      console.error('Element not found');
      return;
    }
    try {
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL('image/jpeg');
      
      if (imgData === 'data:,') {
        console.error('Failed to capture the content as JPEG');
        return;
      }
      console.log(imgData)
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'resultados.jpg';
      link.click();

    } catch (error) {
      console.error('Error generating JPEG:', error);
    }
  };

  //#endregion

  const handleCancelar = () => {
    closePopup()
  }

  return (
    <div>

      <Popup id='info' opened={showPopup} onClose={closePopup} closeByBackdropClick={false} style={{border: '1px solid teal'}}>
        { showHistorial ? (
          <div>
            <Page>
              <div className="navbar" style={{display: 'grid', gridTemplateColumns: '5% 1fr', background: 'teal', color: '#ffffff', textAlign: 'center', alignItems: 'center',  fontSize: '170%', lineHeight: '250%'}}>
                <MdArrowBack style={{ fontSize: '24px', marginLeft: '90%', cursor: 'pointer'}} onClick={closeHistorial}/>
                <span style={{ marginLeft: '10%', marginRight: '15%', textAlign: 'center'}}>Historial</span>
              </div>

                <div className="timeline timeline-sides">

                  {historial.map((registro, index) => (
                    <div className="timeline-item" key={index}>
                      <div className="timeline-item-date">
                        {registro.dia} <small>{registro.mes}</small>
                      </div>
                      <div className="timeline-item-divider"></div>
                      <div className="timeline-item-content">
                        <div className="timeline-item-inner">
                          <div style={{display: 'flex', flexDirection: 'column', width: '99%',height: '100%'}}>
                            <div style={{flex: 1, margin: '2%', display: 'grid', gridTemplateColumns: '45% 50%', alignItems: 'center'}}>
                              <img src={`data:image/png;base64, ${registro.imagen}`} style={{ borderRadius: '25px', width: "100%", height: '100px', marginTop: '3%', marginLeft: '3%', objectFit:'cover', border: `4px solid teal`}}/>
                              <div style={{width: '75%', height: '0', paddingBottom: '70%', position: 'relative', maxWidth: '90px', maxHeight: '80px', margin: 'auto 25%'}}>
                                <CircularProgressbar value={registro.probabilidad} text={`${registro.probabilidad}%`} styles={buildStyles({
                                                                                                                                  // Rotation of path and trail, in number of turns (0-1)
                                                                                                                                  rotation: 0,

                                                                                                                                  // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                                                                                                                  strokeLinecap: 'round',

                                                                                                                                  // Text size
                                                                                                                                  textSize: '160%',
                                                                                                                                  fontWeight: 'bolder',

                                                                                                                                  // How long animation takes to go from one percentage to another, in seconds
                                                                                                                                  pathTransitionDuration: 1,

                                                                                                                                  // Can specify path transition in more detail, or remove it entirely
                                                                                                                                  // pathTransition: 'none',

                                                                                                                                  // Colors
                                                                                                                                  pathColor: registro.color,
                                                                                                                                  textColor: 'black',
                                                                                                                                  trailColor: '#d6d6d6',
                                                                                                                                  backgroundColor: 'black',
                                                                                                                                })}/>
                              </div>
                            </div>
                            <div style={{flex: 1, margin: '5% 4%', marginBottom: '5%', display: 'grid', gridTemplateColumns: '100%', borderRadius: '16px'}}>
                              <div style={{display: 'grid', gridTemplateColumns: '48% 48%', gap: '4%'}}>
                                <Button fill color="blue" onClick={() => handleAmpliarMarkerHistorial(registro)}>Ver</Button>
                                {index < historial.length - 1 && (
                                  <Button fill color='pink' onClick={() => openConfirmBorrar(registro)}>Borrar</Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button fill onClick={handleActualizar} color='pink'>Actualizar Lesión</Button>
                </div>
             </Page>
          </div>
        ):(
          <div>
            { infoPopUp ? (
              <Page>
                <div className="navbar" style={{display: 'grid', gridTemplateColumns: '5% 1fr', background: 'teal', color: '#ffffff', textAlign: 'center', alignItems: 'center',  fontSize: '170%', lineHeight: '250%'}}>
                  <MdArrowBack style={{ fontSize: '24px', marginLeft: '90%', cursor: 'pointer'}} onClick={closeInfoPopUp}/>
                  <span style={{ marginLeft: '10%', marginRight: '15%', textAlign: 'center'}}>Tipo de lesión</span>
                </div>
                <div>
                { index === 0 && (
                  <div class="card demo-card-header-pic" style={{backgroundColor: 'white', border: '8px solid #ac3939'}}>
                    <CardHeader style={{padding: '10px'}}>
                        <img className="tipo" src="../images/MEL.jpg"/>
                        <div className={isMobile ? 'tipo-tittle1-mobile' : 'tipo-tittle1'} >Melanoma</div>
                    </CardHeader>
                    <CardContent>
                      <p className="tipo-subtittle1"><CgDanger style={{ width: '10%', fontSize: '20px', color: 'red' }}/>Riesgo <span className='alto'> ALTO</span>: Cáncer de piel</p>
                        <p className='text-body'>
                        El melanoma es un tipo de cáncer de piel altamente agresivo que se desarrolla a partir de los melanocitos, las células que producen el pigmento melanina. Se caracteriza por un crecimiento anormal de lunares o manchas en la piel que pueden volverse irregulares en forma y color, y pueden aparecer en cualquier parte del cuerpo.
                        </p>
                    </CardContent>
                  </div>
                )}

                { index === 1 && (
                  <div class="card demo-card-header-pic" style={{backgroundColor: 'white', border: '8px solid #ffc34d'}}>
                    <CardHeader style={{padding: '10px'}}>
                        <img className="tipo" src="../images/NV.jpg"/>
                        <div className={isMobile ? 'tipo-tittle2-mobile' : 'tipo-tittle2'} >Nevus</div>
                    </CardHeader>
                    <CardContent>
                      <p className="tipo-subtittle2"><PiWarningFill style={{ width: '10%', fontSize: '20px', color: 'orange' }}/>Riesgo <span className='medio'> POTECIAL</span>: Lunar</p>

                      <p className='text-body'>
                        Los nevus, comúnmente conocidos como lunares, son crecimientos pigmentados en la piel que pueden variar en tamaño, forma y color. La mayoría de los nevus son benignos, pero algunos pueden transformarse en melanoma, especialmente si experimentan cambios en el tamaño, forma o color con el tiempo.                            </p>
                    </CardContent>
                  </div>
                )}

                { index === 2 && (
                  <div class="card demo-card-header-pic" style={{backgroundColor: 'white', border: '8px solid #ac3939'}}>
                    <CardHeader style={{padding: '10px'}}>
                        <img className="tipo" src="../images/BCC.jpg"/>
                        <div className={isMobile ? 'tipo-tittle1-mobile' : 'tipo-tittle1'}>Carcinoma Basocelular</div>
                    </CardHeader>
                    <CardContent>
                      <p className="tipo-subtittle1"><CgDanger style={{ width: '10%', fontSize: '20px', color: 'red' }}/>Riesgo <span className='alto'> ALTO</span>: Cáncer de piel</p>

                        <p className='text-body'>
                        El carcinoma basocelular es el tipo más común de cáncer de piel. A menudo se presenta como una pequeña protuberancia o bulto en la piel que puede ser de color rosa, rojo, blanco o translúcido. Si bien rara vez se disemina a otras partes del cuerpo, puede causar daño localizado si no se trata.                            </p>
                    </CardContent>
                  </div>
                )}

                { index === 3 && (
                      <div class="card demo-card-header-pic" style={{backgroundColor: 'white', border: '8px solid #ffc34d'}}>
                      <CardHeader style={{padding: '10px'}}>
                          <img className="tipo" src="../images/AKIEC.jpg"/>
                          <div className={isMobile ? 'tipo-tittle2-mobile' : 'tipo-tittle2'} >Queratosis Actínica</div>
                      </CardHeader>
                      <CardContent>
                        <p className="tipo-subtittle2"><PiWarningFill style={{ width: '10%', fontSize: '20px', color: 'orange' }}/>Riesgo <span className='medio'> POTECIAL</span>: Lesión precancerosa</p>

                          <p className='text-body'>
                          La queratosis actínica, también conocida como queratosis solar, es una lesión precancerosa causada por la exposición crónica a la radiación ultravioleta del sol. Se manifiesta como manchas rojas, ásperas y escamosas en la piel que pueden volverse sensibles o dolorosas.                            </p>
                      </CardContent>
                  </div>
                )}

                { index === 4 && (
                    <div class="card demo-card-header-pic" style={{backgroundColor: 'white', border: '8px solid #00802b'}}>
                      <CardHeader style={{padding: '10px'}}>
                          <img className="tipo" src="../images/BKL.jpg"/>
                          <div className={isMobile ? 'tipo-tittle3-mobile' : 'tipo-tittle3'} >Queratosis Seborreica</div>
                      </CardHeader>
                      <CardContent>
                        <p className="tipo-subtittle3"><MdHealthAndSafety style={{ width: '10%', fontSize: '20px', color: 'green' }}/><span className='bajo'> SIN RIESGO</span>: Mancha de edad</p>

                          <p className='text-body'>
                          Las queratosis seborreicas, también llamadas verrugas seborreicas o manchas de la edad, son crecimientos cutáneos benignos que generalmente aparecen en áreas de la piel expuestas al sol. A menudo son de color marrón oscuro o negro y tienen una textura cerosa o escamosa.                            </p>
                      </CardContent>
                  </div>
                )}

                { index === 5 && (
                  <div class="card demo-card-header-pic" style={{backgroundColor: 'white', border: '8px solid #00802b'}}>
                    <CardHeader style={{padding: '10px'}}>
                        <img className="tipo" src="../images/DF.jpg"/>
                        <div className={isMobile ? 'tipo-tittle3-mobile' : 'tipo-tittle3'} >Dermatofibroma</div>
                    </CardHeader>
                    <CardContent>
                        <p className="tipo-subtittle3"><MdHealthAndSafety style={{ width: '10%', fontSize: '20px', color: 'green' }}/><span className='bajo'> SIN RIESGO</span>: Lesión benigna</p>

                        <p className='text-body'>
                        El dermatofibroma es una lesión cutánea benigna que se desarrolla a partir de células fibroblásticas en la dermis de la piel. Por lo general, aparece como un pequeño bulto duro de color marrón o rosa que puede tener una apariencia ligeramente elevada. Aunque son inofensivos, a veces pueden confundirse con melanoma debido a su apariencia.                            </p>
                    </CardContent>
                  </div>
                )}

                { index === 6 && (
                    <div class="card demo-card-header-pic" style={{backgroundColor: 'white', border: '8px solid #00802b'}}>
                      <CardHeader style={{padding: '10px'}}>
                          <img className="tipo" src="../images/VASC.jpg"/>
                          <div className={isMobile ? 'tipo-tittle3-mobile' : 'tipo-tittle3'} >Lesiones Vasculares</div>
                      </CardHeader>
                      <CardContent>
                        <p className="tipo-subtittle3"><MdHealthAndSafety style={{ width: '10%', fontSize: '20px', color: 'green' }}/><span className='bajo'> SIN RIESGO</span>: Lesión benigna</p>

                          <p className='text-body'>
                          Las lesiones vasculares son problemas en los vasos sanguíneos de la piel. Incluyen hemangiomas (manchas rojas en bebés), malformaciones vasculares y telangiectasias (pequeñas venas visibles). Estas lesiones pueden ser de nacimiento o desarrollarse con el tiempo. En términos cancerígenos son inofensivas, aunque pueden necesitar tratamiento si afectan la apariencia o la función.                            </p>
                      </CardContent>
                  </div>
                )}
      
                </div>
              </Page>
            ):(
              <div>
                { imagenAmpliada ? (
                  <div>
                    <div className="navbar" style={{display: 'grid', gridTemplateColumns: '5% 1fr', background: 'teal', color: '#ffffff', textAlign: 'center', alignItems: 'center',  fontSize: '170%', lineHeight: '250%'}}>
                      <MdArrowBack style={{ fontSize: '24px', marginLeft: '90%', cursor: 'pointer'}} onClick={handleCloseImagenAmpliada}/>
                      <span style={{ marginLeft: '10%', marginRight: '15%', textAlign: 'center'}}>Resultados</span>
                    </div>
                    <div  style={{margin: '10% 5%', width: '90%', height: 'auto'}}>
                            <img onClick={handleAmpliarImagen} src={`data:image/png;base64, ${imagen}`}  style={{ borderRadius: '15px', width: "100%", height: 'auto', objectFit:'cover', border: `4px solid teal`}}/>
                    </div>
                  </div>
                ):(
                  <div>
                    <div class="page" >

                      <div className="navbar" style={{background: 'teal', color: '#ffffff', textAlign: 'center', alignItems: 'center',  fontSize: '170%', lineHeight: '250%'}}> 
                        <span style={{ margin: '10%', textAlign: 'center'}}>Resultados</span>
                      </div>

                      <div class='page-content'>


                        {imagen && (
                          <div  style={{margin: '2% 5%', display: 'grid', gridTemplateColumns: '30% 70%', alignItems: 'center'}}>
                            <img onClick={handleAmpliarImagen} src={`data:image/png;base64, ${imagen}`}  style={{ borderRadius: '15px', width: "100%", height: '145px', objectFit:'cover', border: `4px solid teal`}}/>
                            <div style={{display: 'flex', flexDirection: 'column', width: '95%',height: '145px', margin:'0 5%'}}>
                              
                              {!analizado && (
                                <div style={{flex: 3, display: 'grid', alignContent: 'center'}}>
                                  <Progressbar infinite color="multi" style={{
                                                                                width: '100%', // Cambia el ancho de la barra de progreso
                                                                                height: '20px', // Ajusta la altura de la barra de progreso
                                                                                borderRadius: '10px', // Define el radio de borde para hacer la barra de progreso más redondeada
                                                                                backgroundColor: 'lightgray', // Cambia el color de fondo de la barra de progreso
                                                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' // Agrega sombra para mejorar la apariencia
                                                                              }} />  
                                </div> 
                              )}
                              {analizado && (
                                <div style={{flex: 3}}>
                                  <div style={{width:'97%', height: '90px', display: 'grid', gridTemplateColumns: '26% 74%', alignContent: 'center', borderRadius: '15px', border: `5px solid #0061A4` }}>
                                    <div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '90px', borderRight: '4px solid #0061A4'}}>
                                      
                                      <div style={{flex: 3, display: 'grid',alignItems: 'center', fontWeight: 'bolder', fontSize: '100%'}}>
                                      {renderIcon(probabilidad)} 
                                      </div>

                                      <div style={{flex: 2, fontWeight: 'bolder', fontSize: '100%', textAlign: 'center'}}>
                                        Riesgo {clasificarRiesgo(probabilidad)}
                                      </div>

                                    </div>

                                    <div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '90px'}}>
                                      <div style={{flex: 3, display: 'grid',alignItems: 'center', fontWeight: 'bolder', fontSize: '120%', color: 'teal', textAlign: 'center'}}>
                                        Probabilidad de Cáncer: {probabilidad}%
                                      </div>
                                      <div style={{flex: 2, width: '90%', margin: 'auto'}}>
                                        {renderRiskBar(probabilidad)} 
                                      </div>

                                    </div>
                                  </div>
                                </div> 
                              )}

                              {simple === 1 && (
                                <div style={{flex: 1}}>
                                  <Button fill onClick={handleCancelar} color="blue" >Cerrar</Button>
                                </div>
                              )}
                              
                              {!simple && (
                                <div style={{flex: 1, display: 'grid', gap: '3%', gridTemplateColumns: '50px 1fr 1fr'}}>
                                  <Button fill onClick={handleGenerateJPEG} color="blue" ><FaRegArrowAltCircleDown style={{fontSize: '45px'}} /></Button>
                                  <Button fill onClick={handleVerHistorial} color="blue" >Historial</Button>
                                  <Button fill onClick={handleCancelar} color="pink" >Cerrar</Button>
                                </div>
                              )}

                            </div>
                          </div>
                        )}
                        
                        {analizado && (
                          <div>
                          {clasificacion.map((item, index) => (
                            <div  key={index} style={{margin: '2% 5%', height: '100px', display: 'grid', gridTemplateColumns: '20% 80%',borderRadius: '15px', border: `8px solid ${item.color}` }}>      
                              <div style={{width: '70%', height: '0', paddingBottom: '70%', position: 'relative', maxWidth: '80px', maxHeight: '80px', margin: 'auto auto'}}>
                                <CircularProgressbar value={item.prediccion} text={`${item.prediccion}%`} styles={buildStyles({
                                                                                                                                  // Rotation of path and trail, in number of turns (0-1)
                                                                                                                                  rotation: 0,

                                                                                                                                  // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                                                                                                                  strokeLinecap: 'round',

                                                                                                                                  // Text size
                                                                                                                                  textSize: '160%',
                                                                                                                                  fontWeight: 'bolder',

                                                                                                                                  // How long animation takes to go from one percentage to another, in seconds
                                                                                                                                  pathTransitionDuration: 1,

                                                                                                                                  // Can specify path transition in more detail, or remove it entirely
                                                                                                                                  // pathTransition: 'none',

                                                                                                                                  // Colors
                                                                                                                                  pathColor: item.color,
                                                                                                                                  textColor: 'black',
                                                                                                                                  trailColor: '#d6d6d6',
                                                                                                                                  backgroundColor: 'black',
                                                                                                                                })}/>
                              </div>   
                              <div style={{width: '98%', height: '90%', display: 'flex', flexDirection: 'column'}}>
                                <div style={{flex: '2', alignContent: 'center'}}>
                                  <div className="Linkicon" style={{display: 'grid', gridTemplateColumns: '7% 90%', alignItems: 'center'}}>
                                    {renderIcon(item.riesgo)}                    
                                    <div style={{width: '100%',fontWeight: 'bold', color: 'teal', fontSize: '120%'}}>
                                      {item.tipoLesion}
                                    </div>
                                  </div>
                                </div> 
                                <div style={{flex: '3'}}>
                                  <div style={{display: 'grid', gridTemplateColumns:'75% 20%', gap:'5%', alignItems: 'center'}}>
                                    <div style={{width: '100%',fontWeight: '400', fontSize: '100%', marginLeft: '7%'}}>
                                      {item.info} Riesgo: {item.riesgo}
                                    </div>
                                    <Button fill onClick={() => handleAmpliar(item.index)} style={{marginTop: '0px'}}>Info</Button>
                                  </div>
                                </div> 
                              </div>
                            </div>
                          ))}
                          </div>
                        )}

                      </div>
                      <div id='captura' ref={divRef}>
                        <div className="navbar" style={{background: 'teal', color: '#ffffff', textAlign: 'center', alignItems: 'center',  fontSize: '170%', lineHeight: '250%'}}> 
                          <span style={{ margin: '10%', textAlign: 'center'}}>Resultados</span>
                        </div>

                        {imagen && (
                          <div  style={{margin: '20px 5%', width: '90%', height: '420px'}}>
                            <img onClick={handleGenerateJPEG} src={`data:image/png;base64, ${imagen}`}  style={{ borderRadius: '15px', width: "100%", height: 'auto', objectFit:'cover', border: `4px solid teal`}}/>

                          </div>
                        )}
                        
                        {analizado && (
                          <div>
                          {clasificacion.map((item, index) => (
                            <div  key={index} style={{margin: '2% 5%', height: '100px', width: '90%', display: 'grid', gridTemplateColumns: '20% 80%',borderRadius: '15px', border: `8px solid ${item.color}` }}>      
                              <div style={{width: '70%', height: '0', paddingBottom: '70%', position: 'relative', maxWidth: '80px', maxHeight: '80px', margin: 'auto auto'}}>
                                <CircularProgressbar value={item.prediccion} text={`${item.prediccion}%`} styles={buildStyles({
                                                                                                                                  // Rotation of path and trail, in number of turns (0-1)
                                                                                                                                  rotation: 0,

                                                                                                                                  // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                                                                                                                  strokeLinecap: 'round',

                                                                                                                                  // Text size
                                                                                                                                  textSize: '160%',
                                                                                                                                  fontWeight: 'bolder',

                                                                                                                                  // How long animation takes to go from one percentage to another, in seconds
                                                                                                                                  pathTransitionDuration: 1,

                                                                                                                                  // Can specify path transition in more detail, or remove it entirely
                                                                                                                                  // pathTransition: 'none',

                                                                                                                                  // Colors
                                                                                                                                  pathColor: item.color,
                                                                                                                                  textColor: 'black',
                                                                                                                                  trailColor: '#d6d6d6',
                                                                                                                                  backgroundColor: 'black',
                                                                                                                                })}/>
                              </div>   
                              <div style={{width: '98%', height: '90%', display: 'flex', flexDirection: 'column'}}>
                                <div style={{flex: '2', alignContent: 'center'}}>
                                  <div className="Linkicon" style={{display: 'grid', gridTemplateColumns: '7% 90%', alignItems: 'center'}}>
                                    {renderIcon(item.riesgo)}                    
                                    <div style={{width: '100%',fontWeight: 'bold', color: 'teal', fontSize: '120%'}}>
                                      {item.tipoLesion}
                                    </div>
                                  </div>
                                </div> 
                                <div style={{flex: '3'}}>
                                  <div style={{display: 'grid', gridTemplateColumns:'75% 20%', gap:'5%', alignItems: 'center'}}>
                                    <div style={{width: '100%',fontWeight: '400', fontSize: '100%', marginLeft: '7%'}}>
                                      {item.info} Riesgo: {item.riesgo}
                                    </div>
                                    <Button fill onClick={() => handleAmpliar(item.index)} style={{marginTop: '0px'}}>Info</Button>
                                  </div>
                                </div> 
                              </div>
                            </div>
                          ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Popup>


    </div>
  );
};
export default AmpliarPopUp;