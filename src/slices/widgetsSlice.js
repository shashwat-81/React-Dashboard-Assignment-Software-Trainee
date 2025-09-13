import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: [
    {
      id: '1',
      name: 'CSPM Executive Dashboard',
      widgets: [
        {
          id: '1',
          title: 'Cloud Accounts',
          type: 'donut',
          content: {
            total: 4,
            data: [
              { label: 'Connected', value: 2, color: 'var(--chart-blue)' },
              { label: 'Not Connected', value: 2, color: 'var(--chart-yellow)' }
            ]
          }
        },
        {
          id: '2',
          title: 'Cloud Account Risk Assessment',
          type: 'donut',
          content: {
            total: 9659,
            data: [
              { label: 'Failed', value: 1683, color: 'var(--chart-red)' },
              { label: 'Warning', value: 681, color: 'var(--chart-yellow)' },
              { label: 'Passed', value: 7254, color: 'var(--chart-green)' },
              { label: 'Not Available', value: 35, color: 'var(--chart-secondary)' }
            ]
          }
        },
        {
          id: '3',
          title: 'Monthly Comparison',
          type: 'bar',
          content: {
            data: [
              { label: 'January', value1: 40, value2: 30, color1: 'var(--chart-blue)', color2: 'var(--chart-green)' },
              { label: 'February', value1: 55, value2: 25, color1: 'var(--chart-blue)', color2: 'var(--chart-green)' },
              { label: 'March', value1: 32, value2: 40, color1: 'var(--chart-blue)', color2: 'var(--chart-green)' },
              { label: 'April', value1: 70, value2: 60, color1: 'var(--chart-blue)', color2: 'var(--chart-green)' },
              { label: 'May', value1: 52, value2: 45, color1: 'var(--chart-blue)', color2: 'var(--chart-green)' }
            ],
            legend: [
              { label: 'Current Year', color: 'var(--chart-blue)' },
              { label: 'Previous Year', color: 'var(--chart-green)' }
            ]
          }
        },
        {
          id: '4',
          title: 'Security Incidents Over Time',
          type: 'line',
          content: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
              {
                label: 'Critical',
                data: [12, 19, 15, 8, 22, 14],
                color: 'var(--chart-red)',
                borderColor: 'var(--chart-red)',
                fill: false
              },
              {
                label: 'High',
                data: [35, 42, 38, 31, 45, 37],
                color: 'var(--chart-yellow)',
                borderColor: 'var(--chart-yellow)',
                fill: false
              },
              {
                label: 'Medium',
                data: [85, 92, 78, 71, 95, 87],
                color: 'var(--chart-blue)',
                borderColor: 'var(--chart-blue)',
                fill: false
              }
            ]
          }
        }
      ]
    },
    {
      id: '2',
      name: 'CWPP Dashboard:',
      widgets: [
        {
          id: '4',
          title: 'Top 5 Namespace Specific Alerts',
          type: 'line',
          content: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: []
          }
        },
        {
          id: '5',
          title: 'Workload Alerts',
          type: 'line',
          content: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: []
          }
        }
      ]
    },
    {
      id: '3',
      name: 'Registry Scan',
      widgets: [
        {
          id: '6',
          title: 'Image Risk Assessment',
          type: 'progress',
          content: {
            data: [
              { label: 'Critical', value: 5, color: 'var(--chart-red)' },
              { label: 'High', value: 150, color: '#ff7043' }
            ],
            total: 1470
          }
        },
        {
          id: '7',
          title: 'Image Security Issues',
          type: 'progress',
          content: {
            data: [
              { label: 'Critical', value: 2, color: 'var(--chart-red)' },
              { label: 'High', value: 2, color: '#ff7043' }
            ],
            total: 2
          }
        }
      ]
    }
  ],
  searchTerm: '',
};

const widgetsSlice = createSlice({
  name: 'widgets',
  initialState,
  reducers: {
    addCategory: (state, action) => {
      state.categories.push({
        id: Date.now().toString(),
        name: action.payload,
        widgets: [],
      });
    },
    removeCategory: (state, action) => {
      state.categories = state.categories.filter(
        (category) => category.id !== action.payload
      );
    },
    addWidget: (state, action) => {
      const { categoryId, widget } = action.payload;
      const category = state.categories.find((c) => c.id === categoryId);
      if (category) {
        category.widgets.push({
          ...widget,
          id: Date.now().toString(),
        });
      }
    },
    updateWidget: (state, action) => {
      const { categoryId, widget } = action.payload;
      const category = state.categories.find((c) => c.id === categoryId);
      if (category) {
        const index = category.widgets.findIndex((w) => w.id === widget.id);
        if (index !== -1) {
          category.widgets[index] = widget;
        }
      }
    },
    removeWidget: (state, action) => {
      const { categoryId, widgetId } = action.payload;
      const category = state.categories.find((c) => c.id === categoryId);
      if (category) {
        category.widgets = category.widgets.filter((w) => w.id !== widgetId);
      }
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
});

export const {
  addCategory,
  removeCategory,
  addWidget,
  updateWidget,
  removeWidget,
  setSearchTerm,
} = widgetsSlice.actions;

export default widgetsSlice.reducer;