var TEXT_ID_SIZE = 15;

window.onload = function() {
    var saveBtn = document.getElementById("save-btn");
    var editor = document.getElementById("editor");
    try {
        var hamburger = document.getElementById("hamburger");
        hamburger.addEventListener("click", function(){
            document.querySelector("body").classList.toggle("active");
        })
    } catch (error) {
        console.log(error)
    }


    (() => {
        // check if we have any saved state or initiate empty state
        let textIds = get('ITEMS');
        if (textIds) {
            for (const id of textIds) {
                addToSidebad(id);
            }
        }
    
        // save
        saveBtn.onclick = function () {
            let text = editor.value;
            if (text) {
                let textId = text.substring(0, TEXT_ID_SIZE);
                textId = textId.replace(/ /g,"_");
                addToSavedItemList(textId);
                saveItem(textId, text);
                addToSidebad(textId);
                editor.value = '';
            }
        }

    })();
}

function addToSidebad(text) {
    var ul = document.getElementById("saved-items");
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.setAttribute('id', text);
    a.appendChild(document.createTextNode(text.replace(/_/g," ")));
    li.addEventListener('click', updateEditorContent);
    li.addEventListener('dblclick', deleteFromList);
    li.appendChild(a);
    ul.prepend(li);
}

function deleteFromList(el) {
    let textId = el.srcElement.id;
    removeItem(textId);
    console.log(el.srcElement.parentNode)
    el.srcElement.parentNode.remove();
}

function updateEditorContent(el) {
    let textId = el.srcElement.id;
    editor.value = getItem(textId);
}

function getSavedItemList() {
    const items = get('ITEMS');
    return items;
}

function addToSavedItemList(textId) {

    let items = get('ITEMS');
    if (items) {
        items.push(textId);
    } else {
        items = [textId];
    }
    set('ITEMS', items);
}

function getItem(id) {
    return get('ITEMS/'+ id);
}

function saveItem(id, data) {
    set('ITEMS/'+ id, data);
}

function removeItem(id) {
    remove(id);
    let items = get('ITEMS');
    if (items) {
        items = items.filter((item) => item !== id);
        set('ITEMS', items);
    }
}

function get(key) {
    const data = localStorage.getItem(key);
    if (data) {
        return JSON.parse(data);
    }
    return null;
}

function set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function remove(key) {
    localStorage.removeItem(key);
}