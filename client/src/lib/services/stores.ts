import { writable } from 'svelte/store'

export const currentLevel = writable(0)
export const points = writable(0)
export const currentDate = new Date().toISOString().substring(0, 10);
export const found = writable<Array<string>>()
export const circle = writable<Array<string>>([])
export const allFound = writable<boolean>(false)
let isCookiesAllowed: boolean = (localStorage.getItem("allowCookies") === "true")

function createCookieAllowance() {
    const { subscribe, set} = writable(false)
    set(isCookiesAllowed)
    return {
        subscribe,
        set: (val:boolean) => {
            set(val);
            isCookiesAllowed = val;
            val ?
                localStorage.setItem("allowCookies", "true") :
                localStorage.removeItem("allowCookies")
        },
        get: () => isCookiesAllowed

    }
}
export const cookiesAllowed = createCookieAllowance()

export const toastDuration = 800

export interface IGameDef {
    possibilities: Array<string>
    chars: Array<string>
    centralLetter: string
    maxPoints: number
}

export interface ISaved {
    id: string
    found: Array<string>
    points: number
    level: number
}

/**
 * App.Svelte sets values when loading new game
 */
export let gameDef: IGameDef = {
    possibilities: [],
    chars: [],
    centralLetter: "",
    maxPoints: 0
}

/** Try to find today's saved score. If not found, create a new one */
let saved: ISaved
try {
    saved = JSON.parse(localStorage.getItem(currentDate))
    if (!saved) {
        throw new Error("no saved")
    }
} catch (error) {
    saved = {
        id: currentDate,
        points: 0,
        found: [],
        level: 0
    }
}


flush()
/** Add today's score to the list of scores */
let arr = getDates()
if (!arr.includes(currentDate)) {
    arr.push(currentDate);
    if (isCookiesAllowed) {
        localStorage.setItem('earlier', JSON.stringify(arr));
    }
}

/** create Statistics on earlier games and proxess data */
export let statistics = {
    count: 0,
    sumLevel: 0,
    sumPoints: 0,
    averagePoints: 0,
    averageLevel: 0
}
const current = new Date().getTime()
const checked: Array<string> = []

for (const item of arr) {
    const storedItemString = localStorage.getItem(item)
    if (storedItemString) {
        try {
            const storedItem = JSON.parse(storedItemString)
            const storedDate = new Date(storedItem.date).getTime()
            /** if it's an old entry, remove stored words */
            if (((current - storedDate) / 1000) > 200000) {
                if (storedItem.found) {
                    delete storedItem.found
                    localStorage.setItem(item, JSON.stringify(storedItem))
                }
            }
            statistics.count += 1
            statistics.sumLevel += storedItem.level + 1
            statistics.sumPoints += storedItem.points
            checked.push(item)
        } catch (err) {
            console.log(err);
            localStorage.removeItem(item)
        }
    }

}
statistics.averagePoints = Math.round(statistics.sumPoints * 100 / statistics.count || 1) / 100
statistics.averageLevel = Math.round(statistics.sumLevel * 100 / statistics.count || 1) / 100
if (isCookiesAllowed) {
    localStorage.setItem('earlier', JSON.stringify(checked))
}

/** initialize stores with the values from 'saved' */
points.set(saved.points)
currentLevel.set(saved.level)
found.set(saved.found)

found.subscribe(act => {
    saved.found = act
    if (gameDef && gameDef.possibilities && gameDef.possibilities.length>0) {
        if (act.length >= gameDef.possibilities.length) {
            allFound.set(true)
        }
    }
})
currentLevel.subscribe(act => {
    saved.level = act
})
points.subscribe(act => {
    saved.points = act
})

/**
 * Write state to localStorage, if saving is allowed
 */
export function flush() {
    if (isCookiesAllowed) {
        if (saved && gameDef.chars && gameDef.chars.length) {
            saved.id = gameDef.centralLetter + gameDef.chars.join("")
        }
        localStorage.setItem(currentDate, JSON.stringify(saved))
    }
}

export function getDates(): Array<string> {
    let stats = localStorage.getItem('earlier');
    let ret: Array<string>;
    try {
        ret = JSON.parse(stats) ?? [];
    } catch (err) {
        console.log(err);
        ret = [];
    }
    return ret.sort();
}

export function getScore(date: string = currentDate): ISaved {
    const storedItemString = localStorage.getItem(date)
    if (storedItemString) {
        try {
            return JSON.parse(storedItemString)
        } catch (err) {
            console.log(err)
        }
    }
    return {
        id: "",
        found: [],
        level: 0,
        points: 0
    }
}

/**
    * Shuffle the words in the circle
    */
export function shuffle() {
    const chars = [...gameDef.chars]
    chars.sort(() => Math.random() - 0.5);
    let idx = chars.indexOf(gameDef.centralLetter);
    chars.splice(idx, 1);
    circle.set(chars)
}

export const levelNames = [
    'Peuter',
    'Schoolkind',
    'Leerling',
    'Student',
    'Meester',
    'Goeroe',
    'Lord Woord',
    'De Slimste',
    'Genius',
];

