"use client";

import { IngestApiSchemaType } from "@/app/api/bot/[id]/ingest/route";
import { ComingSoon } from "@/components/coming-soon";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/components/ui/link";
import { useSupabase } from "@/supabase/components/supabase-provider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Add() {
  const { supabase, session } = useSupabase();
  const [siteUrl, setSiteUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [siteId, setSiteId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [botId, setBotId] = useState<string | null>(null);

  const router = useRouter();

  async function ingest() {
    setLoading(true);
    if (!session) return;
    const { data: bot, error: botError } = await supabase
      .from("bots")
      .insert({ user_id: session.user.id })
      .select()
      .single();

    if (botError) {
      console.error(botError);
      setError(botError.message);
      return;
    }
    setBotId(bot.id);

    const { data: site, error: siteError } = await supabase
      .from("sites")
      .insert({ url: siteUrl, bot_id: bot.id })
      .select()
      .single();

    if (siteError) {
      console.error(siteError);
      setError(siteError.message);
      return;
    } else {
      setSiteId(site.id);
      console.log(bot);
    }

    console.log("body", { url: siteUrl, id: bot.id });

    const url = new URL(
      `/api/bot/${bot.id}/new_ingest`,
      window.location.origin
    );

    url.searchParams.set("siteId", site.id.toString());
    url.searchParams.set("url", siteUrl);

    const response = await fetch(url);
    if (!response.ok) {
      setError("Something went wrong");
      setLoading(false);
      return;
    }
    const data = await response.json();

    router.push(`/bot/${bot.id}/chat`);
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
              <div className="mt-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900">
                <LoadingSpinner />
              </div>
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
