import React, { useState, useEffect } from 'react';

import { MdArrowBack } from 'react-icons/md';

import { CgDanger } from "react-icons/cg";
import { PiWarningFill } from "react-icons/pi";
import { MdHealthAndSafety } from "react-icons/md";


import { 
    f7,
    CardContent,
    CardHeader,
   } from 'framework7-react';

import '../css/custom-styles.css'

import styled from "styled-components";
import '../css/landing.css'

/**
* Tipos Page
*
* Este componente representa la página con los tipos de lesión.
* @method
* @returns {JSX.Element} 
* @name Tipos
*/

const Tipos = () => {

  
  const [isMobile, setIsMobile] = useState(false);
  const [isMobile2, setIsMobile2] = useState(false);
  const [isMobile3, setIsMobile3] = useState(false);

  useEffect(() => { 
    // Función para comprobar si la pantalla es lo suficientemente estrecha 
    const checkIfMobile = () => {
        const containerWidth = document.getElementById('container').offsetWidth;
        console.log(containerWidth)
        setIsMobile(containerWidth <= 1170); // Ajusta este valor 
    };
    const checkIfMobile2 = () => {
        const containerWidth = document.getElementById('container').offsetWidth;
        console.log(containerWidth)
        setIsMobile2(containerWidth <= 550); // Ajusta este valor 
    };
    const checkIfMobile3 = () => {
        const containerWidth = document.getElementById('container').offsetWidth;
        console.log(containerWidth)
        setIsMobile3(containerWidth <= 1400); // Ajusta este valor 
    };

    // Llama a la función de comprobación cuando se carga la página y cada vez que se redimensiona la ventana
    checkIfMobile();
    checkIfMobile2();
    checkIfMobile3();
    window.addEventListener('resize', checkIfMobile);
    window.addEventListener('resize', checkIfMobile2);
    window.addEventListener('resize', checkIfMobile3);

    // Limpia el event listener al desmontar el componente para evitar fugas de memoria
    return () => {
        window.removeEventListener('resize', checkIfMobile);
        window.removeEventListener('resize', checkIfMobile2);
        window.removeEventListener('resize', checkIfMobile3);
    };
  }, []);


  const handleBack = () => {
    f7.views.main.router.back();
  }



  return (
 
    <div>

        <div class="page" style={{backgroundColor: '#EFEFF4'}}>

            <div className="navbar" style={{display: 'grid', gridTemplateColumns: '5% 1fr', background: 'teal', color: '#ffffff', textAlign: 'center', alignItems: 'center',  fontSize: '170%', lineHeight: '250%'}}>
            <MdArrowBack style={{ fontSize: '24px', marginLeft: '90%', cursor: 'pointer'}} onClick={handleBack}/>
            <span style={{ marginLeft: '10%', marginRight: '15%', textAlign: 'center'}}>Tipos de lesiones</span>
            </div>

            <div class="page-content" id='container'>

                {isMobile ? (

                    <Container>
                        <div className='sec-1'>
                            Lesiones malignas
                        </div>
                        

                        <div class="card demo-card-header-pic" style={{backgroundColor: 'white', border: '3px solid #ac3939'}}>
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

                        <div class="card demo-card-header-pic" style={{backgroundColor: 'white', border: '3px solid #ac3939'}}>
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

                        <div class="card demo-card-header-pic" style={{backgroundColor: 'white', border: '3px solid #ffc34d'}}>
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

                        <div class="card demo-card-header-pic" style={{backgroundColor: 'white', border: '3px solid #ffc34d'}}>
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

                        <div class="card demo-card-header-pic" style={{backgroundColor: 'white', border: '3px solid #00802b'}}>
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

                        <div class="card demo-card-header-pic" style={{backgroundColor: 'white', border: '3px solid #00802b'}}>
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

                        <div class="card demo-card-header-pic" style={{backgroundColor: 'white', border: '3px solid #00802b'}}>
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
                            <div class="card demo-card-header-pic" style={{backgroundColor: 'white', border: '3px solid #ac3939'}}>
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

                            <div class="card demo-card-header-pic" style={{backgroundColor: 'white', border: '3px solid #ac3939'}}>
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
                            <div class="card demo-card-header-pic" style={{backgroundColor: 'white', border: '3px solid #ffc34d'}}>
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

                            <div class="card demo-card-header-pic" style={{backgroundColor: 'white', border: '3px solid #ffc34d'}}>
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
                                <div class="card demo-card-header-pic" style={{backgroundColor: 'white', border: '3px solid #00802b'}}>
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
        
                                <div class="card demo-card-header-pic" style={{backgroundColor: 'white', border: '3px solid #00802b'}}>
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
            
                                <div class="card demo-card-header-pic" style={{backgroundColor: 'white', border: '3px solid #00802b'}}>
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
                                <div class="card demo-card-header-pic" style={{backgroundColor: 'white', border: '3px solid #00802b'}}>
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

                                <div class="card demo-card-header-pic" style={{backgroundColor: 'white', border: '3px solid #00802b'}}>
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

                                <div class="card demo-card-header-pic" style={{backgroundColor: 'white', border: '3px solid #00802b'}}>
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

    </div>
  );
};

export default Tipos;

const Container = styled.div`
  height: auto;
  width: 90%;
  margin: 1% auto;

`

const TextIcon = styled.div`
  display: felx;
  align-items: center;              /* Centrar verticalmente los elementos */

  width: 90%;
  margin: 1% auto;
`

const ImageContainer = styled.div`
  height: auto;
  width: 70%;


  max-width: 310px; /* Ancho máximo de 500px */
  margin: 1% auto;

  overflow: hidden;

  position: relative;

  
  border: 1px solid blue;
`

const Imagen = styled.img`
  width: 100%;
  height: auto;
  margin: 0 auto;
`
const Marker = styled.div`
  position: absolute;

  top: ${({ y }) => `${y}%`};
  left: ${({ x }) => `${x}%`};  
  
  width: 15px; 
  height: 15px; 
  background-color: red; 
  border-radius: 50%; 
`
const ContainerButton = styled.div`
  height: auto;
  width: 100%;
  max-width: 700px; /* Ancho máximo de 500px */

  margin: 10px auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2%;

  border: 1px solid red;
`



