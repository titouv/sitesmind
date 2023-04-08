"use client";

import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";
import { useState } from "react";

export default function Page() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  async function makeRequest() {
    console.log("makeing ");
    setLoading(true);
    const response = await fetch("/api/sitemapCrawler");

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    function onParse(event: ParsedEvent | ReconnectInterval) {
      if (event.type === "event") {
        const { url } = JSON.parse(event.data);
        setData((prev) => [...prev, url]);
      }
    }

    const data = response.body;
    if (!data) {
      throw new Error("No data");
    }

    const parser = createParser(onParse);
    const decoder = new TextDecoder("utf-8");
    const reader = data.getReader();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      const splitted = chunkValue.split("\n\n");
      for (const chunk of splitted) {
        parser.feed(chunk + "\n\n");
      }
    }

    setLoading(false);
  }

  return (
    <div>
      <h1>Page</h1>
      <button
        className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
        onClick={makeRequest}
      >
        Generate
      </button>
      Content
      {loading && <div>Loading...</div>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
