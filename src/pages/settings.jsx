import React, { useState, useEffect } from 'react';

import PerfilPage from '../pages/perfil'
import CahngePasswd from '../pages/change-pass'
import ContactPage from '../pages/contact-us'

import { IoMenu } from "react-icons/io5";

import styled from "styled-components";
import {
  f7,
} from 'framework7-react';


export function SettingsPage  ()  {

  //#region ---------------------- RENDER RESPONSIVE ------------------------------------------------------------------------------------------------------------------------------------------

  const [isMobile2, setIsMobile2] = useState(window.innerWidth <= 768); 

  //CONTROL PARA CAMBIO DISPOSITIVO

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



  //#region -------------------------- CONTROL PANTALLA ----------------------------------------------------------------------------------------------------------------

  const [selected, setSelected] = useState('perfil');

  //#endregion

return(
  <div>
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
        
        <div class="rowS">
          <div class="col-md-12">
            <ul class="nav nav-pills flex-column flex-md-row mb-3">
              <li style={{margin: '0px 10px'}}>
                <button className={selected === 'perfil' ? 'butonS-tab active' : 'butonS-tab'} onClick={() => setSelected('perfil')}>Perfil</button>
              </li>
              <li style={{margin: '0px 0px'}}>
                <button className={selected === 'contact' ? 'butonS-tab active' : 'butonS-tab'} onClick={() => setSelected('contact')}>Contactanos</button>
              </li>
              <li style={{margin: '0px 10px'}}>
                <button className={selected === 'changePasswd' ? 'butonS-tab active' : 'butonS-tab'} onClick={() => setSelected('changePasswd')}>Cambio de contraseña</button>
              </li>
            </ul>

            <div style={{ height: '120vh'}}>  
          

                {selected === 'perfil' && (
                      <PerfilPage />
                )}

                {selected === 'skinType' && (
                      <PerfilPage />
                )}

                {selected === 'contact' && (
                      <ContactPage />
                )}

                {selected === 'changePasswd' && (
                      <CahngePasswd />
                )}

              
            </div>

          </div>
        </div>     
    
      </div>

    </div>
    
  </div>
);
}
export default SettingsPage;

const Container =styled.div`

  height: 90vh;
  margin: auto;
  
`
