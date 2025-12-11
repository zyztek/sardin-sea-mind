# ⚠️ NOTA DE MIGRACIÓN: SUPABASE A POCKETBASE

**Fecha:** 9 Diciembre 2025

Este proyecto ha migrado su backend de **Supabase** a **PocketBase**.

### 🟢 ARQUITECTURA ACTIVA

* **Cliente:** `src/integrations/pocketbase/client.ts`
* **Autenticación:** `src/contexts/AuthContext.tsx` (Usa PocketBase)
* **Base de Datos:** PocketBase (SQLite mode)

### 🔴 CÓDIGO OBSOLETO (TO-DO: CLEANUP)

* Carpeta `supabase/` (migraciones SQL)
* Carpeta `src/integrations/supabase/`
* Dependencia `@supabase/supabase-js` en `package.json`

**Por favor, utilice únicamente los servicios ubicados en `src/services/pocketbase` y `src/integrations/pocketbase`.**
