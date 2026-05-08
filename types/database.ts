// Bu dosya `supabase gen types typescript --local > types/database.ts` ile yeniden üretilecek.
// Supabase Dashboard kurulumu tamamlandıktan sonra güncelleyin.
export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
