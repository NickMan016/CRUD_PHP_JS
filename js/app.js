var input_search = document.getElementById("search");
var table = document.getElementById("table");
var response_table_box = document.getElementById("response_table");
var response_box = document.getElementById("response");

document.onload = read("");

function read(query) {
    if (query !== "") {
        var query = "filter=" + query;
    }
    else{
        var query = "filter=";
    }

    var peticion = new XMLHttpRequest();
    peticion.open('POST', 'php/server.php?query=read');
    
    peticion.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    peticion.onload = function () {
        var datos = JSON.parse(peticion.responseText);
        
        if (datos.error === true) {
            response_table_box.classList.add('active');
            response_table_box.classList.add('error');
            response_table_box.innerHTML = datos.message;

            table.innerHTML = '';
        }else{
            response_table_box.classList.remove('active');
            response_table_box.classList.remove('error');
            response_table_box.innerHTML = '';
            
            table.innerHTML = '<thead><th>Código</th><th>Nombre</th><th>Puesto</th><th>Salario</th><th>Acciones</th></thead>';
            const table_body = document.createElement('tbody');
            for (let i = 0; i < datos.employees.length; i++) {
                const elemento = document.createElement('tr');
                elemento.innerHTML += ('<td>' + datos.employees[i].code + '</td>');
                elemento.innerHTML += ('<td>' + datos.employees[i].name + '</td>');
                elemento.innerHTML += ('<td>' + datos.employees[i].staff + '</td>');
                elemento.innerHTML += ('<td>$' + datos.employees[i].salary + '</td>');
                elemento.innerHTML += ('<td class="btns-table"><button onClick=\"edit(' + datos.employees[i].code + ')\"><i class="fas fa-pen"></i></button><button onClick=\"delet(' + datos.employees[i].code + ')\"><i class="fas fa-trash-alt"></i></button></td>');
                table_body.appendChild(elemento);
            }
            table.appendChild(table_body);
        }
    }

    peticion.send(query);
}

input_search.addEventListener('keyup', function () {
    var query = input_search.value.trim();
    read(query);
});

function delet(code) {
    var params = 'code=' + code;

    var peticion = new XMLHttpRequest();
    peticion.open('POST', 'php/server.php?query=delete');

    peticion.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    peticion.onload = function () {
        var response = JSON.parse(peticion.responseText);

        if (response.error === false) {
            response_box.classList.add('active');
            response_box.classList.add('success');
            response_box.innerHTML = response.message;
            setTimeout(function () {
                response_box.classList.remove('active');
                response_box.classList.remove('success');
                response_box.innerHTML = '';
            }, 5000);
        } else {
            response_box.classList.add('active');
            response_box.classList.add('error');
            response_box.innerHTML = response.message;
            setTimeout(function () {
                response_box.classList.remove('active');
                response_box.classList.remove('error');
                response_box.innerHTML = '';
            }, 5000);
        }

        read('');
    }

    peticion.send(params);
}

function edit(code) {
    localStorage.setItem('code', code);
    window.location = "edit.html";
}