const axios = require('axios');

const fs = require('fs');

class Busquedas {

    historial = [];
    dbPath = `./db/database.json`;

    constructor(){
        this.leerDB();
    }

    get historialCapitalizado() {
        return this.historial.map(lugar => {

            let palabras = lugar.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1) );

            return palabras.join(' ');
        })
    }

    get paramsMapbox(){
        return{
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    async ciudad(lugar = '') {

        try {
            
            //? Peticion http
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });

            const resp = await instance.get();    
            // console.log(resp.data.features);

            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));

        } catch (error) {
            return [];
        }
    };

    get paramsOpenWather(){
        return{
            'appid': process.env.OPENWATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }
    
    async climaLugar(lat, lon) {
        
        try {
    
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsOpenWather, lat, lon}
            });

            const resp = await instance.get();
            // console.log(resp.data);

            const {main, weather} = resp.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial(lugar = ''){

        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return;
        }

        this.historial = this.historial.splice(0,5);
        
        this.historial.unshift(lugar.toLocaleLowerCase());
        // Grabar en DB
        this.guardarDB();

    }

    guardarDB(lugar) {

        const payload = {
            historial: this.historial
        };

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
        // return;
    }

    leerDB() {
        if (!fs.existsSync(this.dbPath)) {
            return;
        }
    
        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});    
        const data = JSON.parse(info);
    
        this.historial = data.historial;
        // return this.historial;
    }
}


module.exports = Busquedas;