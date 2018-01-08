const tc = require("testcafe")

tc("localhost", 1337, 1338).then(testcafe => {
  runner = testcafe.createRunner()
  runner
    .src("./test-example.js")
    .browsers(['chrome'])
    // .reporter("json")
    .run()
    .then(failedCount => {
    //   console.log("fail:", failedCount)
      testcafe.close()
    })
    .catch(error => {
    //   console.log("error:", failedCount)
      testcafe.close()
    })
  
})

