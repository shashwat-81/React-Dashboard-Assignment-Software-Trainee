import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateWidget } from '../slices/widgetsSlice';

const EditWidgetModal = ({ widget, categoryId, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: widget.title,
    type: widget.type || 'text',
    content: typeof widget.content === 'object' 
      ? JSON.stringify(widget.content, null, 2)
      : widget.content
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.content) {
      let processedContent = formData.content;
      if (formData.type !== 'text') {
        try {
          processedContent = JSON.parse(formData.content);
        } catch (err) {
          alert('Invalid JSON data for chart widget');
          return;
        }
      }

      dispatch(
        updateWidget({
          categoryId,
          widget: {
            ...widget,
            title: formData.title,
            type: formData.type,
            content: processedContent,
          },
        })
      );
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Widget</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Widget Name:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="type">Widget Type:</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="text">Text</option>
              <option value="donut">Donut Chart</option>
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="content">
              {formData.type === 'text' ? 'Content:' : 'Data (JSON):'}
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
            />
          </div>
          <div className="modal-buttons">
            <button type="submit" className="submit-button">Save Changes</button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWidgetModal;