import React, { useState, useEffect, useRef } from 'react';


import Swal from 'sweetalert2';

import styled from "styled-components";


import { MdImageSearch} from "react-icons/md";

import { FaRegHourglassHalf } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";



import axios from 'axios';

import { View, Page, Panel, Block, Icon, List, Button, ListInput, f7 } from 'framework7-react';

import { userConfig } from '../js/config';

/**
* @module Calendario
*/

/**
* Normaliza la fecha y la establece en la hora 00:00
*
* @method
* @param {Date} date
* @returns {Date} 
* @memberof module:Calendario
*/
function normalizeDate(date) {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

/**
* Devuelve un color aleatorio de un set.
*
* @method
* @returns {String} 
* @memberof module:Calendario
*/
function getRandomColorFromSet() {
  const colors = ['#ff0000', '#2196f3', '#00ff00', '#ff9800', '#9c27b0', '#3f51b5', '#795548'];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
* Transforma un Date es una cadena de texto
*
* @method
* @param {Date} date
* @returns {String} 
* @memberof module:Calendario
*/
function formatDateToString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses van de 0 a 11
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

 /**
 * Calendario Page
 *
 * Este componente representa la página del calendario de la aplicación.
 *
 * @returns {JSX.Element} 
 */
export function Calendario () {

  //#region ---------------------- RENDER RESPONSIVE ------------------------------------------------------------------------------------------------------------------------------------------

  const [isMobile2, setIsMobile2] = useState(window.innerWidth <= 768); 


  /**
  * Efecto que verifica si la pantalla ha cambiado de tamaño
  * lo suficiente para pasar del modo escritorio al modo smartphone
  *
  * @method
  * @param {boolean} isMobile2
  * @memberof module:Calendario
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



  const calendarInline = useRef(null);
  const [eventosSeleccionado, setEventosSeleccionado] = useState([]);
  const [eventos, setEventos] = useState([])
  const [eventosNormalizados, setEventosNormalizados] = useState([])

  //#region ----------------- CREACION Y DESTRUCCION ------------------------------------------------------------------------------------------------------

/**
* En el inicio de la pagina renderiza el calendario de forma dinamica.
*
* @method
* @returns {JSX.Element} 
* @memberof module:Calendario
* @name onPageInit
*/
  const onPageInit = async () => {
    
    const $ = f7.$;
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']

    if (calendarInline.current) {
      calendarInline.current.destroy();
      calendarInline.current = null;
      document.getElementById('demo-calendar-inline-container').innerHTML = ''; // Limpiar el contenedor
    }

    /**
    * Fechas de recordatorios.
    * @const {Date} eventosFetched 
    */
    const eventosFetched = await getFechas()
    setEventos(eventosFetched)


    /**
    * Fechas de recordatorios normalizadas.
    * @const {Date} eventosNormalizadosFetched 
    */
    const eventosNormalizadosFetched = eventosFetched.map(evento => ({
      ...evento,
      date: normalizeDate(evento.date),
    }))
    setEventosNormalizados(eventosNormalizadosFetched)
    //console.log('E2: ', eventosNormalizadosFetched)
    

    calendarInline.current = f7.calendar.create({ containerEl: '#demo-calendar-inline-container', value: [new Date()],
        renderToolbar() {
            return `
            <div class="toolbar calendar-custom-toolbar">
                <div class="toolbar-inner">
                <div class="left">
                    <a  class="link icon-only"><i class="icon icon-back"></i></a>
                </div>
                <div class="center"></div>
                <div class="right">
                    <a  class="link icon-only"><i class="icon icon-forward"></i></a>
                </div>
                </div>
            </div>
            `.trim();
        },
        on: {
            init(c) {
            $('.calendar-custom-toolbar .center').text(
                `${monthNames[c.currentMonth]}, ${c.currentYear}`,
            );
            $('.calendar-custom-toolbar .left .link').on('click', () => {
                calendarInline.current.prevMonth();
            });
            $('.calendar-custom-toolbar .right .link').on('click', () => {
                calendarInline.current.nextMonth();
            });
            },
            monthYearChangeStart(c) {
            $('.calendar-custom-toolbar .center').text(
                `${monthNames[c.currentMonth]}, ${c.currentYear}`,
            );
            },
            dayClick(c, dayEl, year, month, day) {
                setEventosSeleccionado([])
                const events = eventosFetched; // events es una promesa
                const clickedDate = new Date(year, month, day); 
                //console.log(events)
                for (const evento of events){
                    if(evento.date instanceof Date){
                        //console.log(normalizeDate(evento.date), clickedDate.getTime() )
                        if (normalizeDate(evento.date).getTime() === clickedDate.getTime()){
                            //console.log(evento);
                            setEventosSeleccionado(prevEventosSeleccionado => [...prevEventosSeleccionado, evento]);
                        }
                    }

                }
            },
        },
        events: eventosNormalizadosFetched,
        
    });
  };

  /**
  * Al abandonar la pagina destruye el calendario creado de forma dinamica.
  *
  * @method
  * @param {Object} calendar
  * @memberof module:Calendario
  * @name onPageBeforeRemove
  */
  const onPageBeforeRemove = () => {
    calendarInline.current.destroy();
  };

  //#endregion

  //#region ---------- AUTENTICACION ---------------------------------------------------------------------------------------------
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
  

  //#endregion

  //#region ---------- GET RECORDATORIOS ---------------------------------------------------------------------------------------------
  /**
  * Pide los recordatorios a la API.
  *
  * @async
  * @method
  * @returns {Promise<Object>}
  * @throws {Error} - Si ocurre un error durante la solicitud de autenticación.
  * @memberof module:Calendario
  */
  async function getFechas() {

    try {
      const response = await axios.get(`http://${userConfig.serverIP}:${userConfig.serverPort}/fechas`, config);

      //console.log(response.data.fechas);
      return response.data.fechas.map(evento => {
        return {
            id: evento.id,
            date: new Date(evento.fecha), // Asume que evento.fecha es una cadena de fecha
            color: evento.color || getRandomColorFromSet(), // Color por defecto si no se especifica
            text: evento.recordatorio
        };
      });
      
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

  //#region ---------- AÑADIR  -   ELIMINAR RECORDATORIOS ---------------------------------------------------------------------------------------------

  const [fecha, setFecha] = useState("");
  const handleDateChange = (event) => {
    setFecha(event.target.value);
  };

  /**
  * Manejadora de dialogos para añadir fecha.
  *
  * @method
  * @memberof module:Calendario
  * @name handleAñadir
  */
  const handleAñadir = () => {
    
    if (fecha === ""){
      f7.dialog.alert('Por favor, selecciona una fecha.');
    }else{
      f7.dialog.prompt('Introduce el recordatorio:', (info) => {
        f7.dialog.confirm(`${info} en la fecha ${fecha}`, () => {
          añadirFecha(info)
          f7.dialog.alert(`Recordatorio añadido el dia ${fecha}`);
        });
      });
    }
  }

  /**
  * Peticion para añadir recordatorio a la API.
  *
  * @async
  * @method
  * @throws {Error} - Si ocurre un error durante la solicitud de autenticación.
  * @memberof module:Calendario
  */
  async function añadirFecha(info) {

    const data = {
      info: info,
      date: fecha
    }

    const nuevaFecha = {
      date: normalizeDate(fecha),
      color: getRandomColorFromSet(),
      text: info
    };


    try {
      const response = await axios.post(`http://${userConfig.serverIP}:${userConfig.serverPort}/addfecha`, data, config);

      onPageInit()


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


  /**
  * Peticion para eliminar recordatorio a la API.
  *
  * @async
  * @method
  * @throws {Error} - Si ocurre un error durante la solicitud de autenticación.
  * @memberof module:Calendario
  */
  async function handleEliminar (evento) {

    const data = {
      id: evento.id
    }

    try {
      const response = await axios.post(`http://${userConfig.serverIP}:${userConfig.serverPort}/deletefecha`, data, config);

      console.log(response.data.message);

      setEventosSeleccionado(null)

      //console.log(eventos)
      onPageInit()


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

    <Page onPageInit={onPageInit} onPageBeforeRemove={onPageBeforeRemove}>

          { isMobile2 ? (
            <div class="navbar" style={{display: 'grid', gridTemplateColumns: ' 1% 40px 20% 70%', background: 'teal', color: '#ffffff', textAlign: 'center', alignItems: 'center',  fontSize: '170%', lineHeight: '250%'}}>
          
              <div/>
              <IoMenu onClick={handleMenu} style={{width: '100%', fontSize: '40px', color:'white'}}/>
              
              <div onClick={handleMenu} style={{width: '100%', fontSize: '120%'}}>
                      Calendario
              </div>


            </div>
          ):(
            <div class="navbar" style={{display: 'grid', gridTemplateColumns: '1fr', background: 'teal', color: '#ffffff', textAlign: 'center',alignContent: 'center', fontSize: '170%'}}>
              <span style={{}}>Calendario</span>
            </div>
          )} 

          {/*SECCION INSTRUCCIONES*/}
          <div class='instrucciones' style={{width: '80%', maxWidth: '700px', margin: '10px auto'}}>
            <div className="Linkicon" style={{display: 'grid', gridTemplateColumns: '10% 90%', alignItems: 'center', margin:'2% 0'}}>
              <MdImageSearch  style={{width: '100%', fontSize: '30px'}}/>
              <div style={{width: '100%', fontWeight: 'bold', fontSize: '190%'}}>
              Calendario de seguimiento
              </div>
            </div>


            <div className="Linkicon" style={{display: 'grid', gridTemplateColumns: '10% 90%', alignItems: 'center', margin:'5% 0'}}>
              <FaRegHourglassHalf  style={{width: '100%', fontSize: '25px', color:'#006689'}}/>
              <div style={{width: '100%', fontSize: '120%'}}>
              Realiza actualizaciones periódicamente para seguir la evolución de la lesión y tomar decisiones.
              </div>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '50% 50%', alignItems: 'center', margin: '0' }}>
            
              <div style={{width: '95%', margin:'0 auto'}}>
                <Button fill onClick={handleAñadir} title="Analizar" color="teal">Añadir Recordatorio</Button>
              </div>

              <List style={{margin: '0'}}>
                <ListInput label="Date time"
                          type="datetime-local"
                          placeholder="Please choose..."
                          value={fecha}
                          onInput={handleDateChange}>
                  <Icon icon="demo-list-icon" slot="media" />
                </ListInput>
              </List>

            </div>

          </div>

          <Container>

    

            <Block strong className="no-padding">
              <div id="demo-calendar-inline-container" />
            </Block>


            <Eventos id="calendar-events" class="list no-margin no-hairlines no-safe-area-left">
              <UlEventos>
              {eventosSeleccionado && eventosSeleccionado.map((evento, index) =>{
                      //console.log(index, evento)
                      return(
                        <Evento key={index}>
                          <Color  style={{backgroundColor: evento.color}}></Color>
                          <Text   style={{fontWeight: '600', fontSize: '110%'}}>
                              {evento.text}
                          </Text>
                          <Text   style={{fontWeight: '600', fontSize: '110%'}}>
                            {evento.date.toLocaleTimeString()}
                          </Text>
                          <div/>
                          <Button fill onClick={() => handleEliminar(evento)} color='pink'>Eliminar</Button>
                        </Evento>
                          
                      )
              })}
              </UlEventos>
            </Eventos>
    
        

          </Container>



    </Page>

  );
}export default Calendario;

const Container =styled.div`
  height: auto;
  width: 90%;
  max-width: 730px; /* Ancho máximo de 500px */
  
  margin: 10px auto;
  
`
const Eventos = styled.div`
`
const UlEventos = styled.div`
  position: relative;
`
const Evento = styled.div`
  display: grid;
  margin: 2% 0;
  grid-template-columns: 3% 2fr 3fr 20% 20%;
  gap: 10px;
  align-items: center;
  box-sizing: border-box;
`
const Color = styled.div`
  width: 80%;
  height: 100%;
`

const Text = styled.div`
    display: flex;
    min-width: 0;
    align-items: center;
    min-height: calc(var(--f7-list-item-min-height));
    padding-left: calc(var(--f7-list-item-padding-horizontal) + var(--f7-safe-area-left));

`

const Container2 = styled.div`
  height: auto;
  width: 95%;
  
  margin: 5% auto;

  border: 4px solid teal;
  
`
