import { useState } from 'react';
import { FcSearch } from 'react-icons/fc';
import style from './Searchbar.module.css';
import PropTypes from 'prop-types';

function Searchbar({ onSubmit }) {
  const [searchImage, setSearchImage] = useState('');

  const handleImageChange = e => {
    setSearchImage(e.currentTarget.value.toLowerCase());
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (searchImage.trim() === '') {
      return alert('Please, enter image name.');
    }

    onSubmit(searchImage);
    setSearchImage('');
  };

  return (
    <header className={style.Searchbar}>
      <form className={style.SearchForm} onSubmit={handleSubmit}>
        <button type="submit" className={style.SearchForm__button}>
          <FcSearch size={25} />
          <span className={style.SearchForm__button__label}>Search</span>
        </button>
        <input
          className={style.SearchForm__input}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          id="searchInput"
          name="image"
          value={searchImage}
          onChange={handleImageChange}
        ></input>
      </form>
    </header>
  );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  handleImageChange: PropTypes.func,
  handleSubmit: PropTypes.func,
  searchImage: PropTypes.func,
};

export default Searchbar;
