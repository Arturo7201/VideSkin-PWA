import React, { useState, useEffect } from 'react';

import { userConfig } from '../js/config';


import styled from "styled-components";
import { IoMenu } from "react-icons/io5";
import { IoPersonCircleSharp } from "react-icons/io5";


import Swal from 'sweetalert2';
import axios from 'axios';

import BuscadorPacientesPopUp from '../components/buscador';


import {
  f7,
  Button
} from 'framework7-react';
/**
* @module Estadisticas
*/

import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

/**
* Configuración del grafico de barras. 
* @const {Object} optionsBar
*/
const optionsBar = {
  plugins: {
    title: {
      display: true,
      text: 'Gráfico de lesiones por tipo',
      font: {
        size: 25
      }
    },
    tooltip: {
      mode: 'index',
      intersect: true,
    },
    legend: {
      position: 'top',
    },
  },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};
/**
* Configuración del grafico de sectores. 
* @const {Object} optionsPie
*/
const optionsPie = {
  plugins: {
    title: {
      display: true,
      text: 'Lugares con lesiones',
      font: {
        size: 25
      }
    }
  },
  maintainAspectRatio: false,
};
/**
* Configuración del segundo grafico de sectores. 
* @const {Object} optionsPie2
*/
const optionsPie2 = {
  plugins: {
    title: {
      display: true,
      text: 'Tipos de lesiones',
      font: {
        size: 25
      }
    }
  },
  maintainAspectRatio: false,
};


/**
* Estadísticas Page
*
* Este componente representa la página de las estadísticas de la aplicación.
*
* @returns {JSX.Element} 
*/

