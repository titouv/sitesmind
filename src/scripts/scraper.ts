import { load } from "cheerio"

const bannedTags = ["script", "style", "noscript", "iframe", "svg"]

export async function getData(urls: string[]) {
  const responses = await Promise.all(urls.map((url) => fetch(url)))
  const data = await Promise.all(responses.map((response) => response.text()))
  const interestingData = await Promise.all(
    data.map((html) => getInterestingData(html))
  )
  return interestingData
}
async function getInterestingData(html: string) {
  const $ = load(html)
  let texts = new Set()
  // get all text tag and their content
  $("*")
    .contents()
    .each((_, el) => {
      if (el.type === "text") {
        // @ts-ignore
        if (!bannedTags.includes(el?.parent?.name)) {
          texts.add(el.data)
        }
      }
    })
  let text = Array.from(texts).join(" ")
  //replace multiple spaces by newline
  text = text.replace(/\s\s+/g, "\n")

  return text
}
