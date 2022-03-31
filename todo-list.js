// Selectors for new liste
const newListe = document.querySelector('[data-new-liste]');
const newListeInput = document.querySelector('[data-new-liste-input]');

// Selector for listes container
const listesContainer = document.querySelector('[data-listes]');

// Selector for new tâche form
const newTâcheForm = document.querySelector('[data-new-tâche-form]');
const newTâcheSelect = document.querySelector('[data-new-tâche-select]');
const newTâcheInput = document.querySelector('[data-new-tâche-input]');

// Selector for edit tâche form
const editTâcheForm = document.querySelector('[data-edit-tâche-form]');
const editTâcheSelect = document.querySelector('[data-edit-tâche-select]');
const editTâcheInput = document.querySelector('[data-edit-tâche-input]');


// Selector for tâches container
const tâchesContainer = document.querySelector('[data-notes]');

// Selector for currently viewing
const currentlyViewing = document.querySelector('[data-currently-viewing]');


// Local storage keys
const LOCAL_STORAGE_LISTES_KEY = 'LOCAL_STORAGE_LISTES_KEY';
const LOCAL_STORAGE_TÂCHES_KEY = 'LOCAL_STORAGE_TÂCHES_KEY';
const LOCAL_STORAGE_SELECTED_LISTE_ID_KEY = 'LOCAL_STORAGE_SELECTED_LISTE_ID_KEY';

// DATA 
let listes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LISTES_KEY)) || [];
let tâches = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TÂCHES_KEY)) || [];
let selectedListeId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LISTE_ID_KEY);


// EVENT: Add Liste
newListe.addEventListener('submit', (e) => {
    e.preventDefault();

    const liste = newListeInput.value;
    const isListeEmpty = !liste || !liste.trim().length;

    if (isListeEmpty) {
        return console.log('Veuillez entrer une tâche');
    }

    listes.push({ _id: Date.now().toString(), liste: liste, color: getRandomHexColor() });

    newListeInput.value = '';

    saveAndRender();
});

// EVENT: Add tâche
newTâcheForm.addEventListener('submit', (e) => {
    e.preventDefault();
    tâches.push({
        _id: Date.now().toString(),
        listeId: newTâcheSelect.value,
        tâche: newTâcheInput.value,
    });

    newTâcheSelect.value = '';
    newTâcheInput.value = '';

    saveAndRender();
});

// Event : Edit tâche
let tâcheToEdit = null;
editTâcheForm.addEventListener('submit',(e) => {
    e.preventDefault();

    tâcheToEdit.listeId = editTâcheSelect.value;
    tâcheToEdit.tâche = editTâcheInput.value;

    editTâcheForm.style.display = 'none';
    newTâcheForm.style.display = 'flex';

    editTâcheSelect.value = '';
    editTâcheInput.value = '';

    saveAndRender();

})

tâchesContainer.addEventListener('click', (e) => {

    if (e.target.classList[1] === 'fa-pen-to-square') {
        newTâcheForm.style.display = 'none';
        editTâcheForm.style.display = 'flex';

        tâcheToEdit = tâches.find((tâche) => tâche._id === e.target.dataset.editTâche);

        editTâcheSelect.value = tâcheToEdit.listeId;
        editTâcheInput.value = tâcheToEdit.tâche;
    }


    //const tâcheToCheck = tâches.find((tâche) => tâche._id === e.target.dataset.checkTâche);
       // e.target.classList.toggle(tâcheToCheck, 1);
 
    //}
   

    if (e.target.classList[1] === 'fa-trash-can') {
        const tâcheToDeleteIndex = tâches.findIndex((tâche) => tâche._id === e.target.dataset.deleteTâche);
        
        tâches.splice(tâcheToDeleteIndex, 1);
        

        saveAndRender();
    }
   
});

// EVENT: Get Selected liste Id
listesContainer.addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() == 'li') {
        selectedListeId = !e.target.dataset.listesId ? null : e.target.dataset.listesId;
        saveAndRender();
    }

    
});

