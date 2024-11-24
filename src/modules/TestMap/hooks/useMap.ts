import { useEffect, useRef, useState } from "react"
import ymaps from "yandex-maps"

const useMap = (isLoaded: boolean, mapOptions: any) => {
    const mapContainer = useRef<HTMLDivElement | null>(null)
    const [map, setMap] = useState<ymaps.Map | null>(null)

    const renderPlaceMark = () => {
        /*СОЗДАЕМ ЭКЗЕМПЛЯР КЛАССА Placemark (метка) */
        const placeMark = new window.ymaps.Placemark([47.222109, 39.718813], {
            //iconContent: 'Ростова-на-Дону', //текст на иконке
            //balloonContent: 'Красивый город' /*текст появляющийся после нажатия*/
        }, {
            preset: 'twirl#blueStretchyIcon', //тип иконки
        })

        placeMark.events.add('click', () => {
            alert("Ростов-на-Дону")
        })

        /*ДОБАВЛЯЕМ СОЗДАННУЮ КНОПКУ НА НАШУ КАРТУ*/
        map?.geoObjects.add(placeMark);
    }

    const renderPlaceMarksGroup = () => {
        let groups = [
            {
                style: "islands#redIcon",
                items: [
                    {
                        center: [46.711944, 38.272660],
                        name: 'Ейск'
                    },
                    {
                        center: [46.043509, 38.177654],
                        name: 'Приморско-Ахтарск'
                    },
                    {
                        center: [45.215612, 36.718413],
                        name: 'Тамань'
                    },

                ]
            },
            {
                style: "islands#darkGreenIcon",
                items: [
                    {
                        center: [44.894269, 37.316906],
                        name: 'Анапа'
                    },
                    {
                        center: [44.561012, 38.077115],
                        name: 'Геленджик'
                    },
                    {
                        center: [43.585472, 39.723098],
                        name: 'Сочи'
                    },
                    {
                        center: [45.035470, 38.975313],
                        name: 'Краснодар'
                    },

                ]
            },
        ]

        for (let groupId in groups) {
            let group = groups[groupId]

            let collection = new window.ymaps.GeoObjectCollection({}, { preset: group.style })
            map?.geoObjects.add(collection)

            let lengthItem = group.items.length


            for (let i = 0; i < lengthItem; i++) {
                let placeMark = new window.ymaps.Placemark(group.items[i].center, { balloonContent: group.items[i].name })
                collection.add(placeMark)
            }
        }


        // Выставляем масштаб карты, чтобы были видны все группы
        map?.setBounds(map?.geoObjects?.getBounds() || [])

    }

    const renderCluster = () => {
        
        const clusterer = new window.ymaps.Clusterer({
            preset: 'islands#invertedVioletClusterIcons',
            groupByCoordinates: false,
            // @ts-ignore
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false,
            gridSize: 80 // Установили gridSize здесь для лучшей читаемости
        });
        
        const getPointData = (index: number) => ({ // Используем стрелочную функцию для краткости
            balloonContentHeader: `<p>Шапка балуна</p>`,
            balloonContentBody: `<p>Тело балуна</p>`,
            balloonContentFooter: `<p>Информация предоставлена: балуном <strong>метки ${index}</p>`, // Используем template literal
            clusterCaption: `метка <strong>${index}</strong>` // Используем template literal
        });
        
        const points = [
            [55.831903, 37.411961], [55.763338, 37.565466], [55.763338, 37.565466], [55.744522, 37.616378], [55.780898, 37.642889], [55.793559, 37.435983], [55.800584, 37.675638], [55.716733, 37.589988], [55.775724, 37.560840], [55.822144, 37.433781], [55.874170, 37.669838], [55.716770, 37.482338], [55.780850, 37.750210], [55.810906, 37.654142], [55.865386, 37.713329], [55.847121, 37.525797], [55.778655, 37.710743], [55.623415, 37.717934], [55.863193, 37.737000], [55.866770, 37.760113], [55.698261, 37.730838], [55.633800, 37.564769], [55.639996, 37.539400], [55.690230, 37.405853], [55.775970, 37.512900], [55.775777, 37.442180], [55.811814, 37.440448], [55.751841, 37.404853], [55.627303, 37.728976], [55.816515, 37.597163], [55.664352, 37.689397], [55.679195, 37.600961], [55.673873, 37.658425], [55.681006, 37.605126], [55.876327, 37.431744], [55.843363, 37.778445], [55.875445, 37.549348], [55.662903, 37.702087], [55.746099, 37.434113], [55.838660, 37.712326], [55.774838, 37.415725], [55.871539, 37.630223], [55.657037, 37.571271], [55.691046, 37.711026], [55.803972, 37.659610], [55.616448, 37.452759], [55.781329, 37.442781], [55.844708, 37.748870], [55.723123, 37.406067], [55.858585, 37.484980]
        ];
        
        const geoObjects = points.map((point, index) =>  // Используем map для создания массива geoObjects
            new window.ymaps.Placemark(point, getPointData(index), {preset: 'islands#violetIcon'})
        );
        
        
        clusterer.add(geoObjects);
        
        // Предполагается, что 'map' уже определен и инициализирован где-то выше.
        if (map) { // Проверка на существование map
            // @ts-ignore
            map.geoObjects.add(clusterer);
            // Спозиционируем карту так, чтобы на ней были видны все объекты.
            map.setBounds(clusterer.getBounds() || [], { checkZoomRange: true });
        } else {
            console.error("Карта 'map' не инициализирована.");
        }
    }


    const renderPolygon = () => {
        const myPolygon = new window.ymaps.Polygon([[
            // координаты вершин внешней границы многоугольника
            [55.778607,37.553126],
            [55.792923,37.647883],
            [55.724391,37.709681],
            [55.708887,37.583339]
        ]]);
        map?.geoObjects.add(myPolygon);
    }
    const renderCircle = () => {
        const myCircle = new window.ymaps.Circle([
            // Координаты центра круга.
            [55.76, 37.60],
            // Радиус круга в метрах.
            10000
        ], {
            // Описываем свойства круга.
            // Содержимое балуна.
            balloonContent: "Радиус круга - 10 км",
            // Содержимое хинта.
            hintContent: "Подвинь меня"
        }, {
            // Задаем опции круга.
            // Включаем возможность перетаскивания круга.
            draggable: true,
            // Цвет заливки.
            // Последний байт (77) определяет прозрачность.
            // Прозрачность заливки также можно задать используя опцию "fillOpacity".
            fillColor: "#DB709377",
            // Цвет обводки.
            strokeColor: "#990066",
            // Прозрачность обводки.
            strokeOpacity: 0.8,
            // Ширина обводки в пикселях.
            strokeWidth: 2
        });
        map?.geoObjects.add(myCircle);
    }

    useEffect(() => {
        if (isLoaded && mapContainer.current && !map) {
            const newMap = new window.ymaps.Map(mapContainer.current, mapOptions);
            setMap(newMap)
        }
    }, [isLoaded, mapOptions])

    useEffect(() => {
        if (map) {
            renderPlaceMark()
            renderPlaceMarksGroup()
            renderCluster()
            renderPolygon()
            renderCircle()
        }
    }, [map])


    return { mapContainer, map }
}

export default useMap