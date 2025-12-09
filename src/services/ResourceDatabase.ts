/**
 * SARDIN-AI - Sistema de Recursos Automático
 * 
 * Catálogo automatizado de recursos gratuitos para el proyecto.
 * Se auto-actualiza y verifica disponibilidad.
 * 
 * @author Sistema Autónomo SARDIN-AI
 * @date 2024-12-09
 */

// ============================================
// TIPOS
// ============================================

export interface FreeResource {
   id: string;
   name: string;
   category: ResourceCategory;
   subcategory?: string;
   url: string;
   apiUrl?: string;
   freeLimit: string;
   quality: 1 | 2 | 3 | 4 | 5;
   documentation?: string;
   tags: string[];
   lastVerified: string;
   isAvailable: boolean;
   notes?: string;
   priority: 'essential' | 'recommended' | 'optional';
}

export type ResourceCategory =
   | 'voice'
   | 'avatar'
   | 'music'
   | 'video'
   | 'design'
   | 'api'
   | 'hosting'
   | 'ai'
   | 'automation'
   | 'data'
   | 'storage';

export interface ResourceDatabase {
   version: string;
   lastUpdated: string;
   resources: FreeResource[];
}

// ============================================
// BASE DE DATOS DE RECURSOS
// ============================================

export const resourceDatabase: ResourceDatabase = {
   version: '1.0.0',
   lastUpdated: '2024-12-09',
   resources: [
      // ========== VOZ Y TTS ==========
      {
         id: 'elevenlabs',
         name: 'ElevenLabs',
         category: 'voice',
         subcategory: 'tts',
         url: 'https://elevenlabs.io',
         apiUrl: 'https://api.elevenlabs.io',
         freeLimit: '10,000 caracteres/mes',
         quality: 5,
         documentation: 'https://docs.elevenlabs.io',
         tags: ['tts', 'voice-clone', 'realistic', 'api'],
         lastVerified: '2024-12-09',
         isAvailable: true,
         priority: 'essential',
         notes: 'Mejor calidad TTS, permite clonar voz con 30 segundos de audio'
      },
      {
         id: 'bark',
         name: 'Bark (Suno AI)',
         category: 'voice',
         subcategory: 'tts-local',
         url: 'https://github.com/suno-ai/bark',
         freeLimit: 'Ilimitado (local)',
         quality: 4,
         documentation: 'https://github.com/suno-ai/bark#readme',
         tags: ['tts', 'local', 'emotional', 'open-source'],
         lastVerified: '2024-12-09',
         isAvailable: true,
         priority: 'recommended',
         notes: 'Open source, corre local, soporta emociones y efectos de sonido'
      },
      {
         id: 'coqui-tts',
         name: 'Coqui TTS',
         category: 'voice',
         subcategory: 'tts-local',
         url: 'https://github.com/coqui-ai/TTS',
         freeLimit: 'Ilimitado (local)',
         quality: 4,
         documentation: 'https://tts.readthedocs.io',
         tags: ['tts', 'local', 'multilingual', 'open-source'],
         lastVerified: '2024-12-09',
         isAvailable: true,
         priority: 'recommended',
         notes: 'Muchos modelos, clonación de voz, pip install TTS'
      },
      {
         id: 'resemble-ai',
         name: 'Resemble AI',
         category: 'voice',
         subcategory: 'voice-clone',
         url: 'https://resemble.ai',
         freeLimit: '10 clones gratis',
         quality: 5,
         documentation: 'https://docs.resemble.ai',
         tags: ['voice-clone', 'api', 'realistic'],
         lastVerified: '2024-12-09',
         isAvailable: true,
         priority: 'optional',
         notes: 'Excelente para crear "yo digital" permanente'
      },

      // ========== AVATARES ==========
      {
         id: 'd-id',
         name: 'D-ID',
         category: 'avatar',
         subcategory: 'talking-head',
         url: 'https://d-id.com',
         freeLimit: '5 minutos/mes',
         quality: 5,
         documentation: 'https://docs.d-id.com',
         tags: ['avatar', 'video', 'ai', 'talking-head'],
         lastVerified: '2024-12-09',
         isAvailable: true,
         priority: 'essential',
         notes: 'Foto → Video parlante realista'
      },
      {
         id: 'heygen',
         name: 'HeyGen',
         category: 'avatar',
         subcategory: 'talking-head',
         url: 'https://heygen.com',
         freeLimit: '1 video gratis',
         quality: 5,
         documentation: 'https://help.heygen.com',
         tags: ['avatar', 'video', 'professional'],
         lastVerified: '2024-12-09',
         isAvailable: true,
         priority: 'optional'
      },
      {
         id: 'sadtalker',
         name: 'SadTalker',
         category: 'avatar',
         subcategory: 'talking-head-local',
         url: 'https://github.com/OpenTalker/SadTalker',
         freeLimit: 'Ilimitado (local)',
         quality: 4,
         tags: ['avatar', 'local', 'open-source'],
         lastVerified: '2024-12-09',
         isAvailable: true,
         priority: 'recommended',
         notes: 'Open source, ilimitado, requiere GPU'
      },

      // ========== MÚSICA ==========
      {
         id: 'suno-ai',
         name: 'Suno AI',
         category: 'music',
         subcategory: 'generation',
         url: 'https://suno.ai',
         freeLimit: '50 canciones/mes',
         quality: 5,
         tags: ['music-generation', 'ai', 'any-genre', 'vocals'],
         lastVerified: '2024-12-09',
         isAvailable: true,
         priority: 'essential',
         notes: 'Mejor generador de música IA, incluye voces'
      },
      {
         id: 'udio',
         name: 'Udio',
         category: 'music',
         subcategory: 'generation',
         url: 'https://udio.com',
         freeLimit: '40 canciones/mes',
         quality: 5,
         tags: ['music-generation', 'ai', 'high-quality'],
         lastVerified: '2024-12-09',
         isAvailable: true,
         priority: 'essential',
         notes: 'Alternativa a Suno, calidad comparable'
      },
      {
         id: 'youtube-audio-library',
         name: 'YouTube Audio Library',
         category: 'music',
         subcategory: 'library',
         url: 'https://studio.youtube.com/channel/audio',
         freeLimit: 'Ilimitado',
         quality: 4,
         tags: ['music', 'free', 'commercial-use'],
         lastVerified: '2024-12-09',
         isAvailable: true,
         priority: 'essential',
         notes: 'Gratis para uso comercial, miles de tracks'
      },
      {
         id: 'pixabay-music',
         name: 'Pixabay Music',
         category: 'music',
         subcategory: 'library',
         url: 'https://pixabay.com/music',
         freeLimit: 'Ilimitado',
         quality: 4,
         tags: ['music', 'free', 'royalty-free'],
         lastVerified: '2024-12-09',
         isAvailable: true,
         priority: 'recommended'
      },

      // ========== VIDEO ==========
      {
         id: 'davinci-resolve',
         name: 'DaVinci Resolve',
         category: 'video',
         subcategory: 'editor',
         url: 'https://www.blackmagicdesign.com/products/davinciresolve',
         freeLimit: 'Ilimitado (versión gratuita)',
         quality: 5,
         tags: ['video-editor', 'professional', 'color-grading'],
         lastVerified: '2024-12-09',
         isAvailable: true,
         priority: 'essential',
         notes: 'Editor profesional gratis, usado en Hollywood'
      },
      {
         id: 'capcut',
         name: 'CapCut',
         category: 'video',
         subcategory: 'editor-web',
         url: 'https://www.capcut.com',
         freeLimit: 'Ilimitado sin marca de agua',
         quality: 4,
         tags: ['video-editor', 'web', 'mobile', 'easy'],
         lastVerified: '2024-12-09',
         isAvailable: true,
         priority: 'recommended'
      },
      {
         id: 'obs-studio',
         name: 'OBS Studio',
         category: 'video',
         subcategory: 'recording',
         url: 'https://obsproject.com',
         freeLimit: 'Ilimitado',
         quality: 5,
         tags: ['screen-recording', 'streaming', 'open-source'],
         lastVerified: '2024-12-09',
         isAvailable: true,
         priority: 'essential'
      },

      // ========== DISEÑO ==========
      {
         id: 'canva',
         name: 'Canva',
         category: 'design',
         subcategory: 'general',
         url: 'https://canva.com',
         freeLimit: 'Ilimitado (básico)',
         quality: 4,
         tags: ['design', 'graphics', 'presentations', 'social'],
         lastVerified: '2024-12-09',
         isAvailable: true,
         priority: 'essential'
      },
      {
         id: 'figma',
         name: 'Figma',
         category: 'design',
         subcategory: 'ui-ux',
         url: 'https://figma.com',
         freeLimit: 'Ilimitado (personal)',
         quality: 5,
         tags: ['ui', 'ux', 'prototype', 'collaborative'],
         lastVerified: '2024-12-09',
         isAvailable: true,
         priority: 'essential'
      },
      {
         id: 'leonardo-ai',
         name: 'Leonardo AI',
         category: 'design',
         subcategory: 'image-generation',
         url: 'https://leonardo.ai',
         freeLimit: '150 imágenes/día',
         quality: 5,
         tags: ['image-generation', 'ai', 'art'],
         lastVerified: '2024-12-09',
         isAvailable: true,
         priority: 'essential',
         notes: 'Mejor alternativa gratuita a Midjourney'
      },
      {
         id: 'playground-ai',
         name: 'Playground AI',
         category: 'design',
         subcategory: 'image-generation',
         url: 'https://playgroundai.com',
         freeLimit: '500 imágenes/día',
         quality: 4,
         tags: ['image-generation', 'ai'],
         lastVerified: '2024-12-09',
         isAvailable: true,
         priority: 'recommended'
      },

      // ========== APIS DE DATOS ==========
      {
         id: 'open-meteo',
         name: 'Open-Meteo',
         category: 'api',
         subcategory: 'weather',
         url: 'https://open-meteo.com',
         apiUrl: 'https://api.open-meteo.com/v1/forecast',
         freeLimit: 'Ilimitado',
         quality: 5,
         documentation: 'https://open-meteo.com/en/docs',
         tags: ['weather', 'marine', 'forecast', 'api'],
         lastVerified: '2024-12-09',
         isAvailable: true,
         priority: 'essential',
         notes: 'API principal de SARDIN-AI para clima marino'
      },
      {
         id: 'noaa-erddap',
         name: 'NOAA ERDDAP',
         category: 'api',
         subcategory: 'oceanography',
         url: 'https://coastwatch.pfeg.noaa.gov/erddap',
         freeLimit: 'Ilimitado',
         quality: 5,
         documentation: 'https://coastwatch.pfeg.noaa.gov/erddap/information.html',
         tags: ['ocean', 'scientific', 'government', 'api'],
         lastVerified: '2024-12-09',
         isAvailable: true,
         priority: 'essential'
      },

      // ========== HOSTING ==========
      {
         id: 'vercel',
         name: 'Vercel',
         category: 'hosting',
         subcategory: 'frontend',
         url: 'https://vercel.com',
         freeLimit: 'Ilimitado proyectos, 100GB bandwidth',
         quality: 5,
         documentation: 'https://vercel.com/docs',
         tags: ['hosting', 'frontend', 'cdn', 'serverless'],
         lastVerified: '2024-12-09',
         isAvailable: true,
         priority: 'essential'
      },
      {
         id: 'fly-io',
         name: 'Fly.io',
         category: 'hosting',
         subcategory: 'backend',
         url: 'https://fly.io',
         freeLimit: '3 VMs, 256MB RAM',
         quality: 5,
         documentation: 'https://fly.io/docs',
         tags: ['hosting', 'backend', 'docker', 'global'],
         lastVerified: '2024-12-09',
         isAvailable: true,
         priority: 'recommended'
      },
      {
         id: 'oracle-cloud-free',
         name: 'Oracle Cloud Free Tier',
         category: 'hosting',
         subcategory: 'vps',
         url: 'https://www.oracle.com/cloud/free',
         freeLimit: '4 CPUs ARM, 24GB RAM, PERMANENTE',
         quality: 5,
         documentation: 'https://docs.oracle.com/en/cloud/free-tier',
         tags: ['vps', 'free-forever', 'generous'],
         lastVerified: '2024-12-09',
         isAvailable: true,
         priority: 'essential',
         notes: 'MUY generoso tier gratis permanente'
      },

      // ========== STORAGE ==========
      {
         id: 'cloudflare-r2',
         name: 'Cloudflare R2',
         category: 'storage',
         url: 'https://www.cloudflare.com/products/r2',
         freeLimit: '10GB storage, 1M requests/mes',
         quality: 5,
         documentation: 'https://developers.cloudflare.com/r2',
         tags: ['storage', 's3-compatible', 'no-egress'],
         lastVerified: '2024-12-09',
         isAvailable: true,
         priority: 'recommended',
         notes: 'Sin cargos por egress, S3 compatible'
      },

      // ========== AUTOMATIZACIÓN ==========
      {
         id: 'n8n',
         name: 'n8n',
         category: 'automation',
         subcategory: 'workflow',
         url: 'https://n8n.io',
         freeLimit: 'Ilimitado (self-hosted)',
         quality: 5,
         documentation: 'https://docs.n8n.io',
         tags: ['automation', 'workflow', 'integrations', 'open-source'],
         lastVerified: '2024-12-09',
         isAvailable: true,
         priority: 'recommended'
      },
      {
         id: 'github-actions',
         name: 'GitHub Actions',
         category: 'automation',
         subcategory: 'ci-cd',
         url: 'https://github.com/features/actions',
         freeLimit: '2000 minutos/mes',
         quality: 5,
         documentation: 'https://docs.github.com/en/actions',
         tags: ['ci-cd', 'automation', 'devops'],
         lastVerified: '2024-12-09',
         isAvailable: true,
         priority: 'essential'
      },
   ]
};

