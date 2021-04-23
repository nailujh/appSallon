let pagina = 1;

const cita = {
    nombre:'',
    fecha: '',
    hora: '',
    servicios:[]
}



document.addEventListener('DOMContentLoaded', function(){
    inciarApp();
});

function inciarApp(){
    mostrarServicios();

    // resalta el div actual segun el tab que se presiona
    mostrarSeccion();


    // oculta o muestra  un seccio el tab al que se presiona
    cambiarSeccion();

    //paginacion
    paginaSiguiente();

    paginaAnterior();
      
      // comprueba la pagina actual para mostrar o ocultar la paginacion
    botonesPaginador();

    // muestra el resumen de la cita o mensaje de la cita en caso de no pasar la validacion
    mostrarResumen();
 
    //almacena el nombre de la cita en el objeto
    nombreCita();

    // almacena la fecha  en el objeto 
    fechaCita();

    // deshabilita fechas pasadas
    deshabilitarFechaAnterior();


    //almacenar la hora del acita en el objeto

    horaCita();

}
 
function mostrarSeccion(){

     // eliminar mostrar-seecion de la seccion anterior 
     const seccionAnterior = document.querySelector('.mostrar-seccion');
     
     if(seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');
        }
     

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    const tabAnterior =  document.querySelector('.tabs .actual');
    if ( tabAnterior) {
        tabAnterior.classList.remove('actual');
    }
     // elminar la clase actual del tab anterior
     


    //resalta el tab actual 
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');

}


 function cambiarSeccion () {
    const enlaces = document.querySelectorAll('.tabs button');


    enlaces.forEach( enlace=> {
        enlace.addEventListener('click', e =>{
            e.preventDefault();
           pagina = parseInt(e.target.dataset.paso);

          // llamar la funcion mostrar seccion 
          mostrarSeccion();


          botonesPaginador ();
        })
    })
}

async  function mostrarServicios(){
    try {
       const resultado = await fetch('./servicios.json');
       
       const db = await resultado.json()


       const { servicios } = db;
       
     // generar HTML

     servicios.forEach(servicio => {
         const { id, nombre, precio }= servicio

         //DOM Scripting
         
         // Generar nombre de servicio
         const nombreServicio = document.createElement('P');
         nombreServicio.textContent= nombre;
         
         // Generar class 
         nombreServicio.classList.add('nombre-servicio');
         
         // Generar precio
         const precioServicio = document.createElement('P');
         precioServicio.textContent= `$ ${precio}`;
         precioServicio.classList.add('precio-servicio');
         
         // gemerar contendio de servicio
         const servicioDiv = document.createElement('DIV');
         servicioDiv.classList.add('servicio');
         servicioDiv.dataset.idServicio =  id
        
         //selecciona un servicio para la cita 
         servicioDiv.onclick = seleccionarServicio;



        // Inyectar precio y nombre al div del servicio
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            //inyecatarlo al html

            document.querySelector('#servicios').appendChild(servicioDiv);

         });

    } catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(e){
    let elemento; 
    // frozar al elemento al cual le damos click sea al div 
    if (e.target.tagName === 'P'){
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    }
   
    if (elemento.classList.contains('seleccionado')){
        elemento.classList.remove('seleccionado');
       
        
        const id = parseInt (elemento.dataset.idServicio);
        
        eleminarServicio(id);
    } else{
        elemento.classList.add('seleccionado');
        
        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre : elemento.firstElementChild.textContent,
            precio : elemento.firstElementChild.nextElementSibling.textContent
        }
        
        
        agregarServicio(servicioObj);
    }
    
    function eleminarServicio(id){
       const {servicios } = cita;
       cita.servicios = servicios.filter(servicio => servicio.id !== id);

       console.log(cita);
    }

    function agregarServicio(servicioObj){
       const {servicios} = cita;
       cita.servicios= [...servicios,servicioObj]; 
       console.log(cita);     
    }
}

function paginaSiguiente(){
   const paginaSiguiente = document.querySelector('#siguiente');
   paginaSiguiente.addEventListener('click',  () =>{
       pagina++;
       console.log(pagina); 
       
       botonesPaginador();
   });
}

function paginaAnterior(){
    const paginaAnterior= document.querySelector('#anterior');
    paginaAnterior.addEventListener('click',  () =>{
        pagina--;
        console.log(pagina);

        botonesPaginador();
    });
    
}

