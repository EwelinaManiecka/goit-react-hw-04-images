import { useState, useEffect } from 'react';

import fetchPictures from './API/PixabayAPI';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import { Loader } from './Loader/Loader';
import Modal from './Modal/Modal';
import Searchbar from './Searchbar/Searchbar';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

function App() {
  const [imageName, setImageName] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState(Status.IDLE);
  const [showButton, setShowButton] = useState(false);
  const [alertState, setAlertState] = useState(false);
  const [modal, setModal] = useState({
    show: false,
    img: null,
    alt: null,
  });

  useEffect(() => {
    if (!imageName) {
      return;
    }

    async function fetchImages() {
      setStatus(Status.PENDING);

      try {
        const images = await fetchPictures(imageName, page);

        if (images.hits.length < 1) {
          setShowButton(false);
          setStatus(Status.IDLE);
          return alertState(`No images on your query`);
        }

        setImages(prevState => [...prevState, ...images.hits]);
        setShowButton(page < Math.ceil(images.total / 12) ? true : false);
        setStatus(Status.RESOLVED);
      } catch (error) {
        setStatus(Status.REJECTED);
      }
    }

    fetchImages();
  }, [imageName, page, alertState]);

  const handleFormSumbit = searchImage => {
    if (searchImage === imageName) {
      return;
    }
    setImageName(searchImage);
    setPage(1);
    setImages([]);
    setShowButton(false);
    setModal(false);
    setStatus(Status.IDLE);
    setAlertState(false);
  };

  const loadMoreImages = () => {
    setPage(prevState => prevState.page + 1);
  };

  const toggleModal = e => {
    if (!modal.show) {
      setModal({
        show: true,
        img: e.target.src,
        alt: e.target.ale,
      });
    } else {
      setModal({
        show: false,
        img: null,
        alt: null,
      });
    }
  };

  return (
    <>
      <Searchbar onSubmit={handleFormSumbit} />
      {status === Status.IDLE && <h2>Search something</h2>}
      {status === Status.PENDING && alertState === false && <Loader />}
      {alertState && <h2>Try again</h2>}
      {images.length > 0 && (
        <ImageGallery
          modal={toggleModal}
          images={images}
          showModal={toggleModal}
        />
      )}

      {showButton && <Button onClick={loadMoreImages} />}

      {modal.show && (
        <Modal onClose={toggleModal} img={modal.img} alt={modal.alt} />
      )}
    </>
  );
}

export default App;
