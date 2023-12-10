/**
 * create an new puzzle
 */
import Reader from 'n-readline'
import { Processor } from './processor'
import fs from 'fs'

type Worddef = {
    wordlist: Array<string>
    chars: string
    mainChar: string,
    points: number
}
export class Creator {
    /**
     * (1) chose a random 7-letter-combination from sevenchars.txt
     * (2) select randomly one of these 7 letters as central letter (But we don't want X since wiktionary gives lots of roman numbers then (LXXX,CXXX, MCMXIV and so on))
     * (3) find all words that contain at least once the central letter, and no letters except those in the selected combination
     * (4) create a file with these words and the possible points for the client.
     * @returns 
     */
    public async createNew(filename:string) {
        let ret: Worddef = {
            wordlist: [],
            chars: "",
            mainChar: "",
            points: 0
        }
        do {
            ret.chars = await this.chooseWord()
            const idx = Math.floor(Math.random() * 7)
            ret.mainChar = ret.chars.substring(idx, idx + 1)
            ret = await this.parse(ret)
        } while (ret.wordlist.length < 25 || ret.wordlist.length>1200); // we do not want too few possibilities
        const output = "Words:" + ret.chars + ";points:" + ret.points + ";centralLetter:" + ret.mainChar + "\n" + ret.wordlist.join("\n")
        //const filename = new Date().toISOString().substring(0, 10) + ".txt";
        fs.writeFileSync(filename, output)
        return ret
    }

    /**
     * collect all words that (a) contain the central letter and (b) contain only chars which are in letters
     * @param letters 
     * @param central 
     * @returns 
     */
    async parse(prereq: Worddef): Promise<Worddef> {
        return new Promise((resolve, reject) => {
            prereq.wordlist = []
            prereq.points = 0;
            const rl = new Reader({
                filepath: './words.txt',
                skipEmptyLines: true
            })
            rl.start()
            rl.on('error', err => {
                console.log("*** Error:", err)
                reject(err)
            })
            rl.on('line', (line: string, nr: number) => {
                if (line.indexOf(prereq.mainChar) !== -1) {
                    const chars = line.split('')
                    for (const char of chars) {
                        if (prereq.chars.indexOf(char) == -1) {
                            return
                        }
                    }
                    /* If the line is not already in the found array: 
                        calculate the points (which is length-3, plus 7, if the word contains all letters (pangram))
                     */
                    if (!prereq.wordlist.includes(line)) {
                        prereq.points += (line.length === 4 ? 1 : line.length)
                        if ([...new Set(chars)].length == 7) {
                            prereq.points += 7
                        }
                        prereq.wordlist.push(line)
                    }
                }
            })
            rl.on('end', () => {
                resolve(prereq)
            })
        })

    }

    /**
     * select randomly one word from the list with words wirth exactly 7 distinct chars
     * @returns 
     */
    async chooseWord() {
        if (!fs.existsSync("sevenchars.txt")) {
            const pro = new Processor()
            await pro.process()
            if (!fs.existsSync("sevenchars.txt")) {
                throw new Error("Can't create wordlist")
            }
        }
        const wordlist = fs.readFileSync("sevenchars.txt").toString()
        const raw = wordlist.split(/\n/)
        const list = [...new Set(raw)]
        const max = list.length
        const rand = Math.floor(Math.random() * (max + 1))
        const word = list[rand]
        return word;
    }
}

if (process.env["CreatorDebug"] == "true") {
    new Creator().createNew(new Date().toISOString().substring(0,10)+".debug.txt")
}