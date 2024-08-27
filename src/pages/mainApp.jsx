import React, { useState, useEffect, useRef, useContext } from 'react';

import logo from "../images/logo2.png";
import { v } from "../styles/Variables";
import {
  AiOutlineHome,
  AiOutlineSetting
} from "react-icons/ai";
import { MdOutlineAnalytics, MdLogout } from "react-icons/md";
import { IoMdPhotos } from "react-icons/io";
import { MdHealthAndSafety } from "react-icons/md";
import { LuCalendarDays } from "react-icons/lu";
import { GiHealthNormal } from "react-icons/gi";


import styled from "styled-components";

import axios from 'axios';
import { userConfig } from '../js/config';


import {
  f7,
  Page,
  View,
  Link,
} from 'framework7-react';

/**
* @module MainApp
*/

/**
 * MainApp Page
 *
 * Pagina principal para aplicación en modo escritorio.
 *
 * @returns {JSX.Element} 
 */

const MainApp = () => {

  //#region ROL
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
  * Token de autenticación.
  * @const {Integer} role
  */
  const[role, setRole] = useState(1)


  /**
  * Efecto que verifica si el cliente esta autenticado y el rol que tiene.
  * Carga toda la información dinamica de la pantalla.
  *
  * @method
  * @memberof module:MainApp
  * @name useEffect
  */
  useEffect(() => {
    //console.log(f7.views[0].params.role)
    async function checkAuthentication() {  


      try {
        const response = await axios.get(`http://${userConfig.serverIP}:${userConfig.serverPort}/jwt`, config);
        console.log(response.data.logged_in_as)
        console.log(response.data.role)
        setRole(response.data.role)

      } catch (error) {
        console.error('Error al verificar la autenticación:', error);
        // Manejar el error aquí si es necesario
      }
    }

    checkAuthentication();
  }, []);


  //#endregion

  //#region ESTADO MENU

  /**
  * Estado que indica si el menú lateral está abierto o cerrado.
  *
  * @const {boolean} sidebarOpen
  */
  const [sidebarOpen, setSidebarOpen] = useState(true);

  /**
  * Función para alternar el estado del menú lateral.
  */
  const ModSidebaropen = () => {
    setSidebarOpen(!sidebarOpen);
  };

  //#endregion


  //#region control cambio vista

  /**
  * Estado para controlar la vista actual de la aplicación.
  * @const {string} currentView 
  */
  const [currentView, setCurrentView] = useState('/home/');
  /**
  * Estado para controlar la transición a diferentes vistas de páginas.
  * @const {boolean} canChangeView 
  */
  const [canChangeView, setCanChangeView] = useState(true); //CONTROLA LA TRANSICION A VIEW DE LAS PAGINAS

  /**
  * Efecto para habilitar cambio de vista con EVENTO PAGEAFTERIN.
  *
  * @method
  * @returns {boolean} 
  * @memberof module:MainApp
  * @name useEffect
  */
  useEffect(() => {
    
    f7.on('pageAfterIn', (pageData) => {
      setCanChangeView(true); 
    });

    //RETIRAR EVENTO AL DESMONTAR COMPONENTE
    return () => {
      f7.off('pageAfterIn');
    };

    
  }, []);

  //#endregion

  
  //#region MENU
  
  /**
  * Efecto para navegar a la nueva vista cuando esta se modifique
  *
  * @method
  * @param {String} currentView
  * @memberof module:MainApp
  * @name useEffect
  */
  useEffect(() => {
    f7.views.main.router.navigate(currentView);
    console.log(role)
    //setSidebarOpen(false)
  }, [currentView]);
  

  /**
  * Maneja el clic en el botón "Home".
  */
  const handleHome = () => {
    if (canChangeView) {
      setCurrentView('/home/')    //CAMBIAMOS VISTA
      setCanChangeView(false);    //DESHABILITAMOS CAMBIO DE VISTA
    }
  };

  /**
  * Maneja el clic en el botón "Analizar".
  */
  const handleAnalizar = () => {
    if (canChangeView) {
      setCurrentView('/analizar/') //CAMBIAMOS VISTA
      setCanChangeView(false);    //DESHABILITAMOS CAMBIO DE VISTA
    }
  };

  /**
  * Maneja el clic en el botón "Galeria".
  */
  const handleGaleria = () => {
    if (canChangeView) {
        setCurrentView('/galeria/') //CAMBIAMOS VISTA
        setCanChangeView(false);    //DESHABILITAMOS CAMBIO DE VISTA
    }
  };

  /**
  * Maneja el clic en el botón "Calendario".
  */  
  const handleCalendario = () => {
    if (canChangeView) {
      setCurrentView('/calendario/')   //CAMBIAMOS VISTA
      setCanChangeView(false);    //DESHABILITAMOS CAMBIO DE VISTA
    }
  };

  /**
  * Maneja el clic en el botón "Estadísticas".
  */
  const handleStats = () => {
    if (canChangeView) {
        setCurrentView('/stats/') //CAMBIAMOS VISTA
        setCanChangeView(false);    //DESHABILITAMOS CAMBIO DE VISTA
    }
  };

  /**
  * Maneja el clic en el botón "Panel Médico".
  */
  const handleStatsPro = () => {
    if (canChangeView) {
        setCurrentView('/statsPro/') //CAMBIAMOS VISTA
        setCanChangeView(false);    //DESHABILITAMOS CAMBIO DE VISTA
    }
  };



  /**
  * Maneja el clic en el botón "Configuración".
  */
  const handleSettings = () => {
    if (canChangeView) {
      setCurrentView('/settings/') //CAMBIAMOS VISTA
      setCanChangeView(false);     //DESHABILITAMOS CAMBIO DE VISTA
    }
  };

  /**
  * Muestra un diálogo de confirmación para cerrar sesión y realiza la acción correspondiente.
  * @method 
  * @memberof module:MainApp
  * @name LogOutDialog
  */
  const LogOutDialog = () => {
    f7.dialog.confirm('¿Estas seguro de que deseas salir?', () => {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token')
      f7.dialog.progress('Saliendo...');
      setTimeout(() => {
        f7.dialog.close();
      }, 3000)
      window.location.reload();
    });
  };


  //#endregion
  


  return(
 
  <Page name="mainApp">

    <Container className={sidebarOpen ? "sidebarState active" : "safe-areas"}>
      
      <Menu isOpen={sidebarOpen}>

        <div className="Logocontent" onClick={ModSidebaropen}>
          <div className="imgcontent">
            <img src={logo} width={45} />
          </div>
          <h2>VideSkin</h2>
        </div>

        {/* BOTON HOME */}
        <div className="LinkContainer">
          <Link onClick={handleHome} className={currentView === "/home/" ? "Links active" : "Links"} >   {/* Clase Links -> negro, clase Lincks active -> morado */}
            <div className="Linkicon"><AiOutlineHome /></div>
            {sidebarOpen && <span>Home</span>}
          </Link>
        </div>

        {/* BOTON CRIBADO */}
        <div className="LinkContainer">
          <Link onClick={handleAnalizar} className={currentView === "/analizar/" ? "Links active" : "Links"} >   {/* Clase Links -> negro, clase Lincks active -> morado */}
            <div className="Linkicon"><MdHealthAndSafety  /></div>
            {sidebarOpen && <span>Analizar</span>}
          </Link>
        </div>

        
        {/* BOTON GALERIA */}
        <div className="LinkContainer">
          <Link onClick={handleGaleria} className={currentView === "/galeria/" ? "Links active" : "Links"}>     {/* Clase Links -> negro, clase Lincks active -> morado */}
            <div className="Linkicon"><IoMdPhotos /></div>
            {sidebarOpen && <span>Galeria</span>}
          </Link>
        </div>


        {/* BOTON CALENDARIO */}
        <div className="LinkContainer">
          <Link onClick={handleCalendario} className={currentView === "/calendario/" ? "Links active" : "Links"}>   {/* Clase Links -> negro, clase Lincks active -> morado */}
            <div className="Linkicon"><LuCalendarDays  /></div>
            {sidebarOpen && <span>Calendario</span>}
          </Link>
        </div>


        {/* BOTON ESTADISTICAS */}
        <div className="LinkContainer">
          <Link onClick={handleStats} className={currentView === "/stats/" ? "Links active" : "Links"}>   {/* Clase Links -> negro, clase Lincks active -> morado */}
            <div className="Linkicon"><MdOutlineAnalytics /></div>
            {sidebarOpen && <span>Estadisticas</span>}
          </Link>
        </div>


        {/* BOTON PANEL MEDICO */}
        {role === 3 && (
          <div className="LinkContainer">
            <Link onClick={handleStatsPro} className={currentView === "/statsPro/" ? "Links active" : "Links"}>   {/* Clase Links -> negro, clase Lincks active -> morado */}
              <div className="Linkicon"><GiHealthNormal  /></div>
              {sidebarOpen && <span>Panel Médico</span>}
            </Link>
          </div>
        )}

        <Divider/>

        {/* BOTON SETTINGS */}
        <div className="LinkContainer">
          <Link onClick={handleSettings} className={currentView === "/settings/" ? "Links active" : "Links"}>   {/* Clase Links -> negro, clase Lincks active -> morado */}
            <div className="Linkicon"><AiOutlineSetting /></div>
            {sidebarOpen && <span>Configuración</span>}
          </Link>
        </div>

        {/* BOTON SALIR */}
        <div className="LinkContainer">
          <Link onClick={LogOutDialog} className={currentView === "/logOut/" ? "Links active" : "Links"}>   {/* Clase Links -> negro, clase Lincks active -> morado */}
            <div className="Linkicon"><MdLogout /></div>
            {sidebarOpen && <span>Cerrar Sesión</span>}
          </Link>
        </div>

        <Divider/>


      </Menu>

      <View main url='/home/'/>

    </Container>
        
  </Page>
);

}

