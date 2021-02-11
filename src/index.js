import puppeteer from "https://deno.land/x/puppeteer@5.5.1/mod.ts";

import generateJsonFile from "./functions/generateJsonFile.ts";

//TODO:
/**
 * [] - remover codigo hardcoded
 * [] - arrumar a parte do sem link
 * [] - isolar as functions
 * [] - trocar o pre por todo conteudo de informacao
 */

const BASE_URL = "https://ss64.com/bash/";

(async () => {
  const promiseCommandListWithInfo = [];

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(BASE_URL);

  const commandsList = await page.evaluate(() => {
    const nodeList = document.querySelectorAll("tr");

    const trsArray = [...nodeList];

    const listWithCategory = trsArray.map(({ innerText, children }) => {
      const link = children[1].childNodes[0].href || "";
      const [commands, description] = innerText.trim().split("	");

      return { commands, description, link };
    });

    const list = listWithCategory.filter(
      (item) => !item.commands.match(/^[A-Z]$/g)
    );

    return list;
  });

  for (let i = 0; i < commandsList.length; i++) {
    try {
      //Hardcoded
      await page.goto(
        !!commandsList[i].link && !commandsList[i].link.includes("wikipedia")
          ? commandsList[i].link
          : "https://ss64.com/bash/alias.html"
      );

      await page.waitForSelector(".tbtn");

      const detailedInfo = await page.evaluate(async () => {
        const preNodeList = document.querySelectorAll("pre");
        const pNodeList = document.querySelectorAll("p");

        const preArray = [...preNodeList, ...pNodeList];

        const infoList = preArray.map((paragraph) => paragraph.innerHTML);

        return infoList;
      });

      await page.goBack();

      promiseCommandListWithInfo.push({
        ...commandsList[i],
        info: detailedInfo,
      });
    } catch (error) {
      console.log("error: ", error);
      promiseCommandListWithInfo.push(commandsList[i]);
    }
  }

  const commandListWithInfo = await (async () => {
    return Promise.all(promiseCommandListWithInfo);
  })();

  generateJsonFile({
    fileName: "commands-list",
    fileContent: commandListWithInfo,
  });

  await browser.close();
})();
