import { useState } from 'react'
import { Button, Popup } from 'framework7-react';
import Cropper from 'react-easy-crop'

import { MdArrowBack } from 'react-icons/md';


/**
* @module PopUpCropper
*/

/**
* PopUp para recortar imagenes
* Este componente representa el PopUp para recortar y centrar una lesión antes de ser analizada.
* @component
* @param {boolean} props.showPopup - Indica si el PopUp está visible.
* @param {function} props.closePopup - Función para cerrar el PopUp.
* @param {String} props.imagen - Variable que indica la imagen actual.
* @param {function} props.setImagen - Función para setear la imagen actual.
* @param {function} props.setRecortado - Función para setear variable que indica si la imagen ya ha sido recortada.
* @returns {JSX.Element} 
*/

const PopUpCropper = ({showPopup, closePopup, imagen, setImagen, setRecortado}) => {
  /**
  * Coordenadas donde esta el cuadrado de recorte.
  * @const {Object} crop 
  */
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  /**
  * Zoom de la imagen.
  * @const {Integer} zoom 
  */
  const [zoom, setZoom] = useState(1)
  /**
  * Area recortada de la imagen.
  * @const {Object} areaRecorte 
  */
  const [areaRecorte, setAreaRecorte] = useState(null)
  const canvas = document.createElement('canvas');

  /**
  * Manejadora para setear el area recortada cuando se realice un recorte.
  *
  * @method
  * @param {Object} croppedAreaPixels
  * @returns {Object}
  * @memberof module:PopUpCropper
  * @name onCropComplete
  */
  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setAreaRecorte(croppedAreaPixels)
  }

  /**
  * Funcion para recortar la imagen con la variable areaRecorte.
  *
  * @method
  * @param {String} originalImage
  * @returns {String}
  * @memberof module:PopUpCropper
  */
  function procesarImagen(originalImage) {
   
    //CREAR CANVAS
    canvas.width = areaRecorte.width;
    canvas.height = areaRecorte.height;
    const context = canvas.getContext("2d");

    //DIBUJAR LAS COORDENADAS CROP EN CANVAS
    context.drawImage(
        originalImage,
        areaRecorte.x,
        areaRecorte.y,
        areaRecorte.width,
        areaRecorte.height,
        0,
        0,
        areaRecorte.width,
        areaRecorte.height
    );

    //TRANSFORMAR CANVAS A IMAGEN BASE64
    const newImage = canvas.toDataURL("image/png");
    setImagen(newImage)
    
  }

  /**
  * Manejadora para recortar la imagen.
  *
  * @method
  * @memberof module:PopUpCropper
  * @name handleCentrar
  */
  const handleCentrar = () => {

    //CREAR OBJETO IMAGEN CON DATA BASE 64
    const originalImage = new Image();
    originalImage.src = imagen;

    procesarImagen(originalImage);
    setRecortado(true)
    closePopup()
  }   


  const handleGoBack = () => {
    closePopup()
  }

  return (
    <Popup opened={showPopup} onClose={closePopup}>
        <div className="navbar" style={{display: 'grid', gridTemplateColumns: '5% 1fr 20%', background: 'teal', color: '#ffffff', textAlign: 'center', alignItems: 'center'}}>
          <MdArrowBack style={{fontSize: '24px', marginLeft: '90%', cursor: 'pointer'}} onClick={handleGoBack} />
          <span style={{marginLeft: '15%', marginRight: '0', textAlign: 'center'}}>Centrar Imagen</span>
          <Button tonal onClick={handleCentrar} style={{ marginRight: '10%',}}>Guardar</Button>
        </div>

        {imagen && (
      

        <Cropper
            image={imagen}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
        />

   
        
        )}
     

    </Popup>
  )
}

export default PopUpCropper;