var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var dataBase = null;

/* Inicializamos la base de datos */
function iniciarDB() {
  dataBase = indexedDB.open("object", 1);

  dataBase.onupgradeneeded = function (e) {
    active = dataBase.result;
    object = active.createObjectStore("people", { keyPath: 'id', autoIncrement: true });
    object.createIndex('por_nombre', 'nombre', { unique: false });
    object.createIndex('por_dni', 'dni', { unique: true });
  }

  dataBase.onsuccess = function (e) {
    alert('La base de datos ha sido cargada correctamente');
    leerTodos();
  }

  dataBase.onerror = function (e) {
    alert('Error en la carga de la base de datos');
  }
}

function anadir() {
  var active = dataBase.result;
}

window.addEventListener('load', iniciarDB, false);

var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var dataBase = null;

/* Inicializamos la base de datos */
function iniciarDB() {
  dataBase = indexedDB.open("object", 1);

  dataBase.onupgradeneeded = function (e) {
    active = dataBase.result;
    object = active.createObjectStore("people", { keyPath: 'id', autoIncrement: true });
    object.createIndex('por_nombre', 'nombre', { unique: false });
    object.createIndex('por_dni', 'dni', { unique: true });
  }

  dataBase.onsuccess = function (e) {
    alert('La base de datos ha sido cargada correctamente');
    leerTodos();
  }

  dataBase.onerror = function (e) {
    alert('Error en la carga de la base de datos');
  }
}

function anadir() {
  var active = dataBase.result;
  var data = active.transaction(["people"], "readwrite");
  var object = data.objectStore("people");

  var request = object.put({
    dni: document.querySelector("#dni").value,
    nombre: document.querySelector("#nombre").value,
    apellidos: document.querySelector("#apellidos").value
  });

  request.onerror = function (e) {
    alert(request.error.name + '\n\n' + request.error.message);
  };

  data.oncomplete = function (e) {
    document.querySelector("#dni").value = '';
    document.querySelector("#nombre").value = '';
    document.querySelector("#apellidos").value = '';
    alert('Objeto insertado correctamente');
    leerTodos();
  }
}

function leerTodos() {
  var active = dataBase.result;
  var data = active.transaction(["people"], "readonly");
  var object = data.objectStore("people");
  var elements = [];

  object.openCursor().onsuccess = function (e) {
    var result = e.target.result;
    if (result === null) {
      return;
    }
    elements.push(result.value);
    result.continue();
  }

  data.oncomplete = function () {
    var outerHTML = '';
    for (var key in elements) {
      outerHTML += '\n\
      <tr>\n\
      <td id="dni">' + elements[key].dni + '</td>\n\
      <td id="nombre">' + elements[key].nombre + '</td>\n\
      <td id="apellidos">' + elements[key].apellidos + '</td>\n\
      <td>\n\
	  <button type="button" onclick="leer(' + elements[key].id + ')">Detalles</button>\n\
	  <button type="button" onclick="baja(' + elements[key].id + ')">Baja</button>\n\
	  <button type="button" onclick="modificar(' + elements[key].id + ')">Modificar</button>\n\
      <button type="button" onclick="leerPorDni(\'' + elements[key].dni + '\')">Detalle por DNI</button>\n\
      </td>\n\
      </tr>';
    }
    elements = [];
    document.querySelector("#elementsList").innerHTML = outerHTML;

  }
}

function leer(id) {
  var active = dataBase.result;
  var data = active.transaction(["people"], "readonly");
  var object = data.objectStore("people");

  var request = object.get(parseInt(id));
  request.onsuccess = function () {
    var result = request.result;
    if (result !== undefined) {
      alert("ID: " + result.id + "\n\
      DNI " + result.dni + "\n\
      Nombre: " + result.nombre + "\n\
      Apellidos: " + result.apellidos);
    }
  }
}

function leerPorDni(dni) {
  var active = dataBase.result;
  var data = active.transaction(["people"], "readonly");
  var object = data.objectStore("people");

  var index = object.index("por_dni");
  var request = index.get(String(dni));

  request.onsuccess = function () {
    var result = request.result;
    if (result !== undefined) {
      alert("ID: " + result.id + "\n\
      DNI " + result.dni + "\n\
      Nombre: " + result.nombre + "\n\
      Apellidos: " + result.apellidos);
    }
  }
}

function leerTodosPorNombre() {
  var active = dataBase.result;
  var data = active.transaction(["people"], "readonly");
  var object = data.objectStore("people");

  var index = object.index("por_nombre");
  var elements = [];

  index.openCursor().onsuccess = function (e) {
    var result = e.target.result;
    if (result === null) {
      return;
    }
    elements.push(result.value);
    result.continue();

  }
  data.oncomplete = function () {
    var outerHTML = '';
    for (var key in elements) {
      outerHTML += '\n\
      <tr>\n\
        <td>' + elements[key].dni + '</td>\n\
        <td>' + elements[key].nombre + '</td>\n\
        <td>\n\
          <button type="button" onclick="leer(' + elements[key].id + ')">Detalles</button>\n\
	  <button type="button" onclick="baja(' + elements[key].id + ')">Baja</button>\n\
	  <button type="button" onclick="modificar(' + elements[key].id + ')">Modificar</button>\n\
          <button type="button" onclick="leerPorDni(\'' + elements[key].dni + '\')">Detalle por DNI</button>\n\
        </td>\n\
      </tr>';
    }
    elements = [];
    document.querySelector("#elementsList").innerHTML = outerHTML;
  }
}

function baja(id){
  var active = dataBase.result;
  var data = active.transaction(["people"],"readwrite");
  var object = data.objectStore("people");
  if(confirm("¿estás seguro que desea eliminar el elemento?")){
    var request = object.delete(parseInt(id));
    leerTodos();
  }
  
  leerTodos();
}

function modificar(id){
  var active = dataBase.result;
  var data= active.transaction(["people"], "readonly");
  var object = data.objectStore("people");

  var request = object.get(parseInt(id));
  request.onsuccess = function(){
    var result = request.result;
    if(result !== undefined){
      document.getElementById("id_modi").value=result.id;
      document.getElementById("dni_modi").value=result.dni;
      document.getElementById("nombre_modi").value=result.nombre;
      document.getElementById("apellidos_modi").value=result.apellidos;

    }
  }
}

function actualizar(){
  var active = dataBase.result;
  var data = active.transaction(["people"],"readwrite");
  var object = data.objectStore("people");

  var request = object.put({
    dni: document.querySelector("#dni_modi").value,
    nombre: document.querySelector("#nombre_modi").value,
    apellidos: document.querySelector("#apellidos_modi").value,
    id: parseInt(document.querySelector("#id_modi").value)
  });

  request.onerror = function(e){
    alert(request.error.name + '\n\n' + request.error.message);
  }

  data.oncomplete = function(e){
    document.querySelector("#id_modi").value = '';
    document.querySelector("#dni_modi").value = '';
    document.querySelector("#nombre_modi").value = '';
    document.querySelector("#apellidos_modi").value = '';
    alert('Objeto modificado correctamente');
    leerTodos();
  }
}


window.addEventListener('load', iniciarDB, false);





