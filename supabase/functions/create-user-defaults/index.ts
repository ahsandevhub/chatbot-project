Deno.serve(async (req) => {
    const { email } = await req.json()
    const data = {
      message: `Hello ${email}!`,
    }
  
    return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })
  })
  