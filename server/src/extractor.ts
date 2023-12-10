import { DOMParser } from 'xmldom';

const parser = new DOMParser()

/**
 * Extract all relevant words from a string (usually but not necessarily a HTML page). This is only
 * an example implementation that extracts words from structures like <li><a href="something" title="wordToExtract">Some Text</a></li>,
 * and finds the link to a following page by searching <a...></a> elements for the link text given in process.env.linktitle.
 * Adapt this to match the contents of site you want to scrape.
 * @param html text to analyze
 * @returns {foundWords: Array<string>, nextPage: url or null}
 */
export function extract(html: string) {
    const found: Array<string> = []

    const doc = parser.parseFromString(html)
    const items = doc.getElementsByTagName("li")
    for (let i = 0; i < items.length; i++) {
        const ref = items[i].getElementsByTagName("a")
        if (ref && ref.length == 1) {
            const t = ref[0].getAttribute("title")
            if (t) {
                // we do not want roman numbers
                if (!t.match(/^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/)) {
                    found.push(t)
                }
            }
        }
    }
    const next = doc.getElementsByTagName("a")
    let link: string | null = null;
    for (let i = 0; i < next.length; i++) {
        if (next[i].textContent === process.env.linktitle) {
            link = next[i].getAttribute("href")
            if (link) {
                break;
            }
        }
    }
    return {
        foundWords: found,
        nextPage: link
    }
}