// EVENT: Get Selected Liste Color
listesContainer.addEventListener('change', (e) => {
    if (e.target.tagName.toLowerCase() === 'input') {
        const newListeColor = e.target.value;
        const listeId = e.target.parentElement.dataset.listesId;
        const listeToEdit = listes.find((liste) => liste._id === listeId);

        listeToEdit.color = newListeColor;

        saveAndRender();
    }
});

// EVENT: Supprimer Selected Liste
currentlyViewing.addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() === 'span') {
        listes = listes.filter((liste) => liste._id !== selectedListeId);

        tâches = tâches.filter((tâche) => tâche.listeId !== selectedListeId);

        selectedListeId = null;

        saveAndRender();
    }
});

   
// *==================== Functions ====================

function saveAndRender() {
    save();
    render();
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_LISTES_KEY, JSON.stringify(listes));
    localStorage.setItem(LOCAL_STORAGE_TÂCHES_KEY, JSON.stringify(tâches));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LISTE_ID_KEY, selectedListeId); 

}

function render(){
    clearChildElements(listesContainer);
    clearChildElements(newTâcheSelect);
    clearChildElements(editTâcheSelect);
    clearChildElements(tâchesContainer);
   
    
    renderListes();
    renderFormOption();
    renderTâches();

    // Set the current viewing liste
    if (!selectedListeId || selectedListeId == 'null') {
        currentlyViewing.innerHTML = `Vous consultez la liste de <strong>vos tâches</strong>`;
    } else {
        const currentListe = listes.find((liste) => liste._id == selectedListeId);
        currentlyViewing.innerHTML = `Vous consultez la liste  <strong>${currentListe.liste}</strong> <span>(Supprimer)</span>`;
    }

}

    
function renderListes() {
    listesContainer.innerHTML += `<li class="menu-item ${selectedListeId === 'null' || selectedListeId === null ? 'active' : '' }" data-liste-id =""> Ma liste</li>`;
    listes.forEach(({ _id, liste, color }) => {
        listesContainer.innerHTML += ` <li class="menu-item ${_id === selectedListeId ? 'active' : ''}" data-listes-id=${_id}>${liste}<input class="menu-color" type="color" value=${color}></li>`;
 
    });
}

// cette fonction va nous permettre de selectionner un élément parmis la liste de tâche
function renderFormOption(){
    newTâcheSelect.innerHTML += `<option value=""> Ma liste </option>`;
    editTâcheSelect.innerHTML += `<option value=""> Ma liste </option>`;

    listes.forEach(({ _id, liste }) =>{
        newTâcheSelect.innerHTML += `<option value=${_id}> ${liste} </option>`;
        editTâcheSelect.innerHTML += `<option value=${_id}> ${liste} </option>`;
    });

}

function renderTâches(){
    let tâchesToRender = tâches;

    if (selectedListeId && selectedListeId !== 'null') {
        tâchesToRender = tâches.filter((tâche) => tâche.listeId === selectedListeId);
    }

    tâchesToRender.forEach(({ _id, listeId, tâche}) => {
        const { color, liste} =listes.find(({ _id}) => _id === listeId);
        const backgroundColor=  convertHexToRGBA(color,30) 
        tâchesContainer.innerHTML += 
        ` <div class="tâche" style="border-color: ${color};">
            <div class="tâche-tag" style="background-color: ${backgroundColor}; color: ${color}">
                ${liste}
            </div>
            <p class="tâche-description">${tâche}</p>
            <div class="tâche-actions">
                <i class="fa-solid fa-pen-to-square" data-edit-tâche=${_id}></i>
                <i class="fa-solid fa-circle-check" data-check-tâche=${_id}></i>
                <i class="fa-solid fa-trash-can" data-delete-tâche=${_id}></i>
            </div>
        </div> `
    })
}

// AIDES

function clearChildElements(element){
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function convertHexToRGBA(hexCode, opacity) {
    let hex = hexCode.replace('#', '');

    if (hex.length === 3) {
        hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r},${g},${b},${opacity / 100})`;
}


function getRandomHexColor() {
    var hex = (Math.round(Math.random() * 0xffffff)).toString(16);
    while (hex.length < 6) hex = "0" + hex;
    return `#${hex}`;
}

window.addEventListener('load', render);

