"use client";

import { ComingSoon } from "@/components/coming-soon";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "@/components/ui/link";
import { cn } from "@/lib/utils";
import { useSupabase } from "@/supabase/components/supabase-provider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Dropzone, { Accept, FileRejection } from "react-dropzone";

type File = FileRejection["file"];

export function AddPdf({ botId }: { botId: string }) {
  const { supabase, session } = useSupabase();
  const [pdfFile, setPdfFile] = useState<File>();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [sourceId, setsourceId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  async function ingest() {
    setLoading(true);
    if (!session) return;
    if (!pdfFile) return;

    const fileName = pdfFile.name;
    const filePath = `public/${session.user.id}/${fileName}`;

    const { data, error } = await supabase.storage
      .from("pdf")
      .upload(filePath, pdfFile, {
        cacheControl: "3600",
        upsert: false,
      });

    console.log(data, error);
    // get public url
    const {
      data: { publicUrl },
    } = supabase.storage.from("pdf").getPublicUrl(filePath);
    console.log(publicUrl);

    const { data: source, error: sourceError } = await supabase
      .from("sources")
      .insert({
        type: "pdf",
        metadata: { fileName, url: publicUrl },
        bot_id: botId,
      })
      .select()
      .single();
    if (sourceError) {
      throw sourceError;
    }

    console.log(source, sourceError);
    setsourceId(source.id);

    const contentResponse = await fetch("/api/getPdfDocument", {
      method: "POST",
      body: JSON.stringify({ url: publicUrl }),
    });
    const content = await contentResponse.json();
    console.log(content);

    const url = new URL(`/api/bot/${botId}/ingest/pdf`, window.location.origin);

    const formData = new FormData();
    formData.append("documents", JSON.stringify(content));
    formData.append("sourceId", source.id.toString());
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      setError("Something went wrong");
      setLoading(false);
      return;
    }
    const responseData = await response.json();
    console.log(responseData);

    setData(responseData);
  }

  const acceptedFileTypes: Accept = {
    "application/pdf": [".pdf"],
  };
  return (
    <div className="pt-8">
      {!sourceId ? (
        <>
          <Label>Enter the PDF file that you want your bot to know.</Label>
          <div className="mt-2 flex flex-col gap-4">
            <Dropzone
              accept={acceptedFileTypes}
              onDrop={(acceptedFiles) => {
                setPdfFile(acceptedFiles[0]);
              }}
              onDropRejected={(rejectedFiles) => {
                console.log(rejectedFiles);
              }}
              validator={(file) => {
                // limit to 10MB
                if (file.size > 10 * 1024 * 1024) {
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
