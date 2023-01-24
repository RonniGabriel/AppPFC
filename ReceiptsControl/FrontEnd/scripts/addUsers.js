const formulario = document.getElementById('form');
const addUser = document.getElementById('nuevoUsuario');
const inputs = document.querySelectorAll('.inputs');
const categoria = document.getElementById('categoria');



const expresiones = {

    nombre: /^[ÁÉÍÓÚA-Z][a-záéíóú]+(\s+[ÁÉÍÓÚA-Z]?[a-záéíóú]+)*$/, // Cualquier letra  y espacios y con acentos.
    apellido: /^[ÁÉÍÓÚA-Z][a-záéíóú]+(\s+[ÁÉÍÓÚA-Z]?[a-záéíóú]+)*$/,
    correo: /^[a-z-0-9_.-]+@control.com+$/, // Correo con el dominio fijo ejemplo@control.com;
    telefono: /^\d{9,9}$/, // 0 a 9 numeros : Numero Movil

};

const datas = {
    nombre: false,
    apellidos: false,
    correo: false,
    telefono: false
}

const form = (e) => {
    switch (e.target.name) {
        case "nombre":
            checkForm(expresiones.nombre, e.target, 'nombre');
            break;
        case "apellidos":
            checkForm(expresiones.apellido, e.target, 'apellidos');
            break;
        case "correo":
            checkForm(expresiones.correo, e.target, 'correo');
            break;
        case "telefono":
            checkForm(expresiones.telefono, e.target, 'telefono');
            break;
    }
};

const checkForm = (expresion, input, idInput) => {

    if (expresion.test(input.value)) {

        document.getElementById(`${idInput}`).classList.remove("errorInput");
        document.getElementById(`${idInput}`).classList.add("correctInput");
        datas[`${idInput}`] = true;
    } else {
        document.getElementById(`${idInput}`).classList.add("errorInput");

        datas[`${idInput}`] = false;
    }

}


inputs.forEach((input) => {
    input.addEventListener('keyup', form);
    input.addEventListener('blur', form);
});




/* 
    if (datas.nombre && datas.apellidos && datas.correo && datas.telefono) {
        // Si todo es correcto
        if (document.getElementById('RegistroCorrecto').style.display = "none") {
            document.getElementById('RegistroCorrecto').style.display = "block";
        }
formulario.reset();
    } */