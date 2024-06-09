import React, { useState, useContext, createContext } from 'react';

// Creating context to be accessible globally
const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const showLoading = () => setIsLoading(true);
    const hideLoading = () => setIsLoading(false);

    return (
        <LoadingContext.Provider value={{ showLoading, hideLoading }}>
            {children}
            {isLoading && <div id="loading-indicator">Loading...</div>}
        </LoadingContext.Provider>
    );
};
