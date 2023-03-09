"use client"

import { useState } from "react"

export default function TestComponent() {
  const [input, setInput] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [data, setData] = useState<string>("")
  const [startTimer, setStartTimer] = useState<number>(0)
  const [endTimer, setEndTimer] = useState<number>(0)

  const generate = async (e: any) => {
    e.preventDefault()
    setData("")
    setLoading(true)
    const start = Date.now()
    const response = await fetch("/api/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: input,
      }),
    })
    console.log(response)
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
    let first = false
    while (!done) {
      const { value, done: doneReading } = await reader.read()
      if (!first) {
        setStartTimer(Date.now() - start)
        first = true
      }
      done = doneReading
      const chunkValue = decoder.decode(value)
      setData((prev) => prev + chunkValue)
    }
    setEndTimer(Date.now() - start)
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
      <button onClick={generate}>Submit</button>
      <div>
        Start: {startTimer.toLocaleString()}ms End: {endTimer.toLocaleString()}
        ms
      </div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {data && <div>Data :{data}</div>}
    </div>
  )
}
