import { useState, useEffect } from 'react';

interface GeolocationState {
   coordinates: {
      lat: number;
      lng: number;
   } | null;
   loading: boolean;
   error: {
      code: number;
      message: string;
   } | null;
}

interface GeolocationOptions {
   enableHighAccuracy?: boolean;
   timeout?: number;
   maximumAge?: number;
}

export const useGeolocation = (options: GeolocationOptions = {}) => {
   const [state, setState] = useState<GeolocationState>({
      coordinates: null,
      loading: true,
      error: null,
   });

   useEffect(() => {
      if (!navigator.geolocation) {
         setState(prev => ({
            ...prev,
            loading: false,
            error: {
               code: 0,
               message: 'Geolocation is not supported by your browser',
            },
         }));
         return;
      }

      const handleSuccess = (position: GeolocationPosition) => {
         setState({
            coordinates: {
               lat: position.coords.latitude,
               lng: position.coords.longitude,
            },
            loading: false,
            error: null,
         });
      };

      const handleError = (error: GeolocationPositionError) => {
         setState(prev => ({
            ...prev,
            loading: false,
            error: {
               code: error.code,
               message: error.message,
            },
         }));
      };

      const defaultOptions: GeolocationOptions = {
         enableHighAccuracy: true, // Critical for maritime navigation
         timeout: 10000,
         maximumAge: 0,
         ...options,
      };

      // Obtenemos la posición inicial rápidamente
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError, defaultOptions);

      // Nos suscribimos a cambios de posición
      const watchId = navigator.geolocation.watchPosition(
         handleSuccess,
         handleError,
         defaultOptions
      );

      return () => {
         navigator.geolocation.clearWatch(watchId);
      };
   }, []); // Empty dependency array means options should be stable or wrapped in useMemo if passed dynamically

   return state;
};
