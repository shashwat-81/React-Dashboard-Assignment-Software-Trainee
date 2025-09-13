import { configureStore } from '@reduxjs/toolkit';
import widgetsReducer from './slices/widgetsSlice';

const store = configureStore({
  reducer: {
    widgets: widgetsReducer,
  }
});

// Save state to localStorage when it changes
store.subscribe(() => {
  try {
    const state = store.getState().widgets;
    localStorage.setItem('dashboard_state_v1', JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state to localStorage', e);
  }
});

export default store
