import React, { useState, useEffect, useRef } from 'react';


import { Light, Dark } from "../styles/Themes";
import { ThemeProvider } from "styled-components";
export const ThemeContext = React.createContext(null);


import axios from 'axios';


import {
  f7,
  f7ready,
  App,
  View
} from 'framework7-react';


import routes from '../js/routes';
import store from '../js/store';
import { userConfig } from '../js/config';

// Framework7 Parameters
const f7params = {
  name: 'VideSkin', // App name
    theme: 'auto', // Automatic theme detection
    colors: {
      primary: '#0099CC',
    },
 
    // App store
    store: store,
    // App routes
    routes: routes,
 
    // Register service worker (only on production build)
    serviceWorker: process.env.NODE_ENV ==='production' ? {
      path: '/service-worker.js',
    } : {},
};

/**
* Componente principal de la aplicación web.
*
* @component App
* // Ejemplo de uso del componente App
* const f7params = { theme: 'ios', name: 'My App' };
* return <App props={f7params} />
* 
* @param {object} f7params - Las propiedades pasadas al componente.
*
* @returns {JSX.Element} El componente renderizado de la página principal.
*/


const MyApp = () => {


  
  f7ready(() => {

  });

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  /**
  * Comprueba si el usuario está autenticado mediante la validación del token almacenado en localStorage o sessionStorage.
  *
  * @async
  * @method
  * @returns {Promise<boolean>} - Retorna una promesa que resuelve a `true` si el usuario está autenticado, de lo contrario `false`.
  * @throws {Error} - Si ocurre un error durante la solicitud de autenticación.
  */
  async function isAuthenticated() {
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };


    try {
      const response = await axios.get(`http://${userConfig.serverIP}:${userConfig.serverPort}/jwt`, config);
      console.log(response.data.logged_in_as)
      console.log(response.data.role)
      return true;
    } catch (error) {
      return false;
    }
  }


  /**
  * Efecto que comprueba la autenticación del usuario al montar el componente.
  * Navega a diferentes rutas basándose en el estado de autenticación y el tamaño de la ventana.
  *
  * @function
  */
  useEffect(() => {
    async function checkAuthentication() {
      try {
        const authenticated = await isAuthenticated();
       
        if (authenticated) {
          
          if (window.innerWidth <= 768){
            
            f7.views.main.router.navigate('/home/');

          }else{
            
            f7.views.main.router.navigate('/mainApp/');

          }
        }else{
          
          f7.views.main.router.navigate('/');
        }
      } catch (error) {
        console.error('Error al verificar la autenticación:', error);
        // Manejar el error aquí si es necesario
      }
    }

    checkAuthentication();
  }, []);




  const [theme, setTheme] = useState("light");
  const themeStyle = theme === "light" ? Light : Dark;



  //<Navigation/>
  return (
    
    <App { ...f7params }>
      <ThemeContext.Provider value={{ setTheme, theme }}>
        <ThemeProvider theme={themeStyle}>
          <View main url="/">



    

          </View>
        </ThemeProvider>
      </ThemeContext.Provider>
    </App>
    
  )
}


export default MyApp;
export {f7, f7params};
