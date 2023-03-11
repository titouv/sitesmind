"use client"

import { LoadingSpinner } from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "@/components/ui/link"
import { useSupabase } from "@/supabase/components/supabase-provider"
import { useState } from "react"

export function Add() {
  const { supabase, session } = useSupabase()
  const [siteUrl, setSiteUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [siteId, setSiteId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function ingest() {
    setLoading(true)
    const { data: site, error } = await supabase
      .from("sites")
      .insert({ url: siteUrl, user_id: session?.user.id })
      .select()
      .single()
    if (error) {
      console.error(error)
      setError(error.message)
      return
    } else {
      setSiteId(site.id)
      console.log(site)
    }

    const response = await fetch("/api/ingest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: siteUrl, id: site.id }),
    })
    if (!response.ok) {
      try {
        const data = await response.json()
        if (data.status) setError(data.status)
      } catch (e) {
        setError(response.statusText)
      }

      setLoading(false)
      return
    }
    const data = await response.json()

    setData(data)

    setLoading(false)
  }

  return (
    <div className="pt-8">
      {!siteId ? (
        <>
          <Label>
            Enter the adress of the website you want to import data from.
          </Label>
          <div className="flex gap-4">
            <Input
              type="url"
              placeholder="https:/datapix.fr"
              value={siteUrl}
              className="invalid:text-red-500 invalid:border-red-500 "
              onChange={(e) => setSiteUrl(e.target.value)}
            />
            <Button disabled={!siteUrl || loading} onClick={ingest}>
              Create
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4">
          {loading ? (
            <div className="flex  flex-col items-center justify-center">
              Generating chatbot from {siteUrl}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-900">
                <LoadingSpinner />
              </div>
            </div>
          ) : error ? (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          ) : (
            <>
              <span className="py-2">The data as been treated</span>

              {data && (
                <Link href={`/chat/${siteId}`}>
                  Try the generated chatbot from : {siteUrl}
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
