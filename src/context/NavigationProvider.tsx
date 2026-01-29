import { useState, type ReactNode } from 'react';
import { NavigationContext } from './NavigationContext';

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [navigationData, setNavigationData] = useState({});
  
  const clearNavigationData = () => {
    setNavigationData({});
  };

  return (
    <NavigationContext.Provider value={{ navigationData, setNavigationData, clearNavigationData }}>
      {children}
    </NavigationContext.Provider>
  );
}