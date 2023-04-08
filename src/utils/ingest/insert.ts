import { Database } from "@/supabase/database.types";
import { createBrowserClient } from "@/supabase/utils/browser";
import { Metadata } from "@/utils/ingest/types";

type RowToInsert = Database["public"]["Tables"]["documents"]["Insert"];
type Row = Omit<
  Database["public"]["Tables"]["documents"]["Insert"],
  "metadata"
> & {
  metadata: Metadata;
};

export async function insertDocumentInSupabase(dataToInsert: Row[]) {
  const botId = dataToInsert[0].bot_id;

  console.log("Inserting documents into Supabase");
  const supabaseClient = createBrowserClient();
  // In production we should handle possible errors
  await supabaseClient.from("documents").delete().eq("bot_id", botId);

  // In production we should handle possible errors
  // @ts-expect-error
  const { error } = await supabaseClient.from("documents").insert(dataToInsert);
  if (error) {
    console.error("Error while inserting documents", error);
    throw new Error("Error while inserting documents");
  }
}