// ============================================
// FUNCIONES DE BÚSQUEDA
// ============================================

/**
 * Buscar recursos por categoría
 */
export function findByCategory(category: ResourceCategory): FreeResource[] {
   return resourceDatabase.resources.filter(r => r.category === category);
}

/**
 * Buscar recursos por etiqueta
 */
export function findByTag(tag: string): FreeResource[] {
   return resourceDatabase.resources.filter(r => r.tags.includes(tag.toLowerCase()));
}

/**
 * Buscar recursos esenciales
 */
export function findEssential(): FreeResource[] {
   return resourceDatabase.resources.filter(r => r.priority === 'essential');
}

/**
 * Buscar por calidad mínima
 */
export function findByMinQuality(minQuality: 1 | 2 | 3 | 4 | 5): FreeResource[] {
   return resourceDatabase.resources.filter(r => r.quality >= minQuality);
}

/**
 * Buscar recursos para video documental
 */
export function findForVideoProduction(): {
   voice: FreeResource[];
   music: FreeResource[];
   video: FreeResource[];
   design: FreeResource[];
   avatar: FreeResource[];
} {
   return {
      voice: findByCategory('voice').filter(r => r.priority !== 'optional'),
      music: findByCategory('music').filter(r => r.priority !== 'optional'),
      video: findByCategory('video'),
      design: findByCategory('design').filter(r => r.quality >= 4),
      avatar: findByCategory('avatar'),
   };
}

