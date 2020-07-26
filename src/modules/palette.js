import * as COMMANDS from "./commands";
import * as MOVEMENT from './movement';

export function show(prepend) {
    if (MOVEMENT.movementMode === MOVEMENT.movementModes.POINTERLOCK) MOVEMENT.controls.unlock(); // Pointer Lock entsperren. -> Steuerung der Kamera sperren.

    Array.from(document.getElementsByClassName("input-group")).forEach(element => element.hidden = false);
    let textField = document.getElementById("input-field");
    textField.value = prepend;
    textField.focus(); // Text-Feld fokussieren, damit der Benutzer direkt anfangen kann zu schreiben.
    textField.setSelectionRange(textField.value.length, textField.value.length); // Cursor an das Ende des Textes bewegen.
    suggest();
}

export function hide() {
    Array.from(document.getElementsByClassName("input-group")).forEach(element => element.hidden = true);
    let textField = document.getElementById("input-field");
    textField.blur(); // Den Fokus vom Text-Feld nehmen.

    hoveredSuggestion = null;
    selectedNode = null;
    selectedIndex = -1;
}

let hoveredSuggestion = null;
let selectedNode = null;
let selectedIndex = -1;

function suggest() {
    let suggestions = COMMANDS.suggest(document.getElementById("input-field").value);
    let inputList = document.getElementById("input-list");

    Array.from(inputList.children).forEach(node => {
        if (!node.classList.contains("persistent")) inputList.removeChild(node);
    });

    suggestions.forEach(suggestion => {
        let li = document.createElement("li");
        li.classList.add("input-group");

        let div = document.createElement("div");
        div.suggestion = suggestion;
        div.classList.add("input-suggestion");
        div.classList.add("input-group");
        div.classList.add("disable-select");
        div.addEventListener("mouseover", () => {
            selectDiv(div);
            hoveredSuggestion = suggestion;
        });
        div.addEventListener("mouseout", () => {
            unselectDiv(div);
            hoveredSuggestion = null;
        });
        div.addEventListener("click", () => {
            useSuggestion(div);
        });

        let text = document.createTextNode(suggestion);

        div.appendChild(text);
        li.appendChild(div);
        inputList.appendChild(li);
    });
}

export function useSuggestion(div) {
    unselectDiv(div);

    let inputField = document.getElementById("input-field");
    inputField.value += `${div.suggestion} `;
    unselectDiv(div);
    inputField.focus();
    suggest();
}

export function onKeyDown(e) {
    // Direkte Aufrufe
    switch (e.which) {
        case 27: // ESC
            onEscape();
            break;
        case 13: // Enter
            onEnter();
            break;
        case 40: // ArrowDown
            onArrowKey("down");
            break;
        case 38: // ArrowUp
            onArrowKey("up");
            break;

        default:
            break;
    }
}

/**
 * Wird aufgerufen, sobald der Benutzer eine Pfeiltaste drückt.
 * 
 * @param {string} which Welche Pfeiltaste gedrückt wurde ("up", "down")
 */
function onArrowKey(which) {
    if (document.getElementById("input-field").hidden) return;

    let inputList = document.getElementById("input-list");
    let childCount = inputList.children.length;

    if (which === "down") {
        if (selectedIndex === -1 || selectedIndex >= childCount - 1) selectedIndex = 2;
        else if (selectedIndex < childCount - 1) selectedIndex++;

        let next = inputList.children.item(selectedIndex);
        if (selectedNode !== null) unselectDiv(selectedNode);
        selectDiv(next.children.item(0));
    } else if (which === "up") {
        if (selectedIndex === -1 || selectedIndex <= 2) selectedIndex = childCount - 1;
        else selectedIndex--;

        let next = inputList.children.item(selectedIndex);
        if (selectedNode !== null) unselectDiv(selectedNode);
        selectDiv(next.children.item(0));
    }
}

/**
 * Wird aufgerufen, sobald der Benutzer die ESC-Taste drückt.
 */
function onEscape() {
    let textField = document.getElementById("input-field");
    if (document.activeElement === textField) hide();
}

/**
 * Wird aufgerufen, sobald der Benutzer die Enter-Taste drückt.
 */
function onEnter() {
    let textField = document.getElementById("input-field");
    if (selectedNode !== null) {
        useSuggestion(selectedNode);
    } else if (document.activeElement === textField) { // Wenn das Eingabe-Feld fokussiert ist.
        let success = COMMANDS.execute(textField.value);
    } else { // Wenn das Eingabe-Feld keinen Fokus hat.
        show(""); // Eingabe-Feld zeigen.
    }
}

function selectDiv(div) {
    div.prevBGColor = div.style.backgroundColor;
    div.style.backgroundColor = "rgba(127, 127, 127, 0.5)";
    selectedNode = div;
}

function unselectDiv(div) {
    div.style.backgroundColor = div.prevBGColor;
    selectedNode = null;
}

// initialisieren des Input-Feldes
const inputField = document.getElementById("input-field");

// Hinzufügen eines Listeners, welcher aufgerufen wird, sobald der Benutzer den Fokus aus dem Text-Feld nimmt.
inputField.addEventListener("focusout", () => {
      if(hoveredSuggestion === null) hide();
      else hoveredSuggestion = null;
});
inputField.addEventListener("input", () => suggest());
inputField.addEventListener("cut", () => suggest());
inputField.addEventListener("copy", () => suggest());
inputField.addEventListener("paste", () => suggest());