import { getDates, getScore, type ISaved, type IGameDef, gameDef } from './stores'
import rot13 from 'ebg13'

export async function solutions(): Promise<string> {
  let ret = "";
  const dates = getDates()
  if (dates.length > 1) {
    const previous = dates[dates.length - 2]
    const score: ISaved = getScore(previous)
    if (score && score.found) {
      const old: IGameDef = await fetchWords(previous)
      const date = new Date(previous)
      const dateString = date.toLocaleDateString("nl")
      ret = `<p>${dateString}: Je had ${score.found.length} van ${old.possibilities.length} woorden gevonden; ${score.points} van ${old.maxPoints} punten.</p>`
      const fullList: Array<string> = old.possibilities
      const found = score.found.map(a => a.toLowerCase())
      for (let word of fullList) {
        const  color=isPangramm(word,old.chars) ? "#f87217" : "black" 
        const weight=found.includes(word) ? "bold" : "light"
        ret+= `<span style="font-weight:${weight};color:${color}">${word}</span>, `
      }
      ret = ret.substring(0, ret.length - 2)
    }
  }
  return ret;
}

export async function fetchWords(date?: string): Promise<IGameDef> {
  let result: Response;
  let url = "/"
  if (process.env.NODE_ENV == "development") {
    url = "http://localhost:3333/";
  }
  result = await fetch(url + (date ?? "woorden"));

  if (result.ok) {
    const obfuscated = await result.text();
    const plain = rot13(obfuscated)
    const pat = plain.match(/^Words:(.+);points:([0-9]+);centralLetter:(.)/);
    if (pat) {
      const header = pat[0];
      const word = pat[1].toUpperCase()
      let letters = []
      if (word && word.length) {
        letters = [...new Set(word.split(''))]
      }
      return {
        chars: letters,
        maxPoints: parseInt(pat[2]),
        centralLetter: pat[3].toUpperCase(),
        possibilities: plain.substring(header.length + 1).split("\n"),
      }
    }
  } else {
    console.log("ressource not found");
    throw new Error(result.statusText);
  }
}

/**
   * Check value for a word. If it's a pangramm, ad 7 points
   */
export function calculateWordValue(word: string) {
  let points = 0
  if (word.length == 4) {
    points = 1;
  } else {
    points = word.length
  }
  if (isPangramm(word)) {
    points += 7;
  }
  return points;
}

export function isPangramm(word: string, chars: Array<string> = gameDef.chars) {
  for (const ch of chars) {
    if (!word.toUpperCase().includes(ch)) {
      return false;
    }
  }
  return true;
}

