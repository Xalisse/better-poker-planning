import Pusher from 'pusher-js';
import { useEffect, useState } from 'react';

interface Card {
  cardValue: number
  user: string
}

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
  const [cards, setCards] = useState<Card[]>([])
  const [connectedUsers, setConnectedUsers] = useState<string[]>([])
  const [currentCard, setCurrentCard] = useState<number>()
  const [userName, setUserName] = useState(undefined)

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

  useEffect(() => {
    const pusher = new Pusher('36a15d9047517284e838', {
      cluster: 'eu',
      userAuthentication: { endpoint: '/api/join-planning', transport: 'jsonp' }
    })
    const chanel = pusher.subscribe('id-room');
    chanel.bind('card-choosen', (data: Card) => {
      setCards((oldCards) => {
        const newCards = [...oldCards]
        const index = newCards.findIndex((c) => c.user === data.user)
        if (index === -1) {
          newCards.push(data)
        } else {
          newCards[index] = data
        }
        return newCards
      })
    })
    chanel.bind('user-connected', ({ user }: { user: string }) => {
      // first, we add the new user to the list of connected users
      if (!connectedUsers.find(u => u === user)) {
        setConnectedUsers((users) => [...users, user])
        // then, we send a message to the new user to tell him we are connected & our card choose
        if (user !== userName) {
          postMsg({ user: userName }, 'id-room', 'user-connected')
          currentCard && postMsg({ cardValue: currentCard, user: userName }, 'id-room', 'card-choosen')
        }
      }

    })
    return () => pusher.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  return (
    <main>
      <h1>Better Poker planning</h1>
      <h2>{userName}</h2>
      {cards.map((card) =>
        <div key={card.user}>{card.user} a choisi {card.cardValue}</div>
      )}
      {!userName && 
        <form onSubmit={handleNameSubmitted}>
          <label>Saisissez votre nom d&apos;utilisateur</label>
          <input name='name'></input>
          <button type='submit'>Valider</button>
        </form>
      }
      
      {userName && 
        <div>
          Utilisateurs connectés :
          {connectedUsers.map((user) => 
            <div key={user}>{user}</div>
          )}
          <div>
            {[1, 2, 3, 5, 8, 13, 20, 40, 100, '☕️', '♾️'].map((value) => 
              <button key={value} onClick={handleChooseValue} value={value}>{value}</button>
            )}
          </div>
          <div>
            Ma carte: {currentCard}
          </div>
        </div>
      }
    </main>
  )
}
