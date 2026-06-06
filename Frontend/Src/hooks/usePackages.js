import { useEffect, useState } from 'react';
import { packages as fallbackPackages } from '../data/packages.js';
import { api } from '../services/apiClient.js';

export default function usePackages() {
    const [packages, setPackages] = useState(fallbackPackages);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;

        api.getPackages()
            .then((items) => {
                if (isMounted && Array.isArray(items) && items.length) {
                    setPackages(items);
                }
            })
            .catch((requestError) => {
                if (isMounted) setError(requestError.message);
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return { packages, isLoading, error };
}