const Stats = () => {

  //#region ------------------ RESPONSIVE ---------------------------------------------------------------------------

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
  * @memberof module:Estadisticas
  * @name useEffect
  */
  useEffect(() => { 

    const checkIfMobile = () => {
        const containerWidth = document.getElementById('container').offsetWidth;
        setIsMobile(containerWidth <= 950); // Ajusta este valor 
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
  * @memberof module:Estadisticas
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

  //#region -------------------------    GET ESTADISTICAS   --------------------------------------------------------------------------------------
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
  * Struct de lesiones por zona.
  * @const {Object[]}  lesionesPorZona
  * @example
  * {
  *   cabeza: 2,
  *   cuello: 5,
  *   torso: 1,
  *   espalda: 0,
  *   brazo derecho: 0,
  *   mano derecha: 0,
  *   etc
  * }
  */
  const [lesionesPorZona, setlesionPorZona] = useState([])
    /**
  * Struct de lesiones por zona.
  * @const {Object[]}  lesionesPorCategoria
  * @example
  * {
  *   MEL: 2,
  *   AKIEC: 5,
  *   BCC: 1,
  *   NV: 0,
  *   BKL: 0,
  *   DF: 0,
  *   VASC: 1
  * }
  */
  const [lesionesPorCategoria, setlesionesPorCategoria] = useState([])

  /**
  * Pide los datos a la API.
  *
  * @async
  * @method
  * @returns {Promise<Object>} 
  * @throws {Error} - Si ocurre un error durante la solicitud de autenticación.
  * @memberof module:Estadisticas
  */ 
  async function fechtDatos(paciente) {
    try {
      const response = await axios.post(`http://${userConfig.serverIP}:${userConfig.serverPort}/estadisticas`, {id:paciente}, config);
      
      setlesionPorZona(response.data.lesionesPorZona)
      setlesionesPorCategoria(response.data.lesionesPorCategoria)
  
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

  //#region SELECCIONAR PACIENTE ---------------------------------------------------------------------------------------------------------------------------------------------------------

  /**
  * Usuario o paciente selecionado
  * @const {string} user 
  */
  const [user, setUser] = useState(null);
  /**
  * Rol del usuario
  * @const {string} role 
  */
  const [role, setRole] = useState(1);

  /**
  * Comprueba si el usuario está autenticado mediante la validación del token almacenado en localStorage o sessionStorage.
  *
  * @async
  * @method
  * @returns {Promise<boolean>} - Retorna una promesa que resuelve a `true` si el usuario está autenticado, de lo contrario `false`.
  * @throws {Error} - Si ocurre un error durante la solicitud de autenticación.
  * @memberof module:Estadisticas
  */
  async function isAuthenticated() {
  
    try {
      const response = await axios.get(`http://${userConfig.serverIP}:${userConfig.serverPort}/jwt`, config);
      setUser(response.data.logged_in_as)
      setRole(response.data.role)
      return true;

    } catch (error) {

      console.log(error.response.data.msg);
      return false;

    }
  }
 
  /**
  * Efecto que controla la primera carga de los datos.
  * 
  *
  * @method
  * @memberof module:Estadisticas
  * @name useEffect
  */
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const authenticated = await isAuthenticated();
      if (authenticated) {
        await fechtDatos();
        await fetchPerfil();
      }else{
        window.location.reload();
      }
    };
  
    checkAuthAndFetchData();
  }, []);

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
  * @memberof module:Estadisticas
  * @name useEffect
  */
  useEffect(() => {
    const realizarAcciones = async () => {
      if (paciente !== null) {
        f7.dialog.progress();
        try {
          await fetchPerfil(paciente);
          await getUsername(paciente);
          await fechtDatos(paciente);
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
  * @memberof module:Estadisticas
  */
  const closePacientesPopUp = () => {
    showPopUpPacientes(false)
  };

  /**
  * Manejadora de peticion para selecionar al paciente.
  *
  * @method
  * @memberof module:Estadisticas
  */
  const handleSeleccionarPaciente = async () => {
    console.log("SELEC")
    const pacientesObtenidos = await getPacientes();
    setPacientes(pacientesObtenidos);
    showPopUpPacientes(true);
  };

  /**
  * Imagen de perfil del usuario o paciente
  * @const {string} perfilImage 
  */
  const [perfilImage, setPerfilImage] = useState(null);

  /**
  * Consigue la imagen del perfil de usuario o paciente cuando es requerida.
  *
  * @async
  * @method
  * @param {Object} paciente 
  * @returns {Promise<{perfilImage: string | null}>} 
  * @throws {Error} - Si ocurre un error durante la solicitud de autenticación.
  * @memberof module:Estadisticas
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
  * @memberof module:Estadisticas
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

  /**
  * Solicita a la API los pacientes disponibles.
  *
  * @async
  * @method
  * @param {Object} token 
  * @returns {Promise<{pacientes: Object}>} 
  * @throws {Error} - Si ocurre un error durante la solicitud de autenticación.
  * @memberof module:Estadisticas
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


  //#endregion

  //#region ---------- APILADAS CHART -------------------------------------------------------------------------------------------------------------------
  const partesDelCuerpo = ['Cabeza', 'Cuello', 'Pecho', 'Torso', 'Espalda', 'Pelvis', 'Hombro Derecho', 'Brazo Derecho', 'Mano Derecha', 'Hombro Izquierdo', 'Brazo Izquierdo', 'Mano Izquierda', 'Pierna Derecha', 'Pie Derecho', 'Pierna Izquierda', 'Pie Izquierdo'];

  const colorParte = [
    'rgba(255, 99, 132, 0.8)',
    'rgba(54, 162, 235, 0.8)',
    'rgba(255, 206, 86, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(153, 102, 255, 0.8)',
    'rgba(255, 159, 64, 0.8)',
    'rgba(255, 99, 132, 0.8)',
    'rgba(54, 162, 235, 0.8)',
    'rgba(255, 206, 86, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(153, 102, 255, 0.8)',
    'rgba(255, 159, 64, 0.8)',
    'rgba(255, 99, 132, 0.8)',
    'rgba(54, 162, 235, 0.8)',
    'rgba(255, 206, 86, 0.8)',
    'rgba(75, 192, 192, 0.8)'
  ]

  /**
  * Datos del gráfico de barras
  * @const {string} data 
  */ 
  const [data, setData] = useState(null)
  /**
  * Efecto que crea la base de datos necesaria para que la gráfica de barras se renderice.
  *
  * @method
  * @memberof module:Estadisticas
  * @param {boolean} lesionesPorCategoria
  * @name useEffect
  */
  useEffect(() => { 
    console.log(lesionesPorCategoria)
    if (lesionesPorCategoria && Object.keys(lesionesPorCategoria).length > 0) {

      const etiquetas = Object.keys(lesionesPorZona).filter(key => lesionesPorZona[key] !== 0);

      setData({
        labels: ["Melanoma","Nevus","Carcinoma Basocelular","Queratosis actínica","Lesión benigna de queratosis","Dermatofibroma","Lesiones vasculares"],
        datasets: 
          etiquetas.map(parte => ({
            label: parte,
            data: [
              lesionesPorCategoria["Melanoma"][parte],
              lesionesPorCategoria["Nevus"][parte],
              lesionesPorCategoria["Carcinoma Basocelular"][parte],
              lesionesPorCategoria["Queratosis actínica"][parte],
              lesionesPorCategoria["Lesión benigna de queratosis"][parte],
              lesionesPorCategoria["Dermatofibroma"][parte],
              lesionesPorCategoria["Lesiones vasculares"][parte]
            ],
            backgroundColor: colorParte[partesDelCuerpo.indexOf(parte)], // Puedes cambiar el color aquí 
          }
        ))
        
      })
    }
  }, [lesionesPorCategoria]); 

  //#endregion

  //#region ---------- PIE CHART 1 -------------------------------------------------------------------------------------------------------------------------
  /**
  * Datos del gráfico de sectores 1
  * @const {string} data 
  */
  const [data2, setData2] = useState(null)
  /**
  * Efecto que crea la base de datos necesaria para que la gráfica de sectores 1 se renderice.
  *
  * @method
  * @memberof module:Estadisticas
  * @param {boolean} lesionesPorZona
  * @name useEffect
  */
  useEffect(() => { 
    console.log(lesionesPorZona)
    if (lesionesPorZona && Object.keys(lesionesPorZona).length > 0) {

      const etiquetas = Object.keys(lesionesPorZona).filter(key => lesionesPorZona[key] !== 0);
      const numeroLesiones = etiquetas.map(key => lesionesPorZona[key]);

      setData2({
        labels: etiquetas,
        datasets: [{
          label: 'Numero de lesiones',
          data: numeroLesiones,
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)'
          ],
          borderWidth: 1
        }]
      })
    }
  }, [lesionesPorZona]); 

  //#endregion

  //#region ---------- PIE CHART 2 -------------------------------------------------------------------------------------------------------------------------
  const tiposLesion = ["Melanoma","Nevus","Carcinoma Basocelular","Queratosis actínica","Lesión benigna de queratosis","Dermatofibroma","Lesiones vasculares"]

  /**
  * Datos del gráfico de sectores 2
  * @const {string} data 
  */
  const [data3, setData3] = useState(null)
  /**
  * Efecto que crea la base de datos necesaria para que la gráfica de sectores 2 se renderice.
  *
  * @method
  * @memberof module:Estadisticas
  * @param {boolean} lesionesPorZona
  * @name useEffect
  */
  useEffect(() => { 
    console.log(lesionesPorZona)
    if (lesionesPorZona && Object.keys(lesionesPorZona).length > 0) {

      const etiquetas = Object.keys(lesionesPorZona).filter(key => lesionesPorZona[key] !== 0);
      
      // Crear un nuevo diccionario para almacenar la suma de lesiones por tipo
      const sumaLesionesPorTipo = {};
      

      // Iterar sobre cada tipo de lesión
      for (const tipoLesion in lesionesPorCategoria) {
        const lugares = lesionesPorCategoria[tipoLesion];
        // Iterar sobre cada lugar dentro del subdiccionario
        for (const lugar in lugares) {
          // Sumar al contador correspondiente en 'sumaLesionesPorTipo'
          sumaLesionesPorTipo[tipoLesion] = (sumaLesionesPorTipo[tipoLesion] || 0) + lugares[lugar];
        }
      }

      // Crea un nuevo objeto donde las claves se asignan en el orden deseado
      let nuevoSumaLesionesPorTipo = {};
      tiposLesion.forEach(tipo => {
        nuevoSumaLesionesPorTipo[tipo] = sumaLesionesPorTipo[tipo];
      });

      console.log(etiquetas,lesionesPorCategoria,nuevoSumaLesionesPorTipo)
      
      setData3({
        labels: tiposLesion,
        datasets: [{
          label: 'Numero de lesiones',
          data: Object.values(nuevoSumaLesionesPorTipo),
          backgroundColor: [
            'rgba(255, 0, 0, 0.8)',        // Rojo peligro oscuro
            'rgba(255, 255, 102, 0.8)',    // Amarillo warning claro
            'rgba(255, 69, 58, 0.8)',      // Rojo peligro claro (nuevo)
            'rgba(255, 255, 0, 0.8)',      // Amarillo warning oscuro
            'rgba(0, 128, 0, 0.8)',        // Verde safe oscuro
            'rgba(34, 139, 34, 0.8)',      // Verde safe medio (nuevo)
            'rgba(144, 238, 144, 0.8)'     // Verde safe claro
          ],
          borderColor: [
            'rgba(255, 0, 0, 0.8)',       // Rojo oscuro
            'rgba(255, 255, 0, 0.8)',     // Amarillo claro
            'rgba(255, 99, 132, 0.8)',    // Rojo claro
            'rgba(255, 206, 86, 0.8)',    // Amarillo oscuro
            'rgba(34, 139, 34, 0.8)',     // Verde oscuro
            'rgba(75, 192, 192, 0.8)',    // Verde medio
            'rgba(144, 238, 144, 0.8)'    // Verde claro
          ],
          borderWidth: 1
        }]
      })
    }
  }, [lesionesPorZona]); 

  //#endregion

  return(
    <div id='container'>

      { isMobile ? (

        <div class="page">

          { isMobile2 ? (
            <div class="navbar" style={{display: 'grid', gridTemplateColumns: ' 1% 40px 20% 70%', background: 'teal', color: '#ffffff', textAlign: 'center', alignItems: 'center',  fontSize: '170%', lineHeight: '250%'}}>
          
              <div/>
              <IoMenu onClick={handleMenu} style={{width: '100%', fontSize: '40px', color:'white'}}/>
              
              <div onClick={handleMenu} style={{width: '100%', fontSize: '120%'}}>
                      Estadisticas
              </div>


            </div>
          ):(
            <div class="navbar" style={{display: 'grid', gridTemplateColumns: '1fr', background: 'teal', color: '#ffffff', textAlign: 'center',alignContent: 'center', fontSize: '170%'}}>
              <span style={{}}>Estadisticas</span>
            </div>
          )} 


          <div class="page-content">
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

            { data ? (
                <div className='cardS' style={{padding: '5%', height: '60vh'}}>
                  <Bar options={optionsBar} data={data} />
                </div>
            ):(
              <div/>
            )}
      
            { data2 ? (
              <div className='cardS' style={{padding: '20px', height: '50vh'}}>
                <Pie options={optionsPie} data={data2} />
              </div>
            ):(
              <div/>
            )}
            { data ? (
              <div className='cardS' style={{padding: '20px', height: '50vh'}}>
                <Pie options={optionsPie} data={data3} />
              </div>
            ):(
              <div/>
            )}

          </div>
        </div>


      ):(

        <div class="page">

          { isMobile2 ? (
            <div class="navbar" style={{display: 'grid', gridTemplateColumns: ' 1% 40px 20% 70%', background: 'teal', color: '#ffffff', textAlign: 'center', alignItems: 'center',  fontSize: '170%', lineHeight: '250%'}}>
          
              <div/>
              <IoMenu onClick={handleMenu} style={{width: '100%', fontSize: '40px', color:'white'}}/>
              
              <div onClick={handleMenu} style={{width: '100%', fontSize: '120%'}}>
                      Estadisticas
              </div>


            </div>
          ):(
            <div class="navbar" style={{display: 'grid', gridTemplateColumns: '1fr', background: 'teal', color: '#ffffff', textAlign: 'center',alignContent: 'center', fontSize: '170%'}}>
              <span style={{}}>Estadisticas</span>
            </div>
          )} 

          <div class="page-content">

            { data ? (
              <>
              { role === 0 ?(
                <div style={{display:'grid', gridTemplateColumns:'70% 30%'}}>
                  <div className='cardS' style={{padding: '20px', height: '30vh'}}>
                    <Bar options={optionsBar} data={data} />
                  </div>
                  <div className='perfil' style={{display:'flex', flexDirection:'column', padding: '20px', marginTop:'15px', height: '30vh'}}>
                    <div style={{flex:'3', display:'flex', width:'95%'}}>
                      <Cuadrado>
                        <img src={`data:image/png;base64, ${perfilImage}`}  style={{objectFit:'cover', height: "100%",  aspectRatio: '1 / 1',  borderRadius: '50%'}}/>
                      </Cuadrado>
                      <div style={{flex: '2', marginLeft:'20px', alignContent: 'center'}}>   
                        <div className="Linkicon" style={{display: 'grid', height: '50px', gridTemplateColumns: '15% 85%', alignItems: 'center', marginTop: '5%', backgroundColor: 'white', borderRadius: '15px'}}>
                          <IoPersonCircleSharp   style={{width: '100%', fontSize: '30px', color:'#006689'}}/>
                          <div style={{width: '100%', fontWeight: 'bold', color: 'black', fontSize: '120%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>
                            {user}
                          </div>
                        </div>
                      </div> 
                    </div>
                    <div style={{felx:'2', width:'95%', marginTop:'10%'}}>
                      <Button fill color='white' onClick={handleSeleccionarPaciente}>Seleccionar paciente</Button>
                    </div>
                  </div>
                </div>
              ):(
                <div className='cardS' style={{padding: '20px', height: '30vh'}}>
                  <Bar options={optionsBar} data={data} />
                </div>
              )}
              </>
            ):(
              <div/>
            )}
            
            <div style={{display: 'grid', gridTemplateColumns: '50% 50%',}}>
              { data2 ? (
                <div className='cardS' style={{marginTop: '0px', marginBottom: '0px', padding: '20px', height: '48vh'}}>
                  <Pie options={optionsPie} data={data2} />
                </div>
              ):(
                <div/>
              )}
              { data ? (
                <div className='cardS' style={{marginTop: '0px', marginBottom: '0px', padding: '20px', height: '48vh'}}>
                  <Pie options={optionsPie2} data={data3} />
                </div>
              ):(
                <div/>
              )}
            </div>

          </div>
        </div>

      )}

      <BuscadorPacientesPopUp showPopup={popUpPacientes} closePopup={closePacientesPopUp} pacientes={pacientes} setPaciente={setPaciente}/>

      
    </div>
  );
};

export default Stats;


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