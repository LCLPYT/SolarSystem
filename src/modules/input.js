import * as MOVEMENT from "./movement";
import * as UTILS from "./utils";
import { menu } from "..";
import * as COMMANDS from "./commands";

// Die Tastennummern für bestimmte Aktionen im Programm.
export const MOVE_FORWARDS = 87, // 'w'
      MOVE_BACKWARDS = 83, // 's'
      MOVE_LEFT = 65, // 'a'
      MOVE_RIGHT = 68, // 'd'
      MOVE_UP = 32, // 'space'
      MOVE_DOWN = 16, // 'shift'
      LOOK_UP = 38, // 'arrow_up'
      LOOK_DOWN = 40, // 'arrow_down'
      LOOK_LEFT = 37, // 'arrow_left',
      LOOK_RIGHT = 39; // 'arrow_right'

// Ein Feld, welches die Nummern der gerade gedrückten Tasten enthält.
let pressedKeys = [];

/**
 * Diese Funktion registriert alle für dieses Projekt relevanten event listeners.
 * Ein EventListener ist eine Funktion, die aufgerufen wird, sobald ein bestimmtes Ereignis auftritt (z.B. eine Taste wird gedrückt)
 */
export function registerInputListeners() {
      /*
      Dieser Listener wird aufgerufen, sobald eine Taste gedrückt wird.
      Die Funktion testet, ob die gedrückte Taste schon vorher gedrückt wurde (dieser Listener kann mehrmals auf einmal aufgerufen werden).
      Wenn nicht, wird sich gemerkt, dass die Taste gedrückt wurde, indem die Nummer der Taste in einem Feld gespeichert wird.
      Dieses Programm sieht die Taste solang als gedrückt an, wie diese Nummer im Feld gespeichert bleibt.
      */
      document.addEventListener("keydown", e => {
            if (!pressedKeys.includes(e.which)) pressedKeys.push(e.which);

            // Direkte Aufrufe
            switch (e.which) {
                  case 27: // ESC
                        onEscape();
                        break;
                  case 13: // Enter
                        onEnter();
                        break;
                  case 40: // ArrowDown
                        onArrow("down");
                        break;
                  case 38: // ArrowUp
                        onArrow("up");
                        break;
            
                  default:
                        break;
            }
      }, false);

      /*
      Dieser Listener ist das Gegenstück zum 'keydown' Listener, er wird aufgerufen, sobald eine Taste losgelassen wird.
      Wenn die Nummer der Taste im Feld gespeichert ist, wird sie entfernt und somit nicht mehr als gedrückt angesehen.
      */
      document.addEventListener("keyup", e => {
            if (!pressedKeys.includes(e.which)) return;
            let index = pressedKeys.indexOf(e.which);
            if (index >= 0) pressedKeys.splice(index, 1);
      }, false);

      // Dieser Listener wird aufgerufen, sobald man auf der Webseite das Mausrad dreht. Wenn dies geschieht, wird hier die Bewegungsgeschwindigkeit verändert.
      document.body.addEventListener("wheel", e => {
            if(MOVEMENT.movementMode !== MOVEMENT.movementModes.POINTERLOCK) return;

            // Vorzeichen der Mausbewegung feststellen. -1, wenn negativ, +1 wenn positiv, 0 wenn 0. 
            // Danach Vorzeichen umkehren für den nächsten Schritt.
            let sign = Math.sign(e.deltaY) * -1;

            // Ausrechnen der neuen Bewegungsgeschwindigkeit.
            let newSpeed = UTILS.clamp(
                  MOVEMENT.movementSpeed + sign * (0.05 * MOVEMENT.movementSpeedBase), // Ausgerechneter Wert
                  0, // Minimum
                  MOVEMENT.movementSpeedBase * 2); // Maximum

            // Setzen der neuen Bewegungsgeschwindigkeit.
            MOVEMENT.setMovementSpeed(newSpeed);
      }, false);
      
      // Dieser Listener wird aufgerufen, wenn der Benutzer anfängt, linkszuklicken.
      let firstLock = true;
      menu.addEventListener("mousedown", () => {
            if(MOVEMENT.movementMode !== MOVEMENT.movementModes.POINTERLOCK) return;

            MOVEMENT.controls.lock();
            if(firstLock) {
                  firstLock = false;
                  document.getElementById("title").innerHTML = "Klicken, um fortzufahren";
            }
            menu.hidden = true;
      });

      document.getElementById("movementModeToggler").addEventListener("click", e => {
            MOVEMENT.toggleMovementMode();
      }, false);

      document.getElementById("movementSpeedChanger").addEventListener("click", e => {
            showTextInput("SetMovementSpeed ");
      });
}

