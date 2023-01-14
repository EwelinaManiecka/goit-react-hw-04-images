import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import style from './Modal.module.css';

function Modal({ onClose }) {
  const [showImg] = useState();
  const [showAlt] = useState();

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.code === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleBackdropClick = e => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  return (
    <div className={style.Overlay} onClick={handleBackdropClick}>
      <div className={style.Modal}>
        <img src={showImg} alt={showAlt} />
      </div>
    </div>
  );
}

Modal.propTypes = {
  onClick: PropTypes.func,
  onClose: PropTypes.func,
  img: PropTypes.string,
  alt: PropTypes.string,
};

export default Modal;
