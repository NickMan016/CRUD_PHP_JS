<?php

error_reporting(0);
header('Content-Type: application/json; charset: utf-8');

function connection(){
    $conexion = new mysqli('localhost', 'root', '', 'crud_php');
    $conexion->set_charset('utf8');
    if ($conexion->connect_errno) {
        die("Hubo un error al conectar");
    }else{
        return $conexion;
    }
}

function create($conexion){
    $code = $_POST['code'];
    $name = $_POST['name'];
    $staff = $_POST['staff'];
    $salary = $_POST['salary'];

    $statement = $conexion->prepare("INSERT INTO employees (code, name, staff, salary) VALUES (?, ?, ?, ?)");
    $statement->bind_param('sssi', $code, $name, $staff, $salary);
    $statement->execute();

    if ($conexion->affected_rows >= 1) {
        return [
            "error" => false,
            "message" => "Acción realizada con éxito"
        ];
    }else{
        return [
            "error" => true,
            "message" => "Error al realizar esta acción"
        ];
    }
}

function read($conexion){
    $query = "SELECT * FROM employees ORDER BY code DESC";

    if (isset($_POST['filter']) || $_POST['filter'] !== "") {
        $q = $_POST['filter'];

        $query = "SELECT code, name, staff, salary FROM employees WHERE code LIKE '%" . $q . "%' OR name LIKE '%" . $q . "%' OR staff LIKE '%" . $q . "%' OR salary LIKE '%" . $q . "%' ORDER BY code DESC";
    }

    $data = $conexion->query($query);

    if ($data->num_rows > 0) {
        $response = [];
        while ($fila = $data->fetch_assoc()) {
            $employee = [
                'code' => $fila['code'],
                'name' => $fila['name'],
                'staff' => $fila['staff'],
                'salary' => $fila['salary']
            ];
            array_push($response, $employee);
        }
        return [
            "error" => false,
            "employees" => $response
        ];
    }else{
        return [
            "error" => true,
            "message" => "No hay resultados"
        ];
    }
}

function readSingle($conexion){
    $code = $_POST['code'];

    $statement = $conexion->prepare("SELECT name, staff, salary FROM employees WHERE code = ?");
    $statement->bind_param('s', $code);
    $statement->execute();
    $response = $statement->get_result();

    if ($response->num_rows > 0) {

        return [
            "error" => false,
            "employee" => $response->fetch_array()
        ];
    }else{
        return [
            "error" => true,
            "message" => "No existe el empleado"
        ];
    }
}

function update($conexion){
    $code = $_POST['code'];
    $name = $_POST['name'];
    $staff = $_POST['staff'];
    $salary = $_POST['salary'];

    $statement = $conexion->prepare("UPDATE employees SET name = ?, staff = ?, salary = ? WHERE code = ?");
    $statement->bind_param('ssis', $name, $staff, $salary, $code);
    $statement->execute();

    if ($conexion->affected_rows >= 1) {
        return [
            "error" => false,
            "message" => "Acción realizada con éxito"
        ];
    }else{
        return [
            "error" => true,
            "message" => "Error al realizar esta acción"
        ];
    }
}

function delete($conexion){
    $code = $_POST['code'];

    $statement = $conexion->prepare("DELETE FROM employees WHERE code = ?");
    $statement->bind_param('s', $code);
    $statement->execute();

    if ($conexion->affected_rows >= 1) {
        return [
            "error" => false,
            "message" => "Acción realizada con éxito"
        ];
    }else{
        return [
            "error" => true,
            "message" => "Error al realizar esta acción"
        ];
    }
}

$conexion = connection();

if ($_GET['query'] === "create") {
    echo json_encode(create($conexion));
}
elseif ($_GET['query'] === "read") {
    echo json_encode(read($conexion));
} 
elseif ($_GET['query'] === "delete") {
    echo json_encode(delete($conexion));
}
elseif ($_GET['query'] === "readSingle"){
    echo json_encode(readSingle($conexion));
}
elseif ($_GET['query'] === "update"){
    echo json_encode(update($conexion));
}