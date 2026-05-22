import React, { useEffect, useState } from 'react'

export default function App() {
  const [msg, setMsg] = useState('Loading...')

  useEffect(() => {
    fetch('/api/hello')
      .then((r) => r.json())
      .then((d) => setMsg(d.message))
      .catch(() => setMsg('API unavailable'))
  }, [])

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: 20 }}>
      <h1>React Frontend</h1>
      <p>{msg}</p>
    </div>
  )
}
