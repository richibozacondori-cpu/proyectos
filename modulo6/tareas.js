// 🎯 Gestor de Tareas - Versión Web
let tareas = [];
let filtroActual = 'all';

// ============= Variables del DOM =============
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const clearBtn = document.getElementById('clearBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

// ============= Cargar tareas desde localStorage =============
function cargarTareas() {
  try {
    const stored = localStorage.getItem('tareas');
    tareas = stored ? JSON.parse(stored) : [];
    console.log('✅ Tareas cargadas:', tareas.length);
  } catch (err) {
    console.error('Error cargando tareas:', err);
    tareas = [];
  }
  renderizarTareas();
}

// ============= Guardar tareas en localStorage =============
function guardarTareas() {
  try {
    localStorage.setItem('tareas', JSON.stringify(tareas));
    console.log('💾 Tareas guardadas');
  } catch (err) {
    console.error('Error guardando tareas:', err);
  }
}

// ============= Agregar nueva tarea =============
function agregarTarea() {
  const texto = taskInput.value.trim();
  
  if (!texto) {
    alert('❌ Por favor, ingresa una tarea');
    return;
  }

  const nuevaTarea = {
    id: Date.now(),
    nombre: texto,
    completada: false,
    fecha_creacion: new Date().toLocaleDateString('es-ES')
  };

  tareas.push(nuevaTarea);
  console.log('✅ Tarea agregada:', nuevaTarea);
  
  taskInput.value = '';
  taskInput.focus();
  guardarTareas();
  renderizarTareas();
}

// ============= Eliminar tarea =============
function eliminarTarea(id) {
  tareas = tareas.filter(t => t.id !== id);
  console.log('🗑️ Tarea eliminada:', id);
  guardarTareas();
  renderizarTareas();
}

// ============= Completar/descompletar tarea =============
function toggleTarea(id) {
  const tarea = tareas.find(t => t.id === id);
  if (tarea) {
    tarea.completada = !tarea.completada;
    console.log('✏️ Tarea actualizada:', tarea);
    guardarTareas();
    renderizarTareas();
  }
}

// ============= Limpiar tareas completadas =============
function limpiarCompletadas() {
  const completadas = tareas.filter(t => t.completada).length;
  
  if (completadas === 0) {
    alert('No hay tareas completadas para eliminar');
    return;
  }

  if (confirm(`¿Eliminar ${completadas} tarea(s) completada(s)?`)) {
    tareas = tareas.filter(t => !t.completada);
    console.log('🧹 Tareas completadas eliminadas');
    guardarTareas();
    renderizarTareas();
  }
}

// ============= Filtrar tareas =============
function filtrarTareas(filtro) {
  filtroActual = filtro;
  
  filterBtns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.filter === filtro) {
      btn.classList.add('active');
    }
  });

  renderizarTareas();
}

// ============= Obtener tareas filtradas =============
function obtenerTareasFiltradas() {
  switch(filtroActual) {
    case 'active':
      return tareas.filter(t => !t.completada);
    case 'completed':
      return tareas.filter(t => t.completada);
    default:
      return tareas;
  }
}

// ============= Renderizar lista =============
function renderizarTareas() {
  const tareasFiltradas = obtenerTareasFiltradas();
  
  // Actualizar contador
  const tareasActivas = tareas.filter(t => !t.completada).length;
  taskCount.textContent = `${tareasActivas} ${tareasActivas === 1 ? 'tarea' : 'tareas'}`;

  // Mostrar lista
  if (tareasFiltradas.length === 0) {
    taskList.innerHTML = '<li class="empty-state">No hay tareas aún. ¡Crea una nueva!</li>';
    return;
  }

  taskList.innerHTML = tareasFiltradas.map(tarea => `
    <li class="task-item ${tarea.completada ? 'completed' : ''}">
      <input 
        type="checkbox" 
        class="task-checkbox" 
        ${tarea.completada ? 'checked' : ''}
        onchange="toggleTarea(${tarea.id})"
      >
      <span class="task-text">${tarea.nombre}</span>
      <span class="task-date">${tarea.fecha_creacion}</span>
      <button class="btn-delete" onclick="eliminarTarea(${tarea.id})">Eliminar</button>
    </li>
  `).join('');
}

// ============= Event Listeners =============
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎉 Gestor de Tareas iniciado');
  
  // Cargar datos
  cargarTareas();

  // Agregar nuevas tareas
  addBtn.addEventListener('click', agregarTarea);
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') agregarTarea();
  });

  // Limpiar completadas
  clearBtn.addEventListener('click', limpiarCompletadas);

  // Filtros
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filtrarTareas(btn.dataset.filter);
    });
  });
});