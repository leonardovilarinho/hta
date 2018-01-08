const fs   = require('fs')
const path = require('path')
const c    = require('chalk')
const tc   = require("testcafe")

module.exports = async ({run, on, save}) => {
  if(on == undefined)
    throw `Select an browser, for example: ${c.green("on:chrome")}`
  
  let files = [run.filename]

  if(run.isDir) {
    files = []
    fs.readdirSync(run.filename).forEach(file => files.push(path.resolve(run.filename, file)))
  }

  let runner = null

  await tc("localhost", 1337, 1338)
    .then(testcafe => {
      runner = testcafe.createRunner()
      runner
      .src("./test-wrapper.js")
      .browsers([on])
      .reporter("json")
      .run()
      .then(failedCount => {
        console.log("fail:", failedCount)
      })
      .catch(error => {
        console.log("error:", failedCount)
      })
      return testcafe.createBrowserConnection()
    })

    
}