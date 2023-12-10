/**
 * fetch words from site defined in .env: 
 * base="http://some.where"
 * startsite="/here/begins/the/scan?token="topSecret"
 * linktitle="next page"
 */
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import md5 from 'md5'
import { extract } from './extractor'
import robotsParser from 'robots-txt-parser'

/* To prevent spurious robot accesses to the site: Normally process locally cached sites only */
const localOnly = true
const userAgent = 'woordify one-time-collect/1.0'
const robots = robotsParser({
  userAgent,
  allowOnNeutral: true
})


export class Scraper {

  cache = path.join(__dirname, "../cache")
  wordlist = path.join(__dirname, "../words_raw.txt")

  pause(millis: number): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, millis);
    })
  }
  constructor() {
    if (!fs.existsSync(this.cache)) {
      fs.mkdirSync(this.cache, { recursive: true })
    }

  }
  /**
   * Load a html page. If we already scraped it, it's in the cache, so use that.
   * @param site url of the site to analyze
   * @returns the html content of the requested site
   */
  async load(site: string): Promise<string | null> {
    const hash = md5(site)
    if (fs.existsSync(path.join(this.cache, hash + ".html"))) {
      return this.loadFromFile(path.join(this.cache, hash + ".html"))
    } else {
      const contents: string | null = await this.loadFromSite(site)
      if (contents != null) {
        fs.writeFileSync(path.join(this.cache, hash + ".html"), contents);
        return contents
      }
    }
    return null
  }
  /**
   * It's not in the cache, so load it from the site. Since we're good citicens, we
   * respect robots.txt.
   * @param site the site to crawl
   * @returns the html content of the site or null if it could not be fetched
   */
  async loadFromSite(site: string): Promise<string | null> {
    if (localOnly) {
      throw new Error("only local loading active")
    }
    if (await robots.canCrawl(site)) {
      const res = await fetch(site, {
        method: "GET",
        headers: {
          'Api-User-Agent': userAgent
        }
      })
      if (res.status == 200) {
        const body = await res.text()
        // be kind and fetch only once every second
        await this.pause(1000)
        return body;

      } else {
        console.log("Error " + res.statusText)
        return null

      }
    } else {
      console.log("Crawl " + site + " disallowed by robots.txt")
      return null
    }
  }
  /**
   * The page is already in the cache
   * @param file 
   * @returns 
   */
  async loadFromFile(file: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(file, "utf-8", (err, data) => {
        if (err) {
          console.log("Error " + err)
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  analyze(html: string): string | null {
    const extracted = extract(html)
    for (const t of extracted.foundWords) {
      /* For each word: Check if is longer than 3 and contains only letters.
      then deduplicate its letters. If it has less than 8
      different letters, it goes to the word list. */
      if (t && t.length > 3 && t.match(/^[a-zA-Z]+$/)) {
        const tl = t.toLocaleLowerCase()
        const chars = tl.split('')
        const dedup = [...new Set(chars)]
        if (dedup.length < 8) {
          fs.appendFileSync(this.wordlist, tl + "\n")
        }
      }
    }
    return extracted.nextPage
  }
  /**
   * Fetch a page, analyze it, collect the words contained and try to find the next page.
   * @returns 
   */
  async run() {

    let current: string | null = process.env.startsite
    let pages = 0;
    do {
      const doc = await this.load(process.env.base + current)
      if (doc) {
        try {
          let result = this.analyze(doc)
          console.log(result)
          pages += 1
          current = result
        } catch (err) {
          console.log(err)
          break;
        }
      } else {
        break;
      }
    } while (current)
    // await coll.sort()
    return pages + " pages scraped"
  }

}


async function scrape() {
  const scraper = new Scraper()
  const pages = await scraper.run()
  return pages + " pages scraped"
}

if (process.env["ScraperDebug"] == "true") {
  scrape().then(result => {
    console.log(result)
  }).catch(err => {
    console.log("***Error*** " + err)
  })
}
