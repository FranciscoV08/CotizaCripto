//Guardamos en una variable el id de criptomonedas
const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

//Esto se llenada segun las opciones elegidas del formulario
const objBusqueda = {
    moneda: '',
    criptomoneda: ''
};

//Es una funcion que toma parametro y el Promise y el resolve(Obtiene las 10 cripto )
const obtenerCriptomonedas = criptomonedas => new Promise( resolve => {
    resolve(criptomonedas)

});

//Cuando el documento este listo ejecuta la funcion que seria (consultarCriptomonedas)
document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);
    //para los select y guardar valor del Html en el OBJ
    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
})

//Funciones 
function consultarCriptomonedas(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
    
    fetch(url)
        .then(respuesta => respuesta.json())
        //Trae las 10cripto por medio del Promise 
        .then(resultado => obtenerCriptomonedas(resultado.Data))
        .then(criptomonedas => selectCripto(criptomonedas))

}
function selectCripto(criptomonedas){
    //recorre el Array de las cripto 
    criptomonedas.forEach( criptos => {
        //Extraemos los valores de los objetos de informacion
        const {FullName, Name} = criptos.CoinInfo;

        //Creando las opciones 
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);

    })
}

function leerValor(e) {
    //Iguala el valor del html al del obj por medio de sus nombres iguales 
    //Practicar mas 
    //se Mapean con el html por sus "name"
    objBusqueda[e.target.name] = e.target.value;
}
//Funcion de formulario
function submitFormulario(e) {
    e.preventDefault();

    //Validar Form

    //Destructuring 
    const {moneda, criptomoneda} = objBusqueda;

    if (moneda == '' || criptomoneda == '') {
        mostrarAlerta('Ambos campos son obligatorios');        
        //Corta la ejecucion 
        return
    }

    //Consultar la API con los resultados 
    consultarApi();
}

function mostrarAlerta(mensaje){

    //guardamos la clase .error
    const existeError = document.querySelector('.error');

    if ( !existeError) {
        //Creamos el HTML
        const divMensaje = document.createElement('div');
    
        //classes
        divMensaje.classList.add('error');
        //Contenido
        divMensaje.textContent = mensaje;
        //Agregamos al formulario
        formulario.appendChild(divMensaje);
    
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);

    }

};

function consultarApi(){
    //Como pasamos la validacion podemos extraer los valores

    const {moneda, criptomoneda} = objBusqueda;

    //Modificamos el URL de dinamicamente 
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

//Antes de consultar la API quiero que se muestre un Spiner 
    mostrarSpinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizacion => {
            //Al igual que la anterior Mapeamos los valores para mas dinamismo
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda])
        })
}

function mostrarCotizacionHTML(cotizacion){
    limpiarHtml();
    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;
    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es; <span>${PRICE}</span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `Precio más alto del dia; <span>${HIGHDAY}</span>`

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `Precio más Bajo del dia; <span>${LOWDAY}</span>`

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `Precio en las últimas 24 horas; <span>${CHANGEPCT24HOUR}%</span>`

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `Ultima Actualizacion; <span>${LASTUPDATE}</span>`



    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);
}

function limpiarHtml(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner(){
    limpiarHtml();

    const spiner = document.createElement('div');
    spiner.classList.add('spinner');

    spiner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;
    resultado.appendChild(spiner);
}
