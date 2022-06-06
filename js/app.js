const cliente = {
  mesa: '',
  hora: '',
  pedidos: []
}
const categorias = {
  1: "Comida",
  2: "Bebidas",
  3: "Postres"
}
const btnGuadarCliente = document.querySelector('#guardar-cliente');
const contenido = document.querySelector('#resumen .contenido');

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector('.modal-body form').reset()
  btnGuadarCliente.addEventListener('click', guardarCliente);
})

const guardarCliente = () => {
  const mesa = document.querySelector('#mesa').value;
  const hora = document.querySelector('#hora').value;
  const camposVacio = [mesa, hora].some(campo => campo === "");
  if (camposVacio) {
    //   Verificar si ya hay una alerta
    const existeAlerta = document.querySelector('.invalid-feedback');
    if (!existeAlerta) {
      const alerta = document.createElement('div');
      alerta.classList.add('invalid-feedback', 'd-block', 'text-center');
      alerta.textContent = "Todos los campos son obligatorios";
      document.querySelector('.modal-body form').appendChild(alerta)
      setTimeout(() => {
        alerta.remove()
      }, 2000)
    }
    return;
  }
  //   Asignar datos al Obj de cliente
  cliente.mesa = mesa;
  cliente.hora = hora;

  //   ocultar modal
  const modalFormulario = document.querySelector('#formulario');
  const modalBootsrap = bootstrap.Modal.getInstance(modalFormulario);

  modalBootsrap.hide()
  // mostrarSecciones
  mostrarSecciones()

  // obtener platillos de la api de json-server
  obtenerPlatillos()
}

const mostrarSecciones = () => {
  const seccionesOcultas = document.querySelectorAll('.d-none')

  seccionesOcultas.forEach(seccion => seccion.classList.remove('d-none'))
}

const obtenerPlatillos = () => {
  const url = "http://localhost:3000/platillos";
  fetch(url)
    .then(respuesta => respuesta.json())
    .then(respuesta => mostrarPlatillos(respuesta))
    .catch(error => console.log(error))
}

const mostrarPlatillos = (platillos) => {
  const platillosDiv = document.querySelector('#platillos .contenido');
  platillos.forEach(platillo => {
    const {
      id,
      nombre,
      precio,
      categoria
    } = platillo;
    const row = document.createElement('div');
    row.classList.add('row', "py-2", "border-top");
    // nombre
    const nombreDiv = document.createElement('div');
    nombreDiv.classList.add('col-md-4');
    nombreDiv.textContent = nombre;
    // precio
    const precioDiv = document.createElement('div');
    precioDiv.classList.add('col-md-3', "fw-bold");
    precioDiv.textContent = "$" + precio;
    // categoria
    const categoriaDiv = document.createElement('div');
    categoriaDiv.classList.add('col-md-3');
    categoriaDiv.textContent = categorias[categoria];

    // input de cantidad
    const agregar = document.createElement('div');
    agregar.classList.add('col-md-2');
    const inputCantidad = document.createElement('input');
    inputCantidad.classList.add('form-control', "input-cantidad")
    inputCantidad.type = "number";
    inputCantidad.min = 0;
    inputCantidad.id = id;
    agregar.appendChild(inputCantidad)

    // Detectar cantidad y platillo agregado
    inputCantidad.onchange = () => {
      const cantidad = parseInt(inputCantidad.value);
      agregarPlatillo({
        ...platillo,
        cantidad
      })
    }

    // agregar datos de platillo a div
    row.append(nombreDiv, precioDiv, categoriaDiv, agregar)
    // agregar platillo a div
    platillosDiv.appendChild(row)
  })
}

