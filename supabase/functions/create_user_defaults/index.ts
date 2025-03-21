import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

serve(async (req) => {
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: {
                'Access-Control-Allow-Origin': '*', // Replace with your frontend's origin
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Authorization, Content-Type',
            },
        });
    }

    // Handle POST requests
    if (req.method === 'POST') {
        // ... (rest of your Edge Function code remains the same) ...
        const authHeader = req.headers.get('Authorization');
        let user = null;
        if (authHeader) {
            const token = authHeader.replace('Bearer ', '');
            const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
                global: { headers: { Authorization: authHeader } },
            });
            const { data: { user: authUser }, error: userError } = await supabaseClient.auth.getUser();
            if (userError || !authUser) {
                return new Response(JSON.stringify({ error: userError || 'User not found' }), {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            user = authUser;
        } else {
            // If no Authorization header, we will try to get the user from the request body.
            // This is important for auth hooks
            try {
                const body = await req.json();
                if (body && body.event && body.event.data) {
                    user = body.event.data;
                }
            } catch (error) {
                console.error("Error parsing request body:", error);
                return new Response(JSON.stringify({ error: "Error parsing request body" }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            if (!user) {
                return new Response(JSON.stringify({ error: "User data not found in request body" }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        }

        const userId = user.id;
        const internCredits = 2;

        try {
            // Insert default subscription
            const { error: subError } = await supabaseClient.from('subscriptions').insert([
                {
                    user_id: userId,
                    plan: 'intern',
                    status: 'active',
                    credits_limit: internCredits,
                },
            ]);

            if (subError) {
                console.error('Subscription insert error:', subError);
                return new Response(JSON.stringify({ error: 'Failed to create subscription' }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            // Insert default user credits
            const { error: creditsError } = await supabaseClient.from('user_credits').insert([
                {
                    user_id: userId,
                    credits_available: internCredits,
                    last_reset_date: new Date().toISOString().slice(0, 10), // Current date
                },
            ]);

            if (creditsError) {
                console.error('Credits insert error:', creditsError);
                return new Response(JSON.stringify({ error: 'Failed to create user credits' }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            return new Response(JSON.stringify({ message: 'User defaults created' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (error) {
            console.error('Unexpected error:', error);
            return new Response(JSON.stringify({ error: 'Internal server error' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
                headers: { 'Content-Type': 'application/json' },
            });
        }
    }
    return new Response('Not Found', { status: 404 });
});