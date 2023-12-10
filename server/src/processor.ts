import path from 'path'
import fs from 'fs'
import esort from 'external-sorting'
import Reader from 'n-readline'
import { Scraper } from './scraper'

/**
 * Ensure and process words_raw.txt to words.txt and sevenchars.txt
 */
export class Processor {
  rawlist = path.join(__dirname, "../words_raw.txt")
  wordlist = path.join(__dirname, "../words.txt")
  sevenchars = path.join(__dirname, "../sevenchars.txt")

  /**
   * find all words with exactly 7 distinct letters. If there's no wordlist: Call Scraper to create one
   * @returns resolves on success; "sevenchars.txt" has been created then
   */
  public async process(): Promise<void> {
    if (!fs.existsSync(this.wordlist)) {
      if (!fs.existsSync(this.rawlist)) {
        const scraper = new Scraper()
        await scraper.run()
        if (!fs.existsSync(this.rawlist)) {
          throw new Error("can't analyze pages")
        }
      }
      await this.sort(this.rawlist, this.wordlist)
      if (!fs.existsSync(this.wordlist)) {
        throw new Error("could not sort " + this.rawlist + " to " + this.wordlist)
      } else {
        fs.rmSync(this.rawlist)
      }
    }
    return new Promise((resolve, reject) => {

      const unique = new Set<string>()
      const rl = new Reader({
        filepath: this.wordlist,
        skipEmptyLines: true
      })
      rl.start()
      rl.on('error', err => {
        console.log("*** Error:", err)
        reject(err)
      })
      rl.on('line', (line: string, nr: number) => {
        const chars = line.split("")
        const dedup = [...new Set(chars)]
        if (dedup.length == 7) {
          const sorted = dedup.sort()
          unique.add(sorted.join(""))
        }
      })
      rl.on('end', () => {
        const output = [...unique]
        fs.writeFileSync(this.sevenchars, output.join("\n"))
        resolve()
      })
    })
  }

  /**
   * sort words file alphabetically
   * @param infile raw file
   * @param outfile sorted file
   * @returns a Promise resolving when done
   */
  public async sort(infile: string, outfile: string): Promise<void> {
    return esort({
      input: fs.createReadStream(infile),
      output: fs.createWriteStream(outfile),
      tempDir: __dirname,
      maxHeap: 100
    })
      .asc()
      .then(() => {
        console.log('done');
      })
  }
}