import { load } from "cheerio";

const bannedTags = ["script", "style", "noscript", "iframe", "svg"];

export async function getData(url: string) {
  const response = await fetch(url);
  const html = await response.text();
  const interestingData = await getInterestingData(html);
  return interestingData;
}
async function getInterestingData(html: string) {
  const $ = load(html);
  let texts = new Set();
  // get all text tag and their content
  $("*")
    .contents()
    .each((_, el) => {
      if (el.type === "text") {
        // @ts-ignore
        if (!bannedTags.includes(el?.parent?.name)) {
          texts.add(el.data);
        }
      }
    });
  let text = Array.from(texts).join(" ");
  //replace multiple spaces by newline
  text = text.replace(/\s\s+/g, "\n");

  return text;
}
