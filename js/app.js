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
    row.classList.add('row', "py-3", "border-top");
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
  resumen.classList.add('col-md-6');
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


  resumen.append(mesa, hora, heading, grupo);
  contenido.appendChild(resumen);


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