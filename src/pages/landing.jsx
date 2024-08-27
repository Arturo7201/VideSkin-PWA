import React, { useEffect, useState } from 'react';

import RegisterPage from '../components/popup-register'
import ContactPage from './contact-us';

import { IoMenu } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";
import { FaHouseChimneyMedical } from "react-icons/fa6";
import { FaUserDoctor } from "react-icons/fa6";
import { IoMdSchool } from "react-icons/io";
import { FaSun } from "react-icons/fa6";
import { IoBody } from "react-icons/io5";
import { MdArrowBack } from 'react-icons/md';


import styled from 'styled-components';



import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

import axios from 'axios';
import { userConfig } from '../js/config';

import Swal from 'sweetalert2';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import '../css/landing.css'

import {
  f7,
  Page,
  Navbar,
  NavTitle,
  NavTitleLarge,
  LoginScreenTitle,
  View,
  Link,
  NavRight,
  Panel,
  BlockFooter,
  Button,
  Segmented,
  Block,
  BlockTitle,
  ListGroup,
  ListItem,
  Popup,
} from 'framework7-react';


/**
* @module Landing
*/


/**
* Landing Page
*
* Este componente representa la página landing.
*
* @returns {JSX.Element} 
*/
const LandingPage = () => {
    
  //#region ------ RESPONSIVE RENDER ---------------------------------------------------------------------------

    const [isMobile, setIsMobile] = useState(false);
    const [isMobile_1200, setIsMobile_1200] = useState(false);
    const [isMobile2, setIsMobile2] = useState(false);
    /**
     * Efecto que verifica si la pantalla es lo suficientemente estrecha
     * y ajusta el estado `isMobile` en consecuencia. También agrega un listener
     * para el evento `resize` que vuelve a verificar el tamaño de la pantalla
     * cada vez que la ventana se redimensiona.
     *
     * @method
     * @returns {boolean} 
     * @memberof module:Landing
     * @name useEffect
     */
    useEffect(() => {
        // Función para comprobar si la pantalla es lo suficientemente estrecha 
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 820); // Ajusta este valor 
        };
        const checkIfMobile1200 = () => {
            setIsMobile_1200(window.innerWidth <= 1420); // Ajusta este valor 
        };
        const checkIfMobile2 = () => {
            setIsMobile2(window.innerWidth <= 500); // Ajusta este valor 
        };

        // Llama a la función de comprobación cuando se carga la página y cada vez que se redimensiona la ventana
        checkIfMobile();
        checkIfMobile1200();
        checkIfMobile2();

        window.addEventListener('resize', checkIfMobile);
        window.addEventListener('resize', checkIfMobile1200);
        window.addEventListener('resize', checkIfMobile2);

        // Limpia el event listener al desmontar el componente para evitar fugas de memoria
        return () => {
            window.removeEventListener('resize', checkIfMobile);
            window.removeEventListener('resize', checkIfMobile1200);
            window.removeEventListener('resize', checkIfMobile2);
        };
    }, []);

  //#endregion

  //#region ------ POPUP LOGIN REGISTER ------------------------------------------------------------------------
  /**
  * Variable de control del popup de registro.
  * @const {boolean} showPopupReg 
  */
  const [showPopupReg, setShowPopupReg] = useState(false);
  /**
  * Manejadora para cerrar el popup del registro.
  *
  * @method
  * @memberof module:Landing
  * @name closePopupReg
  */ 
  const closePopupReg = () => {
    setShowPopupReg(false);
  }

  /**
  * Manejadora para abrir el popup del registro.
  *
  * @method
  * @memberof module:Landing
  * @name handleSignUp
  */ 
  const handleSignUp = () => {
    setShowPopupReg(true)
  }
  
  /**
  * Manejadora para navegar ala pagina de inicio de sesión.
  *
  * @method
  * @memberof module:Landing
  * @name handleLogIn
  */
  const handleLogIn = () => {
    f7.views.main.router.navigate('/login/');
  }

  //#endregion

  //#region ------ PANEL                ------------------------------------------------------------------------

  const handleMenu = () => {
    f7.panel.open('left');
  }

  //#endregion

  //#region ------ CONTACT            --------------------------------------------------------------------------
  /**
  * Variable de control del popup de registro.
  * @const {boolean} showPopupReg 
  */
  const [showContactUs, setContactUs] = useState(false)
  /**
  * Manejadora para cerrar el popup de contacto.
  *
  * @method
  * @memberof module:Landing
  * @name closeContactUs
  */
  const closeContactUs = () => {
    setContactUs(false)
  }
  /**
  * Manejadora para abrir el popup de contacto.
  *
  * @method
  * @memberof module:Landing
  * @name handleContact
  */
  const handleContact = () => {
    setContactUs(true)
  }
  /**
  * Variable formulario del mensaje de contacto.
  * @const {boolean} data 
  */
  const [data, setData] = useState({
    email: '',
    user: '',
    mensaje : ''
  })
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  /**
  * Manejadora para mandar el mensaje de contacto.
  *
  * @method
  * @memberof module:Landing
  * @name handleEnviar
  */
  const handleEnviar = () => {
    console.log("h",data)
    if(data.email === '' || data.user === '' || data.mensaje === ''){
        Swal.fire({
            icon: 'error',
            text: 'Faltan datos'
        })
    }else {
        uploadInfo()
    }
  }

  /**
  * Peticion a la API para mandar el mensaje de contacto.
  *
  * @method
  * @param {Object} data
  * @throws {Error}
  * @memberof module:Landing
  */
  async function uploadInfo() {
    try {
      const response = await axios.post(`http://${userConfig.serverIP}:${userConfig.serverPort}/contactUs_simple`, {email: data.email, user: data.user, mensaje: data.mensaje});

      Swal.fire({
        icon: 'success',
        text: response.data.mensage
      })
      setData({
        email: '',
        user: '',
        mensaje : ''
      })
      closeContactUs()
        
    } catch (error) {
      try{
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.error
        })
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

  //#region ------ SLIDER             -------------------------------------------------------------------------

  const handleCancer = () => {
    f7.views.main.router.navigate('/tipos/');
  }

  const handleSol = () => {

  }

  const handleTecnology = () => {

  }

  //#endregion


  return(

    <div className="page">

        {isMobile ? (

            <div className="navbar" style={{display: 'grid', gridTemplateColumns: ' 1% 40px 20% 70%', background: 'teal', color: '#ffffff', textAlign: 'center', alignItems: 'center',  fontSize: '170%', lineHeight: '250%'}}>
                
                <div/>
                <IoMenu onClick={handleMenu} style={{width: '100%', fontSize: '40px', color:'white'}}/>
                
                <div onClick={handleMenu} style={{width: '100%', fontSize: '120%'}}>
                        VideSkin
                </div>

                {isMobile2 ? (
                            <div/>
                            ) : (
                                <div style={{display: 'grid', placeItems: 'end'}}>
                                <div style={{maxWidth: '300px'}}>
                                    <div className='grid grid-cols-2 grid-gap'>
                                        <Button className="login-button" large tonal raised style={{fontSize:'20px', ':hover': { color: '#091e28' }}} onClick={handleLogIn} >LOGIN</Button>
                                        <Button className="login-button" large tonal raised style={{fontSize: '20px', ':hover': { color: '#091e28' }}} onClick={handleSignUp} >SINGUP</Button>
                                    </div>
                                </div>
                                </div>

                            )}

            </div>  

            

        ) : (

            <div className="navbar" style={{height: '7%', display: 'grid', gridTemplateColumns: '13% 60% 1% 25%', background: 'teal', color: '#ffffff', textAlign: 'center', alignItems: 'center',  fontSize: '170%', lineHeight: '250%'}}>
                <span style={{ textAlign: 'center'}}>VideSkin</span>
                
                <div className='grid grid-cols-3 grid-gap'style={{maxWidth: '700px'}}>
                    <Button onClick={handleContact} style={{fontSize: '15px', color:'white'}}>Contacta con nosotros</Button>
                    <div/>
                </div>
                <div/>
                <div style={{display: 'grid', placeItems: 'end'}}>
                <div style={{maxWidth: '300px'}}>
                    <div className='grid grid-cols-2 grid-gap'>
                        <Button className="login-button" large tonal raised style={{fontSize:'20px', ':hover': { color: '#091e28' }}} onClick={handleLogIn} >LOGIN</Button>
                        <Button className="login-button" large tonal raised style={{fontSize: '20px', ':hover': { color: '#091e28' }}} onClick={handleSignUp} >SINGUP</Button>
                    </div>
                </div>
                </div>
            </div>  
        )}

      <div className="page-content">

        <Panel left cover containerEl="#panel-page" id="left">
            <div className="panel panel-resizable panel-left panel-floating panel-in">
                <div className="view">
                    <div className="page page-current">
                    <div className="page-content">
                        <div className="block-title" style={{height: '30px', fontSize: '20px'}}>
                            <FaArrowLeft className="link panel-close" style={{fontSize: '15px'}}/> Menú de navegación</div>
                        <div className="list">
                            <ul>


                                <li className="">
                                    <a className="item-link panel-close">
                                        <div className="item-content">
                                            <div className="item-inner">
                                                <div onClick={handleContact} className="item-title">Contacta con nosotros</div>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="block-title">Acceder a la aplicación</div><div className="list">
                            <ul>
                                <li className="">
                                    <a className="item-link panel-close" onClick={handleLogIn}>
                                        <div className="item-content">
                                            <div className="item-inner">
                                                <div className="item-title">Iniciar Sesión</div>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li className="">
                                    <a className="item-link panel-close" onClick={handleSignUp}>
                                        <div className="item-content">
                                            <div className="item-inner">
                                                <div className="item-title">Registarse</div>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        </div>
                        </div>
                </div>
            </div>
        </Panel>

    
        <br/>
        <Swiper
            spaceBetween='2%'
            slidesPerView={1.75}
            //onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
            loop={true}
            centeredSlides={true} // Centra el slide activo
            //navigation // Habilita los botones de navegación
            style={{ width: '100%', height: '60%' }}
        >
            <SwiperSlide className="slide" onClick={handleCancer}>
                <div className="slide-container" >
                    <img className="zoom-effect" src="../images/1.jpg" alt="Slide 1" style={{ objectFit: 'cover'}}/>
                    <div className={isMobile ? 'slide-title-mobile' : 'slide-title'} >Sobre el cancer de piel</div>
                </div>
            </SwiperSlide>
            <SwiperSlide className="slide" onClick={handleSol}>
                <div className="slide-container" >
                    <img className="zoom-effect" src="../images/2.jpg" alt="Slide 2" style={{ objectFit: 'cover'}}/>                   
                    <div className={isMobile ? 'slide-title-mobile' : 'slide-title'} >Sobre la incidencia del sol</div>
                </div>
            </SwiperSlide>
            <SwiperSlide className="slide" onClick={handleTecnology}>
                <div className="slide-container" >
                    <img className="zoom-effect" src="../images/3.jpg" alt="Slide 3" style={{ objectFit: 'cover'}}/>
                    <div className={isMobile ? 'slide-title-mobile' : 'slide-title'} >Sobre la tecnologia utilizada</div>
                </div>
            </SwiperSlide>
            <SwiperSlide className="slide" onClick={handleCancer}>
                <div className="slide-container" >
                    <img className="zoom-effect" src="../images/1.jpg" alt="Slide 1" style={{ objectFit: 'cover'}}/>
                    <div className={isMobile ? 'slide-title-mobile' : 'slide-title'} >Sobre el cancer de piel</div>
                </div>
            </SwiperSlide>
            <SwiperSlide className="slide" onClick={handleSol}>
                <div className="slide-container" >
                    <img className="zoom-effect" src="../images/2.jpg" alt="Slide 2" style={{ objectFit: 'cover'}}/>                   
                    <div className={isMobile ? 'slide-title-mobile' : 'slide-title'} >Sobre la incidencia del sol</div>
                </div>
            </SwiperSlide>
            <SwiperSlide className="slide" onClick={handleTecnology}>
                <div className="slide-container" >
                    <img className="zoom-effect" src="../images/3.jpg" alt="Slide 3" style={{ objectFit: 'cover'}}/>
                    <div className={isMobile ? 'slide-title-mobile' : 'slide-title'} >Sobre la tecnologia utilizada</div>
                </div>
            </SwiperSlide>

        </Swiper>

        {isMobile_1200 ? (

            <div>
                <Block strong className='white-block'>

                <div className="blog-title" >Utiliza nuestras herramientas para tu bienestar:</div>

                    <div>       
                        <div className="blockCalen">
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <div style={{borderRadius: '16px', height: '100%', display: 'grid', gridTemplateColumns: '20% 80%'}}>
                                    <div>
                                        <Cuadrado>
                                            <svg style={{margin: 'auto'}} width="52" height="63" viewBox="0 0 42 43" fill="none">
                                                <path fillRule="evenodd"  d="M11.2972 0.266357C12.0265 0.266357 12.6178 0.857615 12.6178 1.58697V9.42809C12.6178 10.1574 12.0265 10.7487 11.2972 10.7487C10.5678 10.7487 9.97656 10.1574 9.97656 9.42809V1.58697C9.97656 0.857615 10.5678 0.266357 11.2972 0.266357Z" fill="#F8560E"></path>
                                                <path fillRule="evenodd"  d="M30.223 0.124512C30.9523 0.124512 31.5436 0.715769 31.5436 1.44512V9.28625C31.5436 10.0156 30.9523 10.6069 30.223 10.6069C29.4936 10.6069 28.9023 10.0156 28.9023 9.28625V1.44512C28.9023 0.715769 29.4936 0.124512 30.223 0.124512Z" fill="#F8560E"></path>
                                                <path fillRule="evenodd"  d="M8.00391 5.34912H5.26644C2.5434 5.34912 0.335938 7.55658 0.335938 10.2796V38.056C0.335938 40.7791 2.5434 42.9865 5.26644 42.9865H36.8066C39.5296 42.9865 41.7371 40.7791 41.7371 38.056V10.2796C41.7371 7.55658 39.5296 5.34912 36.8066 5.34912H33.4257V9.42732C33.4257 11.2507 31.9475 12.7288 30.1241 12.7288C28.3007 12.7288 26.8226 11.2507 26.8226 9.42732V5.34912H14.607V9.42732C14.607 11.2507 13.1288 12.7288 11.3054 12.7288C9.48205 12.7288 8.00391 11.2507 8.00391 9.42732V5.34912Z" fill="#F8560E"></path>
                                                <path d="M9.73343 29.8157C10.7728 29.8157 11.6153 28.9732 11.6153 27.9339C11.6153 26.8945 10.7728 26.052 9.73343 26.052C8.6941 26.052 7.85156 26.8945 7.85156 27.9339C7.85156 28.9732 8.6941 29.8157 9.73343 29.8157Z" fill="white"></path>
                                                <path d="M17.2569 29.8156C18.2962 29.8156 19.1387 28.9731 19.1387 27.9338C19.1387 26.8944 18.2962 26.0519 17.2569 26.0519C16.2175 26.0519 15.375 26.8944 15.375 27.9338C15.375 28.9731 16.2175 29.8156 17.2569 29.8156Z" fill="white"></path>
                                                <path d="M24.7725 29.8156C25.8118 29.8156 26.6544 28.9731 26.6544 27.9338C26.6544 26.8944 25.8118 26.0519 24.7725 26.0519C23.7332 26.0519 22.8906 26.8944 22.8906 27.9338C22.8906 28.9731 23.7332 29.8156 24.7725 29.8156Z" fill="white"></path>
                                                <path d="M32.3077 29.8156C33.347 29.8156 34.1895 28.9731 34.1895 27.9338C34.1895 26.8944 33.347 26.0519 32.3077 26.0519C31.2683 26.0519 30.4258 26.8944 30.4258 27.9338C30.4258 28.9731 31.2683 29.8156 32.3077 29.8156Z" fill="white"></path>
                                                <path d="M24.7725 22.2877C25.8118 22.2877 26.6544 21.4451 26.6544 20.4058C26.6544 19.3665 25.8118 18.5239 24.7725 18.5239C23.7332 18.5239 22.8906 19.3665 22.8906 20.4058C22.8906 21.4451 23.7332 22.2877 24.7725 22.2877Z" fill="white"></path>
                                                <path d="M32.3077 22.2877C33.347 22.2877 34.1895 21.4451 34.1895 20.4058C34.1895 19.3665 33.347 18.5239 32.3077 18.5239C31.2683 18.5239 30.4258 19.3665 30.4258 20.4058C30.4258 21.4451 31.2683 22.2877 32.3077 22.2877Z" fill="white"></path>
                                                <path d="M9.73343 37.3421C10.7728 37.3421 11.6153 36.4996 11.6153 35.4602C11.6153 34.4209 10.7728 33.5784 9.73343 33.5784C8.6941 33.5784 7.85156 34.4209 7.85156 35.4602C7.85156 36.4996 8.6941 37.3421 9.73343 37.3421Z" fill="white"></path>
                                                <path d="M17.2569 37.3421C18.2962 37.3421 19.1387 36.4996 19.1387 35.4602C19.1387 34.4209 18.2962 33.5784 17.2569 33.5784C16.2175 33.5784 15.375 34.4209 15.375 35.4602C15.375 36.4996 16.2175 37.3421 17.2569 37.3421Z" fill="white"></path>
                                                <path d="M24.7725 37.3421C25.8118 37.3421 26.6544 36.4996 26.6544 35.4602C26.6544 34.4209 25.8118 33.5784 24.7725 33.5784C23.7332 33.5784 22.8906 34.4209 22.8906 35.4602C22.8906 36.4996 23.7332 37.3421 24.7725 37.3421Z" fill="white"></path>
                                            </svg> 
                                        </Cuadrado>
                                    </div>
                                    <div style={{margin: '5%'}}>
                                        <h3 className="tittle-block" >Programa controles y mantén la amenaza baja.</h3>                                        
                                    </div>
                                </div>
                                <div style={{backgroundImage: 'linear-gradient(to bottom, #0e8d43,#107060)', borderRadius: '16px', margin: '20px 0px',  height: '130px', display: 'grid', gridTemplateColumns: '20% 80%'}}>
                                    <div style={{width: '100%', height: '130px', alignContent: 'center'}}>
                                        <Rueda>     
                                            <CircularProgressbar value='33' text='33%' styles={{root: {},
                                                                                                path: {
                                                                                                    
                                                                                                    stroke: '#F77040',
                                                                                                    strokeLinecap: 'round',

                                                                                                    transition: 'stroke-dashoffset 0.5s ease 0s',
                                                                                                    transformOrigin: 'center center',
                                                                                                },
                                                                                                trail: {
                                                                                                    stroke: '#d6d6d6',
                                                                                                    strokeLinecap: 'round',
                                                                                                    
                                                                                                    transformOrigin: 'center center',
                                                                                                },
                                                                                                text: {
                                                                                                    
                                                                                                    fill: 'white',
                                                                                                    fontSize: '170%',
                                                                                                    fontWeight: '600'
                                                                                                },
                                                                                                // Customize background - only used when the `background` prop is true
                                                                                                background: {
                                                                                                    fill: 'black',
                                                                                                },
                                                                                                }}/>              
                
                                        </Rueda> 
                                    </div>
                                    <div style={{width: '100%', color: 'white', fontSize: '130%', alignContent:'center'}}>
                                        <p style={{fontSize: '130%'}}><span>  Nivel de amenaza:</span><strong> Bajo</strong></p>

                                    </div>
                                </div>
                            </div>
                        </div>
                                
                                
                        <div href="" className="blockCalen">
                            <div style={{display: 'flex', flexDirection: 'column'}}>

                                <div style={{borderRadius: '16px', height: '100%', display: 'grid', gridTemplateColumns: '20% 80%'}}>
                                    <div>
                                        <Cuadrado>
                                            <FaSun style={{width: '65%', height: '65%', color: '#F8560E'}}/>
                                        </Cuadrado>
                                    </div>
                                    <div style={{margin: '5%'}}>
                                        <h3 className="tittle-block" >Controla el nivel de radiación UV y protégete.</h3>
                                    </div>
                                </div>
                                <div style={{  backgroundImage: 'linear-gradient(to bottom, #F8560E,#ff9f20)', borderRadius: '16px', margin: '20px 0px', height: '130px', alignContent:'center', paddingLeft: '20px'}}>
        
                                    <div style={{width: '100%', color: 'white', fontSize: '130%', alignContent:'center'}}>
                                        <p style={{fontSize: '130%', fontWeight: '600'}}><span> Nivel de radiación UV: </span><strong style={{fontFamily: 'inherit', fontSize: '110%', margin: '2%'}}> ALTO</strong></p>

                                    </div>
                                </div>
                            </div>
                        </div>
                                
                                
                        <div href="" className="blockCalen">
                            <div style={{display: 'flex', flexDirection: 'column'}}>

                                <div style={{borderRadius: '16px', height: '100%', display: 'grid', gridTemplateColumns: '20% 80%'}}>
                                    <div>
                                        <Cuadrado>
                                            <IoBody   style={{width: '70%', height: '70%', color: '#ff20ff'}}/>
                                        </Cuadrado>
                                    </div>
                                    <div style={{margin: '5%'}}>
                                        <h3 className="tittle-block" >LLeva un registro de las lesiones sobre tu cuerpo.</h3>
                                    </div>
                                </div>
                                <div style={{ margin: '20px 0', height: '130px', display: 'grid', gridTemplateColumns: '32% 32% 32%', gap: '2%'}}>
            
                                    <div style={{width: '100%', backgroundImage: 'linear-gradient(to bottom, #a20ef8,#ff20ff)', borderRadius: '16px', alignContent:'center', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        <span style={{color: 'white', fontSize: '200%', fontWeight: '600'}}>
                                            Cara
                                        </span>
                                    </div>

                                    <div style={{width: '100%', backgroundImage: 'linear-gradient(to bottom, #a20ef8,#ff20ff)', borderRadius: '16px', alignContent:'center', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        <span style={{color: 'white', fontSize: '200%', fontWeight: '600'}}>
                                            Espalda
                                        </span>
                                    </div>

                                    <div style={{width: '100%', backgroundImage: 'linear-gradient(to bottom, #a20ef8,#ff20ff)', borderRadius: '16px', alignContent:'center', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        <span style={{color: 'white', fontSize: '200%', fontWeight: '600'}}>
                                            Torso
                                        </span>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                </Block>
                
            </div>

        ):(

            <div>
                <Block strong className='white-block'>

                    <div className="blog-title" >Utiliza nuestras herramientas para tu bienestar:</div>

                    <div className='pc-block'>       

                        <div className="blockCalen">
                            <div style={{borderRadius: '16px', height: '100%'}}>
                                <div>
                                    <Cuadrado>
                                        <svg style={{margin: 'auto'}} width="52" height="63" viewBox="0 0 42 43" fill="none">
                                            <path fillRule="evenodd"  d="M11.2972 0.266357C12.0265 0.266357 12.6178 0.857615 12.6178 1.58697V9.42809C12.6178 10.1574 12.0265 10.7487 11.2972 10.7487C10.5678 10.7487 9.97656 10.1574 9.97656 9.42809V1.58697C9.97656 0.857615 10.5678 0.266357 11.2972 0.266357Z" fill="#F8560E"></path>
                                            <path fillRule="evenodd"  d="M30.223 0.124512C30.9523 0.124512 31.5436 0.715769 31.5436 1.44512V9.28625C31.5436 10.0156 30.9523 10.6069 30.223 10.6069C29.4936 10.6069 28.9023 10.0156 28.9023 9.28625V1.44512C28.9023 0.715769 29.4936 0.124512 30.223 0.124512Z" fill="#F8560E"></path>
                                            <path fillRule="evenodd"  d="M8.00391 5.34912H5.26644C2.5434 5.34912 0.335938 7.55658 0.335938 10.2796V38.056C0.335938 40.7791 2.5434 42.9865 5.26644 42.9865H36.8066C39.5296 42.9865 41.7371 40.7791 41.7371 38.056V10.2796C41.7371 7.55658 39.5296 5.34912 36.8066 5.34912H33.4257V9.42732C33.4257 11.2507 31.9475 12.7288 30.1241 12.7288C28.3007 12.7288 26.8226 11.2507 26.8226 9.42732V5.34912H14.607V9.42732C14.607 11.2507 13.1288 12.7288 11.3054 12.7288C9.48205 12.7288 8.00391 11.2507 8.00391 9.42732V5.34912Z" fill="#F8560E"></path>
                                            <path d="M9.73343 29.8157C10.7728 29.8157 11.6153 28.9732 11.6153 27.9339C11.6153 26.8945 10.7728 26.052 9.73343 26.052C8.6941 26.052 7.85156 26.8945 7.85156 27.9339C7.85156 28.9732 8.6941 29.8157 9.73343 29.8157Z" fill="white"></path>
                                            <path d="M17.2569 29.8156C18.2962 29.8156 19.1387 28.9731 19.1387 27.9338C19.1387 26.8944 18.2962 26.0519 17.2569 26.0519C16.2175 26.0519 15.375 26.8944 15.375 27.9338C15.375 28.9731 16.2175 29.8156 17.2569 29.8156Z" fill="white"></path>
                                            <path d="M24.7725 29.8156C25.8118 29.8156 26.6544 28.9731 26.6544 27.9338C26.6544 26.8944 25.8118 26.0519 24.7725 26.0519C23.7332 26.0519 22.8906 26.8944 22.8906 27.9338C22.8906 28.9731 23.7332 29.8156 24.7725 29.8156Z" fill="white"></path>
                                            <path d="M32.3077 29.8156C33.347 29.8156 34.1895 28.9731 34.1895 27.9338C34.1895 26.8944 33.347 26.0519 32.3077 26.0519C31.2683 26.0519 30.4258 26.8944 30.4258 27.9338C30.4258 28.9731 31.2683 29.8156 32.3077 29.8156Z" fill="white"></path>
                                            <path d="M24.7725 22.2877C25.8118 22.2877 26.6544 21.4451 26.6544 20.4058C26.6544 19.3665 25.8118 18.5239 24.7725 18.5239C23.7332 18.5239 22.8906 19.3665 22.8906 20.4058C22.8906 21.4451 23.7332 22.2877 24.7725 22.2877Z" fill="white"></path>
                                            <path d="M32.3077 22.2877C33.347 22.2877 34.1895 21.4451 34.1895 20.4058C34.1895 19.3665 33.347 18.5239 32.3077 18.5239C31.2683 18.5239 30.4258 19.3665 30.4258 20.4058C30.4258 21.4451 31.2683 22.2877 32.3077 22.2877Z" fill="white"></path>
                                            <path d="M9.73343 37.3421C10.7728 37.3421 11.6153 36.4996 11.6153 35.4602C11.6153 34.4209 10.7728 33.5784 9.73343 33.5784C8.6941 33.5784 7.85156 34.4209 7.85156 35.4602C7.85156 36.4996 8.6941 37.3421 9.73343 37.3421Z" fill="white"></path>
                                            <path d="M17.2569 37.3421C18.2962 37.3421 19.1387 36.4996 19.1387 35.4602C19.1387 34.4209 18.2962 33.5784 17.2569 33.5784C16.2175 33.5784 15.375 34.4209 15.375 35.4602C15.375 36.4996 16.2175 37.3421 17.2569 37.3421Z" fill="white"></path>
                                            <path d="M24.7725 37.3421C25.8118 37.3421 26.6544 36.4996 26.6544 35.4602C26.6544 34.4209 25.8118 33.5784 24.7725 33.5784C23.7332 33.5784 22.8906 34.4209 22.8906 35.4602C22.8906 36.4996 23.7332 37.3421 24.7725 37.3421Z" fill="white"></path>
                                        </svg> 
                                    </Cuadrado>
                                </div>
                                <div style={{margin: '5%'}}>
                                    <h3 className="tittle-block" >Programa controles y mantén la amenaza baja.</h3>
                                    
                                    <div style={{backgroundImage: 'linear-gradient(to bottom, #0e8d43,#107060)', borderRadius: '16px', margin: '5% 0', height: '130px', display: 'grid', gridTemplateColumns: '20% 80%'}}>
                                        <div style={{width: '100%', height: '130px', alignContent: 'center'}}>
                                            <Rueda>     
                                                <CircularProgressbar value='33' text='33%' styles={{root: {},
                                                                                                    path: {
                                                                                                        
                                                                                                        stroke: '#F77040',
                                                                                                        strokeLinecap: 'round',

                                                                                                        transition: 'stroke-dashoffset 0.5s ease 0s',
                                                                                                        transformOrigin: 'center center',
                                                                                                    },
                                                                                                    trail: {
                                                                                                        stroke: '#d6d6d6',
                                                                                                        strokeLinecap: 'round',
                                                                                                        
                                                                                                        transformOrigin: 'center center',
                                                                                                    },
                                                                                                    text: {
                                                                                                        
                                                                                                        fill: 'white',
                                                                                                        fontSize: '170%',
                                                                                                        fontWeight: '600'
                                                                                                    },
                                                                                                    // Customize background - only used when the `background` prop is true
                                                                                                    background: {
                                                                                                        fill: 'black',
                                                                                                    },
                                                                                                    }}/>              
                    
                                            </Rueda> 
                                        </div>
                                        <div style={{width: '100%', color: 'white', fontSize: '130%', alignContent:'center'}}>
                                            <p style={{fontSize: '130%'}}><span>  Nivel de amenaza:</span><strong> Bajo</strong></p>

                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                                
                                
                        <div href="" className="blockCalen">
                            <div style={{borderRadius: '16px', height: '100%'}}>
                                <div>
                                    <Cuadrado>
                                        <FaSun style={{width: '65%', height: '65%', color: '#F8560E'}}/>
                                    </Cuadrado>
                                </div>
                                <div style={{margin: '5%'}}>
                                    <h3 className="tittle-block" >Controla el nivel de radiación UV y protégete.</h3>
                                    <div style={{  backgroundImage: 'linear-gradient(to bottom, #F8560E,#ff9f20)', borderRadius: '16px', margin: '5% 0', height: '130px', alignContent:'center', paddingLeft: '20px'}}>
            
                                        <div style={{width: '100%', color: 'white', fontSize: '130%', alignContent:'center'}}>
                                            <p style={{fontSize: '130%', fontWeight: '600'}}><span> Nivel de radiación UV: </span><strong style={{fontFamily: 'inherit', fontSize: '110%', margin: '2%'}}> ALTO</strong></p>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                                
                                
                        <div href="" className="blockCalen">
                            <div style={{borderRadius: '16px', height: '100%'}}>
                                <div>
                                    <Cuadrado>
                                        <IoBody   style={{width: '70%', height: '70%', color: '#ff20ff'}}/>
                                    </Cuadrado>
                                </div>
                                <div style={{margin: '5%'}}>
                                    <h3 className="tittle-block" >LLeva un registro de las lesiones sobre tu cuerpo.</h3>
                                    <div style={{ margin: '5% 0', height: '130px', display: 'grid', gridTemplateColumns: '49% 49%', gap: '2%'}}>
            
                                        <div style={{width: '100%', backgroundImage: 'linear-gradient(to bottom, #a20ef8,#ff20ff)', borderRadius: '16px', alignContent:'center', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                            <span style={{color: 'white', fontSize: '200%', fontWeight: '600'}}>
                                                Cara
                                            </span>
                                        </div>

                                        <div style={{width: '100%', backgroundImage: 'linear-gradient(to bottom, #a20ef8,#ff20ff)', borderRadius: '16px', alignContent:'center', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                            <span style={{color: 'white', fontSize: '200%', fontWeight: '600'}}>
                                                Espalda
                                            </span>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </Block>

            </div>

        )}


        {isMobile ? (

            <div>
                <Block strong className='white-block'>

                    <div className="blog-title" >A quién prestamos nuestros servicios:</div>
                    <br/>

                    <div>  
                        { isMobile2 ?(
                            <div href="" className="blockHouse">
                                    <div style={{marginBottom: '10px'}}>
                                        <Cuadrado>
                                            <FaHouseChimneyMedical style={{width: '70%', height: '70%', color: '#F8560E'}}/>
                                        </Cuadrado>
                                    </div>
                                    <div>
                                        <h3 className="tittle-block" >Diseñado para uso doméstico</h3>
                                        <div className="text-block">
                                            <p>Deja que VideSkin forme parte de tu dia a día y mantén una piel sana gracias al seguimiento de la aplicación y los análisis periódicos.</p>
                                        </div>
                                    </div>
                            </div>
                        ):(
                            <div href="" className="blockHouse">
                                <div style={{borderRadius: '16px', height: '100%', display: 'grid', gridTemplateColumns: '20% 80%'}}>
                                    <div>
                                        <Cuadrado>
                                            <FaHouseChimneyMedical style={{width: '70%', height: '70%', color: '#F8560E'}}/>
                                        </Cuadrado>
                                    </div>
                                    <div>
                                        <h3 className="tittle-block" >Diseñado para uso doméstico</h3>
                                        <div className="text-block">
                                            <p>Deja que VideSkin forme parte de tu dia a día y mantén una piel sana gracias al seguimiento de la aplicación y los análisis periódicos.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}    

                        { isMobile2 ?(
                            <div href="" className="blockPro">
                                <div style={{marginBottom: '10px'}}>
                                    <Cuadrado>
                                        <FaUserDoctor  style={{width: '70%', height: '70%', color: '#107060'}}/>
                                    </Cuadrado>
                                </div>
                                <div>
                                    <h3 className="tittle-block" >Diseñado para profesionales</h3>
                                    <div className="text-block">
                                        <p>Consigue una herramienta de analisis para tu dia a dia en el trabajo, usala para realizar cribados o de apoyo y aumenta tu eficiencia.</p>
                                    </div>
                                </div>
                            </div>
                        ):(
                            <div href="" className="blockPro">
                                <div style={{borderRadius: '16px', height: '100%', display: 'grid', gridTemplateColumns: '20% 80%'}}>
                                    <div>
                                        <Cuadrado>
                                            <FaUserDoctor  style={{width: '70%', height: '70%', color: '#107060'}}/>
                                        </Cuadrado>
                                    </div>
                                    <div>
                                        <h3 className="tittle-block" >Diseñado para profesionales</h3>
                                        <div className="text-block">
                                            <p>Consigue una herramienta de analisis para tu dia a dia en el trabajo, usala para realizar cribados o de apoyo y aumenta tu eficiencia.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}      

                        { isMobile2 ?(
                            <div href="" className="blockUni">
                                    <div style={{marginBottom: '10px'}}>
                                        <Cuadrado>
                                            <IoMdSchool  style={{width: '70%', height: '70%', color: '#ff20ff'}}/>
                                        </Cuadrado>
                                    </div>
                                    <div>
                                        <h3 className="tittle-block" >Uso académico</h3>
                                        <div className="text-block">
                                            <p>La aplicación esta diseñada para el apoyo y aprendizaje en la detección de cáncer dermatológico.</p>
                                        </div>
                                    </div>
                            </div>
                        ):(
                            <div href="" className="blockUni">
                                <div style={{borderRadius: '16px', height: '100%', display: 'grid', gridTemplateColumns: '20% 80%'}}>
                                    <div>
                                        <Cuadrado>
                                            <IoMdSchool  style={{width: '70%', height: '70%', color: '#ff20ff'}}/>
                                        </Cuadrado>
                                    </div>
                                    <div>
                                        <h3 className="tittle-block" >Uso académico</h3>
                                        <div className="text-block">
                                            <p>La aplicación esta diseñada para el apoyo y aprendizaje en la detección de cáncer dermatológico.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}      


                                
                                

                                
                                

                    </div>

                </Block>
                
            </div>

        ):(

            <div>
            <Block strong className='white-block'>

                <div className="blog-title" >A quién prestamos nuestros servicios:</div>
                <br/>
                <div className='pc-block'>       
                    <div href="" className="blockHouse">
                        <div style={{borderRadius: '16px', height: '100%'}}>
                            <div>
                                <Cuadrado>
                                    <FaHouseChimneyMedical style={{width: '70%', height: '70%', color: '#F8560E'}}/>
                                </Cuadrado>
                            </div>
                            <div style={{margin: '5%'}}>
                                <h3 className="tittle-block" >Diseñado para uso doméstico</h3>
                                <div className="text-block">
                                    <p>Deja que VideSkin forme parte de tu dia a día y mantén una piel sana gracias al seguimiento de la aplicación y los análisis periódicos.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                            
                            
                    <div href="" className="blockPro">
                        <div style={{borderRadius: '16px', height: '100%'}}>
                            <div>
                                <Cuadrado>
                                    <FaUserDoctor  style={{width: '70%', height: '70%', color: '#107060'}}/>
                                </Cuadrado>
                            </div>
                            <div style={{margin: '5%'}}>
                                <h3 className="tittle-block" >Diseñado para profesionales</h3>
                                <div className="text-block">
                                    <p>Consigue una herramienta de analisis para tu dia a dia en el trabajo, usala para realizar cribados o de apoyo y aumenta tu eficiencia.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                            
                            
                    <div href="" className="blockUni">
                        <div style={{borderRadius: '16px', height: '100%'}}>
                            <div>
                                <Cuadrado>
                                    <IoMdSchool  style={{width: '70%', height: '70%', color: '#ff20ff'}}/>
                                </Cuadrado>
                            </div>
                            <div style={{margin: '5%'}}>
                                <h3 className="tittle-block" >Uso académico</h3>
                                <div className="text-block">
                                    <p>La aplicación esta diseñada para el apoyo y aprendizaje en la detección de cáncer dermatológico.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </Block>
            
        </div>

        )}

        <br/>

        <div className="bottom-block">

        </div>

        <RegisterPage showPopup={showPopupReg} closePopup={closePopupReg} id="reg-popup"/>

        <Popup opened={showContactUs} onClose={closeContactUs}>
          <div className='page'>
            <div className="navbar" style={{display: 'grid', gridTemplateColumns: '15% 1fr', background: 'teal', color: '#ffffff', textAlign: 'center', alignItems: 'center',  fontSize: '170%', lineHeight: '250%'}}>
              <Button onClick={closeContactUs} ><MdArrowBack style={{ fontSize: '24px', color: 'white'}}/></Button>
              <span style={{ marginLeft: '0%', marginRight: '15%', textAlign: 'center'}}>Contáctanos</span>
            </div>

            <div className='page-content' style={{padding: '5%'}}>
                <div className="cardS" style={{marginTop: '100px'}}>
                    
                    <div className="card-bodyS">
                        <div className="cardS-orange" >
                            <h6 className="header-orange">Introduce tus datos.</h6>
                            <p className="body-orange">Introduce tus datos y mandanos un mensaje, te responderemos lo más pronto posible.</p>
                        </div>
                        
                    <div className="rowS">


                        <div className="bloqueInput">
                        <label htmlFor="email" className="form-label">E-mail</label>
                        <textarea
                            className="form-control"
                            id="email"
                            name="email"
                            value={data.email}
                            onChange={handleInputChange}
                            placeholder="Tu email..."
                        ></textarea>
                        </div>

                        <div className="bloqueInput">
                        <label htmlFor="username" className="form-label">Nombre</label>
                        <textarea
                            className="form-control"
                            id="user"
                            name="user"
                            value={data.user}
                            onChange={handleInputChange}
                            placeholder="Tu nombre..."
                        ></textarea>
                        </div>

                        <div className="bloqueInput" style={{ gridColumn: 'span 2' }}>
                        <label htmlFor="message" className="form-label">Mensaje</label>
                        <textarea
                            className="form-control"
                            id="message"
                            name="mensaje"
                            value={data.mensaje}
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
          </div>
        </Popup>
        
    </div>
    </div>
  );
}
export default LandingPage;

const Rueda = styled.div`
  width: 70%;
  max-width: 100px;
  margin: auto auto;
`;

const Cuadrado = styled.div`
width: 70%;
max-width: 100px;
min-width: 75px;
background-color: white;
border-radius: 16px;
display: flex;
justify-content: center; /* Centra horizontalmente */
align-items: center; /* Centra verticalmente */
position: relative; 
&:after {
  content: '';
  display: block;
  padding-top: 100%; 
}
&:content {
    position: absolute;
    width: 100%;
    height: 100%;
}
`;