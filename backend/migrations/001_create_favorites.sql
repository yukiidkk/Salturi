-- ============================================
-- SALTURI — Migración: Tabla de Favoritos
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- Crear tabla de favoritos
CREATE TABLE IF NOT EXISTS public.favorites (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    place_id integer NOT NULL,
    place_name text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Índice único para evitar duplicados (un usuario no puede guardar el mismo lugar dos veces)
CREATE UNIQUE INDEX IF NOT EXISTS idx_favorites_user_place 
    ON public.favorites(user_id, place_id);

-- Índice para queries por usuario
CREATE INDEX IF NOT EXISTS idx_favorites_user 
    ON public.favorites(user_id);

-- ============================================
-- POLÍTICAS RLS
-- ============================================

-- Habilitar RLS
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Los usuarios solo pueden ver sus propios favoritos
CREATE POLICY "Users can view own favorites"
    ON public.favorites FOR SELECT
    USING (auth.uid() = user_id);

-- Los usuarios solo pueden insertar sus propios favoritos
CREATE POLICY "Users can insert own favorites"
    ON public.favorites FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Los usuarios solo pueden eliminar sus propios favoritos
CREATE POLICY "Users can delete own favorites"
    ON public.favorites FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- COMENTARIO
-- ============================================
COMMENT ON TABLE public.favorites IS 'Lugares favoritos guardados por usuarios autenticados de SALTURI';
