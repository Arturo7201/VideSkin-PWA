import React, { useState, useEffect, useRef } from 'react';


import styled from "styled-components";
import { MdImageSearch} from "react-icons/md";
import { MdHistory } from "react-icons/md";
import { MdArrowBack } from 'react-icons/md';
import { AiOutlineAim } from "react-icons/ai";
import { FaRegHourglassHalf } from "react-icons/fa6";
import { IoPersonCircleSharp } from "react-icons/io5";
import { FaSun } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";



import { CgDanger } from "react-icons/cg";
import { PiWarningFill } from "react-icons/pi";
import { MdHealthAndSafety } from "react-icons/md";



import NavigationMenu from '../components/panel';
import BodyPopup from '../components/popUp-body';
import AmpliarPopUp from '../components/popup-ampliar'
import InstruccionesPopup from '../components/popUp-instrucciones';
import ResultPopUp from '../components/popup-result';
import BuscadorPacientesPopUp from '../components/buscador';



import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

import 'react-circular-progressbar/dist/styles.css';

import { FaLocationCrosshairs } from "react-icons/fa6";

import Swal from 'sweetalert2';


import axios from 'axios';
import { userConfig } from '../js/config';

import {
  f7,
  Link,
  CardContent,
  CardHeader,
  List,
  Progressbar,
  Popover,
  ListItem,
  Button
} from 'framework7-react';

  /**
  * @module HomePage
  */

 /**
 * HomePage Page
 *
 * Este componente representa la página principal de la aplicación,
 * donde el usuario realiza su seguimiento de lesiones.
 *
 * @returns {JSX.Element} El componente renderizado de la página principal.
 */

