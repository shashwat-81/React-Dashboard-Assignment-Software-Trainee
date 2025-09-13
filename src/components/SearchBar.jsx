import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm } from '../slices/widgetsSlice';

const SearchBar = () => {
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state.widgets.searchTerm);

  return (
    <input
      type="text"
      className="search"
      placeholder="Search widgets..."
      value={searchTerm}
      onChange={(e) => dispatch(setSearchTerm(e.target.value))}
    />
  );
};

export default SearchBar;