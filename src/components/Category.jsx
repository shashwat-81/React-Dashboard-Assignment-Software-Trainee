import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeWidget } from '../slices/widgetsSlice';
import Widget from './Widget';
import AddWidgetModal from './AddWidgetModal';

const Category = ({ category }) => {
  const dispatch = useDispatch();
  const [showAddWidget, setShowAddWidget] = useState(false);

  const handleRemoveWidget = (widgetId) => {
    dispatch(removeWidget({ categoryId: category.id, widgetId }));
  };

  return (
    <section className="category-section">
      <div className="category-header">
        <h2>{category.name}</h2>
        <button 
          className="widget-button"
          onClick={() => setShowAddWidget(true)}
          title="Add widget"
        >
          + Add Widget
        </button>
      </div>
      <div className="widgets-grid">
        {category.widgets.map((widget) => (
          <Widget
            key={widget.id}
            widget={widget}
            categoryId={category.id}
            onRemove={() => handleRemoveWidget(widget.id)}
          />
        ))}
        {category.widgets.length === 0 && (
          <div className="empty-widget">
            <button 
              className="widget-button"
              onClick={() => setShowAddWidget(true)}
            >
              + Add Widget
            </button>
          </div>
        )}
      </div>
      {showAddWidget && (
        <AddWidgetModal
          categoryId={category.id}
          onClose={() => setShowAddWidget(false)}
        />
      )}
    </section>
  );
};

export default Category;