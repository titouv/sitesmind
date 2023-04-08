type FetchFunction = (url: string) => Promise<string>;

interface LinkExtractor {
  (sitemap: string): string[];
}

async function* crawlRecursive(
  url: string,
  fetchSitemap: FetchFunction,
  extractLinks: LinkExtractor,
  maxVisitedUrls: number,
  detectedUrls = new Set<string>(),
  detectedSitemaps = new Set<string>()
): AsyncGenerator<string> {
  if (detectedUrls.size >= maxVisitedUrls) return;

  let sitemap: string;

  try {
    sitemap = await fetchSitemap(url);
  } catch (error) {
    console.error(`Failed to fetch sitemap URL: ${url}`, error);
    return;
  }

  const discoveredUrls = extractLinks(sitemap);

  for (const discoveredUrl of discoveredUrls) {
    const trimmedUrl = discoveredUrl.trim();
    if (detectedUrls.size >= maxVisitedUrls) break;

    if (trimmedUrl.endsWith(".xml") && !detectedSitemaps.has(trimmedUrl)) {
      detectedSitemaps.add(trimmedUrl);
      yield* crawlRecursive(
        trimmedUrl,
        fetchSitemap,
        extractLinks,
        maxVisitedUrls,
        detectedUrls,
        detectedSitemaps
      );
    } else {
      detectedUrls.add(trimmedUrl);
      yield trimmedUrl;
    }
  }
}

const exampleFetchFunction: FetchFunction = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch sitemap");
  return response.text();
};

const exampleLinkExtractor: LinkExtractor = (sitemap: string) => {
  const pattern = /<loc>([^<]+)<\/loc>/g;
  const links = [];
  let match;

  while ((match = pattern.exec(sitemap)) !== null) {
    links.push(match[1]);
  }

  return links;
};

export const crawlRecursiveStream = (sitemapUrl: string) => {
  const maxVisitedUrls = 10;
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for await (const url of crawlRecursive(
        sitemapUrl,
        exampleFetchFunction,
        exampleLinkExtractor,
        maxVisitedUrls
      )) {
        const encoded = encoder.encode(`data: ${JSON.stringify({ url })}\n\n`);
        // wait 1 second to simulate a slow stream
        await new Promise((resolve) => setTimeout(resolve, 100));
        controller.enqueue(encoded);
      }
      controller.close();
    },
  });
  return stream;
};
