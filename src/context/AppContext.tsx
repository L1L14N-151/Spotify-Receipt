import React, { createContext, useReducer, ReactNode } from 'react';
import { AppState, AppAction, AppContextType, Theme, TimeRange } from './AppContextTypes';

const initialState: AppState = {
  auth: {
    isAuthenticated: false
  },
  tracks: [],
  theme: 'cvs' as Theme,
  timeRange: 'medium_term' as TimeRange,
  receipt: null
};

export const AppContext = createContext<AppContextType>({
  state: initialState,
  dispatch: () => null
});

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_AUTH':
      return { ...state, auth: action.payload };
    case 'SET_TRACKS':
      return { ...state, tracks: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_TIME_RANGE':
      return { ...state, timeRange: action.payload };
    case 'SET_RECEIPT':
      return { ...state, receipt: action.payload };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}