const agregarPlatillo = (datos) => {

  const {
    id,
    nombre,
    precio,
    cantidad
  } = datos;


  // Revisar que cantidad sea mayor a 0
  if (cantidad > 0) {
    // Cmprobar si el producto ya existe y si es asi cambiar la cantidad de lo contrario se agrega un nuevo elemento

    const resultado = cliente.pedidos.some(pedido => pedido.id === datos.id)
    if (resultado) {
      const pedidoActualizado = cliente.pedidos.map(pedido => {
        if (pedido.id === datos.id) {
          pedido.cantidad = datos.cantidad
        }
        return pedido
      });
      cliente.pedidos = [...pedidoActualizado]
    } else {
      cliente.pedidos = [...cliente.pedidos, datos]
    }

  } else {
    // Resetear input de producto
    const pedido = document.querySelector(`[id="${id}"]`);
    pedido.value = "";

    // Eliminar elementos cuadno la cantidad es 0
    const resultado = cliente.pedidos.filter(pedido => pedido.id !== datos.id)
    cliente.pedidos = [...resultado];
    // Resetea el html de resumen de consumo y el valor del input
    mensajePedidoVacio();

  }
  // limpiar html

  // mostrarResumen
  if (cliente.pedidos.length > 0) {
    imprimirPedidos()
  }
}
const imprimirPedidos = () => {
  limpiarHtml(contenido);

  const resumen = document.createElement("div");
  resumen.classList.add('col-md-6', "card", "py-5", "px-3", "shadow");


  // mesa 
  const mesa = document.createElement('p');
  mesa.textContent = "Mesa: "
  mesa.classList.add("fw-bold");
  const mesaSpan = document.createElement('span');
  mesaSpan.textContent = cliente.mesa;
  mesaSpan.classList.add("fw-normal");
  mesa.appendChild(mesaSpan);

  // hora
  const hora = document.createElement('p');
  hora.textContent = "Mesa: "
  hora.classList.add("fw-bold");
  const horaSpan = document.createElement('span');
  horaSpan.textContent = cliente.hora;
  horaSpan.classList.add("fw-normal");
  hora.appendChild(horaSpan);

  // titulo de la seccion
  const heading = document.createElement('h3');
  heading.textContent = "Platillos consumidos";
  heading.classList.add("my-4", "text-center");


  // iterar sobre arreglos de pedidos
  const grupo = document.createElement('ul');
  grupo.classList.add('list-group');
  cliente.pedidos.forEach(pedido => {
    const {
      id,
      nombre,
      precio,
      cantidad
    } = pedido;
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    const nombreEl = document.createElement('h4');
    nombreEl.classList.add("my-4");
    nombreEl.textContent = nombre;
    // cantidad del articulo
    const cantidadEl = document.createElement('p');
    cantidadEl.classList.add("fw-bold");
    cantidadEl.textContent = "Cantidad: ";
    // valor de cantidad
    const cantidadValor = document.createElement('span');
    cantidadValor.classList.add("fw-normal");
    cantidadValor.textContent = cantidad;

    cantidadEl.appendChild(cantidadValor)

    // precio del articulo
    const precioEl = document.createElement('p');
    precioEl.classList.add("fw-bold");
    precioEl.textContent = "Precio: ";
    // valor de precio
    const precioValor = document.createElement('span');
    precioValor.classList.add("fw-normal");
    precioValor.textContent = `$${precio}`;

    precioEl.appendChild(precioValor)

    // Subtotal
    const subtotalEl = document.createElement('p');
    subtotalEl.classList.add("fw-bold");
    subtotalEl.textContent = "Subtotal: ";
    // valor de subtotal
    const subtotalValor = document.createElement('span');
    subtotalValor.classList.add("fw-normal");
    // calcular el subtotal por producto
    subtotalValor.textContent = calcularSubtotal(precio, cantidad);

    subtotalEl.appendChild(subtotalValor)

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = "Eliminar producto"
    btnEliminar.classList.add("btn", "btn-danger")
    btnEliminar.onclick = () => {
      eliminarItem(id)
    }

    // agregar elementos a li
    li.append(nombreEl, cantidadEl, precioEl, subtotalEl, btnEliminar)
    // Agregar a html
    grupo.appendChild(li)
  })


  resumen.append(heading, mesa, hora, grupo);

  contenido.appendChild(resumen);
  // formulariol de propinas
  formularioPropinas();

}
const calcularSubtotal = (cantidad, precio) => {
  return `$ ${cantidad * precio}`
}
// Elimina un producto en especifico basado en el id
const eliminarItem = (id) => {
  const productos = cliente.pedidos.filter(pedido => pedido.id != id)
  cliente.pedidos = [...productos]

  const pedido = document.querySelector(`[id="${id}"]`);
  pedido.value = "";


  if (cliente.pedidos.length === 0) {
    mensajePedidoVacio()
    return;
  }

  imprimirPedidos()
}
const formularioPropinas = () => {

  const divPropinas = document.createElement("div")
  const heading = document.createElement('h3');
  divPropinas.classList.add("col-md-6","formulario", "card", "py-5", "px-2", "shadow")

  heading.classList.add('my-4');
  heading.textContent = "Propina"

  // Radio button 10%
  const radio10 = document.createElement("input")
  radio10.classList.add("form-check-input");
  radio10.id = "radio-10";
  radio10.type = "radio";
  radio10.name = "propina"
  radio10.value = "10";

  // const radio10Label
  const radio10Label = document.createElement("label");
  radio10Label.classList.add("form-check-label")
  radio10Label.textContent = "10%";
  radio10Label.htmlFor = radio10.id

  // div radio10 
  const divRaddio10 = document.createElement("div")
  divRaddio10.classList.add("form-check")
  divRaddio10.append(radio10, radio10Label)
  divRaddio10.onclick = calcularPropina

  // Radio button 25%
  const radio25 = document.createElement("input")
  radio25.classList.add("form-check-input");
  radio25.type = "radio";
  radio25.id = "radio-25";

  radio25.name = "propina"
  radio25.value = "25";

  // const radio25Label
  const radio25Label = document.createElement("label");
  radio25Label.classList.add("form-check-label")
  radio25Label.textContent = "25%";
  radio25Label.htmlFor = radio25.id

  // div radio25 
  const divRaddio25 = document.createElement("div")
  divRaddio25.classList.add("form-check")
  divRaddio25.append(radio25, radio25Label)
  divRaddio25.onclick = calcularPropina


  // Radio button 50%
  const radio50 = document.createElement("input")
  radio50.classList.add("form-check-input");
  radio50.type = "radio";
  radio50.name = "propina"
  radio50.id = "radio-50";
  radio50.value = "50";
  // const radio50Label
  const radio50Label = document.createElement("label");
  radio50Label.classList.add("form-check-label")
  radio50Label.textContent = "50%";
  radio50Label.htmlFor = radio50.id

  // div radio50 
  const divRaddio50 = document.createElement("div")
  divRaddio50.classList.add("form-check")
  divRaddio50.append(radio50, radio50Label)
  divRaddio50.onclick = calcularPropina

  divPropinas.append(heading, divRaddio10, divRaddio25, divRaddio50)
  contenido.appendChild(divPropinas)

}
const calcularPropina = (e) => {
  let subTotal = 0;
  const { pedidos } = cliente;
  pedidos.forEach( articulo => {
    subTotal+= articulo.cantidad * articulo.precio
  })
  console.log(subTotal)
  if(e.target.classList.contains("form-check-input")){
    const propina =  (subTotal * parseInt(e.target.value)/100)
    const total = subTotal + propina

    mostrarTotalHtml(subTotal, total, propina)
  }
}