function botonesPaginador (){
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior= document.querySelector('#anterior');

    if (pagina === 1) {
        paginaAnterior.classList.add('ocultar');
    } else if (pagina === 3){
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');
        mostrarResumen(); // estamos en la pagina 3 se carga el resuemen de la cita
    
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion(); // cambia la seccion que se muestra por la de la pagina
    
}


function mostrarResumen(){
     
    //destructuring
    const {nombre, fecha, hora, servicios} = cita;

    // seleccionar el resumen
      const resumenDiv = document.querySelector('.contenido-resumen');

    // limpiar el html previo 
    while(resumenDiv.firstChild){
        resumenDiv.removeChild(resumenDiv.firstChild);
    }

    // validacion del objeto

    if(Object.values(cita).includes('')){
        const noServcios = document.createElement('P');
        noServcios.textContent = ' Faltan datos de Servicios, hora, fecha o nombre ';
        noServcios.classList.add('invalidar-cita');

        // agregar al resumen Div
        resumenDiv.appendChild(noServcios);
        
        return;
    }
    
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita'


    // mostrar resumen 
 const nombreCita = document.createElement('P');
 nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;
 

 const fechaCita = document.createElement('P');
 fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

 const horaCita = document.createElement('P');
 horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

 const serviciosCita = document.createElement('DIV');
 serviciosCita.classList.add('resumen-servicios');

 const headingServicios = document.createElement('H3');
 headingServicios.textContent = 'Resumen de Servicios'
 
 serviciosCita.appendChild(headingServicios);

 let cantidad = 0;
 // iterar sobre el array de servicios
 servicios.forEach( servicio => {

      const {nombre, precio} = servicio;
    
      const contendorServicio = document.createElement('DIV');
      contendorServicio.classList.add('contenedor-servicio');
      
      const textoServicio =  document.createElement('P')
      textoServicio.textContent = nombre;

      const precioServicio =  document.createElement('P')
      precioServicio.textContent = precio;
      precioServicio.classList.add('precio')
      const totalServicio = precio.split('$')
    //   console.log(parseInt(totalServicio[1].trim()));
     
    cantidad +=parseInt(totalServicio[1].trim());
     
     
     
      // colocar texto y precio en el div 

      contendorServicio.appendChild(textoServicio);
      contendorServicio.appendChild(precioServicio);
      serviciosCita.appendChild(contendorServicio);
 });

 resumenDiv.appendChild(headingCita);
 resumenDiv.appendChild(nombreCita);
 resumenDiv.appendChild(fechaCita);
 resumenDiv.appendChild(horaCita);
 resumenDiv.appendChild(serviciosCita);
 
 const cantidadPagar = document.createElement('P');
 cantidadPagar.classList.add('total');
 cantidadPagar.innerHTML = `<span>Total a Pagar: </span> $ ${cantidad}`;
 resumenDiv.appendChild(cantidadPagar);

}



function nombreCita(){
    const nombreInput = document.querySelector("#nombre");
    
    nombreInput.addEventListener('input', (e) => {
        const  nombreTexto = e.target.value.trim();

       //validacion de que exista tetxto
       if (nombreTexto === ''|| nombreTexto.length < 3){
           mostrarAlerta('Nombre no valido', 'error');
       } else{
       const alerta = document.querySelector('.alerta');
   
       if(alerta){
           alerta.remove();
       }
       cita.nombre = nombreTexto;
    }

    });
}


function mostrarAlerta (mensaje, tipo){
    
// Si hay una alerta previa, no crear otra 
const alertaPrevia = document.querySelector('.alerta');
if (alertaPrevia){
    return;
}

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
 
    if(tipo === 'error'){
alerta.classList.add('error');
 }

 //interatar en el Html
 const formulario = document.querySelector('.formulario');
 formulario.appendChild(alerta);

 //eliminar alerta despues de 3 segundos 

 setTimeout(()=>{
     alerta.remove();
 },3000 )

}


function fechaCita (){
    const fechaInput = document.querySelector("#fecha");
    fechaInput.addEventListener('input', e =>{
     
        const dia = new Date(e.target.value).getUTCDay();
     if([0, 6].includes(dia)){
         e.preventDefault();
         fechaInput.value ='';
         mostrarAlerta('Fines de semana no son permititos', 'error');
     } else {
         cita.fecha= fechaInput.value;
     }
     console.log(cita);
    })
}

function deshabilitarFechaAnterior(){
    const inputFecha = document.querySelector('#fecha');

    const fechaAhora = new Date ();
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() +1;
    const dia = fechaAhora.getDate() +1;
    
    
    
    const fechaDeshabilitar = `${year}-${mes < 10 ? `0${mes}` : mes}-${dia < 10 ? `0${dia}` : dia}`;
    
    inputFecha.min =  fechaDeshabilitar;
   
}


function horaCita(){
const inputHora = document.querySelector('#hora');
inputHora.addEventListener('input', e => {
    
    const horaCita = e.target.value;
    const hora = horaCita.split(':');
    if (hora [0] < 10 || hora [0]>18 ){
        mostrarAlerta('Hora no valida', 'error')
        
        setTimeout(() => {
            inputHora.value = '';
        }, 3000);
        
    } else {
        cita.hora = horaCita;
        console.log(cita);
    }

    


});

}