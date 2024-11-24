import { useEffect, useState } from "react"

const useLoadMapScript2 = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMapReady, setIsMapReady] = useState(false)
  

  useEffect(() => {
      const loadYandexMapScript = () => {
          try {
              if (!window?.ymaps) {
                  const script = document.createElement('script');
                  script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=f8dc6812-7c25-4ca4-ba5f-8939e5da2493';
                  script.async = true;

                  // Ждём завершения загрузки скрипта
                  new Promise((resolve, reject) => {
                      script.onload = () => {
                        setIsLoaded(true)
                      };
                      script.onerror = () => reject(new Error('Ошибка загрузки скрипта Яндекс.Карт'));
                      document.body.appendChild(script);
                  });
              }
          } catch (error) {
              console.error('ERR: Ошибка загрузки карты', error);
              setIsLoaded(false); // Ошибка загрузки
          }
      };

      loadYandexMapScript();
  }, []);

  useEffect(() => {
    if(window.ymaps) {
      window.ymaps.ready(() => {
        setIsMapReady(true)
      })
    }
  }, [isLoaded])

  return { isLoaded: isLoaded && isMapReady }
}

export default useLoadMapScript2