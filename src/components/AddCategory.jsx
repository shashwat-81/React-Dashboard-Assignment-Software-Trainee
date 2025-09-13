import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addCategory } from '../slices/widgetsSlice';

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (categoryName.trim()) {
      dispatch(addCategory(categoryName.trim()));
      setCategoryName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-category-form">
      <input
        type="text"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        placeholder="Enter category name"
        className="category-input"
      />
      <button type="submit" className="add-button">Add Category</button>
    </form>
  );
};

export default AddCategory;