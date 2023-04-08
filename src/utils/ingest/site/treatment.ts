import { CheerioAPI } from "cheerio";

const bannedTags = ["script", "style", "noscript", "iframe", "svg"];

export function getInterestingDataFromHtml($: CheerioAPI) {
  let texts = new Set();
  // get all text tag and their content
  $("*")
    .contents()
    .each((_, el) => {
      // @ts-ignore
      if (el.type === "text" && !bannedTags.includes(el?.parent?.name)) {
        if (el.data && el.data.trim().length > 0) {
          texts.add(el.data);
        }
      }
    });
  let text = Array.from(texts).join("\n\n");
  return text;
}
