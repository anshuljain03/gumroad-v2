// hooks/useLoading.js
import { useState, useEffect } from 'react';

export default function useLoading() {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingBarPosition, setLoadingBarPosition] = useState(0);

    useEffect(() => {
        let interval;
        if (isLoading) {
            interval = setInterval(() => {
                setLoadingBarPosition(prevPosition => prevPosition + 20);
            }, 600);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const showLoading = () => setIsLoading(true);
    const hideLoading = () => setIsLoading(false);

    return {
        showLoading,
        hideLoading,
        loadingBarPosition,
        isLoading
    };
}

// components/LoadingIndicator.js
import React from 'react';
import useLoading from '../hooks/useLoading';

export default function LoadingIndicator() {
    const { isLoading, showLoading, hideLoading, loadingBarPosition } = useLoading();

    return (
        <>
            {isLoading && (
                <div>
                    <div id="loading-indicator" style={{ display: 'block' }}>Loading...</div>
                    <div id="loading-bar" style={{ backgroundPosition: `${loadingBarPosition}px 0` }}></div>
                </div>
            )}
            <button onClick={showLoading}>Show Loading</button>
            <button onClick={hideLoading}>Hide Loading</button>
        </>
    );
}
