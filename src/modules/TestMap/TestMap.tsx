import React, { useRef } from 'react'
import useLoadMapScript from './hooks/useLoadMapScript'
import useLoadMapScript2 from './hooks/useLoadMapScript2'
import useMap from './hooks/useMap'


const TestMap = () => {
    const {isLoaded} = useLoadMapScript2();
    const {map, mapContainer} = useMap(isLoaded, {
        center: [45.0448, 38.976], //координаты центра
        zoom: 10, //уровень приближения
    })
    
    return (
        (!isLoaded)
            ?
            <p>Загрузка...</p>
            :
            <div ref={mapContainer} style={{width: "100vw", height: "100vh", overflow: "hidden"}}></div>
    )
}

export default TestMap