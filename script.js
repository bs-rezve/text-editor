var TEXT_ID_SIZE = 15;

window.onload = function() {
    var saveBtn = document.getElementById("save-btn");
    var editor = document.getElementById("editor");
    var wordCount = document.getElementById("word-count");
    var charCount = document.getElementById("char-count");

    // count word & character
    editor.addEventListener('keyup', function(ev) {
        wordCount.textContent = getWordCount(editor.value);
        charCount.textContent = editor.value.length;
    })

    // save & remember sidebar's initial state
    let isActiveSidebar = get('IS_ACTIVE_SIDEBAR');
    if (isActiveSidebar == null) {
        set('IS_ACTIVE_SIDEBAR', true);
        isActiveSidebar = true;
    }
    if (!isActiveSidebar) {
        setTimeout(()=> {
            document.querySelector("body").classList.toggle("active");
        }, 1000)
    }
    
    // sidebar event handler
    try {
        var hamburger = document.getElementById("hamburger");
        hamburger.addEventListener("click", function(){
            document.querySelector("body").classList.toggle("active");
            isActiveSidebar = set('IS_ACTIVE_SIDEBAR', !isActiveSidebar);
        })
    } catch (error) {
        console.log(error)
    }

    // editor content saving
    (() => {
        // check if we have any saved state or initiate empty state
        let textIds = get('ITEMS');
        if (textIds) {
            for (const id of textIds) {
                addToSidebar(id);
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
                addToSidebar(textId);
                editor.value = '';
            }
        }

    })();
}

function getWordCount(str) {
    return str ? str.trim().split(/\s+/).length : 0;
}

/**
 * Create a element in sidebar add to the DOM
 * @param {*} text 
 */
function addToSidebar(text) {
    var ul = document.getElementById("saved-items");
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.setAttribute('id', text);
    a.setAttribute('title', 'Single click to view & Double click to delete');
    a.appendChild(document.createTextNode(text.replace(/_/g," ")));
    li.addEventListener('click', updateEditorContent);
    li.addEventListener('dblclick', deleteFromList);
    li.appendChild(a);
    ul.prepend(li);
}

/**
 * Delete an element from DOM
 * @param {*} el 
 */
function deleteFromList(el) {
    let textId = el.srcElement.id;
    removeItem(textId);
    console.log(el.srcElement.parentNode)
    el.srcElement.parentNode.remove();
}

/**
 * Update the content of editor
 * @param {*} el 
 */
function updateEditorContent(el) {
    let textId = el.srcElement.id;
    editor.value = getItem(textId);
}

/**
 * Get all saved items
 * @returns 
 */
function getSavedItemList() {
    const items = get('ITEMS');
    return items;
}

/**
 * Save a new content
 * @param {*} textId 
 */
function addToSavedItemList(textId) {
    let items = get('ITEMS');
    if (items) {
        items.push(textId);
    } else {
        items = [textId];
    }
    set('ITEMS', items);
}

/**
 * Get a single content details
 * @param {*} id 
 * @returns 
 */
function getItem(id) {
    return get('ITEMS/'+ id);
}

/**
 * Save ids of list
 * @param {*} id 
 * @param {*} data 
 */
function saveItem(id, data) {
    set('ITEMS/'+ id, data);
}

/**
 * Remove from saved ids of items
 * @param {*} id 
 */
function removeItem(id) {
    remove(id);
    let items = get('ITEMS');
    if (items) {
        items = items.filter((item) => item !== id);
        set('ITEMS', items);
    }
}

/**
 * Get JSON formatted data from local storage
 * 
 * @param {*} key 
 * @returns 
 */
function get(key) {
    const data = localStorage.getItem(key);
    if (data) {
        return JSON.parse(data);
    }
    return null;
}

/**
 * Save a json stringified data of a object
 * @param {*} key 
 * @param {*} value 
 */
function set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Delete from local storage
 * @param {*} key 
 */
function remove(key) {
    localStorage.removeItem(key);
}