const formulario = document.getElementById('form');
const addUser = document.getElementById('nuevoUsuario');
const inputs = document.querySelectorAll('.inputs');


const expresiones = {

    nombre: /^[ÁÉÍÓÚA-Z][a-záéíóú]+(\s+[ÁÉÍÓÚA-Z]?[a-záéíóú]+)*$/, // Cualquier letra  y espacios y con acentos.
    apellido: /^[ÁÉÍÓÚA-Z][a-záéíóú]+(\s+[ÁÉÍÓÚA-Z]?[a-záéíóú]+)*$/,
    correo: /^[a-z-0-9_.-]+@control.com+$/, // Correo con el dominio fijo ejemplo@control.com;
    telefono: /^\d{9,9}$/, // 0 a 9 numeros : Numero Movil

};

const Form = (e) => {
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

const checkForm = (expresion, input, id) => {
    if (expresion.test(input.value)) {
        document.getElementById(`${id}`).classList.add('correctInput');
        document.getElementById(`${id}`).classList.remove('errorInput');
    } else {
        document.getElementById(`${id}`).classList.add('errorInput');
    }

}


inputs.forEach((input) => {
    input.addEventListener('keyup', Form);
    input.addEventListener('blur', Form);
});



addUser.addEventListener('click', (e) => {
    e.preventDefault();

})