import React, { useState } from 'react';
import { guardarRutaDeImagen } from '../services/uploadService';
import './styles/uploadImage.css';

const UploadImage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = () => {
    if (!image) {
      alert('Por favor, selecciona una imagen primero.');
      return;
    }
    setMessage('Imagen cargada con éxito.');
  };

  const handleClose = () => {
    setShowPopup(false);
    setImage(null);
    setPreview(null);
    setMessage('');
  };

  return (
    <div>
      <button onClick={() => setShowPopup(true)}>Subir Imagen</button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="close-btn" onClick={handleClose}>
              &times;
            </button>
            <h2>Cargar Imagen</h2>
            <input className="uploadImage-input" type="file" accept="image/*" onChange={handleImageChange} />
            {preview && (
              <div className="preview-container">
                <img src={preview} alt="Vista previa" />
              </div>
            )}
            
            <div className='uploadImage-footer'>
            <button onClick={handleClose} className='gestor-btn-cancelar' >Cerrar</button>
            <button onClick={handleUpload} className='gestor-btn-confirmar'>Guardar</button>
            </div>
            
            {message && <p>{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadImage;
