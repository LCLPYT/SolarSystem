import { movementSpeed, setMovementSpeed } from "./movement";
import * as UTILS from "./utils";

export class Command {

    /**
     * @param {string} name Der Name des Kommandos.
     * @param {Function} suggestor Eine Funktion, die Vorschläge für das auf den bisherigen Text folgenden Argument gibt.
     * @param {Function} executor Eine Funktion, die das Kommando aufgrund der eingebenen Argumente ausführt. Gibt True zurück, wenn das Kommando erfolgreich ausgeführt wurde.
     */
    constructor(name, suggestor, executor) {
        this.name = name;
        this.suggestor = suggestor;
        this.executor = executor;
    }

    /**
     * Gibt Vorschläge für die folgenden Argumente zurück.
     * 
     * @param {string[]} args Die bisherigen Argumente.
     * @retuns Ein Feld, welches Vorschläge für folgende Teile des Kommandos beinhaltet.
     */
    getSuggestions(args) {
        return this.suggestor(args);
    }

    /**
     * Verarbeitet das Kommando.
     * 
     * @param {string[]} args Die angegebenen Argumente.
     * @returns True, wenn das Kommando erfolgreich ausgeführt wurde.
     */
    execute(args) {
        return this.executor(args);
    }
}

function getCommand(args) {
    let inputCommand = args[0].toLowerCase();

    // Suchen der Kommando Instanz.
    let foundCmd = null;
    commands.some(cmd => {
        if(cmd.name.toLowerCase() === inputCommand) {
            foundCmd = cmd;
            return true; // Iteration abbrechen.
        }
    });

    return foundCmd;
}

/**
 * Führt ein Kommando aus.
 * 
 * @param {string} text Der eingegebene Text.
 * @returns True, wenn das Kommando erfolgreich ausgeführt wurde. False, wenn nicht.
 */
export function execute(text) {
    let args = UTILS.splitIntoWords(text); // Spaltet den eingegebenen Text in Wörter auf und filtert leere Wörter raus.
    if (args.length <= 0) return false;

    let foundCmd = getCommand(args);
    if(foundCmd === null) return false;

    args.splice(0, 1); // Das erste Element aus dem Feld entfernen.

    // Das Kommando ausführen.
    return foundCmd.execute(args);
}

/**
 * Gibt Vorschläge für das nächste Argument eines Kommandos zurück.
 * 
 * @param {string} text Der eingegebene Text.
 * @returns {string[]} Ein Feld mit Vorschlägen.
 */
export function suggest(text) {
    let args = UTILS.splitIntoWords(text); // Spaltet den eingegebenen Text in Wörter auf und filtert leere Wörter raus.
    if (args.length <= 0) return commands.map(cmd => cmd.name); // Ein Feld mit den Namen jedes Kommandos zurückgeben.

    let foundCmd = getCommand(args);
    if(foundCmd === null) return [];

    args.splice(0, 1); // Das erste Element aus dem Feld entfernen.

    return foundCmd.getSuggestions(args);
}

// Feld, das Instanzen aller Kommandos beinhaltet.
export let commands = [];

// Definieren der Kommandos.
export const cmdSetMovementSpeed = new Command("SetMovementSpeed", 
args => { // Suggestor
    if(args.length <= 0) return ["600 u/s", "299792.458 km/s"];
    else if(args.length == 1) return ["km/h", "km/s", "m/s", "u/s"];

    return [];
}, args => { // Exekutor
    if(args.length == 0) {
        alert(`Die momentane Bewegungsgeschwindigkeit beträgt ${movementSpeed} u/s. (${UTILS.convert_U_S_to_KM_S(movementSpeed)} km/s)`);
        return true;
    }
    
    let newMovementSpeed = Number(args[0]);
    if(Number.isNaN(newMovementSpeed)) return false; // Argument 1 entspricht keiner Zahl.

    if(args.length === 2) {
        let unit = args[1];
        newMovementSpeed = UTILS.getUPS(newMovementSpeed, unit);
    }

    alert(`Die Bewegungsgeschwindigkeit wurde auf ${newMovementSpeed} u/s gesetzt. (${UTILS.convert_U_S_to_KM_S(newMovementSpeed)} km/s)`);
    setMovementSpeed(newMovementSpeed);
    return true;
});

// Registrieren der Kommandos.
commands.push(cmdSetMovementSpeed);