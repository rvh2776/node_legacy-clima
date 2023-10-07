require('dotenv').config()
require('colors');
const Busquedas = require('./models/busquedas');

const { 
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
} = require("./helpers/inquirer");


const main = async () => {

    let opcion = '';

    const busquedas = new Busquedas();

    do {

        opcion = await inquirerMenu();
        
        switch (opcion) {
            
            case 1:   //? Buscar ciudad
                // Mostrar mensaje
                const termino = await leerInput('Ciudad:');
                // Buscar los lugares
                const lugares = await busquedas.ciudad(termino);
                // Seleccionar el lugar
                const id = await listarLugares(lugares);
                if (id === '0') continue;

                const lugarSel = lugares.find(lugar => lugar.id === id);
                busquedas.agregarHistorial(lugarSel.nombre);
                // Clima
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);
                // Mostrar resultados
                console.clear();
                console.log('\nInformacion de la ciudad\n'.cyan);
                console.log('Ciudad: '.cyan, lugarSel.nombre);
                console.log('Lat: '.cyan, lugarSel.lat);
                console.log('Lng: '.cyan, lugarSel.lng);
                console.log('Temperatura: '.cyan, clima.temp);
                console.log('Minima: '.cyan, clima.min);
                console.log('Maxima: '.cyan, clima.max);
                console.log('Como esta el clima: '.cyan, clima.desc);
            break;

            case 2:   //? Historial
                    console.log();
                    busquedas.historialCapitalizado.forEach((lugar, i) =>{
                        console.log(`${i + 1}.`.cyan, lugar);
                })
            break;

        };

        if (opcion !== 0) await pausa();

    } while (opcion !== 0);
}

main();