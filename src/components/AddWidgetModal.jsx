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
  },
  bar: {
    data: [
      { label: 'Category 1', value1: 80, value2: 60, color1: 'var(--chart-red)', color2: 'var(--chart-orange)' },
      { label: 'Category 2', value1: 65, value2: 45, color1: 'var(--chart-red)', color2: 'var(--chart-orange)' },
      { label: 'Category 3', value1: 45, value2: 30, color1: 'var(--chart-red)', color2: 'var(--chart-orange)' }
    ],
    legend: [
      { label: 'Current Period', color: 'var(--chart-red)' },
      { label: 'Previous Period', color: 'var(--chart-orange)' }
    ]
  },
  line: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Series 1',
        data: [65, 59, 80, 81, 56],
        color: 'var(--chart-blue)',
        borderColor: 'var(--chart-blue)',
        fill: false
      },
      {
        label: 'Series 2',
        data: [28, 48, 40, 19, 86],
        color: 'var(--chart-green)',
        borderColor: 'var(--chart-green)',
        fill: false
      }
    ]
  }
};

const AddWidgetModal = ({ categoryId, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    type: 'text',
    content: '',
  });

  const validateChartData = (type, content) => {
    try {
      const data = typeof content === 'string' ? JSON.parse(content) : content;
      
      switch (type) {
        case 'donut':
          if (!data.data || !Array.isArray(data.data)) {
            throw new Error('Invalid donut chart data: missing data array');
          }
          break;
        case 'bar':
          if (!data.data || !Array.isArray(data.data) || !data.legend || !Array.isArray(data.legend)) {
            throw new Error('Invalid bar chart data: missing data or legend array');
          }
          break;
        case 'line':
          if (!data.labels || !Array.isArray(data.labels) || !data.datasets || !Array.isArray(data.datasets)) {
            throw new Error('Invalid line chart data: missing labels or datasets array');
          }
          break;
      }
      return data;
    } catch (err) {
      throw new Error('Invalid JSON data for chart: ' + err.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.content) {
      let processedContent = formData.content;
      
      if (formData.type !== 'text') {
        try {
          processedContent = validateChartData(formData.type, formData.content);
        } catch (err) {
          alert(err.message);
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
        if (['donut', 'bar', 'line'].includes(value)) {
          newState.content = JSON.stringify(defaultChartData[value], null, 2);
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
                  : formData.type === 'donut'
                  ? `Example for donut chart:
{
  "data": [
    { "label": "Category 1", "value": 50, "color": "var(--chart-blue)" },
    { "label": "Category 2", "value": 30, "color": "var(--chart-green)" }
  ],
  "total": 80
}`
                  : formData.type === 'bar'
                  ? `Example for bar chart:
{
  "data": [
    { "label": "Category 1", "value1": 80, "value2": 60, "color1": "var(--chart-red)", "color2": "var(--chart-orange)" },
    { "label": "Category 2", "value1": 65, "value2": 45, "color1": "var(--chart-red)", "color2": "var(--chart-orange)" }
  ],
  "legend": [
    { "label": "Current Period", "color": "var(--chart-red)" },
    { "label": "Previous Period", "color": "var(--chart-orange)" }
  ]
}`
                  : `Example for line chart:
{
  "labels": ["Jan", "Feb", "Mar", "Apr", "May"],
  "datasets": [
    {
      "label": "Series 1",
      "data": [65, 59, 80, 81, 56],
      "color": "var(--chart-blue)",
      "borderColor": "var(--chart-blue)",
      "fill": false
    }
  ]
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