import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addWidget } from '../slices/widgetsSlice';
import EditWidgetModal from './EditWidgetModal';

const DonutChart = ({ data, total }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data?.length) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;

    // Helper function to get computed color from CSS variable
    const getColor = (cssVar) => {
      if (!cssVar.startsWith('var(')) return cssVar;
      const varName = cssVar.slice(4, -1);
      return getComputedStyle(document.documentElement).getPropertyValue(varName);
    };

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let startAngle = 0;
    data.forEach(item => {
      const sliceAngle = (2 * Math.PI * item.value) / total;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.arc(centerX, centerY, radius * 0.6, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = getColor(item.color);
      ctx.fill();

      startAngle += sliceAngle;
    });

    // Draw total in center
    ctx.fillStyle = '#2C3E50';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(total.toString(), centerX, centerY);
  }, [data, total]);

  return <canvas ref={canvasRef} width={200} height={200} />;
};

const LineChart = ({ labels = [], datasets = [] }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !datasets?.length || !labels?.length) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    
    // Helper function to get computed color from CSS variable
    const getColor = (cssVar) => {
      if (!cssVar?.startsWith('var(')) return cssVar || '#666';
      const varName = cssVar.slice(4, -1);
      return getComputedStyle(document.documentElement).getPropertyValue(varName);
    };

    ctx.clearRect(0, 0, width, height);

    const allValues = datasets.flatMap(dataset => dataset.data);
    const maxValue = Math.max(...allValues);
    const minValue = Math.min(...allValues);
    const range = maxValue - minValue;

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = getColor('var(--text-secondary)');
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw grid lines and value labels
    const gridLines = 5;
    ctx.strokeStyle = getColor('var(--border-color)');
    ctx.fillStyle = getColor('var(--text-secondary)');
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= gridLines; i++) {
      const y = padding + (height - 2 * padding) * (i / gridLines);
      const value = Math.round(maxValue - (range * (i / gridLines)));
      
      // Grid line
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      
      // Value label
      ctx.fillText(value.toString(), padding - 8, y);
    }

    // Draw x-axis labels
    ctx.fillStyle = getColor('var(--text-secondary)');
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    const xStep = (width - 2 * padding) / (labels.length - 1);
    labels.forEach((label, i) => {
      const x = padding + i * xStep;
      ctx.fillText(label, x, height - padding + 20);
    });

    // Draw datasets with points and lines
    datasets.forEach(dataset => {
      const color = getColor(dataset.color);
      
      // Draw lines
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;

      dataset.data.forEach((value, i) => {
        const x = padding + i * xStep;
        const y = height - padding - ((value - minValue) / range) * (height - 2 * padding);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      // Draw points
      dataset.data.forEach((value, i) => {
        const x = padding + i * xStep;
        const y = height - padding - ((value - minValue) / range) * (height - 2 * padding);
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#FFF';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    });

    // Draw legend
    const legendY = 20;
    let legendX = padding;
    datasets.forEach(dataset => {
      ctx.fillStyle = dataset.color;
      ctx.strokeStyle = dataset.color;
      
      ctx.beginPath();
      ctx.moveTo(legendX, legendY);
      ctx.lineTo(legendX + 20, legendY);
      ctx.stroke();
      
      ctx.fillText(dataset.label, legendX + 30, legendY + 4);
      legendX += 100;
    });
  }, [labels, datasets]);

  return <canvas ref={canvasRef} width={600} height={300} />;
};

const BarChart = ({ data = [], legend = [] }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data?.length) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Helper function to get computed color from CSS variable
    const getColor = (cssVar) => {
      if (!cssVar?.startsWith('var(')) return cssVar || '#666';
      const varName = cssVar.slice(4, -1);
      return getComputedStyle(document.documentElement).getPropertyValue(varName);
    };

    ctx.clearRect(0, 0, width, height);

    const maxValue = Math.max(
      ...data.flatMap(item => [item.value1 || 0, item.value2 || 0])
    );

    // Draw grid lines and axes
    const gridLines = 5;
    ctx.strokeStyle = getColor('var(--border-color)');
    ctx.fillStyle = getColor('var(--text-secondary)');
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= gridLines; i++) {
      const y = padding + (height - 2 * padding) * (i / gridLines);
      const value = Math.round(maxValue - (maxValue * (i / gridLines)));
      
      // Grid line
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      
      // Value label
      ctx.fillText(value.toString(), padding - 8, y);
    }

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = getColor('var(--text-secondary)');
    ctx.lineWidth = 2;
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Calculate bar width
    const barGroupWidth = chartWidth / data.length;
    const barWidth = barGroupWidth * 0.35;

    // Draw bars and labels
    data.forEach((item, i) => {
      const x = padding + i * barGroupWidth + barGroupWidth / 2;
      
      // Draw first bar
      const height1 = ((item.value1 || 0) / maxValue) * chartHeight;
      ctx.fillStyle = getColor(item.color1);
      ctx.strokeStyle = '#FFF';
      ctx.lineWidth = 1;
      
      // Bar with rounded top corners
      const radius = 4;
      ctx.beginPath();
      ctx.moveTo(x - barWidth - 2, height - padding);
      ctx.lineTo(x - barWidth - 2, height - padding - height1 + radius);
      ctx.arcTo(x - barWidth - 2, height - padding - height1, x - barWidth - 2 + radius, height - padding - height1, radius);
      ctx.lineTo(x - 2, height - padding - height1);
      ctx.arcTo(x - 2, height - padding - height1, x - 2, height - padding - height1 + radius, radius);
      ctx.lineTo(x - 2, height - padding);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Draw second bar
      const height2 = ((item.value2 || 0) / maxValue) * chartHeight;
      ctx.fillStyle = getColor(item.color2);
      
      // Bar with rounded top corners
      ctx.beginPath();
      ctx.moveTo(x + 2, height - padding);
      ctx.lineTo(x + 2, height - padding - height2 + radius);
      ctx.arcTo(x + 2, height - padding - height2, x + 2 + radius, height - padding - height2, radius);
      ctx.lineTo(x + barWidth + 2, height - padding - height2);
      ctx.arcTo(x + barWidth + 2, height - padding - height2, x + barWidth + 2, height - padding - height2 + radius, radius);
      ctx.lineTo(x + barWidth + 2, height - padding);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Draw label
      ctx.fillStyle = getColor('var(--text-secondary)');
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(item.label, x, height - padding + 20);
    });

    // Draw legend
    if (legend?.length) {
      const legendY = 20;
      let legendX = padding;
      legend.forEach(item => {
        if (!item?.color) return;
        
        const color = getColor(item.color);
        ctx.fillStyle = color;
        
        // Rounded rectangle for legend
        const rectHeight = 10;
        const rectWidth = 20;
        const radius = 3;
        
        ctx.beginPath();
        ctx.moveTo(legendX + radius, legendY - rectHeight);
        ctx.lineTo(legendX + rectWidth - radius, legendY - rectHeight);
        ctx.arcTo(legendX + rectWidth, legendY - rectHeight, legendX + rectWidth, legendY - rectHeight + radius, radius);
        ctx.lineTo(legendX + rectWidth, legendY);
        ctx.arcTo(legendX + rectWidth, legendY, legendX + rectWidth - radius, legendY, radius);
        ctx.lineTo(legendX + radius, legendY);
        ctx.arcTo(legendX, legendY, legendX, legendY - radius, radius);
        ctx.lineTo(legendX, legendY - rectHeight + radius);
        ctx.arcTo(legendX, legendY - rectHeight, legendX + radius, legendY - rectHeight, radius);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = getColor('var(--text-secondary)');
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(item.label, legendX + 30, legendY);
        legendX += 150;
      });
    }
  }, [data, legend]);

  return <canvas ref={canvasRef} width={600} height={300} />;
};

