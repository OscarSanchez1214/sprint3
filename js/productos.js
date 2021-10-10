const url = "http://localhost:8080/InventarioApp/webresources/producto/";
const contenedor = document.querySelector('tbody')
let resultados = ''


/*const modalClientes = new bootstrap.Modal(document.getElementById('modalCliente'))*/
const formProducto = document.querySelector('form')
const idProducto = document.getElementById('idProducto')
const codigo = document.getElementById('codigo')
const nombre = document.getElementById('nombre')
const descripcion = document.getElementById('descripcion')
const categoria = document.getElementById('categoria')
const unidadDeMedida = document.getElementById('unidadDeMedida')
const costo = document.getElementById('costo')
const habilitado = document.getElementById('habilitado')
const RowInsert = document.getElementById('row01')

let opcion = ''

btnCrear.addEventListener('click', () => {
    RowInsert.style.visibility = 'visible'
    RowInsert.style.display = 'block'
    idProducto.value = ''
    codigo.value = ''
    nombre.value = ''
    descripcion.value = ''
    categoria.value = ''
    unidadDeMedida.value = ''
    costo.value = ''
    habilitado.value = ''    
    //modalClientes.show()
    opcion = 'crear'
})


const ajax = (options) => {
    let { url, method, success, error, data } = options;    
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", (e) => {
        if (xhr.readyState !== 4) return;

        if (xhr.status >= 200 && xhr.status < 300) {
            let json = JSON.parse(xhr.responseText);
            success(json);
        } else {
            let message = xhr.statusText || "Ocurrió un error";
            error(`Error ${xhr.status}: ${message}`);
        }
    });

    xhr.open(method || "GET", url);
    xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
    xhr.send(JSON.stringify(data));
};



const getAll = () => {
    ajax({
        url: url+ "listar",
        crossDomain: true,        
        success: (res) => {
            console.log(res);

            res.forEach((producto) => {
                resultados += `<tr>
                        <td>${producto.idProducto}</td>
                        <td>${producto.codigo}</td>
                        <td>${producto.nombre}</td>
                        <td>${producto.descripcion}</td>
                        <td>${producto.idCategoria.descripcion}</td>
                        <td>${producto.idUnidadDeMedida.nombre}</td>
                        <td>${producto.costo}</td>
                        <td>${producto.habilitado}</td>  
                        <td><button type="button" class="btnEditar btn btn-rounded btn-warning">Upd</button> <button type="button" class="btnBorrar btn btn-rounded btn-danger">Del</button>
                    </tr>`
            });

            contenedor.innerHTML = resultados
        },
        error: (err) => {
            console.log(err);
           //$table.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`);
        },
    });
};

document.addEventListener("DOMContentLoaded", getAll);

document.addEventListener("click", (e) => {

    if (e.target.matches(".btnBorrar")) {
        const fila = e.target.parentNode.parentNode
        const id = fila.firstElementChild.innerHTML
        console.log(id)
        alertify.confirm(`¿Estás seguro de eliminar el id ${id}?`,
            function () {
                ajax({
                    url: url + "/" + id,
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        "Access-Control-Allow-Headers" : "Content-Type",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                    },
                    success: (res) => location.reload(),
                    error: (err) => alert(err),
                });
                alertify.success('Registro eliminado')
            },
            function () {
                alertify.error('Cancel')
            });



    }
    if (e.target.matches(".btnEditar")) {
        const fila = e.target.parentNode.parentNode
        idCliente.value = fila.children[0].innerHTML
        nombreCliente.value = fila.children[1].innerHTML
        direccionCliente.value = fila.children[2].innerHTML
        telefonoCliente.value = fila.children[3].innerHTML
        ciudadCliente.value = fila.children[4].innerHTML
        idCliente.disabled = true
        opcion = 'editar'
        modalClientes.show()
    }
})


formProducto.addEventListener('submit', (e) => {
    e.preventDefault()
    let metodo = "POST"
    if (opcion == 'editar') {
        metodo = "PUT"

    }
    let url2 = "insertar"
    if (opcion == 'editar') {
        url2 = "modificar"

    }
    ajax({
        url: url + url2 ,
        method: metodo,
        headers: {
            'Content-Type': 'application/json'
        },
        success: (res) => location.reload(),
        error: (err) =>
            $form.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`),
        data: {            
            "idProducto":idProducto.value,
            "codigo":codigo.value,
            "nombre":nombre.value,
            "descripcion":descripcion.value,
            "idCategoria":categoria.value,
            "idUnidadDeMedida":unidadDeMedida.value,
            "costo":costo.value,
            "habilitado":habilitado.value
        },
    });
    modalClientes.hide()
})
