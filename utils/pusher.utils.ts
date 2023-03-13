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

export {postMsg}
