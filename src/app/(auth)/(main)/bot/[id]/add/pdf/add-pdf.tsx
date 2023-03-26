"use client";

import { ComingSoon } from "@/components/coming-soon";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/components/ui/link";
import { cn } from "@/lib/utils";
import { useSupabase } from "@/supabase/components/supabase-provider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Dropzone, { Accept, FileRejection } from "react-dropzone";

type File = FileRejection["file"];

export function AddText({ botId }: { botId: string }) {
  const { supabase, session } = useSupabase();
  const [pdfFile, setPdfFile] = useState<File>();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [siteId, setSiteId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  async function ingest() {
    setLoading(true);
    if (!session) return;
    if (!pdfFile) return;

    const pdfFileName = pdfFile.name;

    const { data: site, error: siteError } = await supabase
      .from("sources")
      .insert({ meta: pdfFileName, bot_id: botId })
      .select()
      .single();

    if (siteError) {
      console.error(siteError);
      setError(siteError.message);
      return;
    } else {
      setSiteId(site.id);
      console.log(site.id);
    }

    console.log("body", { url: pdfFile, id: botId });

    const url = new URL(`/api/bot/${botId}/ingest/pdf`, window.location.origin);

    const formData = new FormData();
    formData.append("file", pdfFile);
    formData.append("sourceId", site.id.toString());
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      setError("Something went wrong");
      setLoading(false);
      return;
    }
    const data = await response.json();

    router.push(`/bot/${botId}/chat`);
  }

  const acceptedFileTypes: Accept = {
    "application/pdf": [".pdf"],
  };
  return (
    <div className="pt-8">
      {!siteId ? (
        <>
          <Label>Enter the PDF file that you want your bot to know.</Label>
          <div className="mt-2 flex flex-col gap-4">
            <Dropzone
              accept={acceptedFileTypes}
              onDrop={(acceptedFiles) => {
                setPdfFile(acceptedFiles[0]);
              }}
              validator={(file) => {
                if (file.size > 10000000) {
                  return {
                    code: "file-too-large",
                    message: "File is too large",
                  };
                }
                return null;
              }}
            >
              {({ getRootProps, getInputProps, acceptedFiles }) => (
                <div
                  className={cn(
                    "flex w-96 flex-col items-center justify-center gap-4 rounded-md border-2 border-dashed border-gray-300 bg-gray-100 p-8  hover:border-gray-500",
                    acceptedFiles.length > 0 &&
                      "border-solid border-green-500 bg-green-50 hover:border-green-500"
                  )}
                >
                  {acceptedFiles.length < 1 ? (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <p>Drop a PDF here, or click to select a file</p>
                    </div>
                  ) : (
                    <span className="text-center">
                      File accepted :<br /> {acceptedFiles[0].name}
                    </span>
                  )}
                </div>
              )}
            </Dropzone>
            <Button disabled={!pdfFile || loading} onClick={ingest}>
              Create
            </Button>
          </div>
          <ComingSoon />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center">
              <>
                Generating chatbot from {pdfFile?.name}
                <LoadingSpinner />
                <ComingSoon />
              </>
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