//#region STYLED COMPONENTS

const Container = styled.div`
  display: grid;
  grid-template-columns: 90px auto;
  background: ${({ theme }) => theme.bgtotal};
  transition:all 0.3s ;
  height:100vh;
  &.active {
    grid-template-columns: 300px auto;
  }
  color:${({theme})=>theme.text};
`;

const Menu = styled.div`
  color: ${(props) => props.theme.text};
  background: ${(props) => props.theme.bg};
  position: sticky;
  padding-top: 20px;
  .Sidebarbutton {
    position: absolute;
    top: ${v.xxlSpacing};
    right: -18px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${(props) => props.theme.bgtgderecha};
    box-shadow: 0 0 4px ${(props) => props.theme.bg3},
      0 0 7px ${(props) => props.theme.bg};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    transform: ${({ isOpen }) => (isOpen ? `initial` : `rotate(180deg)`)};
    border: none;
    letter-spacing: inherit;
    color: inherit;
    font-size: inherit;
    text-align: inherit;
    padding: 0;
    font-family: inherit;
    outline: none;
  }
  .Logocontent {
    display: flex;
    justify-content: center;
    align-items: center;

    padding-bottom: ${v.lgSpacing};
    .imgcontent {
      display: flex;
      img {
        max-width: 100%;
        height: auto;
      }
      cursor: pointer;
      transition: all 0.3s;
      transform: ${({ isOpen }) => (isOpen ? `scale(0.7)` : `scale(1.5)`)};
    }
    h2 {
      display: ${({ isOpen }) => (isOpen ? `block` : `none`)};
    }
  }
  .LinkContainer {
    margin: 8px 0;
   
    padding: 0 15%;
    :hover {
      background: "${(props) => props.theme.bg3}";
    }
    .Links {
      display: flex;
      align-items: left;
      justify-content: flex-start;
      text-decoration: none;
      padding: calc(${v.smSpacing}-2px) 0;
      color: ${(props) => props.theme.text};
      height:50px;
      outline: none;
      .Linkicon {
        padding: ${v.smSpacing} ${v.mdSpacing};
        display: flex;

        svg {
          font-size: 25px;
        }
      }
      &.active {
        .Linkicon {
          svg {
            color: teal;
          }
        }
      }
    }
    .Links:focus,
    .Links:active {
      outline: none;
    }
  }
  .Themecontent {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .titletheme {
      display: block;
      padding: 10px;
      font-weight: 700;
      opacity: ${({ isOpen }) => (isOpen ? `1` : `0`)};
      transition: all 0.3s;
      white-space: nowrap;
      overflow: hidden;
    }
    .Togglecontent {
      margin: ${({ isOpen }) => (isOpen ? `auto 40px` : `auto 15px`)};
      width: 36px;
      height: 20px;
      border-radius: 10px;
      transition: all 0.3s;
      position: relative;
      .theme-container {
        background-blend-mode: multiply, multiply;
        transition: 0.4s;
        .grid {
          display: grid;
          justify-items: center;
          align-content: center;
          height: 100vh;
          width: 100vw;
          font-family: "Lato", sans-serif;
        }
        .demo {
          font-size: 32px;
          .switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;
            .theme-swither {
              opacity: 0;
              width: 0;
              height: 0;
              &:checked + .slider:before {
                left: 4px;
                content: "🌑";
                transform: translateX(26px);
              }
            }
            .slider {
              position: absolute;
              cursor: pointer;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: ${({ themeUse }) =>
                themeUse === "light" ? v.lightcheckbox : v.checkbox};

              transition: 0.4s;
              &::before {
                position: absolute;
                content: "☀️";
                height: 0px;
                width: 0px;
                left: -10px;
                top: 16px;
                line-height: 0px;
                transition: 0.4s;
              }
              &.round {
                border-radius: 34px;

                &::before {
                  border-radius: 50%;
                }
              }
            }
          }
        }
      }
    }
  }
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background: ${(props) => props.theme.bg3};
  margin: ${v.lgSpacing} 0;
`;

//#endregion

export default MainApp;