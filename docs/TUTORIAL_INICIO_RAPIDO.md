# 🚀 SARDIN-AI - Tutorial de Inicio Rápido

## Comienza a usar SARDIN-AI en 5 minutos

---

# 📋 Requisitos Previos

- **Node.js** 18+ ([descargar](https://nodejs.org))
- **Git** ([descargar](https://git-scm.com))
- **Navegador moderno** (Chrome, Firefox, Edge)

---

# 🔧 Paso 1: Clonar el Repositorio

```bash
# Clonar
git clone https://github.com/tu-usuario/sardin-sea-mind.git

# Entrar al directorio
cd sardin-sea-mind
```

---

# 📦 Paso 2: Instalar Dependencias

```bash
npm install
```

Esto instalará todas las dependencias necesarias (~2-3 minutos).

---

# ⚙️ Paso 3: Configurar PocketBase (Backend)

### Opción A: Descargar Ejecutable (Recomendado)

1. Ve a [pocketbase.io/docs](https://pocketbase.io/docs)
2. Descarga la versión para tu sistema
3. Extrae en la carpeta `pocketbase/`
4. Ejecuta:

**Windows:**

```powershell
cd pocketbase
.\pocketbase.exe serve
```

**Mac/Linux:**

```bash
cd pocketbase
./pocketbase serve
```

### Opción B: Usar Docker

```bash
docker-compose up pocketbase -d
```

---

# 🗄️ Paso 4: Configurar Base de Datos

1. Abre <http://localhost:8090/_/>
2. Crea una cuenta de administrador
3. Ve a **Settings** → **Import collections**
4. Importa el archivo `pocketbase/pb_schema.json`

---

# 🌐 Paso 5: Iniciar el Frontend

En una **nueva terminal**:

```bash
npm run dev
```

Abre <http://localhost:8080> en tu navegador.

---

# ✅ ¡Listo

Deberías ver el dashboard de SARDIN-AI.

## Primeros Pasos en la App

1. **Registrar cuenta** - Click en "Registrarse"
2. **Explorar dashboard** - Navega por las secciones
3. **Ver clima** - El widget de clima se actualiza automáticamente
4. **Activar agentes IA** - En el panel de agentes, click "Iniciar"

---

# 🔍 Verificar Todo Funciona

### Checklist

- [ ] PocketBase corriendo en <http://localhost:8090>
- [ ] Frontend corriendo en <http://localhost:8080>
- [ ] Puedes crear una cuenta
- [ ] Dashboard carga correctamente
- [ ] Widget de clima muestra datos

### Si Algo Falla

1. **Error de conexión a PocketBase:**
   - Verifica que PocketBase esté corriendo
   - Revisa que el puerto 8090 esté libre

2. **Error al instalar dependencias:**

   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Puerto 8080 ocupado:**
   - El frontend automáticamente usará otro puerto
   - Revisa la terminal para ver cuál

---

# 📚 Próximos Pasos

- [Tutorial de Desarrollo](./TUTORIAL_DESARROLLO.md) - Para contribuir código
- [Tutorial de Despliegue](./TUTORIAL_DESPLIEGUE.md) - Para producción
- [Ejemplos de Uso](./EJEMPLOS_USO.md) - Casos de uso prácticos
- [FAQ](./FAQ.md) - Preguntas frecuentes

---

# 🆘 ¿Necesitas Ayuda?

- **GitHub Issues:** Reporta problemas
- **Documentación:** Revisa `/docs`
- **Community:** [Próximamente]

---

*Tutorial actualizado: 2024-12-09*