const mostrarTotalHtml = (subTotal, total, propina) => {
  // console.log(subTotal,total, propina)
  const existeValores = document.querySelector(".total-pagar");
  if(existeValores){
   existeValores.remove()
  }
  const valores = document.createElement("div");
  valores.classList.add("total-pagar")
  console.log(valores)
  // Subtotal
  const subTotalParrafo = document.createElement('p');
  subTotalParrafo.classList.add("fs-3", "fw-bold", "mt-5")
  subTotalParrafo.textContent = "Subtotal Consumo: $";
  const subTotalSpan = document.createElement("span");
  subTotalSpan.textContent = subTotal;
  subTotalSpan.classList.add("fw-normal");
  subTotalParrafo.appendChild(subTotalSpan)
  // Propina
  const propinaParrafo = document.createElement('p');
  propinaParrafo.classList.add("fs-3", "fw-bold", "mt-5")
  propinaParrafo.textContent = "Propina Consumo: $";
  const propinaSpan = document.createElement("span")
  propinaSpan.textContent = propina
  propinaSpan.classList.add("fw-normal");
  propinaParrafo.appendChild(propinaSpan)

  // total
  const totalParrafo = document.createElement('p');
  totalParrafo.classList.add("fs-3", "fw-bold", "mt-5")
  totalParrafo.textContent = "Total Consumo: $";
  const totalSpan = document.createElement("span")
  totalSpan.textContent = total;
  totalSpan.classList.add("fw-normal");
  totalParrafo.appendChild(totalSpan)


  valores.append(subTotalParrafo, propinaParrafo, totalParrafo)
  document.querySelector(".formulario").appendChild(valores)

}


const mensajePedidoVacio = () => {
  limpiarHtml(contenido)

  const p = document.createElement('p');
  p.classList.add('text-center');
  p.textContent = "Añade los elemento del pedido";
  contenido.appendChild(p);

}
const limpiarHtml = (campo) => {
  while (campo.firstChild) {
    campo.removeChild(campo.firstChild)
  }
}