import makeloc from "https://deno.land/x/dirname@1.1.2/mod.ts";

type GenerateJsonFileProps = {
  fileName: string;
  fileContent: object[];
};

async function generateJsonFile({
  fileName,
  fileContent,
}: GenerateJsonFileProps) {
  const { __dirname } = makeloc(import.meta);

  await Deno.writeTextFile(
    `${__dirname}/../json/${fileName}.json`,
    JSON.stringify(fileContent, null, 2)
  );
}

export default generateJsonFile;
