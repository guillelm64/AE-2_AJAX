let URL_DESTINO = 'http://127.0.0.7:5500/AE-2_AJAX/';  
        let recurso = 'datos.json';
        let datos;
        /* Funcion para crear el objeto XMLHttpRequest, configurar el evento onreadystatechange que verifica 
          el estado igual a 4 y el estado HTTP igual a 200. Llamamos las funciones llenarDatos que generan 
          los elementos input de ingredientes y tamaños.
          Por ultimo, solicitud HTTP, abriendo conexión (GET) y enviando solicitud
        */
        function cargarDatosIniciales() {
            
            let xmlHttp = new XMLHttpRequest();
            
            xmlHttp.onreadystatechange = function() {
               
                if (this.readyState == 4 && this.status == 200) {
                    datos = JSON.parse(this.responseText);
                    llenarDatos(document.getElementById('tamanos'), datos.tamanos, datos.precioPizza);
                    llenarDatos(document.getElementById('ingredientes'), datos.ingredientes, datos.precioIngredientes);
                }
            };

            xmlHttp.open('GET', URL_DESTINO + recurso, true);
            xmlHttp.send(null);
        }

        function llenarDatos(contenedor, items, precios) {
            contenedor.innerHTML = ''; 

            items.forEach(function(item, index) {
                let input = document.createElement('input');
                input.type = (contenedor.id == 'tamanos') ? 'radio' : 'checkbox';
                input.name = (contenedor.id == 'tamanos') ? 'tamanos' : 'ingredientes';
                input.value = item;
                
                let label = document.createElement('label');
                label.appendChild(input);
                label.appendChild(document.createTextNode(item));

                contenedor.appendChild(label);
                contenedor.appendChild(document.createElement('br'));
            });
  }
  
        function procesarPedido() {
    
            // Metemos en variable los valores introducidos por input
    
            let nombre = document.getElementById('nombre').value;
            let direccion = document.getElementById('direccion').value;
            let telefono = document.getElementById('telefono').value;
            let email = document.getElementById('email').value;
            let tamanoElegido = document.querySelector('input[name="tamanos"]:checked');
            let ingredientesElegido = document.querySelectorAll('input[name="ingredientes"]:checked');
    
            // Verificar que los datos hayan sido introducidos correctamente 
    
            if (!nombre || !direccion || !telefono || !telefono.match(/[0-9]{9}/) || !email){ 
                alert("Por favor, asegúrese de rellenar todos los datos de contacto correctamente");
                return;
            }
            else if (!email.match(/^[a-zA-Z0-9._-]+@gmail\.com$/) && !email.match(/^[a-zA-Z0-9._-]+@hotmail\.com$/)){
                alert("Por favor, revise el mail proporcionado");
                return;
            }
    
            // Verificar que se haya seleccionado tamaño y al menos un ingrediente
    
            if (!tamanoElegido && ingredientesElegido.length === 0) {
                alert("Por favor, seleccione tamaño de la pizza que desea y al menos 1 ingrediente");
                return;
            }
            else if (!tamanoElegido) {
                alert("Por favor, seleccione el tamaño de la pizza que desea");
                return;
            }
            else if (ingredientesElegido.length === 0) {
                alert("Por favor, seleccione al menos 1 ingrediente para su pizza");
                return;
            }
            
            let tamano = tamanoElegido.value;

            // Obtenemos los ingredientes elegidos
            let ingredientes = Array.from(ingredientesElegido).map(function(ingredienteElegido) {
            return ingredienteElegido.value;
            });

            // Calculamos el precio total sumando tamaños e ingredientes
            let precioTamanos = datos.precioPizza[datos.tamanos.indexOf(tamano)];
           
            let precioIngredientes = ingredientes.reduce(function(total, ingrediente) {
                let ingredienteObj = datos.precioIngredientes.find(obj => obj.hasOwnProperty(ingrediente));
                return total + (ingredienteObj ? ingredienteObj[ingrediente] : 0);
                }, 0);
            
            let precioTotal = precioTamanos + precioIngredientes;

            alert("Precio Total del Pedido: " + precioTotal + "€");
        }

        function refrescar(){
            location.reload();
        }

        window.onload = function() {
        cargarDatosIniciales();
    };