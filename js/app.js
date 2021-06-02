const criptomonedaSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const formContent = document.querySelector('.form-content');
const resultadoCotizacion= document.querySelector('#resultado')

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

document.addEventListener('DOMContentLoaded', consultarTop)

//Crear un Promise
const obtenerCriptomonedas = criptomonedas => new Promise( resolve => {
    resolve(criptomonedas)
})

document.addEventListener('DOMContentLoaded', () => {
    
    consultarCriptomonedas()
    formulario.addEventListener('submit', submitFormulario)

    criptomonedaSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
});

async function consultarTop(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
    

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json()

        console.log(resultado.Data)
        mostrarTop(resultado.Data)
    } catch (error) {
        
    }
}


async function consultarCriptomonedas(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
    

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json()
        const criptomonedas = await obtenerCriptomonedas(resultado.Data)
        selectCriptomonedas(criptomonedas)
    } catch (error) {
        
    }
}




function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach( moneda => {
        const { FullName, Name }  = moneda.CoinInfo;

        const option = document.createElement('option');
        option.textContent = FullName;
        option.value = Name;

        criptomonedaSelect.appendChild(option)


    });
}

function mostrarTop(criptomonedas){
    const tableCrypto = document.querySelector('.table-crypto');
    const topCrypto = document.querySelector('.topCrypto');
    const spinner = document.createElement('div');
    spinner.innerHTML = `
        <div class="sk-fading-circle">
            <div class="sk-circle1 sk-circle"></div>
            <div class="sk-circle2 sk-circle"></div>
            <div class="sk-circle3 sk-circle"></div>
            <div class="sk-circle4 sk-circle"></div>
            <div class="sk-circle5 sk-circle"></div>
            <div class="sk-circle6 sk-circle"></div>
            <div class="sk-circle7 sk-circle"></div>
            <div class="sk-circle8 sk-circle"></div>
            <div class="sk-circle9 sk-circle"></div>
            <div class="sk-circle10 sk-circle"></div>
            <div class="sk-circle11 sk-circle"></div>
            <div class="sk-circle12 sk-circle"></div>
        </div>
    `;
    topCrypto.appendChild(spinner)

    setTimeout(() => {
        spinner.remove()
 
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Precio</th>
                <th scope="col">Precio <i class="fas fa-sort-up text-success"></i> del día:</th>
                <th scope="col">Precio <i class="fas fa-sort-down text-danger"></i> del día: </th>
                <th scope="col">Actualización: </th>
                <th scope="col">Ultimas 24hs: </th>
            </tr>
        `;

        tableCrypto.appendChild(thead)

    
        criptomonedas.forEach( moneda => {
            const { FullName, Name }  = moneda.CoinInfo;
            const { PRICE, HIGHDAY, LOWDAY, LASTUPDATE, CHANGEPCT24HOUR }  = moneda.DISPLAY.USD;
            console.log(FullName)
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <th class="p-2" scope="row">${FullName}</th>
            <td class="p-2 text-right">${PRICE}</td>
            <td class="p-2 text-right">${HIGHDAY}</td>
            <td class="p-2 text-right">${LOWDAY}</td>
            <td class="p-2 text-right">${LASTUPDATE}</td>
            <td class="p-2 text-right porcentaje"><</td>
            `;
            
            tableCrypto.appendChild(tr)
            
            
        });
    }, 2000);
}



function leerValor(e){
    
    objBusqueda.criptomoneda = criptomonedaSelect.value;
    objBusqueda.moneda = monedaSelect.value;
    console.log(objBusqueda);
}


function submitFormulario(e){
    e.preventDefault()

    const { moneda, criptomoneda } = objBusqueda;
    
    if(moneda === '' || criptomoneda === ''){
        mostrarError('Ambos campos son obligatorios');
        return;
    }
    
    consultarInfoApi()
}

function mostrarError(mensaje){
    const existeError = document.querySelector('.error')
    if(!existeError){
        limpiarHTML()

        const alerta = document.createElement('p');
        alerta.textContent = mensaje;
        alerta.classList.add('alert', 'alert-danger', 'w-100', 'mt-4')
        
        formContent.appendChild(alerta)
        
        setTimeout(() => {
            alerta.remove()
        }, 3000);
    }
}

async function consultarInfoApi(){
    const { moneda, criptomoneda } = objBusqueda;
    console.log(moneda)
    
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner()

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json()

        console.log(resultado)

        mostrarInfo(resultado)
    } catch (error) {
        console.log(error)
    }
    
}


function mostrarInfo(resultado){

    limpiarHTML()
    
    const { moneda, criptomoneda } = objBusqueda;
    
    const { PRICE, HIGHDAY, LOWDAY, LASTUPDATE, CHANGEPCT24HOUR} = resultado.DISPLAY[criptomoneda][moneda]
    const cotizacion = document.createElement('div')
    cotizacion.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'text-right');
    cotizacion.innerHTML = `
        <h3>Precio actual: <br> <strong> ${PRICE} </strong> </h3>
        <p>Precio más alto del día: <br> <strong> ${HIGHDAY} </strong></p>
        <p>Precio más bajo del día: <br> <strong> ${LOWDAY} </strong></p>
        <p>Variación ultimas 24hs: <br> <strong> ${CHANGEPCT24HOUR} %</strong></p>
        <p>Última actualización: <br> <strong> ${LASTUPDATE} </strong></p>
        

    `;

    resultadoCotizacion.appendChild(cotizacion)
}


function limpiarHTML(){
    while (resultadoCotizacion.firstChild) {
        resultadoCotizacion.removeChild(resultadoCotizacion.firstChild)
    }
}

function mostrarSpinner(){
    limpiarHTML()

    const spinner = document.createElement('div');
    spinner.innerHTML = `
        <div class="sk-fading-circle">
            <div class="sk-circle1 sk-circle"></div>
            <div class="sk-circle2 sk-circle"></div>
            <div class="sk-circle3 sk-circle"></div>
            <div class="sk-circle4 sk-circle"></div>
            <div class="sk-circle5 sk-circle"></div>
            <div class="sk-circle6 sk-circle"></div>
            <div class="sk-circle7 sk-circle"></div>
            <div class="sk-circle8 sk-circle"></div>
            <div class="sk-circle9 sk-circle"></div>
            <div class="sk-circle10 sk-circle"></div>
            <div class="sk-circle11 sk-circle"></div>
            <div class="sk-circle12 sk-circle"></div>
        </div>
    `;

    resultadoCotizacion.appendChild(spinner)

}