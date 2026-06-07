export const packages = [
    {
        id: 'paris-romantico',
        title: 'Paris romantico',
        destination: 'Paris, Francia',
        description: 'Vuelos, hotel centrico, cena panoramica y recorrido por los iconos de la ciudad.',
        days: 6,
        price: 899,
        tag: 'Mas elegido',
        type: 'popular',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
        heroImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1800&q=85',
        mapQuery: 'Paris France Eiffel Tower',
        gallery: [
            'https://images.unsplash.com/photo-1431274172761-fca41d930114?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&w=900&q=80'
        ],
        includes: [
            'Vuelo ida y vuelta con equipaje base.',
            'Hotel centrico cerca de metro y zonas turisticas.',
            'Cena panoramica y recorrido nocturno por la ciudad.',
            'Asistencia FlyGo antes y durante el viaje.'
        ],
        idealFor: [
            'Parejas que buscan una escapada romantica.',
            'Viajeros que quieren caminar la ciudad con calma.',
            'Primera visita a Europa con agenda clara.'
        ]
    },
    {
        id: 'tokio-neon',
        title: 'Tokio Neon',
        destination: 'Tokio, Japon',
        description: 'Barrios historicos, tecnologia, gastronomia local y excursiones urbanas guiadas.',
        days: 8,
        price: 1299,
        tag: 'Cultura',
        type: 'popular',
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
        heroImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1800&q=85',
        mapQuery: 'Shibuya Crossing Tokyo Japan',
        gallery: [
            'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1554797589-7241bb691973?auto=format&fit=crop&w=900&q=80'
        ],
        includes: [
            'Alojamiento conectado con lineas principales.',
            'Tour urbano por Shibuya, Asakusa y Akihabara.',
            'Guia gastronomica para izakayas, ramen y mercados.',
            'Asistencia para pases y traslados internos.'
        ],
        idealFor: [
            'Fans de cultura, tecnologia y comida local.',
            'Viajeros que quieren una ciudad intensa y segura.',
            'Grupos que prefieren recorridos guiados.'
        ]
    },
    {
        id: 'ny-escapada',
        title: 'Nueva York Express',
        destination: 'Nueva York, USA',
        description: 'Hotel en Manhattan, pase turistico, miradores y asistencia para moverte sin perder tiempo.',
        days: 5,
        price: 799,
        tag: 'Oferta',
        type: 'offer',
        image: 'https://images.unsplash.com/photo-1538970272646-f61fabb3a8a2?auto=format&fit=crop&w=1200&q=80',
        heroImage: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=1800&q=85',
        mapQuery: 'Times Square New York',
        gallery: [
            'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&w=900&q=80'
        ],
        includes: [
            'Hotel base en Manhattan o zona conectada.',
            'Pase turistico para miradores y atracciones.',
            'Itinerario express para aprovechar cinco dias.',
            'Soporte para traslados aeropuerto-ciudad.'
        ],
        idealFor: [
            'Viajeros que quieren una escapada urbana.',
            'Compras, shows, miradores y fotografia.',
            'Quienes visitan NY por primera vez.'
        ]
    },
    {
        id: 'rio-playa',
        title: 'Rio y playa',
        destination: 'Rio de Janeiro, Brasil',
        description: 'Playas, tour al Cristo Redentor, traslados y opciones flexibles para grupos.',
        days: 7,
        price: 699,
        tag: 'Low cost',
        type: 'offer',
        image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80',
        heroImage: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=1800&q=85',
        mapQuery: 'Copacabana Rio de Janeiro Brazil',
        gallery: [
            'https://images.unsplash.com/photo-1544989164-31dc3c645987?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1526401485004-2fda9f4d61f5?auto=format&fit=crop&w=900&q=80'
        ],
        includes: [
            'Hotel con acceso rapido a playas principales.',
            'Tour Cristo Redentor y Pan de Azucar.',
            'Traslados coordinados para llegada y salida.',
            'Opciones flexibles para grupos y familias.'
        ],
        idealFor: [
            'Viajes con amigos y escapadas de playa.',
            'Presupuesto cuidado sin perder ubicacion.',
            'Quienes quieren combinar ciudad y descanso.'
        ]
    },
    {
        id: 'islandia-auroras',
        title: 'Islandia Auroras',
        destination: 'Reykjavik, Islandia',
        description: 'Ruta escenica, lagunas termales, cascadas y noches pensadas para ver auroras.',
        days: 7,
        price: 1599,
        tag: 'Aventura',
        type: 'popular',
        image: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=1200&q=80',
        heroImage: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1800&q=85',
        mapQuery: 'Reykjavik Iceland',
        gallery: [
            'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1529963183134-61a90db47eaf?auto=format&fit=crop&w=900&q=80'
        ],
        includes: [
            'Alojamiento base en Reykjavik.',
            'Excursion a circulo dorado y cascadas.',
            'Salida nocturna para auroras segun clima.',
            'Recomendaciones de ropa y equipo.'
        ],
        idealFor: [
            'Fotografia, naturaleza y paisajes dramaticos.',
            'Viajeros que quieren una experiencia distinta.',
            'Parejas o grupos aventureros.'
        ]
    },
    {
        id: 'grecia-islas',
        title: 'Grecia Islas',
        destination: 'Santorini, Grecia',
        description: 'Atardeceres, playas, paseos en barco y hoteles con vistas al Egeo.',
        days: 8,
        price: 1190,
        tag: 'Relax',
        type: 'popular',
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
        heroImage: 'https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&w=1800&q=85',
        mapQuery: 'Santorini Greece Oia',
        gallery: [
            'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=900&q=80'
        ],
        includes: [
            'Hoteles seleccionados con buena ubicacion.',
            'Paseo en barco y miradores para atardecer.',
            'Traslados internos entre puertos y hotel.',
            'Recomendaciones de playas y restaurantes.'
        ],
        idealFor: [
            'Descanso, fotos y viajes romanticos.',
            'Quienes quieren mar sin itinerario pesado.',
            'Luna de miel o escapadas premium.'
        ]
    },
    {
        id: 'marrakech-sahara',
        title: 'Marrakech y Sahara',
        destination: 'Marrakech, Marruecos',
        description: 'Medina, riads, mercados, desierto y una noche bajo estrellas.',
        days: 6,
        price: 950,
        tag: 'Exotico',
        type: 'offer',
        image: 'https://images.unsplash.com/photo-1548018560-c7196548e84d?auto=format&fit=crop&w=1200&q=80',
        heroImage: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1800&q=85',
        mapQuery: 'Jemaa el-Fnaa Marrakech Morocco',
        gallery: [
            'https://images.unsplash.com/photo-1539020140153-e8c237112e53?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&w=900&q=80'
        ],
        includes: [
            'Riad seleccionado dentro o cerca de la medina.',
            'Tour guiado por mercados y palacios.',
            'Excursion al desierto con campamento.',
            'Consejos culturales y asistencia local.'
        ],
        idealFor: [
            'Viajeros curiosos y amantes de la cultura.',
            'Fotografia, gastronomia y aventura suave.',
            'Quienes buscan algo distinto a lo clasico.'
        ]
    },
    {
        id: 'patagonia-glaciares',
        title: 'Patagonia Glaciares',
        destination: 'El Calafate, Argentina',
        description: 'Glaciar Perito Moreno, navegacion, senderos y paisajes patagonicos.',
        days: 5,
        price: 620,
        tag: 'Nacional',
        type: 'offer',
        image: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=1200&q=80',
        heroImage: 'https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?auto=format&fit=crop&w=1800&q=85',
        mapQuery: 'Perito Moreno Glacier Argentina',
        gallery: [
            'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80'
        ],
        includes: [
            'Alojamiento en El Calafate.',
            'Excursion al Glaciar Perito Moreno.',
            'Opciones de navegacion y trekking suave.',
            'Asistencia para traslados y clima.'
        ],
        idealFor: [
            'Naturaleza, fotografia y viajes nacionales.',
            'Escapadas cortas con alto impacto visual.',
            'Familias, parejas y grupos chicos.'
        ]
    }
];
