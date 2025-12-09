# 🤝 Contribuir a SARDIN-AI

¡Gracias por tu interés en contribuir a SARDIN-AI! Este documento te guiará en el proceso.

## 📋 Código de Conducta

Este proyecto se adhiere a un código de conducta. Al participar, se espera que lo respetes.

### Nuestros Estándares

- Usar lenguaje acogedor e inclusivo
- Respetar diferentes puntos de vista y experiencias
- Aceptar críticas constructivas con gracia
- Enfocarse en lo mejor para la comunidad
- Mostrar empatía hacia otros miembros

## 🚀 Cómo Contribuir

### Reportar Bugs

1. **Busca primero** - Revisa si ya existe un issue similar
2. **Crea un issue** usando la plantilla de bug
3. **Incluye detalles**:
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots si aplica
   - Versión del navegador/OS

### Sugerir Features

1. **Revisa IDEAS_NUEVAS.md** - Tu idea podría estar ahí
2. **Abre un issue** con la etiqueta "enhancement"
3. **Describe**:
   - El problema que resuelve
   - La solución propuesta
   - Alternativas consideradas

### Pull Requests

#### Setup del Entorno

```bash
# 1. Fork el repositorio en GitHub

# 2. Clona tu fork
git clone https://github.com/TU-USUARIO/sardin-sea-mind.git
cd sardin-sea-mind

# 3. Agrega el upstream
git remote add upstream https://github.com/ORIGINAL/sardin-sea-mind.git

# 4. Instala dependencias
npm install

# 5. Crea una rama
git checkout -b feature/mi-feature

# 6. Inicia desarrollo
npm run dev
```

#### Proceso de PR

1. **Asegúrate de que el código compila**

   ```bash
   npm run build
   ```

2. **Pasa los linters**

   ```bash
   npm run lint
   ```

3. **Escribe tests** (cuando aplique)

4. **Commit con mensajes claros**

   ```
   feat: agregar predicción de mareas
   fix: corregir cálculo de ruta
   docs: actualizar README
   style: formatear código
   refactor: simplificar servicio de clima
   test: agregar tests de auth
   ```

5. **Push y crea PR**

   ```bash
   git push origin feature/mi-feature
   ```

6. **En la PR describe**:
   - Qué cambios hiciste
   - Por qué los hiciste
   - Screenshots si hay cambios visuales

## 📁 Estructura del Proyecto

```
sardin-sea-mind/
├── src/
│   ├── agents/         # Sistema multi-agente IA
│   ├── components/     # Componentes React
│   │   ├── dashboard/  # Widgets del dashboard
│   │   ├── navigation/ # Controles de navegación
│   │   └── ui/         # Componentes Shadcn/UI
│   ├── contexts/       # Contextos React
│   ├── hooks/          # Hooks personalizados
│   ├── integrations/   # Integraciones (PocketBase)
│   ├── pages/          # Páginas de la app
│   ├── services/       # Servicios externos
│   └── types/          # Definiciones TypeScript
├── pocketbase/         # Configuración del backend
├── docs/               # Documentación
└── public/             # Assets estáticos
```

## 🎨 Guía de Estilo

### TypeScript

- Usar tipos explícitos, evitar `any`
- Interfaces sobre types cuando sea posible
- Documentar funciones públicas con JSDoc

```typescript
/**
 * Calcula la ruta óptima entre dos puntos
 * @param origin Coordenadas de origen
 * @param destination Coordenadas de destino
 * @returns Ruta optimizada con waypoints
 */
function calculateRoute(origin: Coordinates, destination: Coordinates): Route {
  // ...
}
```

### React

- Componentes funcionales con hooks
- Props destructuradas
- Nombres descriptivos

```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}

export function Button({ variant, onClick, children }: ButtonProps) {
  return (
    <button className={`btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}
```

### CSS

- Usar Tailwind CSS
- Variables CSS para colores custom
- Mobile-first responsive

## 🧪 Testing

```bash
# Ejecutar tests
npm run test

# Con coverage
npm run test:coverage
```

## 📝 Documentación

- Actualiza README si agregas features
- Documenta APIs nuevas
- Agrega a FAQ si es pregunta común
- Actualiza CHANGELOG

## 🏷️ Etiquetas de Issues

| Etiqueta | Descripción |
|----------|-------------|
| `bug` | Algo no funciona |
| `enhancement` | Nueva feature |
| `documentation` | Mejora de docs |
| `good first issue` | Bueno para nuevos |
| `help wanted` | Se necesita ayuda |
| `priority: high` | Urgente |
| `priority: low` | Cuando se pueda |

## 🎯 Áreas de Contribución

### Para Desarrolladores

- Nuevos agentes IA
- Integraciones de APIs
- Mejoras de UI/UX
- Tests automatizados
- Optimización de rendimiento

### Para No-Desarrolladores

- Traducción de documentación
- Reportar bugs
- Sugerir features
- Escribir tutoriales
- Probar en diferentes dispositivos

### Para Expertos del Dominio

- Validar predicciones de pesca
- Sugerir mejoras en navegación
- Feedback de UX marítimo
- Conexiones con cooperativas

## 💬 Comunicación

- **Issues** - Para bugs y features
- **Discussions** - Para preguntas y charla
- **Discord** - [Próximamente]

## 🙏 Reconocimiento

Todos los contribuidores son agregados a CONTRIBUTORS.md

---

¿Preguntas? Abre un issue con la etiqueta "question"

**¡Gracias por hacer SARDIN-AI mejor!** 🚢
