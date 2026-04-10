const SUPABASE_URL = "https://fugjkxnxfsnnnhnshxzg.supabase.co";
const SUPABASE_KEY = "sb_publishable_NBQYqfAi42G2K-AsK0ZC5g_SPyEo46R";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
};

export class DeleteUsuarioModel {
  static async borrarPorEmail(id) {
    try {
      await fetch(
        `${SUPABASE_URL}/rest/v1/usuario_turista?id=eq.${id}`,
        {
          method: "DELETE",
          headers
        }
      );
    } catch (error) {
      throw new Error('Error al borrar el usuario: ' + error.message);
    }
  }
}