export function HomePage () {


  //#region ------ RESPONSIVE RENDER ---------------------------------------------------------------------------------------------------------------------------------------------------

  const [isMobile, setIsMobile] = useState(false);
  const [isMobile2, setIsMobile2] = useState(window.innerWidth <= 768); ;

   /**
   * Efecto que verifica si la pantalla es lo suficientemente estrecha
   * y ajusta el estado `isMobile` en consecuencia. También agrega un listener
   * para el evento `resize` que vuelve a verificar el tamaño de la pantalla
   * cada vez que la ventana se redimensiona.
   *
   * @method
   * @returns {boolean} 
   * @memberof module:HomePage
   * @name useEffect
   */
  useEffect(() => { 
    // Función para comprobar si la pantalla es lo suficientemente estrecha 
    const checkIfMobile = () => {
        const containerWidth = document.getElementById('container').offsetWidth;
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
  * Efecto que verifica si se ha cambiado e tamaño lo suficiente como para recargar 
  * la aplicación en modo smartphone o escritorio.
  *
  * @method
  * @param {boolean} isMobile2
  * @returns {boolean} 
  * @memberof module:HomePage
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

  /**
  * Logica de  control del panel desplegable en modo smartphone.
  *
  */
  const handleMenu = () => {
    f7.panel.open('#home');
  }


  //#endregion

  const [currentImage, setCurrentImage] = useState('/images/BODY1.png');
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(1);
  const [renderizado, setRenderizado] = useState(false);
  const [showPopupBody, setShowPopupBody] = useState(false);

  //#region ----- TIPOS -----------------------------------------------------------------------------------------
  /**
  * Logica de renderizado para la vista de los tipos de lesiones
  */

  const [tipos, setTipos] = useState(false)
  
  const [isMobileT, setIsMobileT] = useState(false);
  const [isMobileT2, setIsMobileT2] = useState(false);
  const [isMobile3, setIsMobile3] = useState(false);

  useEffect(() => { 
    // Función para comprobar si la pantalla es lo suficientemente estrecha 
    const checkIfMobileT = () => {
        const containerWidth = document.getElementById('container').offsetWidth;
        setIsMobileT(containerWidth <= 1170); // Ajusta este valor 
    };
    const checkIfMobileT2 = () => {
        const containerWidth = document.getElementById('container').offsetWidth;
        setIsMobileT2(containerWidth <= 550); // Ajusta este valor 
    };
    const checkIfMobile3 = () => {
        const containerWidth = document.getElementById('container').offsetWidth;
        //console.log(containerWidth)
        setIsMobile3(containerWidth <= 1400); // Ajusta este valor 
    };

    // Llama a la función de comprobación cuando se carga la página y cada vez que se redimensiona la ventana
    checkIfMobileT();
    checkIfMobileT2();
    checkIfMobile3();
    window.addEventListener('resize', checkIfMobileT);
    window.addEventListener('resize', checkIfMobileT2);
    window.addEventListener('resize', checkIfMobile3);

    // Limpia el event listener al desmontar el componente para evitar fugas de memoria
    return () => {
        window.removeEventListener('resize', checkIfMobileT);
        window.removeEventListener('resize', checkIfMobileT2);
        window.removeEventListener('resize', checkIfMobile3);
    };
  }, []);

  const handleTipos = () => {
    setTipos(true)
  }

  const handleBack = () => {
    setTipos(false)
  }

  //#endregion

  //#region ------- AUTENTICACION ------------------------------------------------------
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
  * Comprueba si el usuario está autenticado mediante la validación del token almacenado en localStorage o sessionStorage.
  *
  * @async
  * @method
  * @returns {Promise<boolean>} - Retorna una promesa que resuelve a `true` si el usuario está autenticado, de lo contrario `false`.
  * @throws {Error} - Si ocurre un error durante la solicitud de autenticación.
  * @memberof module:HomePage
  */
  async function isAuthenticated() {
    
     try {
      const response = await axios.get(`http://${userConfig.serverIP}:${userConfig.serverPort}/jwt`, config);
      setUser(response.data.logged_in_as)
      setMedico(response.data.logged_in_as)
      setRole(response.data.role)
      return true;

    } catch (error) {

      console.log(error.response.data.msg);
      return false;

    }
  }

  /**
  * Efecto que verifica si el cliente esta autenticado y carga toda la información dinamica
  * de la pantalla.
  *
  * @method
  * @memberof module:HomePage
  * @name useEffect
  */
  useEffect(() => {
    async function checkAuthentication() {
      try {

        const authenticated = await isAuthenticated();

        if (authenticated) {
          f7.dialog.progress();
          await fetchPerfil();
          await uvaCoordenadas()
          await obtenerMarkers();
          setRenderizado(true)
          f7.dialog.close();
        } else {
          console.log('NO AUTENTICADO');
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "La sesión ha caducado"
          })
          setRenderizado(false)
          window.location.reload();
        }
      } catch (error) {
        console.error('Error al cargar el componente:', error);
      }
    }

    if (!renderizado){
      //console.log(renderizado)
      checkAuthentication();
      setRenderizado(true)
    }
  }, []);

  //#endregion

  //#region   ---- FUNCIONES BLOQUE PERFIL ------------------------------------------------------
  const [perfilImage, setPerfilImage] = useState(null);
  /**
  * Consigue la imagen del perfil de usuario o paciente cuando es requerida.
  *
  * @async
  * @method
  * @param {Object} paciente 
  * @returns {Promise<{perfilImage: string | null}>} 
  * @throws {Error} - Si ocurre un error durante la solicitud de autenticación.
  * @memberof module:HomePage
  */
  async function fetchPerfil(paciente) {
    try {

      const response = await axios.post(`http://${userConfig.serverIP}:${userConfig.serverPort}/perfilImage`, {id: paciente}, config);
      setPerfilImage(response.data.imagen);
        
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


  /**
  * Solicita la identificacion de perfil del usuario o paciente si es requerida.
  *
  * @async
  * @method
  * @param {Object} paciente 
  * @returns {Promise<{perfilImage: string | null}>} 
  * @throws {Error} - Si ocurre un error durante la solicitud de autenticación.
  * @memberof module:HomePage
  */
    async function getUsername(paciente) {
      try {
  
        const response = await axios.post(`http://${userConfig.serverIP}:${userConfig.serverPort}/getUsername`, {id: paciente}, config);
        setUser(response.data.username);
          
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

  //#region   ---- FUNCIONES BLOQUE UVA ------------------------------------------------------
  const [ciudad, setCiudad] = useState(null)
  const [pais, setPais] = useState(null)
  const [uvIndex, setUVIndex] = useState(null)
  const [uvText, setUVText] = useState(null)


  /**
  * Funcion para solicitar la geolocalizacion al cliente. Devuelve las coordenadas alt. y lat.
  *
  * @async
  * @method
  * @returns {String} 
  * @throws {Error}
  * @memberof module:HomePage

  */
  async function uvaCoordenadas() {

    if ("geolocation" in navigator) {
      // El navegador admite la geolocalización
      navigator.geolocation.getCurrentPosition(function(position) {
        // Obtiene la posición actual del usuario
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
    
        //console.log("Latitud:", latitude);
        //console.log("Longitud:", longitude);
        uvaAPI(latitude,longitude)

      }, function(error) {
        // Maneja errores de geolocalización
        switch(error.code) {
          case error.PERMISSION_DENIED:
            console.error("El usuario ha denegado la solicitud de geolocalización.");
            break;
          case error.POSITION_UNAVAILABLE:
            console.error("La información de ubicación no está disponible.");
            break;
          case error.TIMEOUT:
            console.error("La solicitud para obtener la ubicación del usuario ha excedido el tiempo límite.");
            break;
          case error.UNKNOWN_ERROR:
            console.error("Se ha producido un error desconocido.");
            break;
        }
      });
    } else {
      // El navegador no admite la geolocalización
      console.error("Geolocalización no compatible en este navegador.");
    }

  }

  /**
  * Solicita a la API AccuWeather la key de localización con las coordenadas.
  * @method
  * @param {String} latitude 
  * @param {String} longitude 
  * @returns {String} - Retorna una KEY de posicion para pedirle a la API los datos meteorológicos.
  * @memberof module:HomePage
  */
  async function uvaAPI(latitude,longitude) {
    try {

      const response = await axios.get(`http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${userConfig.apiKey}&q=${latitude}%2C${longitude}&language=es`);


      setCiudad(response.data.LocalizedName)
      setPais(response.data.Country.LocalizedName)

      const responseUva = await axios.get(`http://dataservice.accuweather.com/currentconditions/v1/${response.data.Key}?apikey=${userConfig.apiKey}&language=es&details=true`);


      setUVIndex(responseUva.data[0].UVIndex)
      setUVText(responseUva.data[0].UVIndex)


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

  /**
  * Renderizar barra de riesgo UV
  *
  * @method
  * @param {String} risk 
  * @returns {JSX.Element}
  * @memberof module:HomePage
  */  
  const renderRiskBar = (risk) =>{
    if (risk < 2) {
      return (
        <div>
          <Progressbar color="green" progress={((risk*100)/11)}
          style={{
            width: '95%', // Cambia el ancho de la barra de progreso
            height: '20px', // Ajusta la altura de la barra de progreso
            margin: '0 5px',
            borderRadius: '6px', // Define el radio de borde para hacer la barra de progreso más redondeada
            backgroundColor: 'white', // Cambia el color de fondo de la barra de progreso
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' // Agrega sombra para mejorar la apariencia
          }} /> 
        </div>
      );
    } else if (risk > 7) {
      return (
        <Progressbar color="pink" progress={((risk*100)/11)}
        style={{
          width: '95%', // Cambia el ancho de la barra de progreso
          height: '20px', // Ajusta la altura de la barra de progreso
          margin: '0 5px',
          borderRadius: '6px', // Define el radio de borde para hacer la barra de progreso más redondeada
          backgroundColor: 'white', // Cambia el color de fondo de la barra de progreso
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' // Agrega sombra para mejorar la apariencia
        }} />
      );
    } else {
      return (
        <div>
        <Progressbar color='orange' progress={((risk*100)/11)} 
          style={{
            width: '95%', // Cambia el ancho de la barra de progreso
            height: '20px', // Ajusta la altura de la barra de progreso
            margin: '0 5px',
            borderRadius: '6px', // Define el radio de borde para hacer la barra de progreso más redondeada
            backgroundColor: 'white', // Cambia el color de fondo de la barra de progreso
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' // Agrega sombra para mejorar la apariencia
          }} />
      </div>
      );
    }
  }

  //#endregion

  //#region ------- FUNCIONES BLOQUE MARKERS ------------------------------------------------------
  /**
  * Marcadores de las lesiones.
  * @const {Object[]} markers 
  */
  const [markers, setMarkers] = useState([])
  const [showPopupAmpliar, setShowPopupAmpliar] = useState(false);
  /**
  * Marcador la lesion seleccionada.
  * @const {Object | null} marker - Objeto que representa la lesión seleccionada con sus datos asociados, o null si no hay ninguna lesión seleccionada.
  * @example
  * {
  *   id: 1,
  *   x: 0.2,
  *   y:0.6,
  *   body: '/images/BODY1.png',
  *   opened: false
  *   probabilidad: 0.75,
  *   imagen: 'base64',
  *   predicciones: [0.12,0.01,0.03,0.05,0.6,0.18],
  *   color: 'red'
  * }
  */
  const [marker, setMarker] = useState(null);

  /**
  * Solicita a la API los marcadores de las lesiones.
  *
  * @async
  * @method
  * @returns {Promise<{markers: Object | null}>} 
  * @throws {Error} - Si ocurre un error durante la solicitud de autenticación.
  * @memberof module:HomePage
  */
  async function obtenerMarkers(paciente) {

    try {

      const response = await axios.post(`http://${userConfig.serverIP}:${userConfig.serverPort}/markers`, {id: paciente}, config);
      //console.log(response.data.markers)
      const newMarkers = response.data.markers.map(marker => ({
        id: marker.id,
        x: marker.x,
        y: marker.y,
        body: marker.body,
        probabilidad: marker.probabilidad,
        predicciones: marker.predicciones,
        imagen: marker.imagen,
        color: marker.color,
        opened: false
      }));
      console.log(newMarkers)
      setMarkers(newMarkers);

    } catch (error) {
      try{
        if (error.response.status == 404){
          setMarkers([])
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
  };

  /**
  * Solicita a la API eliminar una lesion del seguimiento.
  *
  * @async
  * @method
  * @param {Object} marker 
  * @returns {Promise<{markers: Object}>} 
  * @throws {Error} - Si ocurre un error durante la solicitud de autenticación.
  * @memberof module:HomePage
  */
  async function handleBorrarMarker(marker) {
    console.log(marker)
    try {
      const response = await axios.post(`http://${userConfig.serverIP}:${userConfig.serverPort}/deleteMarker`, {id: marker.id}, config);
      Swal.fire({
        icon: 'success',
        text: response.data.mesage
      })

      // Eliminar el marcador de la lista markers
      const updatedMarkers = markers.filter(m => m.id !== marker.id);
      setMarkers(updatedMarkers);

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

  // CAMBIAR A IMAGEN DELANTERA
  const handleCambiarDelante = () => {
    setCurrentImage('/images/BODY1.png');
  };
  
  // CAMBIAR A IMAGEN TRASERA
  const handleCambiarDetras = () => {
    setCurrentImage('/images/BODY2.png');
  };

  // ABRIR POPUP-BODY
  const handleNewLesion = () => {
    setShowPopupBody(true);
  };

  // CERRAR POPUP-BODY AL GUARDAR
  const closePopupBodyGuardado = () => {
    obtenerMarkers(paciente)
    setShowPopupBody(false)
  };

  // CERRAR POPUP-BODY
  const closePopupBody = () => {
    setShowPopupBody(false)
  };

  //ABRIR POPOVER
  const handleClickMarker = (marker) => {
    marker.opened = true
    const updatedMarkers = [...markers];
    setMarkers(updatedMarkers);
  }

  //AMPLIAR RESULTADO
  const handleAmpliar = (marker) => {
    marker.opened = false
    const updatedMarkers = [...markers];
    setMarkers(updatedMarkers);
    setMarker(marker)
    setShowPopupAmpliar(true)
  }

  //CERRAR RESULTADO
  const closePopupAmpliar = () => {
    setShowPopupAmpliar(false)
  }


  //#endregion

  //#region ------------------------ ACTUALIZAR MARKER ---------------------------------------------------------------------------------------------------------------------
  const [instruccionesPopUp, setInstruccionesPopUp] = useState(false)
  const closeInstruccionesPopUp = () =>{
    setInstruccionesPopUp(false)
  }

  const handleActualizar = () => {
    closePopupAmpliar()
    setInstruccionesPopUp(true)

  }
  
  const [imagen, setImagen] = useState(null)
  const [fileSelected, setFileSelected] = useState(false);
  const [resultPopUp, setResultPopUp] = useState(false)
  const [analizar, setAnalizar] = useState(false)
  const [analizado, setAnalizado] = useState(false)

  const closeResultPopUp = () => {
    setResultPopUp(false)
    setAnalizar(false)
    setAnalizado(false)
  }

  const handleAnalizar = () => {
    closeInstruccionesPopUp()
    setResultPopUp(true)
    setAnalizar(true)
  }

  const handleCerrar = (newMarker) => {
    //
    //setMarker(prevMarker => ({ ...prevMarker })); // Cambio en setMarker para activar el useEffect
    console.log(marker)
    console.log(newMarker)
    console.log(newMarker.id,newMarkers(markers,newMarker))
    setMarkers(newMarkers(markers,newMarker))
    //setImagen(null)
    setFileSelected(false)
    closeResultPopUp()
    //setShowPopupAmpliar(true)
  }

  const newMarkers = (prevMarkers, marker) => {
    return prevMarkers.map(m =>
      m.id === marker.id ? marker : m
    );
  };


  
  //#endregion

  //#region ------ MEDICO -------------------------
  const [medico, setMedico] = useState(null)
  /**
  * Pacientes en el sistema.
  * @const {object} paciente
  * @property {integer} id - Identificador del paciente.
  * @property {string} username - Usuario del paciente.
  * @property {string} name - Nombre del paciente.
  * @property {string} surname - Apellido del paciente.
  */ 
  const [paciente, setPaciente] = useState(null)

  /**
  * Efecto que controla la seleccion de un paciente para cargar sus datos.
  * 
  *
  * @method
  * @memberof module:HomePage
  * @name useEffect
  */
  useEffect(() => {
    const realizarAcciones = async () => {
      if (paciente !== null) {
        console.log('Paciente seleccionado:', paciente);
        f7.dialog.progress();
        try {
          await fetchPerfil(paciente);
          await getUsername(paciente);
          await obtenerMarkers(paciente);
          //setRenderizado(true);
        } catch (error) {
          console.error("Error al realizar acciones:", error);
        } finally {
          f7.dialog.close();
        }
      }
    };

    realizarAcciones();
    closePacientesPopUp();
  }, [paciente]);

  /**
  * Pacientes en el sistema.
  * @const {object[]} pacientes
  * @property {number} id - Identificador del paciente.
  * @property {string} username - Usuario del paciente.
  * @property {string} name - Nombre del paciente.
  * @property {string} surname - Apellido del paciente.
  */
  const [pacientes, setPacientes] = useState([])

  const [popUpPacientes, showPopUpPacientes] = useState(false)
  /**
  * Manejadora de cierre del pop up para seleccionar el paciente.
  *
  * @method
  * @memberof module:HomePage
  */
  const closePacientesPopUp = () => {
    showPopUpPacientes(false)
  };

  /**
  * Manejadora de peticion para selecionar al paciente.
  *
  * @method
  * @memberof module:HomePage
  */
  const handleSeleccionarPaciente = async () => {
    const pacientesObtenidos = await getPacientes();
    setPacientes(pacientesObtenidos);
    showPopUpPacientes(true);
  };


  /**
  * Manejadora de peticion para establecer recordatorio al paciente.
  *
  * @method
  * @memberof module:HomePage
  */
  const handleRecordatorio = async () => {
    const { value: date } = await Swal.fire({
      title: "Selecciona la fecha del recordatorio",
      input: "date",
      didOpen: () => {
        const today = (new Date()).toISOString();
        console.log(today)
        Swal.getInput().min = today.split("T")[0];
      }
    });

    if (date) {
      f7.dialog.prompt('Introduce el recordatorio:', (info) => {
        f7.dialog.confirm(`${info} en la fecha ${date}`, () => {
          añadirFecha(info,date,paciente)
        });
      });
    }


  };

  

  /**
  * Solicita a la API los pacientes disponibles.
  *
  * @async
  * @method
  * @param {Object} token 
  * @returns {Promise<{pacientes: Object}>} 
  * @throws {Error} - Si ocurre un error durante la solicitud de autenticación.
  * @memberof module:HomePage
  */
  async function getPacientes() {
    
    try {

      const response = await axios.get(`http://${userConfig.serverIP}:${userConfig.serverPort}/pacientes`, config);
      //console.log(response.data.pacientes)
      return response.data.pacientes

    } catch (error) {
      try{
        if (error.response.status == 401){
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "La sesión ha caducado"
          })
          window.location.reload();

        }else if (error.response.status == 403){
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "Permiso denegado"
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

  /**
  * Peticion para añadir recordatorio a un paciente a la API.
  *
  * @async
  * @method
  * @param {String} info 
  * @param {Date} date
  * @param {Integer} paciente 
  * @throws {Error} - Si ocurre un error durante la solicitud de autenticación.
  * @memberof module:HomePage
  */
  async function añadirFecha(info,date,paciente) {

    const data = {
      id: paciente,
      info: info,
      date: `${date}T00:00`
    }
    console.log(data)

    try {
      const response = await axios.post(`http://${userConfig.serverIP}:${userConfig.serverPort}/addfecha`, data, config);

      console.log(response)
      Swal.fire({
        icon: 'success',
        text: response.data.message
      })

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

  //#endregion

  return(

    <div >

      { tipos ? (
        <div className="page" style={{backgroundColor: '#EFEFF4'}}>

          <div className="navbar" style={{display: 'grid', gridTemplateColumns: '5% 1fr', background: 'teal', color: '#ffffff', textAlign: 'center', alignItems: 'center',  fontSize: '170%', lineHeight: '250%'}}>
          <MdArrowBack style={{ fontSize: '24px', marginLeft: '90%', cursor: 'pointer'}} onClick={handleBack}/>
          <span style={{ marginLeft: '10%', marginRight: '15%', textAlign: 'center'}}>Tipos de lesiones</span>
          </div>

          <div className="page-content" id='container'>

              {isMobile ? (

                  <Container>
                      <div className='sec-1'>
                          Lesiones malignas
                      </div>
                      

                      <div className="card demo-card-header-pic" style={{backgroundColor: 'white', border: '3px solid #ac3939'}}>
                          <CardHeader style={{padding: '10px'}}>
                              <img className="tipo" src="../images/MEL.jpg"/>
                              <div className={isMobile ? 'tipo-tittle1-mobile' : 'tipo-tittle1'} >Melanoma</div>
                          </CardHeader>
                          <CardContent>
                              {isMobile2 ? (
                                  <div className="tipo-subtittle1-mobile">
                                      <div className="first-line">
                                          <CgDanger style={{fontSize: '20px', color: 'red'}}/>
                                          <div>
                                              Riesgo <span  className='alto'> ALTO</span > :
                                          </div>
                                      </div>
                                      <p className="second-line"> Cáncer de piel</p>
                                  
                                  </div>
                              ):(
                                  <p className="tipo-subtittle1"><CgDanger style={{ width: '10%', fontSize: '20px', color: 'red' }}/>Riesgo <p className='alto'> ALTO</p>: Cáncer de piel</p>

                              )}
                              <p className='text-body'>
                              El melanoma es un tipo de cáncer de piel altamente agresivo que se desarrolla a partir de los melanocitos, las células que producen el pigmento melanina. Se caracteriza por un crecimiento anormal de lunares o manchas en la piel que pueden volverse irregulares en forma y color, y pueden aparecer en cualquier parte del cuerpo.
                              </p>
                          </CardContent>
                      </div>

                      <div className="card demo-card-header-pic" style={{backgroundColor: 'white', border: '3px solid #ac3939'}}>
                          <CardHeader style={{padding: '10px'}}>
                              <img className="tipo" src="../images/BCC.jpg"/>
                              <div className={isMobile ? 'tipo-tittle1-mobile' : 'tipo-tittle1'}>Carcinoma Basocelular</div>
                          </CardHeader>
                          <CardContent>
                              {isMobile2 ? (
                                      <div className="tipo-subtittle1-mobile">
                                          <div className="first-line">
                                              <CgDanger style={{fontSize: '20px', color: 'red'}}/>
                                              <div>
                                                  Riesgo <span  className='alto'> ALTO</span > :
                                              </div>
                                          </div>
                                          <p className="second-line"> Cáncer de piel</p>
                                      
                                      </div>
                                  ):(
                                      <p className="tipo-subtittle1"><CgDanger style={{ width: '10%', fontSize: '20px', color: 'red' }}/>Riesgo <p className='alto'> ALTO</p>: Cáncer de piel</p>

                              )}
                              <p className='text-body'>
                              El carcinoma basocelular es el tipo más común de cáncer de piel. A menudo se presenta como una pequeña protuberancia o bulto en la piel que puede ser de color rosa, rojo, blanco o translúcido. Si bien rara vez se disemina a otras partes del cuerpo, puede causar daño localizado si no se trata.                            </p>
                          </CardContent>
                      </div>

                      <div className='sec-2'>
                          Lesiones potencialmente malignas
                      </div>

                      <div className="card demo-card-header-pic" style={{backgroundColor: 'white', border: '3px solid #ffc34d'}}>
                          <CardHeader style={{padding: '10px'}}>
                              <img className="tipo" src="../images/NV.jpg"/>
                              <div className={isMobile ? 'tipo-tittle2-mobile' : 'tipo-tittle2'} >Nevus</div>
                          </CardHeader>
                          <CardContent>
                              {isMobile2 ? (
                                      <div className="tipo-subtittle2-mobile">
                                          <div className="first-line">
                                              <PiWarningFill style={{fontSize: '20px', color: 'orange'}}/>
                                              <div>
                                                  Riesgo <span  className='medio'> POTENCIAL</span > :
                                              </div>
                                          </div>
                                          <p className="second-line"> Lunar</p>
                                      
                                      </div>
                                  ):(
                                      <p className="tipo-subtittle2"><PiWarningFill style={{ width: '10%', fontSize: '20px', color: 'orange' }}/>Riesgo <p className='medio'> POTECIAL</p>: Lunar</p>

                              )}
                              <p className='text-body'>
                              Los nevus, comúnmente conocidos como lunares, son crecimientos pigmentados en la piel que pueden variar en tamaño, forma y color. La mayoría de los nevus son benignos, pero algunos pueden transformarse en melanoma, especialmente si experimentan cambios en el tamaño, forma o color con el tiempo.                            </p>
                          </CardContent>
                      </div>

                      <div className="card demo-card-header-pic" style={{backgroundColor: 'white', border: '3px solid #ffc34d'}}>
                          <CardHeader style={{padding: '10px'}}>
                              <img className="tipo" src="../images/AKIEC.jpg"/>
                              <div className={isMobile ? 'tipo-tittle2-mobile' : 'tipo-tittle2'} >Queratosis Actínica</div>
                          </CardHeader>
                          <CardContent>
                              {isMobile2 ? (
                                      <div className="tipo-subtittle2-mobile">
                                          <div className="first-line">
                                              <PiWarningFill style={{fontSize: '20px', color: 'orange'}}/>
                                              <div>
                                                  Riesgo <span  className='medio'> POTENCIAL</span > :
                                              </div>
                                          </div>
                                          <p className="second-line"> Lesión precancerosa</p>
                                      
                                      </div>
                                  ):(
                                      <p className="tipo-subtittle2"><PiWarningFill style={{ width: '10%', fontSize: '20px', color: 'orange' }}/>Riesgo <p className='medio'> POTECIAL</p>: Lesión precancerosa</p>

                              )}
                              <p className='text-body'>
                              La queratosis actínica, también conocida como queratosis solar, es una lesión precancerosa causada por la exposición crónica a la radiación ultravioleta del sol. Se manifiesta como manchas rojas, ásperas y escamosas en la piel que pueden volverse sensibles o dolorosas.                            </p>
                          </CardContent>
                      </div>

                      <div className='sec-3'>
                          Lesiones benignas
                      </div>

                      <div className="card demo-card-header-pic" style={{backgroundColor: 'white', border: '3px solid #00802b'}}>
                          <CardHeader style={{padding: '10px'}}>
                              <img className="tipo" src="../images/BKL.jpg"/>
                              <div className={isMobile ? 'tipo-tittle3-mobile' : 'tipo-tittle3'} >Queratosis Seborreica</div>
                          </CardHeader>
                          <CardContent>
                              {isMobile2 ? (
                                      <div className="tipo-subtittle3-mobile">
                                          <div className="first-line">
                                              <MdHealthAndSafety style={{fontSize: '20px', color: 'green'}}/>
                                              <div>
                                                  <span  className='bajo'> SIN RIESGO</span > :
                                              </div>
                                          </div>
                                          <p className="second-line"> Mancha de edad</p>
                                      
                                      </div>
                                  ):(
                                      <p className="tipo-subtittle3"><MdHealthAndSafety style={{ width: '10%', fontSize: '20px', color: 'green' }}/><p className='bajo'> SIN RIESGO</p>: Mancha de edad</p>

                              )}
                              <p className='text-body'>
                              Las queratosis seborreicas, también llamadas verrugas seborreicas o manchas de la edad, son crecimientos cutáneos benignos que generalmente aparecen en áreas de la piel expuestas al sol. A menudo son de color marrón oscuro o negro y tienen una textura cerosa o escamosa.                            </p>
                          </CardContent>
                      </div>

                      <div className="card demo-card-header-pic" style={{backgroundColor: 'white', border: '3px solid #00802b'}}>
                          <CardHeader style={{padding: '10px'}}>
                              <img className="tipo" src="../images/DF.jpg"/>
                              <div className={isMobile ? 'tipo-tittle3-mobile' : 'tipo-tittle3'} >Dermatofibroma</div>
                          </CardHeader>
                          <CardContent>
                          {isMobile2 ? (
                                      <div className="tipo-subtittle3-mobile">
                                          <div className="first-line">
                                              <MdHealthAndSafety style={{fontSize: '20px', color: 'green'}}/>
                                              <div>
                                                  <span  className='bajo'> SIN RIESGO</span > :
                                              </div>
                                          </div>
                                          <p className="second-line"> Lesión benigna</p>
                                      
                                      </div>
                                  ):(
                                      <p className="tipo-subtittle3"><MdHealthAndSafety style={{ width: '10%', fontSize: '20px', color: 'green' }}/><p className='bajo'> SIN RIESGO</p>: Lesión benigna</p>

                              )}
                              <p className='text-body'>
                              El dermatofibroma es una lesión cutánea benigna que se desarrolla a partir de células fibroblásticas en la dermis de la piel. Por lo general, aparece como un pequeño bulto duro de color marrón o rosa que puede tener una apariencia ligeramente elevada. Aunque son inofensivos, a veces pueden confundirse con melanoma debido a su apariencia.                            </p>
                          </CardContent>
                      </div>

                      <div className="card demo-card-header-pic" style={{backgroundColor: 'white', border: '3px solid #00802b'}}>
                          <CardHeader style={{padding: '10px'}}>
                              <img className="tipo" src="../images/VASC.jpg"/>
                              <div className={isMobile ? 'tipo-tittle3-mobile' : 'tipo-tittle3'} >Lesiones Vasculares</div>
                          </CardHeader>
                          <CardContent>
                          {isMobile2 ? (
                                      <div className="tipo-subtittle3-mobile">
                                          <div className="first-line">
                                              <MdHealthAndSafety style={{fontSize: '20px', color: 'green'}}/>
                                              <div>
                                                  <span  className='bajo'> SIN RIESGO</span > :
                                              </div>
                                          </div>
                                          <p className="second-line"> Lesión benigna</p>
                                      
                                      </div>
                                  ):(
                                      <p className="tipo-subtittle3"><MdHealthAndSafety style={{ width: '10%', fontSize: '20px', color: 'green' }}/><p className='bajo'> SIN RIESGO</p>: Lesión benigna</p>

                              )}
                              <p className='text-body'>
                              Las lesiones vasculares son problemas en los vasos sanguíneos de la piel. Incluyen hemangiomas (manchas rojas en bebés), malformaciones vasculares y telangiectasias (pequeñas venas visibles). Estas lesiones pueden ser de nacimiento o desarrollarse con el tiempo. En términos cancerígenos son inofensivas, aunque pueden necesitar tratamiento si afectan la apariencia o la función.                            </p>
                          </CardContent>
                      </div>





                      
                  </Container>

              ):(
                  <Container>

                      <div className='sec-1'>
                          Lesiones malignas
                      </div>

                      <div style={{display: 'grid', gridTemplateColumns: '45% 45%', gap: '10%'}}>
                          <div className="card demo-card-header-pic" style={{backgroundColor: 'white', border: '3px solid #ac3939'}}>
                              <CardHeader style={{padding: '10px'}}>
                                  <img className="tipo" src="../images/MEL.jpg"/>
                                  <div className={isMobile ? 'tipo-tittle1-mobile' : 'tipo-tittle1'} >Melanoma</div>
                              </CardHeader>
                              <CardContent>
                                  {isMobile2 ? (
                                      <div className="tipo-subtittle1-mobile">
                                          <div className="first-line">
                                              <CgDanger style={{fontSize: '20px', color: 'red'}}/>
                                              <div>
                                                  Riesgo <span  className='alto'> ALTO</span > :
                                              </div>
                                          </div>
                                          <p className="second-line"> Cáncer de piel</p>
                                      
                                      </div>
                                  ):(
                                      <p className="tipo-subtittle1"><CgDanger style={{ width: '10%', fontSize: '20px', color: 'red' }}/>Riesgo <p className='alto'> ALTO</p>: Cáncer de piel</p>

                                  )}
                                  <p className='text-body'>
                                  El melanoma es un tipo de cáncer de piel altamente agresivo que se desarrolla a partir de los melanocitos, las células que producen el pigmento melanina. Se caracteriza por un crecimiento anormal de lunares o manchas en la piel que pueden volverse irregulares en forma y color, y pueden aparecer en cualquier parte del cuerpo.
                                  </p>
                              </CardContent>
                          </div>

                          <div className="card demo-card-header-pic" style={{backgroundColor: 'white', border: '3px solid #ac3939'}}>
                              <CardHeader style={{padding: '10px'}}>
                                  <img className="tipo" src="../images/BCC.jpg"/>
                                  <div className={isMobile ? 'tipo-tittle1-mobile' : 'tipo-tittle1'}>Carcinoma Basocelular</div>
                              </CardHeader>
                              <CardContent>
                                  {isMobile2 ? (
                                          <div className="tipo-subtittle1-mobile">
                                              <div className="first-line">
                                                  <CgDanger style={{fontSize: '20px', color: 'red'}}/>
                                                  <div>
                                                      Riesgo <span  className='alto'> ALTO</span > :
                                                  </div>
                                              </div>
                                              <p className="second-line"> Cáncer de piel</p>
                                          
                                          </div>
                                      ):(
                                          <p className="tipo-subtittle1"><CgDanger style={{ width: '10%', fontSize: '20px', color: 'red' }}/>Riesgo <p className='alto'> ALTO</p>: Cáncer de piel</p>

                                  )}
                                  <p className='text-body'>
                                  El carcinoma basocelular es el tipo más común de cáncer de piel. A menudo se presenta como una pequeña protuberancia o bulto en la piel que puede ser de color rosa, rojo, blanco o translúcido. Si bien rara vez se disemina a otras partes del cuerpo, puede causar daño localizado si no se trata.                            </p>
                              </CardContent>
                          </div>
                      </div>

                      
                      <div className='sec-2'>
                          Lesiones potencialmente malignas
                      </div>

                      <div style={{display: 'grid', gridTemplateColumns: '45% 45%', gap: '10%'}}>
                          <div className="card demo-card-header-pic" style={{backgroundColor: 'white', border: '3px solid #ffc34d'}}>
                              <CardHeader style={{padding: '10px'}}>
                                  <img className="tipo" src="../images/NV.jpg"/>
                                  <div className={isMobile ? 'tipo-tittle2-mobile' : 'tipo-tittle2'} >Nevus</div>
                              </CardHeader>
                              <CardContent>
                                  {isMobile2 ? (
                                          <div className="tipo-subtittle2-mobile">
                                              <div className="first-line">
                                                  <PiWarningFill style={{fontSize: '20px', color: 'orange'}}/>
                                                  <div>
                                                      Riesgo <span  className='medio'> POTENCIAL</span > :
                                                  </div>
                                              </div>
                                              <p className="second-line"> Lunar</p>
                                          
                                          </div>
                                      ):(
                                          <p className="tipo-subtittle2"><PiWarningFill style={{ width: '10%', fontSize: '20px', color: 'orange' }}/>Riesgo <p className='medio'> POTECIAL</p>: Lunar</p>

                                  )}
                                  <p className='text-body'>
                                  Los nevus, comúnmente conocidos como lunares, son crecimientos pigmentados en la piel que pueden variar en tamaño, forma y color. La mayoría de los nevus son benignos, pero algunos pueden transformarse en melanoma, especialmente si experimentan cambios en el tamaño, forma o color con el tiempo.                            </p>
                              </CardContent>
                          </div>

                          <div className="card demo-card-header-pic" style={{backgroundColor: 'white', border: '3px solid #ffc34d'}}>
                              <CardHeader style={{padding: '10px'}}>
                                  <img className="tipo" src="../images/AKIEC.jpg"/>
                                  <div className={isMobile ? 'tipo-tittle2-mobile' : 'tipo-tittle2'} >Queratosis Actínica</div>
                              </CardHeader>
                              <CardContent>
                                  {isMobile2 ? (
                                          <div className="tipo-subtittle2-mobile">
                                              <div className="first-line">
                                                  <PiWarningFill style={{fontSize: '20px', color: 'orange'}}/>
                                                  <div>
                                                      Riesgo <span  className='medio'> POTENCIAL</span > :
                                                  </div>
                                              </div>
                                              <p className="second-line"> Lesión precancerosa</p>
                                          
                                          </div>
                                      ):(
                                          <p className="tipo-subtittle2"><PiWarningFill style={{ width: '10%', fontSize: '20px', color: 'orange' }}/>Riesgo <p className='medio'> POTECIAL</p>: Lesión precancerosa</p>

                                  )}
                                  <p className='text-body'>
                                  La queratosis actínica, también conocida como queratosis solar, es una lesión precancerosa causada por la exposición crónica a la radiación ultravioleta del sol. Se manifiesta como manchas rojas, ásperas y escamosas en la piel que pueden volverse sensibles o dolorosas.                            </p>
                              </CardContent>
                          </div>
                      </div>

                      <div className='sec-3'>
                          Lesiones benignas
                      </div>

                  

                      { isMobile3 ? (
                          <div>
                              <div className="card demo-card-header-pic" style={{backgroundColor: 'white', border: '3px solid #00802b'}}>
                                  <CardHeader style={{padding: '10px'}}>
                                      <img className="tipo" src="../images/BKL.jpg"/>
                                      <div className={isMobile ? 'tipo-tittle3-mobile' : 'tipo-tittle3'} >Queratosis Seborreica</div>
                                  </CardHeader>
                                  <CardContent>
                                      {isMobile2 ? (
                                              <div className="tipo-subtittle3-mobile">
                                                  <div className="first-line">
                                                      <MdHealthAndSafety style={{fontSize: '20px', color: 'green'}}/>
                                                      <div>
                                                          <span  className='bajo'> SIN RIESGO</span > :
                                                      </div>
                                                  </div>
                                                  <p className="second-line"> Mancha de edad</p>
                                              
                                              </div>
                                          ):(
                                              <p className="tipo-subtittle3"><MdHealthAndSafety style={{ width: '10%', fontSize: '20px', color: 'green' }}/><p className='bajo'> SIN RIESGO</p>: Mancha de edad</p>
          
                                      )}
                                      <p className='text-body'>
                                      Las queratosis seborreicas, también llamadas verrugas seborreicas o manchas de la edad, son crecimientos cutáneos benignos que generalmente aparecen en áreas de la piel expuestas al sol. A menudo son de color marrón oscuro o negro y tienen una textura cerosa o escamosa.                            </p>
                                  </CardContent>
                              </div>
      
                              <div className="card demo-card-header-pic" style={{backgroundColor: 'white', border: '3px solid #00802b'}}>
                                  <CardHeader style={{padding: '10px'}}>
                                      <img className="tipo" src="../images/DF.jpg"/>
                                      <div className={isMobile ? 'tipo-tittle3-mobile' : 'tipo-tittle3'} >Dermatofibroma</div>
                                  </CardHeader>
                                  <CardContent>
                                  {isMobile2 ? (
                                              <div className="tipo-subtittle3-mobile">
                                                  <div className="first-line">
                                                      <MdHealthAndSafety style={{fontSize: '20px', color: 'green'}}/>
                                                      <div>
                                                          <span  className='bajo'> SIN RIESGO</span > :
                                                      </div>
                                                  </div>
                                                  <p className="second-line"> Lesión benigna</p>
                                              
                                              </div>
                                          ):(
                                              <p className="tipo-subtittle3"><MdHealthAndSafety style={{ width: '10%', fontSize: '20px', color: 'green' }}/><p className='bajo'> SIN RIESGO</p>: Lesión benigna</p>
          
                                      )}
                                      <p className='text-body'>
                                      El dermatofibroma es una lesión cutánea benigna que se desarrolla a partir de células fibroblásticas en la dermis de la piel. Por lo general, aparece como un pequeño bulto duro de color marrón o rosa que puede tener una apariencia ligeramente elevada. Aunque son inofensivos, a veces pueden confundirse con melanoma debido a su apariencia.                            </p>
                                  </CardContent>
                              </div>
          
                              <div className="card demo-card-header-pic" style={{backgroundColor: 'white', border: '3px solid #00802b'}}>
                                  <CardHeader style={{padding: '10px'}}>
                                      <img className="tipo" src="../images/VASC.jpg"/>
                                      <div className={isMobile ? 'tipo-tittle3-mobile' : 'tipo-tittle3'} >Lesiones Vasculares</div>
                                  </CardHeader>
                                  <CardContent>
                                  {isMobile2 ? (
                                              <div className="tipo-subtittle3-mobile">
                                                  <div className="first-line">
                                                      <MdHealthAndSafety style={{fontSize: '20px', color: 'green'}}/>
                                                      <div>
                                                          <span  className='bajo'> SIN RIESGO</span > :
                                                      </div>
                                                  </div>
                                                  <p className="second-line"> Lesión benigna</p>
                                              
                                              </div>
                                          ):(
                                              <p className="tipo-subtittle3"><MdHealthAndSafety style={{ width: '10%', fontSize: '20px', color: 'green' }}/><p className='bajo'> SIN RIESGO</p>: Lesión benigna</p>
          
                                      )}
                                      <p className='text-body'>
                                      Las lesiones vasculares son problemas en los vasos sanguíneos de la piel. Incluyen hemangiomas (manchas rojas en bebés), malformaciones vasculares y telangiectasias (pequeñas venas visibles). Estas lesiones pueden ser de nacimiento o desarrollarse con el tiempo. En términos cancerígenos son inofensivas, aunque pueden necesitar tratamiento si afectan la apariencia o la función.                            </p>
                                  </CardContent>
                              </div>
                          </div>

                      ):(
                          <div style={{display: 'grid', gridTemplateColumns: '32% 32% 32%', gap: '2%'}}>
                              <div className="card demo-card-header-pic" style={{backgroundColor: 'white', border: '3px solid #00802b'}}>
                                  <CardHeader style={{padding: '10px'}}>
                                      <img className="tipo" src="../images/BKL.jpg"/>
                                      <div className={isMobile ? 'tipo-tittle3-mobile' : 'tipo-tittle3'} >Queratosis Seborreica</div>
                                  </CardHeader>
                                  <CardContent>
                                      {isMobile2 ? (
                                              <div className="tipo-subtittle3-mobile">
                                                  <div className="first-line">
                                                      <MdHealthAndSafety style={{fontSize: '20px', color: 'green'}}/>
                                                      <div>
                                                      <span  className='bajo'> SIN RIESGO</span > :
                                                      </div>
                                                  </div>
                                                  <p className="second-line"> Mancha de edad</p>
                                              
                                              </div>
                                          ):(
                                              <p className="tipo-subtittle3"><MdHealthAndSafety style={{ width: '10%', fontSize: '20px', color: 'green' }}/><p className='bajo'> SIN RIESGO</p>: Mancha de edad</p>

                                      )}
                                      <p className='text-body'>
                                      Las queratosis seborreicas, también llamadas verrugas seborreicas o manchas de la edad, son crecimientos cutáneos benignos que generalmente aparecen en áreas de la piel expuestas al sol. A menudo son de color marrón oscuro o negro y tienen una textura cerosa o escamosa.                            </p>
                                  </CardContent>
                              </div>

                              <div className="card demo-card-header-pic" style={{backgroundColor: 'white', border: '3px solid #00802b'}}>
                                  <CardHeader style={{padding: '10px'}}>
                                      <img className="tipo" src="../images/DF.jpg"/>
                                      <div className={isMobile ? 'tipo-tittle3-mobile' : 'tipo-tittle3'} >Dermatofibroma</div>
                                  </CardHeader>
                                  <CardContent>
                                  {isMobile2 ? (
                                              <div className="tipo-subtittle3-mobile">
                                                  <div className="first-line">
                                                      <MdHealthAndSafety style={{fontSize: '20px', color: 'green'}}/>
                                                      <div>
                                                      <span  className='bajo'> SIN RIESGO</span > :
                                                      </div>
                                                  </div>
                                                  <p className="second-line"> Lesión benigna</p>
                                              
                                              </div>
                                          ):(
                                              <p className="tipo-subtittle3"><MdHealthAndSafety style={{ width: '10%', fontSize: '20px', color: 'green' }}/><p className='bajo'> SIN RIESGO</p>: Lesión benigna</p>

                                      )}
                                      <p className='text-body'>
                                      El dermatofibroma es una lesión cutánea benigna que se desarrolla a partir de células fibroblásticas en la dermis de la piel. Por lo general, aparece como un pequeño bulto duro de color marrón o rosa que puede tener una apariencia ligeramente elevada. Aunque son inofensivos, a veces pueden confundirse con melanoma debido a su apariencia.                            </p>
                                  </CardContent>
                              </div>

                              <div className="card demo-card-header-pic" style={{backgroundColor: 'white', border: '3px solid #00802b'}}>
                                  <CardHeader style={{padding: '10px'}}>
                                      <img className="tipo" src="../images/VASC.jpg"/>
                                      <div className={isMobile ? 'tipo-tittle3-mobile' : 'tipo-tittle3'} >Lesiones Vasculares</div>
                                  </CardHeader>
                                  <CardContent>
                                  {isMobile2 ? (
                                              <div className="tipo-subtittle3-mobile">
                                                  <div className="first-line">
                                                      <MdHealthAndSafety style={{fontSize: '20px', color: 'green'}}/>
                                                      <div>
                                                      <span  className='bajo'> SIN RIESGO</span > :
                                                      </div>
                                                  </div>
                                                  <p className="second-line"> Lesión benigna</p>
                                              
                                              </div>
                                          ):(
                                              <p className="tipo-subtittle3"><MdHealthAndSafety style={{ width: '10%', fontSize: '20px', color: 'green' }}/><p className='bajo'> SIN RIESGO</p>: Lesión benigna</p>

                                      )}
                                      <p className='text-body'>
                                      Las lesiones vasculares son problemas en los vasos sanguíneos de la piel. Incluyen hemangiomas (manchas rojas en bebés), malformaciones vasculares y telangiectasias (pequeñas venas visibles). Estas lesiones pueden ser de nacimiento o desarrollarse con el tiempo. En términos cancerígenos son inofensivas, aunque pueden necesitar tratamiento si afectan la apariencia o la función.                            </p>
                                  </CardContent>
                              </div>
                          </div>
                      )}
                      
                  </Container>

              )}

          </div>
        </div>
      ):(
        <div className="page" >

          { isMobile2 ? (
            <div className="navbar" style={{display: 'grid', gridTemplateColumns: ' 1% 40px 20% 70%', background: 'teal', color: '#ffffff', textAlign: 'center', alignItems: 'center',  fontSize: '170%', lineHeight: '250%'}}>
          
              <div/>
              <IoMenu onClick={handleMenu} style={{width: '100%', fontSize: '40px', color:'white'}}/>
              {role === 0 ? (
                <div onClick={handleMenu} style={{width: '100%', fontSize: '120%', whiteSpace: 'nowrap'}}>
                  VideSkin Profesional
                </div>
              ) : (
                <div onClick={handleMenu} style={{width: '100%', fontSize: '120%'}}>
                  VideSkin
                </div>
              )}
            </div>
          ):(
            <>
              {role === 0 ? (
                <div className="navbar" style={{ display: 'grid', gridTemplateColumns: '1fr', background: 'teal', color: '#ffffff', textAlign: 'center', alignContent: 'center', fontSize: '170%' }}>
                  <span>VideSkin Profesional</span>
                </div>
              ) : (
                <div className="navbar" style={{ display: 'grid', gridTemplateColumns: '1fr', background: 'teal', color: '#ffffff', textAlign: 'center', alignContent: 'center', fontSize: '170%' }}>
                  <span>VideSkin</span>
                </div>
              )}
            </>
          )}

          <div className="page-content"  >

            <NavigationMenu/>

            <Container id='container' >

              { isMobile ? (
                <div>
                  {/* PERFIL */}
                  <div className='perfil'>
                        <CuadradoHancho style={{margin: '5%'}}>
                          <img src={`data:image/png;base64, ${perfilImage}`}  style={{objectFit:'cover', width: "100%",  aspectRatio: '1 / 1',  borderRadius: '50%', border: `5px solid white`}}/>
                        </CuadradoHancho>
                        <div style={{display: 'flex', flexDirection: 'column',height: '100%', marginLeft: '3%'}}>
                          <div style={{flex: '2', alignContent: 'center'}}>   
                            <div className="Linkicon" style={{display: 'grid', height: '50px', gridTemplateColumns: '15% 85%', alignItems: 'center', marginTop: '5%', backgroundColor: 'white', borderRadius: '15px'}}>
                              <IoPersonCircleSharp   style={{width: '100%', fontSize: '30px', color:'#006689'}}/>
                              <div style={{width: '100%', fontWeight: 'bold', color: 'black', fontSize: '120%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>
                                {user}
                              </div>
                            </div>
                          </div> 
                          {role === 0 ? (
                            <div style={{ flex: '3', paddingTop: '5%' }}>
                              <Button fill color='white' onClick={handleSeleccionarPaciente}>Seleccionar paciente</Button>
                            </div>
                            ):(
                              <div style={{ flex: '3'}}/>
                            )} 
                        </div>
                  </div>

                  {/* UVA */}
                  <div className='uva'>
                      <div className="Linkicon" style={{width: '95%', display: 'grid', gridTemplateColumns: '10% 90%', alignItems: 'center'}}>
                        <FaSun   style={{width: '100%', fontSize: '30px', color: 'Gold'}}/>
                        <div style={{width: '100%'}}>
                          {ciudad ? (
                            <div style={{width: '100%',display: 'grid', gridTemplateColumns: '50% 50%', alignItems: 'center'}}>
                              <div style={{fontWeight: '600', fontSize: '140%', color: 'white'}}>
                                <span>{ciudad} ({pais})</span>
                              </div>
                              <div style={{display: 'flex', flexDirection: 'column'}}>
                                <div style={{flex: '1',fontWeight: '600', fontSize: '140%', color: 'white', marginBottom: '5px'}}>
                                  Indice UV: {uvIndex}
                                </div>
                                <div style={{flex: '1', display: 'grid', gridTemplateColumns: '5% 85% 10%', alignItems: 'center', textAlign: 'center', fontWeight: '600', fontSize: '140%', color: 'white'}}>
                                  1{renderRiskBar(uvIndex)}11
                                </div> 
                              </div>
                            </div>
                          ):(
                            <div style={{fontWeight: '600', fontSize: '110%', color: 'white'}}>
                            No se ha podido acceder a la localización.
                            </div>
                          )}
                        </div>
                      </div>
                  </div>


                  {/*SECCION INSTRUCCIONES*/}
                  <div className='instrucciones'>
                    <div className="Linkicon" style={{display: 'grid', gridTemplateColumns: '10% 90%', alignItems: 'center', margin:'5% 0'}}>
                      <MdImageSearch  style={{width: '100%', fontSize: '30px'}}/>
                      <div style={{width: '100%', fontWeight: 'bold', fontSize: '150%'}}>
                        Realiza tu seguimiento dermatológico
                      </div>
                    </div>

                    <div className="Linkicon" style={{display: 'grid', gridTemplateColumns: '10% 90%', alignItems: 'center', margin:'5% 0'}}>
                      <AiOutlineAim  style={{width: '100%', fontSize: '30px', color:'#006689'}}/>
                      <div style={{width: '100%', fontSize: '120%'}}>
                        Añade las lesiones en el mapa y mantenlas localizadas. Pulsa sobre los marcadores para ampliar la información.
                      </div>
                    </div>

                    <div className="Linkicon" style={{display: 'grid', gridTemplateColumns: '10% 90%', alignItems: 'center', margin:'5% 0'}}>
                      <MdHistory style={{width: '100%', fontSize: '30px', color:'#006689'}}/>
                      <div style={{width: '100%', fontSize: '120%'}}>
                        Explora el historial de cada lesión y mantén su evolución controlada.
                      </div>
                    </div>

                    <div className="Linkicon" style={{display: 'grid', gridTemplateColumns: '10% 90%', alignItems: 'center', margin:'5% 0'}}>
                      <FaRegHourglassHalf  style={{width: '100%', fontSize: '25px', color:'#006689'}}/>
                      <div style={{width: '100%', fontSize: '120%'}}>
                      Realiza actualizaciones periódicamente para seguir la evolución de la lesión y tomar decisiones.
                      </div>
                    </div>

                    <div style={{width: '95%', margin: '20px auto', marginTop: '30px'}}>
                      <Button fill title="Analizar" onClick={handleNewLesion} color="teal">Añadir Lesión</Button>
                    </div>

                  </div>

                  
                  {/*SECCION BODY*/}
                  <ImageContainer>
                    <MarkersContainer>
                      <Imagen src={currentImage} alt="Imagen" className="body-image"/>
                    
                      {/* Renderizar los marcadores */}
                      {markers.map((marker, index) =>{

                        const popoverClassName  = `popover-${index}`;
                        //console.log(index,popoverClassName,marker.color )
                        return(
                        <div key={index} onClick={() => handleClickMarker(marker)} style={{ cursor: 'pointer' }}>
                          <Marker className='Marker' popoverOpen={`.${popoverClassName}`} marker={marker} currentimage={currentImage} ><FaLocationCrosshairs style={{fontSize: '25px', color: marker.color}}/></Marker>

                          <Popover className={popoverClassName}>
                            <div style={{display: 'flex', flexDirection: 'column', width: '99%',height: '100%'}}>
                              <div style={{flex: 1, margin: '2%', display: 'grid', gridTemplateColumns: '45% 50%', alignItems: 'center'}}>
                                <img src={`data:image/png;base64, ${marker.imagen}`} style={{ borderRadius: '25px', width: "100%", height: '100px', marginTop: '3%', marginLeft: '3%', objectFit:'cover', border: `4px solid teal`}}/>
                                <div style={{width: '75%', height: '0', paddingBottom: '70%', position: 'relative', maxWidth: '90px', maxHeight: '80px', margin: 'auto 25%'}}>
                                  <CircularProgressbar value={marker.probabilidad} text={`${marker.probabilidad}%`} styles={buildStyles({
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
                                                                                                                                    pathColor: marker.color,
                                                                                                                                    textColor: 'black',
                                                                                                                                    trailColor: '#d6d6d6',
                                                                                                                                    backgroundColor: 'black',
                                                                                                                                  })}/>
                                </div>
                              </div>
                              <div style={{flex: 1, margin: '5% 4%', marginBottom: '5%', display: 'grid', gridTemplateColumns: '100%', borderRadius: '16px'}}>
                                <div style={{display: 'grid', gridTemplateColumns: '48% 48%', gap: '4%', alignItems: 'center'}}>
                                  <a className="list-button popover-close" style={{backgroundColor: '#FF7F50', color: 'white', borderRadius: '8px'}} onClick={() => handleAmpliar(marker)}>Ampliar</a>
                                  <a className="list-button popover-close" style={{backgroundColor: '#FF7F50', color: 'white', borderRadius: '8px'}} onClick={() => handleBorrarMarker(marker)}>Borrar</a>
                                </div>
                              </div>
                            </div>
                          </Popover>
                        </div>
                      )})}

                    </MarkersContainer>
                  </ImageContainer>

                  <ContainerButton>
                    <Button fill style={{background: '#FF7F50'}} onClick={handleCambiarDelante}>Delante</Button>
                    <Button fill style={{background: '#FF7F50'}} onClick={handleCambiarDetras}>Detras</Button>
                  </ContainerButton>

                  <div style={{width: '95%', margin: '10px auto'}}>
                      <Button fill title="Analizar" onClick={handleNewLesion} color="teal">Añadir Lesión</Button>
                  </div>

                  {/*SECCION FOOTER*/}    
                  {role === 0 && user !== medico ? (
                    <>
                      <List strong inset dividersIos style={{marginBottom: '0px'}}>
                        <ListItem onClick={handleTipos} style={{height: '7vh', alignContent: 'center', fontSize: '20px'}} title="Tipos de Lesión"/>
                      </List>
                      <List strong inset dividersIos style={{marginBottom: '0px', backgroundColorcolor:'black'}}>
                        <Button fill onClick={handleRecordatorio} style={{height: '7vh', alignContent: 'center', fontSize: '16px'}}>Añadir recordatorio al usuario</Button>
                      </List>
                    </>
                  ):(
                    <List strong inset dividersIos style={{marginBottom: '0px'}}>
                      <ListItem onClick={handleTipos} style={{height: '7vh', alignContent: 'center', fontSize: '20px'}} title="Tipos de Lesión"/>
                    </List>
                  )}
              
                </div>
              ):(
                <div className='homeGrid'>
                  <div className='columna'>

                    {/* PERFIL */}
                    <div className='perfil'>
                    
                          <Cuadrado>
                            <img src={`data:image/png;base64, ${perfilImage}`}  style={{objectFit:'cover', height: "100%",  aspectRatio: '1 / 1',  borderRadius: '50%'}}/>
                          </Cuadrado>
                    
                          <div style={{display: 'flex', flexDirection: 'column',height: '100%', marginLeft: '14%'}}>
                            <div style={{flex: '2', alignContent: 'center'}}>   
                              <div className="Linkicon" style={{display: 'grid', height: '50px', gridTemplateColumns: '15% 85%', alignItems: 'center', marginTop: '5%', backgroundColor: 'white', borderRadius: '15px'}}>
                                <IoPersonCircleSharp   style={{width: '100%', fontSize: '30px', color:'#006689'}}/>
                                <div style={{width: '100%', fontWeight: 'bold', color: 'black', fontSize: '120%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>
                                  {user}
                                </div>
                              </div>
                            </div> 
                            {role === 0 ? (
                            <div style={{ flex: '3', paddingTop: '5%' }}>
                              <Button fill color='white' onClick={handleSeleccionarPaciente}>Seleccionar paciente</Button>
                            </div>
                            ):(
                              <div style={{ flex: '3'}}/>
                            )} 
                          </div>
                    </div>

                    {/* UVA */}
                    <div className='uva'>
                      <div className="Linkicon" style={{width: '95%', display: 'grid', gridTemplateColumns: '10% 90%', alignItems: 'center'}}>
                        <FaSun   style={{width: '100%', fontSize: '30px', color: 'Gold'}}/>
                        <div style={{width: '100%'}}>
                          {ciudad ? (
                            <div style={{width: '100%',display: 'grid', gridTemplateColumns: '50% 50%', alignItems: 'center'}}>
                              <div style={{fontWeight: '600', fontSize: '140%', color: 'white'}}>
                                <span>{ciudad} ({pais})</span>
                              </div>
                              <div style={{display: 'flex', flexDirection: 'column'}}>
                                <div style={{flex: '1',fontWeight: '600', fontSize: '140%', color: 'white', marginBottom: '5px'}}>
                                  Indice UV: {uvIndex}
                                </div>
                                <div style={{flex: '1', display: 'grid', gridTemplateColumns: '5% 85% 10%', alignItems: 'center', textAlign: 'center', fontWeight: '600', fontSize: '140%', color: 'white'}}>
                                  1{renderRiskBar(uvIndex)}11
                                </div> 
                              </div>
                            </div>
                          ):(
                            <div style={{fontWeight: '600', fontSize: '110%', color: 'white'}}>
                            No se ha podido acceder a la localización.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/*SECCION INSTRUCCIONES*/}
                    <div className='instrucciones'>
                      <div className="Linkicon" style={{display: 'grid', gridTemplateColumns: '10% 90%', alignItems: 'center', margin:'5% 0'}}>
                        <MdImageSearch  style={{width: '100%', fontSize: '30px'}}/>
                        <div style={{width: '100%', fontWeight: 'bold', fontSize: '150%'}}>
                          Realiza tu seguimiento dermatológico
                        </div>
                      </div>

                      <div className="Linkicon" style={{display: 'grid', gridTemplateColumns: '10% 90%', alignItems: 'center', margin:'5% 0'}}>
                        <AiOutlineAim  style={{width: '100%', fontSize: '30px', color:'#006689'}}/>
                        <div style={{width: '100%', fontSize: '120%'}}>
                          Añade las lesiones en el mapa y mantenlas localizadas. Pulsa sobre los marcadores para ampliar la información.
                        </div>
                      </div>

                      <div className="Linkicon" style={{display: 'grid', gridTemplateColumns: '10% 90%', alignItems: 'center', margin:'5% 0'}}>
                        <MdHistory style={{width: '100%', fontSize: '30px', color:'#006689'}}/>
                        <div style={{width: '100%', fontSize: '120%'}}>
                          Explora el historial de cada lesión y mantén su evolución controlada.
                        </div>
                      </div>

                      <div className="Linkicon" style={{display: 'grid', gridTemplateColumns: '10% 90%', alignItems: 'center', margin:'5% 0'}}>
                        <FaRegHourglassHalf  style={{width: '100%', fontSize: '25px', color:'#006689'}}/>
                        <div style={{width: '100%', fontSize: '120%'}}>
                        Realiza actualizaciones periódicamente para seguir la evolución de la lesión y tomar decisiones.
                        </div>
                      </div>

                      <div style={{width: '95%', margin: '20px auto', marginTop: '30px'}}>
                        <Button fill title="Analizar" onClick={handleNewLesion} color="teal">Añadir Lesión</Button>
                      </div>

                    </div>

                    {/*SECCION FOOTER*/} 
                    {role === 0 && user !== medico ? (
                      <div style={{display:'grid', gridTemplateColumns:'37% 63%'}}>
                        <List strong inset dividersIos style={{marginBottom: '0px'}}>
                          <ListItem onClick={handleTipos} style={{height: '7vh', alignContent: 'center', fontSize: '16px'}} title="Tipos de Lesión"/>
                        </List>
                        <List strong inset dividersIos style={{marginBottom: '0px', backgroundColorcolor:'black'}}>
                          <Button fill onClick={handleRecordatorio} style={{height: '7vh', alignContent: 'center', fontSize: '16px'}}>Añadir recordatorio al usuario</Button>
                        </List>
                      </div>
                    ):(
                      <List strong inset dividersIos style={{marginBottom: '0px'}}>
                        <ListItem onClick={handleTipos} style={{height: '7vh', alignContent: 'center', fontSize: '20px'}} title="Tipos de Lesión"/>
                      </List>
                    )}

                  </div>

                  {/*SECCION BODY*/}
                  <div className='columna'>
                    
                    
                    <ImageContainer>
                      <MarkersContainer>
                        <Imagen src={currentImage} alt="Imagen" className="body-image"/>
                      
                        {/* Renderizar los marcadores */}
                        {markers.map((marker, index) =>{

                          const popoverClassName  = `popover-${index}`;
                          //console.log(index,popoverClassName,marker.color )
                          return(
                          <div key={index} onClick={() => handleClickMarker(marker)} style={{ cursor: 'pointer' }}>
                            <Marker className='Marker' popoverOpen={`.${popoverClassName}`} marker={marker} currentimage={currentImage} ><FaLocationCrosshairs style={{fontSize: '25px', color: marker.color}}/></Marker>

                            <Popover className={popoverClassName}>
                              <div style={{display: 'flex', flexDirection: 'column', width: '99%',height: '100%'}}>
                                <div style={{flex: 1, margin: '2%', display: 'grid', gridTemplateColumns: '45% 50%', alignItems: 'center'}}>
                                  <img src={`data:image/png;base64, ${marker.imagen}`} style={{ borderRadius: '25px', width: "100%", height: '100px', marginTop: '3%', marginLeft: '3%', objectFit:'cover', border: `4px solid teal`}}/>
                                  <div style={{width: '75%', height: '0', paddingBottom: '70%', position: 'relative', maxWidth: '90px', maxHeight: '80px', margin: 'auto 25%'}}>
                                    <CircularProgressbar value={marker.probabilidad} text={`${marker.probabilidad}%`} styles={buildStyles({
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
                                                                                                                                      pathColor: marker.color,
                                                                                                                                      textColor: 'black',
                                                                                                                                      trailColor: '#d6d6d6',
                                                                                                                                      backgroundColor: 'black',
                                                                                                                                    })}/>
                                  </div>
                                </div>
                                <div style={{flex: 1, margin: '5% 4%', marginBottom: '5%', display: 'grid', gridTemplateColumns: '100%', borderRadius: '16px'}}>
                                  <div style={{display: 'grid', gridTemplateColumns: '48% 48%', gap: '4%', alignItems: 'center'}}>
                                    <a className="list-button popover-close" style={{backgroundColor: '#FF7F50', color: 'white', borderRadius: '8px'}} onClick={() => handleAmpliar(marker)}>Ampliar</a>
                                    <a className="list-button popover-close" style={{backgroundColor: '#FF7F50', color: 'white', borderRadius: '8px'}} onClick={() => handleBorrarMarker(marker)}>Borrar</a>
                                  </div>
                                </div>
                              </div>
                            </Popover>
                          </div>
                        )})}

                      </MarkersContainer>
                    </ImageContainer>

                    <ContainerButton>
                      <Button fill style={{background: '#FF7F50'}} onClick={handleCambiarDelante}>Delante</Button>
                      <Button fill style={{background: '#FF7F50'}} onClick={handleCambiarDetras}>Detras</Button>
                    </ContainerButton>

                  
                  </div>
                </div>
              )}
              
            </Container>
              
            <BodyPopup showPopup={showPopupBody} closePopup={closePopupBody} closePopupGuardado={closePopupBodyGuardado} handleCambiarDelante={handleCambiarDelante} handleCambiarDetras={handleCambiarDetras} currentImage={currentImage} paciente={paciente} id="body-popup"/>
            <AmpliarPopUp showPopup={showPopupAmpliar} closePopup={closePopupAmpliar} marker={marker} setMarker={setMarker} handleActualizar={handleActualizar}/>
            <InstruccionesPopup showPopup={instruccionesPopUp} closePopup={closeInstruccionesPopUp} imagen={imagen} setImagen={setImagen} fileSelected={fileSelected} setFileSelected={setFileSelected} handleAnalizar = {handleAnalizar}/>
            <ResultPopUp showPopup={resultPopUp} cerrarTodo={handleCerrar} closePopup={closeResultPopUp} imagen={imagen} analizar={analizar} analizado={analizado} setAnalizado={setAnalizado} marker={marker} setMarker={setMarker} body={currentImage} simple={0} update={1} paciente={paciente}/>
            <BuscadorPacientesPopUp showPopup={popUpPacientes} closePopup={closePacientesPopUp} pacientes={pacientes} setPaciente={setPaciente}/>
          </div>
        </div>
      )}
    </div>
  );
}
export default React.memo(HomePage);


const Container =styled.div`
  height: auto;
  width: 100%;
  
  margin: 10px auto;
  
`


const Cuadrado = styled.div`
height: 15vh;
min-height: 120px;
border-radius: 16px;
margin: auto;
display: flex;
justify-content: center; /* Centra horizontalmente */
align-items: center; /* Centra verticalmente */
position: relative; 


&:after {
  content: '';
  display: block;
}
&:content {
    position: absolute;
    width: 100%;
    height: 100%;
}
`;


const CuadradoHancho = styled.div`
width: 80%;
max-width: 140px;
min-height: 120px;
border-radius: 16px;
margin: auto;
display: flex;
justify-content: center; /* Centra horizontalmente */
align-items: center; /* Centra verticalmente */
position: relative; 


&:after {
  content: '';
  display: block;
}
&:content {
    position: absolute;
    width: 100%;
    height: 100%;
}
`;



const ContainerButton = styled.div`
  height: auto;
  width: 95%;

  margin: 0px auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2%;
`


const ImageContainer = styled.div`
  height: 100%;
  width: 94%;

  margin: 10px auto;

  overflow: hidden;
  position: relative;

  
  background-color: white;
  border-radius: 16px;

  border: 4px solid teal;

`

const MarkersContainer = styled.div`
  aspect-ratio: 600 / 1332;
  height: 97%; 
  max-width: 340px;

  margin: 10px auto;
  border-radius: 25px;

  align-items: center;
  position: relative;
`


const Imagen = styled.img`
  height: 100%;
  max-width: 340px;
  borderRadius: 25px;
`

const Marker = styled(Link)`
  position: absolute;
  top: ${({ marker }) => `${marker.y}%`};   
  left: ${({ marker }) => `${marker.x}%`};

  width: 7%;

  /* Filtrar el marcador según la imagen */
  ${({ marker, currentimage }) =>
    marker.body !== currentimage &&
    `
    display: none;
  `}

`
