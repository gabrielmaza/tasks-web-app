// Obtener elementos del DOM para manipular el formulario, el input, la lista de tareas y una plantilla de HTML
const form = document.getElementById("form"); // Formulario donde se ingresa una tarea nueva
const input = document.getElementById("input"); // Input de texto donde se escribe la descripción de la tarea
const taskList = document.getElementById("tasks-list"); // Contenedor donde se muestran las tareas en el HTML
const template = document.getElementById("template").content; // Plantilla para el formato de cada tarea
const fragment = document.createDocumentFragment(); // Fragmento para evitar re-renderizados innecesarios

// Objeto para almacenar las tareas en la memoria
let tasks = {};

// Evento para cargar las tareas guardadas en localStorage al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  // Si hay tareas guardadas en localStorage, las carga en el objeto 'tasks'
  if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks")); // Convierte las tareas guardadas de JSON a objeto
  }

  // Muestra las tareas en la interfaz llamando a la función printTasks()
  printTasks();
});

// Evento para manejar las acciones de los botones en las tareas
taskList.addEventListener("click", (event) => {
  btnAction(event); // Llama a la función para gestionar la acción correspondiente
});

// Evento para manejar el envío del formulario y agregar una nueva tarea
form.addEventListener("submit", (event) => {
  event.preventDefault(); // Evita que la página se recargue
  setTasks(event); // Llama a la función que agrega la tarea
});

// Función para agregar una nueva tarea
const setTasks = (e) => {
  // Valida si el input está vacío (si sí, muestra un mensaje y termina la función)
  if (input.value.trim() === "") {
    console.log("Está vacío...");
    return;
  }

  // Crea un nuevo objeto de tarea con un ID único, el texto y el estado (sin completar)
  const task = {
    id: Date.now(), // Genera un ID único usando la fecha y hora actual
    text: input.value, // Toma el texto del input como descripción de la tarea
    state: false, // Estado de la tarea, inicialmente 'sin completar'
  };

  // Agrega la tarea al objeto 'tasks' usando el ID como clave
  tasks[task.id] = task;

  // Limpia el input y vuelve a enfocar en él para escribir otra tarea si se desea
  form.reset();
  input.focus();

  // Muestra todas las tareas actualizadas
  printTasks();
};

// Función para mostrar todas las tareas en la lista y guardarlas en localStorage
const printTasks = () => {
  // Guarda las tareas en localStorage en formato JSON
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // Si no hay tareas, muestra un mensaje y sale de la función
  if (Object.values(tasks).length === 0) {
    taskList.innerHTML = `
            <div class="alert"><span>No hay tareas pendientes</span></div>
        `;
    return;
  }

  // Limpia la lista antes de agregar las tareas actualizadas
  taskList.innerHTML = "";

  // Recorre todas las tareas en 'tasks' y las muestra en la lista
  Object.values(tasks).forEach((task) => {
    const clone = template.cloneNode(true); // Clona la plantilla para cada tarea

    // Muestra el texto de la tarea en el elemento <p> de la plantilla
    clone.querySelector("p").textContent = task.text;

    // Asigna el ID de cada tarea a los iconos de acción usando el dataset
    clone.querySelector(".task_undo-icon").dataset.id = task.id;
    clone.querySelector(".task_check-icon").dataset.id = task.id;
    clone.querySelector(".task_trash-icon").dataset.id = task.id;

    // Cambia el estilo de la tarea según si está completada o no
    if (task.state) {
      // Tarea completada: cambia color a verde, oculta el ícono de completar y muestra el de deshacer
      clone.querySelector(".task_main").classList.replace("yellow", "green");
      clone
        .querySelector(".task_check-icon")
        .classList.replace("d-block", "d-none");
      clone
        .querySelector(".task_undo-icon")
        .classList.replace("d-none", "d-block");
      clone.querySelector("p").classList.add("line-through"); // Agrega línea de tachado
    } else {
      // Tarea sin completar: cambia color a amarillo, muestra el ícono de completar y oculta el de deshacer
      clone.querySelector(".task_main").classList.replace("green", "yellow");
      clone
        .querySelector(".task_check-icon")
        .classList.replace("d-none", "d-block");
      clone
        .querySelector(".task_undo-icon")
        .classList.replace("d-block", "d-none");
    }

    // Agrega la tarea clonada al fragmento
    fragment.appendChild(clone);
  });

  // Agrega todas las tareas del fragmento a la lista en el DOM
  taskList.appendChild(fragment);
};

// Función para manejar las acciones de los botones en cada tarea (completar, deshacer, eliminar)
const btnAction = (e) => {
  // Completar tarea
  if (e.target.classList.contains("task_check-icon")) {
    tasks[e.target.dataset.id].state = true; // Cambia el estado a completado
    printTasks(); // Actualiza la lista de tareas
  }

  // Deshacer tarea
  if (e.target.classList.contains("task_undo-icon")) {
    tasks[e.target.dataset.id].state = false; // Cambia el estado a no completado
    printTasks(); // Actualiza la lista de tareas
  }

  // Eliminar tarea
  if (e.target.classList.contains("task_trash-icon")) {
    delete tasks[e.target.dataset.id]; // Borra la tarea del objeto 'tasks'
    printTasks(); // Actualiza la lista de tareas
  }

  // Detiene la propagación del evento para evitar problemas con otros elementos del DOM
  e.stopPropagation();
};
