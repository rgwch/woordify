import { writable } from "svelte/store";
import { found, gameDef, points, flush, toastDuration } from './stores'
import { calculateWordValue } from "./calculations";
import { toast } from "@zerodevx/svelte-toast";

function createInputLine() {
    const { subscribe, set, update } = writable("")
    let current: string = ""
    subscribe(v => current = v)
    return {
        subscribe, set, update,
        get: (): string => current
    }
}
export const inputLine = createInputLine()


export function add(char: string) {
    inputLine.update(before => before + char)
}

/**
    * Check the word if the user hits Enter:
    * - at least four letters
    * - central letter must be included
    * - not already in found list
    * - is in word list
    */
let aFound = []
found.subscribe(a => aFound = a)
export function checkWord() {
    let typed = inputLine.get().toUpperCase()
    if (typed.length < 4) {
        toast.push("minimaal vier letters", { duration: toastDuration });
    } else if (typed.indexOf(gameDef.centralLetter) == -1) {
        toast.push(`de "${gameDef.centralLetter}" ontbreekt`, {
            duration: toastDuration,
        });
    } else if (aFound.includes(typed)) {
        toast.push("al eerder gevonden", { duration: toastDuration });
    } else {
        if (gameDef.possibilities.indexOf(typed.toLowerCase()) == -1) {
            toast.push("niet in mijn lijst", { duration: toastDuration });
        } else {
            const pts = calculateWordValue(typed);
            toast.push(`+${pts} punten!`, {
                duration: toastDuration,
                theme: {
                    "--toastBackground": "blue",
                    "--toastColor": "white",
                },
            });
            found.update((prev) => [...prev, typed]);
            points.update((prev) => prev + pts);
            inputLine.set("");
            flush();
        }
    }
}

