"use client"

import { useState } from "react"

export default function TestComponent() {
  const [input, setInput] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [data, setData] = useState<string>("")

  const generateBio = async (e: any) => {
    e.preventDefault()
    setData("")
    setLoading(true)
    const response = await fetch("/api/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: input,
      }),
    })

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    // This data is a ReadableStream
    const data = response.body
    if (!data) {
      return
    }

    const reader = data.getReader()
    const decoder = new TextDecoder()
    let done = false

    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      const chunkValue = decoder.decode(value)
      setData((prev) => prev + chunkValue)
    }
    // scrollToBios()
    setLoading(false)
  }

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={generateBio}>Submit</button>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {data && <div>Data :{data}</div>}
    </div>
  )
}
