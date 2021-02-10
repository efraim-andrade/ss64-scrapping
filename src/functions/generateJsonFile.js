const fs = require("fs");

function generateJsonFile({ fileName, fileContent }) {
  fs.writeFile(
    `${__dirname}/../json/${fileName}.json`,
    JSON.stringify(fileContent, null, 2),
    (err) => {
      if (err) throw new Error("Something went wrong");

      console.log("Sucesso demais!");
    }
  );
}

module.exports = generateJsonFile;