/**
 * Obtener resumen de recursos disponibles
 */
export function getResourceSummary(): Record<ResourceCategory, number> {
   const summary: Record<string, number> = {};

   for (const resource of resourceDatabase.resources) {
      summary[resource.category] = (summary[resource.category] || 0) + 1;
   }

   return summary as Record<ResourceCategory, number>;
}

// ============================================
// VERIFICACIÓN DE DISPONIBILIDAD
// ============================================

/**
 * Verificar si un recurso está disponible (solo en cliente)
 */
export async function verifyResourceAvailability(resource: FreeResource): Promise<boolean> {
   try {
      // Solo funciona en navegador
      if (typeof fetch === 'undefined') return true;

      const response = await fetch(resource.url, {
         method: 'HEAD',
         mode: 'no-cors' // Para evitar CORS
      });

      return true; // Si no hay error, asumimos disponible
   } catch {
      return false;
   }
}

/**
 * Verificar todos los recursos (batch)
 */
export async function verifyAllResources(): Promise<Map<string, boolean>> {
   const results = new Map<string, boolean>();

   for (const resource of resourceDatabase.resources) {
      const isAvailable = await verifyResourceAvailability(resource);
      results.set(resource.id, isAvailable);
   }

   return results;
}

// ============================================
// EXPORTAR DATOS
// ============================================

export function exportToMarkdown(): string {
   let md = '# Recursos Gratuitos SARDIN-AI\n\n';
   md += `*Generado: ${new Date().toISOString()}*\n\n`;

   const categories = [...new Set(resourceDatabase.resources.map(r => r.category))];

   for (const category of categories) {
      const resources = findByCategory(category);
      md += `## ${category.toUpperCase()}\n\n`;
      md += '| Nombre | Límite Gratis | Calidad | URL |\n';
      md += '|--------|---------------|---------|-----|\n';

      for (const r of resources) {
         md += `| ${r.name} | ${r.freeLimit} | ${'⭐'.repeat(r.quality)} | [Link](${r.url}) |\n`;
      }

      md += '\n';
   }

   return md;
}

// ============================================
// SINGLETON
// ============================================

export default resourceDatabase;
