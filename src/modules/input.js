import * as MOVEMENT from "./movement";

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

      document.body.addEventListener("wheel", e => {
            if(e.deltaY < 0) MOVEMENT.setMovementSpeed(MOVEMENT.movementSpeed + 1);
            else if(e.deltaY > 0) MOVEMENT.setMovementSpeed(MOVEMENT.movementSpeed - 1);
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