var response_box = document.getElementById("response");
var form = document.getElementById("formulario");
var btn_send = document.getElementById("send");
var code, name, staff, salary;

btn_send.addEventListener('click', function (e) {
    e.preventDefault();

    var peticion = new XMLHttpRequest();
    peticion.open('POST', 'php/server.php?query=create');
    
    peticion.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    code = form.code.value.trim();
    name = form.name.value.trim();
    staff = form.staff.value.trim();
    salary = parseInt(form.salary.value.trim());

    var params = 'code=' + code + '&name=' + name + '&staff=' + staff + '&salary=' + salary;

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
    }

    peticion.send(params);
});