const Widget = ({ widget, categoryId, onRemove }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const categories = useSelector((state) => state.widgets.categories);
  const [showMoveOptions, setShowMoveOptions] = useState(false);
  
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleCopy = async () => {
    try {
      const contentStr = typeof widget.content === 'object' 
        ? JSON.stringify(widget.content, null, 2)
        : widget.content;
      await navigator.clipboard.writeText(contentStr);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const renderLegend = (items, inline = false) => {
    return (
      <div className={`widget-legend ${inline ? 'inline' : ''}`}>
        {items.map((item, index) => (
          <div key={index} className="legend-item" title={`${item.label}${item.value ? ` (${item.value})` : ''}`}>
            <div className="legend-color" style={{ background: item.color }} />
            <span>{item.label}{item.value ? ` (${item.value})` : ''}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderProgressBar = (data) => {
    if (!Array.isArray(data) || data.length === 0) return null;
    const total = data.reduce((acc, item) => acc + (item?.value || 0), 0);
    return (
      <div className="progress-container">
        <div className="progress-bar-group">
          <div className="progress-bar-header">
            <span>Progress</span>
            <span>{total}</span>
          </div>
          <div className="progress-bar">
            {data.map((item, index) => (
              <div
                key={index}
                className="progress-bar-segment"
                style={{
                  width: `${(item.value / total) * 100}%`,
                  backgroundColor: item.color,
                  left: `${data
                    .slice(0, index)
                    .reduce((acc, curr) => acc + (curr.value / total) * 100, 0)}%`
                }}
              />
            ))}
          </div>
          <div className="progress-stats">
            {data.map((item, index) => (
              <div key={index} className="progress-stat">
                <span
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '2px',
                    backgroundColor: item.color
                  }}
                />
                <span>
                  {item.label}: {Math.round((item.value / total) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (widget.type) {
      case 'donut':
        return (
          <div className="widget-chart">
            <DonutChart {...widget.content} />
            {widget.content.data && renderLegend(widget.content.data, true)}
          </div>
        );
      case 'progress':
        return (
          <div className="widget-chart">
            {widget.content?.data && renderProgressBar(widget.content.data)}
          </div>
        );
      case 'line':
        return (
          <div className="widget-chart">
            <LineChart {...widget.content} />
            {widget.content.datasets && renderLegend(widget.content.datasets, true)}
          </div>
        );
      case 'bar':
        return (
          <div className="widget-chart">
            <BarChart {...widget.content} />
            {widget.content.legend && renderLegend(widget.content.legend, true)}
          </div>
        );
      case 'text':
      default:
        return (
          <div className="widget-text" onClick={handleCopy}>
            {widget.content}
          </div>
        );
    }
  };

  return (
    <>
      {isFullscreen && <div className="modal-backdrop" onClick={() => setIsFullscreen(false)} />}
      <div className={`widget ${isFullscreen ? 'fullscreen' : ''}`}>
        <div className="widget-header">
          <h3>{widget.title}</h3>
          <div className="widget-buttons">
            <div className="widget-actions">
              {widget.type === 'text' && (
                <button
                  className="widget-button"
                  onClick={handleCopy}
                  title="Copy content"
                >
                  {showCopied ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 4V16H20V4H8ZM18 14H10V6H18V14ZM6 8H4V20H16V18H6V8Z" fill="currentColor"/>
                    </svg>
                  )}
                </button>
              )}
              <button
                className="widget-button"
                onClick={() => setShowMoveOptions(!showMoveOptions)}
                title="Move widget"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 12H15M12 9V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              <button
                className="widget-button"
                onClick={() => setIsEditing(true)}
                title="Edit widget"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.2322 5.23223L18.7677 8.76777M16.7322 3.73223C17.7085 2.75592 19.2914 2.75592 20.2677 3.73223C21.244 4.70854 21.244 6.29146 20.2677 7.26777L6.5 21.0355H3V17.4644L16.7322 3.73223Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                className="widget-button"
                onClick={onRemove}
                title="Remove widget"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <button
              className="widget-button fullscreen-button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
            >
              {isFullscreen ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 3H2V9M22 9V3H16M16 21H22V15M2 15V21H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 3H21V9M9 3H3V9M3 15V21H9M21 15V21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
        </div>
        {showMoveOptions && (
          <div className="move-options">
            <select
              onChange={(e) => {
                if (e.target.value !== categoryId) {
                  onRemove();
                  dispatch(
                    addWidget({
                      categoryId: e.target.value,
                      widget: {
                        ...widget,
                        id: Date.now().toString(),
                      },
                    })
                  );
                }
                setShowMoveOptions(false);
              }}
              value={categoryId}
            >
              <option value="">Select category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="widget-content">
          {renderContent()}
        </div>
      </div>
      {isEditing && (
        <EditWidgetModal
          widget={widget}
          categoryId={categoryId}
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  );
};

export default Widget;
