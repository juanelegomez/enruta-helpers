module.exports = {
	nearPoints: function(point, line) {
		//Creando circulo con el radio
		turf = require('turf');
		
		var radius=0.2;
		var numero_puntos=180;
		var grados=360/numero_puntos;
		var points = [];
		for(var i=-180; i<180; i+=grados) {
			var punto = turf.destination(point, radius, i, 'kilometers');
			points.push(punto.geometry.coordinates);
		}
		points.push(points[0]);


		var circulo = {
			type: 'Feature',
			geometry: {
				type: 'Polygon',
				coordinates: [points]
			}
		};

		var corte = turf.intersect(circulo, line);
		near_points = [];

		//De este corte tengo varias opciones, primero que solo recibo un punto, con este debo calcular distancia sobre la línea desde este punto al destino
		if(corte.geometry.type=='Point') {
			//En este caso solo se cortan en 1 punto, guardo este punto en el array de puntos
			near_points = [corte];
		} else if(corte.geometry.type=='LineString') {
			//Solo corta una línea, saco el punto más cercano sobre la línea al punto de referencia
			near_points = [turf.pointOnLine(corte, point)];
		} else if(corte.geometry.type=='MultiLineString') {
			//Corta varias lineas, saco los puntos más crecanos en cada una de las líenas
			for(var i=0; i<corte.geometry.coordinates.length; i++) {
				var segmento = {
					type: 'Feature',
					geometry: {
						type: 'LineString',
						coordinates: corte.geometry.coordinates[i]
					}
				}
				near_points.push(turf.pointOnLine(segmento, point));
			}
		}

		return near_points;
	}
}