import yaml from 'js-yaml'
import fs from 'fs'
import _ from 'lodash'

require('testcafe');
import { Selector } from "testcafe"

try {
  const file = yaml.safeLoad(fs.readFileSync("./tests/name-alert.yml", "utf8"))

   fixture`${file.project}`.page`${file.link}`;

   test(`${file.test} test`, async (t) => {

      for (const option of file.options) {
        const _option = _( option.split(" ").map(i => i.trim()) )
        const name = _option.last()

        switch (name) {
          case 'alerts':
            const alertResponse = _option.dropRight().last()
            if(alertResponse.toLowerCase() == "accept")
              await t.setNativeDialogHandler(() => true)  
            else
              await t.setNativeDialogHandler(() => false)  
          break;
        }
      }

      for (const item in file.steps) {
        let step = file.steps[item];
        step = step.replace(/'/g, '"');
        file.steps[item] = step;

        const instructions = step.split('"').map(i => i.trim());
        const _instructions = _(instructions);

        const command = instructions[0];

        switch (command) {
          case "write":
            //write 'Leonardo' in 'your-name' field
            const writeValue = instructions[1];
            const writeElementType = `${_instructions.last()}s`;

            if (file[writeElementType] == undefined)
              throw `${writeElementType} section not found!`;

            const writeElements = file[writeElementType];
            const writeElementName = _instructions.dropRight().last();

            if (writeElements[writeElementName] == undefined)
              throw `${writeElementType}.${writeElementName} not found!`;

            const writeElement = writeElements[writeElementName];

            await t.typeText(writeElement, writeValue).takeScreenshot(`${item}-write-${writeValue}-in-${writeElementName}`)
          break

          case "select":
            // select 'Both' in 'interface' field
            const selectValue = instructions[1];
            const selectElementType = `${_instructions.last()}s`;

            if (file[selectElementType] == undefined)
              throw `${selectElementType} section not found!`;

            const selectElements = file[selectElementType];
            const selectElementName = _instructions.dropRight().last();

            if (selectElements[selectElementName] == undefined)
              throw `${selectElementType}.${selectElementName} not found!`;

            const selectElement = selectElements[selectElementName];

            const selectObject = Selector(selectElement)
            await t
              .click(selectObject)
              .click(selectObject.find('option').withText(selectValue))
              .takeScreenshot(`${item}-select-${selectValue}-in-${selectElementName}`)
          break

          case "click in":
            // click in 'populate' button
            const clickElementType = `${_instructions.last()}s`;

            if (file[clickElementType] == undefined)
              throw `${clickElementType} section not found!`;

            const clickElements = file[clickElementType];
            const clickElementName = _instructions.dropRight().last();

            if (clickElements[clickElementName] == undefined)
              throw `${clickElementType}.${clickElementName} not found!`;

            const clickElement = clickElements[clickElementName];

            await t.click(clickElement).takeScreenshot(`${item}-click-in-${clickElementName}`)
          break

          case "assert if":
            // assert if 'your-name' field value is equals 'Peter Parker'
            const assertDetails = _(instructions[2].split(" "));
            const assertType = assertDetails.last();
            const assertAttribute = assertDetails.dropRight().dropRight().last();
            
            const assertElementType = `${assertDetails.first()}s`;

            if (file[assertElementType] == undefined)
              throw `${assertElementType} section not found!`;

            const assertElements = file[assertElementType];
            const assertElementName = instructions[1];

            if (assertElements[assertElementName] == undefined)
              throw `${assertElementType}.${assertElementName} not found!`;

            const element = assertElements[assertElementName];

            if(assertType.toLowerCase() == 'equals') {
              await t.expect(Selector(element)[assertAttribute]).eql(_instructions.dropRight().last())
            }
          break

          
        }
      }
   });

} catch (e) {
  console.log(e)
}

