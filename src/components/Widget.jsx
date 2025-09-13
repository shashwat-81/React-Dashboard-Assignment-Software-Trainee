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

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let startAngle = 0;
    data.forEach(item => {
      const sliceAngle = (2 * Math.PI * item.value) / total;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.arc(centerX, centerY, radius * 0.6, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();

      startAngle += sliceAngle;
    });

    // Draw total in center
    ctx.fillStyle = '#000';
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

    ctx.clearRect(0, 0, width, height);

    const allValues = datasets.flatMap(dataset => dataset.data);
    const maxValue = Math.max(...allValues);
    const minValue = Math.min(...allValues);

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#666';
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw labels
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    const xStep = (width - 2 * padding) / (labels.length - 1);
    labels.forEach((label, i) => {
      const x = padding + i * xStep;
      ctx.fillText(label, x, height - padding + 20);
    });

    // Draw datasets
    datasets.forEach(dataset => {
      ctx.beginPath();
      ctx.strokeStyle = dataset.color;
      ctx.lineWidth = 2;

      dataset.data.forEach((value, i) => {
        const x = padding + i * xStep;
        const y = height - padding - ((value - minValue) / (maxValue - minValue)) * (height - 2 * padding);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
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

    ctx.clearRect(0, 0, width, height);

    const maxValue = Math.max(
      ...data.flatMap(item => [item.value1 || 0, item.value2 || 0])
    );

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#666';
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
      ctx.fillStyle = item.color1;
      ctx.fillRect(x - barWidth - 2, height - padding - height1, barWidth, height1);

      // Draw second bar
      const height2 = ((item.value2 || 0) / maxValue) * chartHeight;
      ctx.fillStyle = item.color2;
      ctx.fillRect(x + 2, height - padding - height2, barWidth, height2);

      // Draw label
      ctx.fillStyle = '#666';
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
        
        ctx.fillStyle = item.color;
        ctx.fillRect(legendX, legendY - 10, 20, 10);
        
        ctx.fillStyle = '#666';
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
            {widget.type === 'text' && (
              <button
                className="widget-button"
                onClick={handleCopy}
                title="Copy content"
              >
                {showCopied ? '✓' : '📋'}
              </button>
            )}
            <button
              className="widget-button"
              onClick={() => setShowMoveOptions(!showMoveOptions)}
              title="Move widget"
            >
              📦
            </button>
            <button
              className="widget-button"
              onClick={() => setIsEditing(true)}
              title="Edit widget"
            >
              ✏️
            </button>
            <button
              className="widget-button"
              onClick={onRemove}
              title="Remove widget"
            >
              ❌
            </button>
            <button
              className="widget-button fullscreen-button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
            >
              {isFullscreen ? '⊗' : '⛶'}
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
