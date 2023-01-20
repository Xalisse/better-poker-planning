import Pusher from 'pusher-js';
import { useEffect, useState } from 'react';

const postMsg = async (data: any, chanel: string, event: string) => {
  const res = await fetch('/api/channels-event', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({...data, chanel, event}),
  })
  if (!res.ok) {
    console.error('failed to push data');
  }
  return res
}

export default function Home() {
  const [msg, setMsg] = useState('')
  const [currentCard, setCurrentCard] = useState(undefined)
  const [userName, setUserName] = useState(undefined)

  useEffect(() => {
    const p = new Pusher('36a15d9047517284e838', {
      cluster: 'eu'
    })
    const c = p.subscribe('id-room');
    c.bind('user-connected', (data: any) => {
      setMsg(JSON.stringify(data))
    })
    c.bind('card-choosen', (data: any) => {
      setMsg(JSON.stringify(data))
    })
    return () => p.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  const handleNameSubmitted = (e: any) => {
    e.preventDefault()
    setUserName(e.target.name.value)
    postMsg({ user: e.target.name.value }, 'id-room', 'user-connected')
  }

  const handleChooseValue = async (e: any) => {
    const card = e.target.value
    setCurrentCard(card)
    postMsg({ cardValue: card, user: userName }, 'id-room', 'card-choosen')
  }

  return (
    <main>
      <h1>Better Poker planning</h1>
      {msg}
      {!userName && 
        <form onSubmit={handleNameSubmitted}>
          <label>Saisissez votre nom d&apos;utilisateur</label>
          <input name='name'></input>
          <button type='submit'>Valider</button>
        </form>
      }
      
      {userName && 
        <div>
          
          <div>
            {[1, 2, 3, 5, 8, 13, 20, 40, 100, '☕️', '♾️'].map((value) => 
              <button key={value} onClick={handleChooseValue} value={value}>{value}</button>
            )}
          </div>
        </div>
      }
    </main>
  )
}
