import React, { createContext, useState } from 'react';

// ✅ Create Context
export const ProgressContext = createContext();

// ✅ Provide Context
export const ProgressProvider = ({ children }) => {
  const [destinationsVisited, setDestinationsVisited] = useState(0);
  const [checklistsCompleted, setChecklistsCompleted] = useState(0);
  const [tripsPacked, setTripsPacked] = useState(0);
  const [userPoints, setUserPoints] = useState(0); 

  const visitDestination = () => {
    setDestinationsVisited((prev) => prev + 1);
    setUserPoints((prev) => prev + 10);
  };

  const completeChecklist = () => {
    setChecklistsCompleted((prev) => prev + 1);
    setUserPoints((prev) => prev + 5);
  };

  return (
    <ProgressContext.Provider 
      value={{ 
        destinationsVisited, 
        checklistsCompleted, 
        tripsPacked, 
        userPoints, 
        setUserPoints,  
        visitDestination, 
        completeChecklist
      }}
    >
      {children || <></>}
    </ProgressContext.Provider>
  );
};