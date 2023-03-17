"use client";

import { ComingSoon } from "@/components/coming-soon";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/components/ui/link";
import { useSupabase } from "@/supabase/components/supabase-provider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AddSite({ botId }: { botId: string }) {
  const { supabase, session } = useSupabase();
  const [siteUrl, setSiteUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [siteId, setSiteId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  async function ingest() {
    setLoading(true);
    if (!session) return;

    const { data: site, error: siteError } = await supabase
      .from("sources")
      .insert({ meta: siteUrl, bot_id: botId })
      .select()
      .single();

    if (siteError) {
      console.error(siteError);
      setError(siteError.message);
      throw siteError;
      return;
    } else {
      setSiteId(site.id);
      console.log(site.id);
    }

    console.log("body", { url: siteUrl, id: botId });

    const url = new URL(
      `/api/bot/${botId}/ingest/site`,
      window.location.origin
    );

    url.searchParams.set("sourceId", site.id.toString());
    url.searchParams.set("url", siteUrl);

    const response = await fetch(url);
    if (!response.ok) {
      setError("Something went wrong");
      setLoading(false);
      return;
    }
    const data = await response.json();

    router.push(`/bot/${botId}/chat`);
  }

  return (
    <div className="pt-8">
      {!siteId ? (
        <>
          <Label>
            Enter the adress of the website you want to import data from.
          </Label>
          <div className="mt-2 flex gap-4">
            <Input
              type="url"
              placeholder="https:/example.com"
              value={siteUrl}
              className="invalid:border-red-500 invalid:text-red-500 "
              onChange={(e) => setSiteUrl(e.target.value)}
            />
            <Button disabled={!siteUrl || loading} onClick={ingest}>
              Create
            </Button>
          </div>
          <ComingSoon />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4">
          {loading ? (
            <div className="flex  flex-col items-center justify-center">
              Generating chatbot from {siteUrl}
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
              <span className="py-2">The data has been treated</span>

              {data && (
                <Link href={`/bot/${botId}/chat`}>
                  Try the generated chatbot
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
