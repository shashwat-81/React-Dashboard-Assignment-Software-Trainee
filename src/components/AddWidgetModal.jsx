import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addWidget } from '../slices/widgetsSlice';

const defaultChartData = {
  donut: {
    data: [
      { label: 'Connected', value: 2, color: 'var(--chart-blue)' },
      { label: 'Not Connected', value: 2, color: 'var(--chart-yellow)' }
    ],
    total: 4
  }
};

const AddWidgetModal = ({ categoryId, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    type: 'text',
    content: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.content) {
      let processedContent = formData.content;
      
      if (formData.type === 'donut') {
        try {
          // Try to parse if it's JSON string
          if (typeof formData.content === 'string') {
            processedContent = JSON.parse(formData.content);
          }
          // Validate the structure
          if (!processedContent.data || !Array.isArray(processedContent.data)) {
            throw new Error('Invalid chart data structure');
          }
        } catch (err) {
          alert('Please provide valid JSON data for the chart');
          return;
        }
      }

      dispatch(
        addWidget({
          categoryId,
          widget: {
            id: Date.now().toString(),
            title: formData.title,
            type: formData.type,
            content: processedContent
          },
        })
      );
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      
      // When changing type, set default content
      if (name === 'type') {
        if (value === 'donut') {
          newState.content = JSON.stringify(defaultChartData.donut, null, 2);
        } else {
          newState.content = '';
        }
      }
      
      return newState;
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add New Widget</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Widget Name:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter widget name"
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
              {formData.type === 'text' ? 'Content:' : 'Chart Data (JSON):'}
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder={
                formData.type === 'text' 
                  ? 'Enter widget content' 
                  : `Example for ${formData.type} chart:
{
  "data": [
    { "label": "Category 1", "value": 50, "color": "var(--chart-blue)" },
    { "label": "Category 2", "value": 30, "color": "var(--chart-green)" }
  ],
  "total": 80
}`
              }
              required
              style={{ 
                fontFamily: formData.type === 'text' ? 'inherit' : 'monospace',
                minHeight: formData.type === 'text' ? '100px' : '200px'
              }}
            />
          </div>
          <div className="modal-buttons">
            <button type="submit" className="submit-button">Add Widget</button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWidgetModal;