import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';

import {
    f7,
    Panel
  } from 'framework7-react';

const NavigationMenu = () => {
    
  const handleGoHome = () => {
    f7.views.main.router.navigate("/home/");
  };

  const handleGoAnalizar = () => {
    f7.views.main.router.navigate("/analizar/");
  };

  const handleGoGaleria = () => {
    f7.views.main.router.navigate("/galeria/");
  };

  const handleGoCalendario = () => {
    f7.views.main.router.navigate("/calendario/");
  };

  const handleGoStats = () => {
    f7.views.main.router.navigate("/stats/");
  };

  const handleGoSettings = () => {
    f7.views.main.router.navigate("/settings/");
  };

  const LogOutDialog = () => {
    f7.dialog.confirm('¿Estas seguro de que deseas salir?', () => {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      f7.dialog.progress('Saliendo...');
      setTimeout(() => {
        f7.dialog.close();
      }, 3000);
      window.location.reload();
    });
  };

  return (
    <Panel left cover containerEl="#panel-page" id="home">
      <div className="panel panel-resizable panel-left panel-floating panel-in">
        <div className="view">
          <div className="page page-current">
            <div className="page-content">
              <div className="block-title" style={{ height: '30px', fontSize: '20px' }}>
                <FaArrowLeft className="link panel-close" style={{ fontSize: '15px' }} /> Menú de navegación
              </div>
              <div className="list">
                <ul>
                  <li className="">
                    <a className="item-link panel-close" onClick={handleGoHome}>
                      <div className="item-content">
                        <div className="item-inner">
                          <div onClick={handleGoHome} className="item-title">Home</div>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="">
                    <a className="item-link panel-close" onClick={handleGoAnalizar}>
                      <div className="item-content">
                        <div className="item-inner">
                          <div onClick={handleGoAnalizar} className="item-title">Analizar</div>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="">
                    <a className="item-link panel-close" onClick={handleGoGaleria}>
                      <div className="item-content">
                        <div className="item-inner">
                          <div className="item-title">Galeria</div>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="">
                    <a className="item-link panel-close" onClick={handleGoCalendario}>
                      <div className="item-content">
                        <div className="item-inner">
                          <div className="item-title">Calendario</div>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="">
                    <a className="item-link panel-close" onClick={handleGoStats}>
                      <div className="item-content">
                        <div className="item-inner">
                          <div className="item-title">Estadísticas</div>
                        </div>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>

              <div className="block-title">Configuración</div>
              <div className="list">
                <ul>
                  <li className="">
                    <a className="item-link panel-close" onClick={handleGoSettings}>
                      <div className="item-content">
                        <div className="item-inner">
                          <div className="item-title">Configuración</div>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="">
                    <a className="item-link panel-close" onClick={LogOutDialog}>
                      <div className="item-content">
                        <div className="item-inner">
                          <div className="item-title">Cerrar Sesión</div>
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
  );
};

export default NavigationMenu;