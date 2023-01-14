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
  const [showModal, setShowModal] = useState({
    show: false,
    img: null,
    alt: null,
  });

  // state = {
  //   imageName: '',
  //   images: [],
  //   page: 1,
  //   showButton: false,
  //   status: Status.IDLE,
  //   modal: { show: false, img: null, alt: null },
  //   alertState: false,

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

  // componentDidUpdate(_, prevState) {
  //   const prevName = prevState.imageName;
  //   const nextName = this.state.imageName;

  //   const prevPage = prevState.page;
  //   const nextPage = this.state.page;

  //   if (prevName !== nextName || prevPage !== nextPage) {
  //     this.setState({ status: Status.PENDING, alertState: false });

  const handleFormSumbit = searchImage => {
    if (searchImage === imageName) {
      return;
    }
    setImageName(searchImage);
    setPage(1);
    setImages([]);
    setShowButton(false);
    setShowModal(false);
    setStatus(Status.IDLE);
    setAlertState(false);
  };

  const loadMoreImages = () => {
    setPage(prevState => prevState.page + 1);
  };

  const handleModalImage = e => {
    setShowModal(e);
  };

  const handleModalAlt = e => {
    setShowModal(e);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <Searchbar onSubmit={handleFormSumbit} />
      {status === Status.IDLE && <h2>Search something</h2>}
      {status === Status.PENDING && alertState === false && <Loader />}
      {alertState && <h2>Try again</h2>}
      {images.length > 0 && (
        <ImageGallery
          showModal={toggleModal}
          images={images}
          handleModalAlt={handleModalAlt}
          handleModalImage={handleModalImage}
        />
      )}

      {showButton && <Button onClick={loadMoreImages} />}

      {showModal && (
        <Modal onClose={toggleModal} img={showModal.img} alt={showModal.alt} />
      )}
    </>
  );
}

export default App;
