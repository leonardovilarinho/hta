const path = require('path')
const fs   = require('fs')
const c    = require('chalk')

const icon = c.green("\u27A5")

module.exports = {
  run: ptTests => {
    const filename = path.resolve(process.cwd(), ptTests)
    const fileObj = fs.lstatSync(filename)

    console.log(`${icon}  Tests in ${c.bold(ptTests)} ${fileObj.isFile() ? "yaml file" : "directory"}`)

    return { filename, isDir: fileObj.isDirectory() }
  },

  on: browserName => {
    const browsers = ["chromium", "chrome", "chrome-canary", "ie", "edge", "firefox", "opera", "safari"]
    
    if(browsers.indexOf(browserName.toLowerCase()) == -1)
      throw `Browser ${browserName} not supported`

    console.log(`${icon}  Open in ${c.bold(browserName)} browser`)

    return browserName
  },

  save: evidencePath => {
    const filename = path.resolve(process.cwd(), evidencePath)

    if (!fs.existsSync(filename))
      fs.mkdirSync(filename)
    
    console.log(`${icon}  Save evidences in ${c.bold(evidencePath)} directory`)

    return filename
  }
}