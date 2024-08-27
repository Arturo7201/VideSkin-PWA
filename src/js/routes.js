import LandingPage from '../pages/landing.jsx'
import LogIn from '../pages/login.jsx'
import Tipos from '../pages/tipos.jsx'


import MainApp from '../pages/mainApp.jsx';
import HomePage from '../pages/home.jsx';
import Analizar from '../pages/cribado.jsx';
import Galeria from '../pages/galeria.jsx';
import Calendario from '../pages/calendario.jsx';
import Stats from '../pages/stats.jsx'


import SettingsPage from '../pages/settings.jsx';
import PerfilPage from '../pages/perfil.jsx';


import NotFoundPage from '../pages/404.jsx';




var routes = [
  {
    path: '/',
    component: LandingPage,
  },
  {
    path: '/login/',
    component: LogIn,
  },
  {
    path: '/tipos/',
    component: Tipos,
  },




  {
    path: '/mainApp/',
    component: MainApp,
  },
  {
    path: '/home/',
    component: HomePage,
  },
  {
    path: '/analizar/',
    component: Analizar,
  },
  {
    path: '/galeria/',
    component: Galeria,
  },
  {
    path: '/calendario/',
    component: Calendario,
  },
  {
    path: '/stats/',
    component: Stats,
  },
  {
    path: '/settings/',
    component: SettingsPage,
  },



  {
    path: '/perfil/',
    component: PerfilPage,
  },




  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
