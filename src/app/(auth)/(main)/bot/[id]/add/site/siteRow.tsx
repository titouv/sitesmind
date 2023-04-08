"use client";

import { LoadingSpinner } from "@/components/loading-spinner";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/supabase/components/supabase-provider";
import { useState } from "react";

export function SiteRow({
  botId,
  siteUrl,
}: {
  botId: string;
  siteUrl: string;
}) {
  const { supabase, session } = useSupabase();
  const [loading, setLoading] = useState(false);
  const [sourceId, setsourceId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    console.log("generate", siteUrl);
    setLoading(true);
    if (!session) return;

    const { data: source, error: sourceError } = await supabase
      .from("sources")
      .insert({ type: "text", metadata: { siteUrl: siteUrl }, bot_id: botId })
      .select()
      .single();

    if (sourceError) {
      console.error(sourceError);
      setError(sourceError.message);
      return;
    } else {
      setsourceId(source.id);
      console.log(source.id);
    }
  }
  return (
    <li className="flex w-full items-center justify-between gap-6 rounded-md px-4 py-2 odd:bg-gray-100">
      <div className="w-96 truncate">{siteUrl}</div>

      <Button onClick={generate}>
        {loading ? (
          <div className="h-4 w-4">
            <Spinner />
          </div>
        ) : sourceId ? (
          "Generated"
        ) : (
          "Generate"
        )}
      </Button>
    </li>
  );
}
