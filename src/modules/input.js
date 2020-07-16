import * as MOVEMENT from "./movement";
import * as UTILS from "./utils";
import { menu } from "..";

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
            // Vorzeichen der Mausbewegung feststellen. -1, wenn negativ, +1 wenn positiv, 0 wenn 0. 
            // Danach Vorzeichen umkehren für den nächsten Schritt.
            let sign = Math.sign(e.deltaY) * -1;

            // Ausrechnen der neuen Bewegungsgeschwindigkeit.
            let newSpeed = UTILS.clamp(MOVEMENT.movementSpeed + sign * 0.5, 0, 20);

            // Setzen der neuen Bewegungsgeschwindigkeit.
            MOVEMENT.setMovementSpeed(newSpeed);
      });
      
      // Dieser Listener
      let firstLock = true;
      document.body.addEventListener("click", () => {
            if(MOVEMENT.movementMode !== MOVEMENT.movementModes.POINTERLOCK) return;
            
            MOVEMENT.controls.lock();
            if(firstLock) {
                  firstLock = false;
                  document.getElementById("title").innerHTML = "Klicken, um fortzufahren";
            }
            menu.hidden = true;
      });

      MOVEMENT.controls.addEventListener("unlock", () => {
            menu.hidden = false;
            pressedKeys.length = 0;
      });

      MOVEMENT.controls.addEventListener("change", () => {
            MOVEMENT.updateViewDirection();
      });
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