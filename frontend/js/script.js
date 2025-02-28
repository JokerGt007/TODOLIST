const tbody = document.querySelector('tbody');
const addForm = document.querySelector('.add-form');
const inputTask = document.querySelector('.input-task');

const fetchTasks = async () => {
    const res = await fetch('http://localhost:3333/tasks')
    const tasks = await res.json()
    return tasks;
}

const addTask = async (event) => {
    event.preventDefault();

    const task = { title: inputTask.value };

    await fetch('http://localhost:3333/tasks', {
        method: 'post', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
    });

    loadTasks();
    inputTask.value = '';
}

const deleteTask = async (id) => {
    await fetch(`http://localhost:3333/tasks/${id}`, {
        method: 'delete',
    })

    loadTasks();
} 

const updateTask = async ({ id, title, status }) => {

    await fetch(`http://localhost:3333/tasks/${id}`, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({title, status}),
    })

    loadTasks();

}


const formatDate = (dateUTC) => {
    const options = { dateStyle: 'long', timeStyle: 'short' };
    const date = new Date(dateUTC).toLocaleString('pt-br', options);
    return date;
}

const createElement = (tag, innerText = '', innerHTML = '') => {
    const element = document.createElement(tag);

    if (innerText) {
        element.innerText = innerText;  
    }

    if (innerHTML) { 
        element.innerHTML = innerHTML;
    }

    return element;
}

const createSelect = (value) => {
    const options = `
        <option value="Pendente">Pendente</option>
        <option value="Em Andamento">Em Andamento</option>
        <option value="Concluída">Concluída</option>
    `; 

    const select = createElement('select', '', options);
    
    select.value = value;

    return select;
}


const createRow = (task) => {

    const { id, title, created_at, status } = task;

    const tr = createElement('tr');
    const tdTitle = createElement('td', title);
    const tdCreatedAt = createElement('td', formatDate(created_at));
    const tdStatus = createElement('td');
    const tdActions = createElement('td');

    const select = createSelect(status);

    select.addEventListener('change', ({ target }) => updateTask({ ...task, status: target.value }));

    const editButton = createElement('button', '', '<span class="material-symbols-outlined">edit</span>');
    const deleteButton = createElement('button', '', '<span class="material-symbols-outlined"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></span>');

    const editForm = createElement('form');
    const editInput = createElement('input');

    editInput.value = title;
    editForm.appendChild(editInput);

    editForm.addEventListener('submit', (event) => {
        event.preventDefault();

        updateTask({ id, title: editInput.value, status });
    });

    editButton.addEventListener('click', () => {
        tdTitle.innerText = '';
        tdTitle.appendChild(editForm);
    });

    editButton.classList.add('btn-action');
    deleteButton.classList.add('btn-action');

    deleteButton.addEventListener('click', () => deleteTask(id));

    tdStatus.appendChild(select);

    tdActions.appendChild(editButton);
    tdActions.appendChild(deleteButton);

    tr.appendChild(tdTitle);
    tr.appendChild(tdCreatedAt);
    tr.appendChild(tdStatus);
    tr.appendChild(tdActions);

    return tr;
}

const loadTasks = async () => {
    const tasks = await fetchTasks();

    tbody.innerHTML = '';

    tasks.forEach((task) => {
        const tr = createRow(task);
        tbody.appendChild(tr);
    });
}

addForm.addEventListener('submit', addTask);

loadTasks();