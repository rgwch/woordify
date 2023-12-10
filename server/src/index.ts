/**
 * Entry module. Construct a http Server. Listen on port 3333, or on a port defined in process.env.PORT
 */
import * as dotenv from 'dotenv'
import rot13 from 'ebg13'
dotenv.config()

import { createServer } from 'http'
import path from 'path'
import fs from 'fs'
import { Creator } from './creator'
const pck = require('../package.json')

function localDate(current = undefined) {
  if (!current) {
    current = new Date()
  }
  return new Date(current.getTime() - current.getTimezoneOffset() * 60000);
}

createServer(async (req, res) => {
  let file = req.url
  /** Do not enforce Same-Origin-Policy when in development mode  */
  if (process.env.NODE_ENV == 'development') {
    res.setHeader('Access-Control-Allow-Origin', '*')
  }
  // console.log("requested: " + file)
  if (file == "/info") {
    res.setHeader("content-type", "text/plain")
    res.statusCode = 200
    res.end("Woordify v" + pck.version)
  } else {
    if (!file || file === '/' || file === '') {
      file = 'index.html'
    }
    const dir = path.join(__dirname, '../public')
    const fullpath = path.join(dir, file)
    if (fs.existsSync(fullpath)) {
      send(fullpath, false)
    } else if (file == '/woorden') {
      const currentDate = localDate().toISOString().substring(0, 10)
      const filename = path.join(__dirname, '../', currentDate + '.txt')
      if (!fs.existsSync(filename)) {
        try {
          const creator = new Creator()
          await creator.createNew(filename)
        } catch (err) {
          console.log(err)
          res.statusCode = 500
          res.end("internal error")
        }
      }
      if (fs.existsSync(filename)) {
        send(filename, true)
      } else {
        res.statusCode = 500
        res.end()
      }
    } else if (file.match(/^\/[0-9]{4,4}-[0-9][0-9]-[0-9][0-9]$/)) {
      const filename = path.join(__dirname, '../', file + '.txt')
      if (fs.existsSync(filename)) {
        send(filename, true)
      } else {
        res.statusCode = 404
        res.end()
      }
    } else {
      res.statusCode = 404
      res.end()
    }

    /**
     * Set correct content-type header and send file.
     * if it's a word list, we obfuscate it slightly by rot13, so it's
     * not too easy to cheat. Thats not bulletprof, though ;-)
     * (On the other hand, we don't send state secrets here, so don't worry)
     * @param filename file to send
     * @param obfuscate true to obfuscate
     */
    function send(filename: string, obfuscate: boolean) {
      let mime = 'text/html; charset="utf-8"'
      if (filename.endsWith('js')) {
        mime = 'text/javascript'
      } else if (filename.endsWith('css')) {
        mime = 'text/css'
      } else if (filename.endsWith('svg')) {
        mime = 'text/svg+xml'
      } else if (filename.endsWith('jpg')) {
        mime = 'image/jpeg'
      } else if (filename.endsWith('txt')) {
        mime = 'text/plain'
      }
      res.setHeader('Content-Type', mime)
      if (obfuscate) {
        const cnt = fs.readFileSync(filename, "utf-8")
        const obfuscated = rot13(cnt)
        res.end(obfuscated)

      } else {
        const read = fs.createReadStream(filename)
        read.on('end', () => {
          res.end()
        })
        read.pipe(res)
      }
      // console.log('serving ' + path.join(__dirname, "../", filename))
    }
  }
}).listen(process.env.PORT || 3333)

