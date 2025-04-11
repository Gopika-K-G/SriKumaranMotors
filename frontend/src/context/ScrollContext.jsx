import { createContext, useContext, useState } from 'react';

const ScrollContext = createContext();

export const ScrollProvider = ({ children }) => {
  const [scrollTarget, setScrollTarget] = useState(null);
  const [currentSection, setCurrentSection] = useState('home');

  return (
    <ScrollContext.Provider value={{ scrollTarget, setScrollTarget, currentSection, setCurrentSection }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => useContext(ScrollContext);
