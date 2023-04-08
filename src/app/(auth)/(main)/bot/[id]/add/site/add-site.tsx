"use client";

import { SiteRow } from "@/app/(auth)/(main)/bot/[id]/add/site/siteRow";
import { ComingSoon } from "@/components/coming-soon";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/components/ui/link";
import { useSupabase } from "@/supabase/components/supabase-provider";
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AddSite({ botId }: { botId: string }) {
  const [sourceUrl, setsourceUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [sourceId, setsourceId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [siteUrls, setSiteUrls] = useState<string[]>([]);
  const router = useRouter();

  async function crawl() {
    console.log("makeing ");
    setLoading(true);
    const response = await fetch("/api/sitemapCrawler");

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    function onParse(event: ParsedEvent | ReconnectInterval) {
      if (event.type === "event") {
        const { url } = JSON.parse(event.data);
        setSiteUrls((prev) => [...prev, url]);
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
      setLoading(false);
      done = doneReading;
      const chunkValue = decoder.decode(value);
      console.log(chunkValue);
      const splitted = chunkValue.split("\n\n");
      for (const chunk of splitted) {
        parser.feed(chunk + "\n\n");
      }
    }
  }

  return (
    <div className="pt-8">
      {siteUrls.length == 0 ? (
        <>
          <Label>
            Enter the root URL of the website you want to import data from.
          </Label>
          <div className="mt-2 flex gap-4">
            <Input
              type="url"
              placeholder="https:/example.com"
              value={sourceUrl}
              className="invalid:border-red-500 invalid:text-red-500 "
              onChange={(e) => setsourceUrl(e.target.value)}
            />
            <Button disabled={!sourceUrl || loading} onClick={crawl}>
              Create
            </Button>
          </div>
          <ComingSoon />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4">
          {loading ? (
            <div className="flex  flex-col items-center justify-center">
              Generating chatbot from {sourceUrl}
              <LoadingSpinner />
              <ComingSoon />
            </div>
          ) : error ? (
            <div
              className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center gap-4">
                <Link href={`/bot/${botId}/customize`}>Customize</Link>
                <ul className="flex flex-col gap-4">
                  {siteUrls.map((url) => (
                    <SiteRow botId={botId} siteUrl={url} key={url} />
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
