import React from 'react';
import { MdArrowBack } from 'react-icons/md';

import {
    f7,
    Popup,
    Subnavbar,
    Searchbar,
    List,
    ListItem,
    Button
  } from 'framework7-react';


/**
* Interfaz de selección de paciente
*
* Este componente representa el PopUp para selecionar pacientes.
* @method
* @param {Boolean} showPopup 
* @param {Function} closePopup 
* @param {Object} pacientes 
* @param {Function} setPaciente
* @returns {JSX.Element} 
* @name BuscadorPacientesPopUp
*/
const BuscadorPacientesPopUp = ({showPopup,closePopup,pacientes,setPaciente}) => {


  const onSelectPaciente = (id) => {
    setPaciente(id)
  }

  return (
    <Popup opened={showPopup} onClose={closePopup} closeByBackdropClick={false} style={{border: '1px solid teal'}}>
      <div>
          <div className="page" >

            <div className="navbar" style={{display: 'grid', gridTemplateColumns: '5% 1fr', background: 'teal', color: '#ffffff', textAlign: 'center', alignItems: 'center',  fontSize: '170%', lineHeight: '250%'}}>
              <MdArrowBack style={{ fontSize: '24px', marginLeft: '90%', cursor: 'pointer'}} onClick={closePopup}/>
              <span style={{ marginLeft: '10%', marginRight: '15%', textAlign: 'center'}}>Pacientes</span>
            </div>
            <Subnavbar inner={false}>
              <Searchbar searchContainer=".search-list" searchIn=".item-title" />
            </Subnavbar>

            <div className='page-content'>

              <List strongIos outlineIos dividersIos className="searchbar-not-found">
                <ListItem title="Nothing found" />
              </List>
              <List strongIos outlineIos dividersIos className="search-list searchbar-found">

              {pacientes && pacientes.length > 0 ? (
                    pacientes.map(paciente => (
                    <li key={paciente.id}>
                        <div className="item-content">
                            <div className="item-inner">
                                <div className="item-title">{paciente.name} {paciente.surname}</div>
                                <div className="item-after">{paciente.username}</div>
                            </div>
                            <Button fill color='green' style={{margin:'2%', width:'20%'}}onClick={() => onSelectPaciente(paciente.id)}>Seleccionar</Button>

                        </div>
                    </li>
                    ))
                ) : (
                    <li>No se encontraron pacientes</li>
                )}


              </List>
            </div>

          </div>
      </div>  

    </Popup>
  );
};

export default BuscadorPacientesPopUp;