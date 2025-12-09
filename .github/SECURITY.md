# Política de Seguridad

## Versiones Soportadas

| Versión | Soportada |
|---------|-----------|
| 1.x     | ✅        |
| < 1.0   | ❌        |

## Reportar Vulnerabilidades

Si descubres una vulnerabilidad de seguridad, por favor:

1. **NO** abras un issue público
2. Envía un email a: [security@sardin-ai.com] (reemplazar con email real)
3. Incluye:
   - Descripción de la vulnerabilidad
   - Pasos para reproducir
   - Impacto potencial
   - Tu información de contacto

## Tiempo de Respuesta

- **Acknowledgment:** 48 horas
- **Triage inicial:** 7 días
- **Parche (crítico):** 30 días
- **Parche (otros):** 90 días

## Alcance

Consideramos vulnerabilidades en:

- Autenticación y autorización
- Exposición de datos sensibles
- Inyección de código
- XSS
- CSRF
- Dependencias con CVEs conocidos

## Recompensas

Actualmente no tenemos programa de bug bounty, pero reconocemos públicamente a quienes reporten vulnerabilidades responsablemente.

## Prácticas de Seguridad

- Dependencias actualizadas regularmente
- Auditorías de código en PRs
- No almacenamos credenciales en código
- HTTPS obligatorio en producción
- Sanitización de inputs
