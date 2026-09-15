import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface CreatePayload {
  email: string;
  password: string;
  fullName: string;
  role: 'admin' | 'superadmin';
}

interface DeletePayload {
  id: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return json({ message: 'Authentification requise.' }, 401);
  }

  const callerClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user: caller }, error: callerError } = await callerClient.auth.getUser();
  if (callerError || !caller) {
    return json({ message: 'Authentification requise.' }, 401);
  }

  const { data: callerProfile } = await callerClient
    .from('admin_users')
    .select('role')
    .eq('id', caller.id)
    .single();

  if (callerProfile?.role !== 'superadmin') {
    return json({ message: 'Reserve aux superadmins.' }, 403);
  }

  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  if (req.method === 'POST') {
    let payload: Partial<CreatePayload>;
    try {
      payload = await req.json();
    } catch {
      return json({ message: 'Corps de requete invalide.' }, 422);
    }

    const { email, password, fullName, role } = payload;
    if (!email || !password || !fullName || !role) {
      return json({ message: 'Email, mot de passe, nom et role sont requis.' }, 422);
    }
    if (password.length < 8) {
      return json({ message: 'Le mot de passe doit contenir au moins 8 caracteres.' }, 422);
    }
    if (role !== 'admin' && role !== 'superadmin') {
      return json({ message: 'Role invalide.' }, 422);
    }

    const { data: created, error: createErr } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createErr || !created.user) {
      const isDuplicate = createErr?.message?.toLowerCase().includes('already been registered')
        || createErr?.message?.toLowerCase().includes('already registered');
      return json(
        { message: isDuplicate ? 'Cet email est deja utilise.' : (createErr?.message ?? 'Creation impossible.') },
        isDuplicate ? 409 : 500,
      );
    }

    const { error: insertErr } = await adminClient
      .from('admin_users')
      .insert({ id: created.user.id, email, full_name: fullName, role });

    if (insertErr) {
      await adminClient.auth.admin.deleteUser(created.user.id);
      return json({ message: insertErr.message }, 500);
    }

    return json({ id: created.user.id, email, fullName, role }, 201);
  }

  if (req.method === 'DELETE') {
    let payload: Partial<DeletePayload>;
    try {
      payload = await req.json();
    } catch {
      return json({ message: 'Corps de requete invalide.' }, 422);
    }

    const { id } = payload;
    if (!id) {
      return json({ message: "L'identifiant est requis." }, 422);
    }
    if (id === caller.id) {
      return json({ message: 'Vous ne pouvez pas supprimer votre propre compte.' }, 400);
    }

    const { error: deleteRowErr } = await adminClient.from('admin_users').delete().eq('id', id);
    if (deleteRowErr) {
      return json({ message: deleteRowErr.message }, 500);
    }

    const { error: deleteAuthErr } = await adminClient.auth.admin.deleteUser(id);
    if (deleteAuthErr) {
      return json({ message: deleteAuthErr.message }, 500);
    }

    return json({ id }, 200);
  }

  return json({ message: 'Methode non supportee.' }, 405);
});
