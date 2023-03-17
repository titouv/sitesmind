import { getInterestingDataFromHtml } from "./treatment";
import { load } from "cheerio";

const MAX_DEPTH = 5; // Maximum depth to crawl
const URL_LIMIT = 5;

interface PageData {
  url: string;
  content: string;
  textContent?: string;
}

/**
 * Recursive crawler function
 * @param url The URL to crawl
 * @param depth The current depth of the crawl
 * @param visitedUrls Array of visited URLs
 * @param domain The domain of the starting URL
 * @param results Array to store the results
 * @param bannedUrls Array of banned URLs
 */
export async function crawl(
  url: string,
  depth: number = 0,
  visitedUrls: string[] = [],
  domain: string,
  results: PageData[],
  bannedUrls: string[] = []
): Promise<void> {
  // Check if max depth has been reached
  if (depth >= MAX_DEPTH || visitedUrls.length >= URL_LIMIT) {
    return;
  }

  try {
    // Remove the fragment identifier from the URL
    const urlWithoutFragment = new URL(url);
    urlWithoutFragment.hash = "";
    // test if url is a file
    if (urlWithoutFragment.pathname.split(".").length > 1) {
      return;
    }

    const normalizedUrl = urlWithoutFragment.href;

    if (visitedUrls.includes(normalizedUrl)) {
      return;
    }

    // Check if the URL is banned
    if (bannedUrls.some((bannedUrl) => normalizedUrl.startsWith(bannedUrl))) {
      return;
    }

    visitedUrls.push(normalizedUrl);

    // Fetch the page content
    const response = await fetch(normalizedUrl);
    const contentPromise = response.text();
    const pageData: PageData = {
      url: normalizedUrl,
      content: await contentPromise,
    };

    // Parse the page content using Cheerio
    const $ = load(pageData.content);

    // Perform expensive operation on the page content
    const textContentPromise = performExpensiveOperation(pageData, $);

    // Find all links on the page and crawl them recursively
    const links = $("a[href]").toArray();
    const promises = links.map(async (link) => {
      const href = $(link).attr("href");
      if (href) {
        const childUrl = new URL(href, normalizedUrl).href;
        const childUrlDomain = new URL(childUrl).hostname;
        // console.log({ childUrl, childUrlDomain, domain });
        if (childUrlDomain === domain) {
          try {
            await crawl(
              childUrl,
              depth + 1,
              visitedUrls,
              domain,
              results,
              bannedUrls
            );
          } catch (error) {
            // @ts-ignore
            console.error(`Error crawling ${childUrl}:`, error.message);
            return;
          }
        }
      }
    });

    await Promise.all(promises);

    pageData.textContent = await textContentPromise;
    results.push(pageData);
  } catch (error) {
    // @ts-ignore
    console.error(`Error fetching ${url}:`, { error });
  }
}

/**
 * Expensive operation to perform on a page's content
 * @param pageData The page data to perform the operation on
 * @param $ The CheerioAPI object for the page content
 */
async function performExpensiveOperation(
  pageData: PageData,
  $: any
): Promise<string> {
  return getInterestingDataFromHtml($);
}

export async function mainCrawl(url: string, bannedUrls: string[] = []) {
  console.log("Crawling", url, "...");
  console.log("Banned URLs:", bannedUrls);
  const startingUrl = url;
  const startingUrlDomain = new URL(startingUrl).hostname;
  const results: PageData[] = [];
  const visitedUrls: string[] = [];
  await crawl(
    startingUrl,
    0,
    visitedUrls,
    startingUrlDomain,
    results,
    bannedUrls
  );

  console.log({ visitedUrls });
  console.log("Crawled", results.length, "pages");

  const limitedResults = results.slice(0, URL_LIMIT);
  console.log("Crawled", limitedResults.length, "pages");

  return limitedResults;
}

// mainCrawl("https://epita-s3-ocr.netlify.app/").then((results) => {
//   // console.log(results);
// });
