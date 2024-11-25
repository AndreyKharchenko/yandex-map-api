import { useEffect, useState } from "react"

export const useLoadMapScript = () => {
    const [isLoadedScript, setIsLoadedScript] = useState(false)
    const [isMapReady, setIsMapReady] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    
    let isScriptAlreadyLoaded = false

    useEffect(() => {
        // Проверяем наличие тэга скрипт и если что создаем новый
        const scriptId = 'map-script-id'
        const existingScript = document.getElementById(scriptId)
        if (existingScript) {
          existingScript.addEventListener('load', () => setIsLoadedScript(true))
          existingScript.addEventListener('error', () =>
            setError(new Error('Ошибка загрузки скрипта Яндекс.Карт'))
          )
          return
        }
        
        const script = document.createElement('script')
        script.id = scriptId
        
        script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=f8dc6812-7c25-4ca4-ba5f-8939e5da2493'
        
        // Загружаем тэг
        script.onload = () => {
          isScriptAlreadyLoaded = true
          setIsLoadedScript(true)
        }
        
        script.onerror = () => setError(new Error('Ошибка загрузки скрипта Яндекс.Карт'));
    
        document.head.appendChild(script)
    
        // Удаляем тэг при размонтировании
        return () => {
          if (script.parentNode) {
            script.parentNode.removeChild(script)
          }
        }
      }, [])
    
      useEffect(() => {
        if (isLoadedScript) {
          window.ymaps?.ready(() => {
            setIsMapReady(true)
          })
        }
      }, [isLoadedScript])
    
      return { isLoaded: isLoadedScript && isMapReady, error }
}