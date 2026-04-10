const SUPABASE_URL = "https://fugjkxnxfsnnnhnshxzg.supabase.co";
const SUPABASE_KEY = "sb_publishable_NBQYqfAi42G2K-AsK0ZC5g_SPyEo46R";

// Cliente genérico tipo "connection"
export const connectionDB = {
  
  // 🔍 GET (SELECT)
  async get(endpoint) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
      method: "GET",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      }
    });

    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // ➕ POST (INSERT)
  async post(endpoint, data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation"
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // ✏️ PATCH (UPDATE)
  async patch(endpoint, data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
      method: "PATCH",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // ❌ DELETE
  async delete(endpoint) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
      method: "DELETE",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      }
    });

    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
};