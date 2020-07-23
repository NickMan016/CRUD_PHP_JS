var response_box = document.getElementById("response");
var form = document.getElementById("formulario");
var btn_send = document.getElementById("send");
var btn_return = document.getElementById("return");
var code, name, staff, salary;

window.onload = function () {
    var code_employee = localStorage.getItem('code');
    var params = 'code=' + code_employee;

    var peticion = new XMLHttpRequest();
    peticion.open('POST', 'php/server.php?query=readSingle');

    peticion.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    peticion.onload = function () {
        var datos = JSON.parse(peticion.responseText);

        form.name.value = datos.employee.name;
        form.staff.value = datos.employee.staff;
        form.salary.value = datos.employee.salary;
    }

    peticion.send(params);
}

btn_send.addEventListener('click', function (e) {
    e.preventDefault();

    code = localStorage.getItem('code');
    name = form.name.value.trim();
    staff = form.staff.value.trim();
    salary = parseInt(form.salary.value.trim());

    var params = 'code=' + code + '&name=' + name + '&staff=' + staff + '&salary=' + salary;

    var peticion = new XMLHttpRequest();
    peticion.open('POST', 'php/server.php?query=update');

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
                window.location = 'index.html';
            }, 3000);
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
    }

    peticion.send(params);
});

btn_return.addEventListener('click', function () {
    localStorage.removeItem('code');
    window.location = 'index.html';
});