function showTextInput(prepend) {
      if(MOVEMENT.movementMode === MOVEMENT.movementModes.POINTERLOCK) MOVEMENT.controls.unlock(); // Pointer Lock entsperren. -> Steuerung der Kamera sperren.

      Array.from(document.getElementsByClassName("input-group")).forEach(element => element.hidden = false);
      let textField = document.getElementById("input-field");
      textField.value = prepend;
      textField.focus(); // Text-Feld fokussieren, damit der Benutzer direkt anfangen kann zu schreiben.
      textField.setSelectionRange(textField.value.length, textField.value.length); // Cursor an das Ende des Textes bewegen.
      suggest();
}

function hideTextInput() {
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
            if(!node.classList.contains("persistent")) inputList.removeChild(node);
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

function useSuggestion(div) {
      unselectDiv(div);

      let inputField = document.getElementById("input-field");
      inputField.value += `${div.suggestion} `;
      unselectDiv(div);
      inputField.focus();
      suggest();
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

/**
 * Wird aufgerufen, sobald der Benutzer die ESC-Taste drückt.
 */
function onEscape() {
      let textField = document.getElementById("input-field");
      if(document.activeElement === textField) hideTextInput();
}

/**
 * Wird aufgerufen, sobald der Benutzer die Enter-Taste drückt.
 */
function onEnter() {
      let textField = document.getElementById("input-field");
      if(selectedNode !== null) {
            useSuggestion(selectedNode);
      }
      else if(document.activeElement === textField) { // Wenn das Eingabe-Feld fokussiert ist.
            let success = COMMANDS.execute(textField.value);
      } else { // Wenn das Eingabe-Feld keinen Fokus hat.
            showTextInput(""); // Eingabe-Feld zeigen.
      }
}

/**
 * Wird aufgerufen, sobald der Benutzer eine Pfeiltaste drückt.
 * 
 * @param {string} which Welche Pfeiltaste gedrückt wurde ("up", "down")
 */
function onArrow(which) {
      if(document.getElementById("input-field").hidden) return;

      let inputList = document.getElementById("input-list");
      let childCount = inputList.children.length;

      if(which === "down") {
            if(selectedIndex === -1 || selectedIndex >= childCount - 1) selectedIndex = 2;
            else if(selectedIndex < childCount - 1) selectedIndex++;

            let next = inputList.children.item(selectedIndex);
            if(selectedNode !== null) unselectDiv(selectedNode);
            selectDiv(next.children.item(0));
      }
      else if(which === "up") {
            if(selectedIndex === -1 || selectedIndex <= 2) selectedIndex = childCount - 1;
            else selectedIndex--;

            let next = inputList.children.item(selectedIndex);
            if(selectedNode !== null) unselectDiv(selectedNode);
            selectDiv(next.children.item(0));
      }
}

/**
 * Testet, ob eine Taste gerade gedrückt ist.
 * 
 * @param {number} keyCode Die Nummer der Taste.
 * @returns {boolean} True, wenn die Taste mit der angegebenen Nummer gerade gedrückt ist.
 */
export function isKeyDown(keyCode) {
      return pressedKeys.includes(keyCode);
}

/**
 * Diese Funktion leert das pressedKeys feld.
 */
export function unpressAllKeys() {
      pressedKeys.length = 0;
}

// initialisieren des Input-Feldes
const inputField = document.getElementById("input-field");

// Hinzufügen eines Listeners, welcher aufgerufen wird, sobald der Benutzer den Fokus aus dem Text-Feld nimmt.
inputField.addEventListener("focusout", () => {
      if(hoveredSuggestion === null) hideTextInput();
      else hoveredSuggestion = null;
});
inputField.addEventListener("input", () => suggest());
inputField.addEventListener("cut", () => suggest());
inputField.addEventListener("copy", () => suggest());
inputField.addEventListener("paste", () => suggest());