/**
 * SARDIN-AI - Script de Datos de Semilla
 * 
 * Ejecutar en la consola del navegador cuando PocketBase esté corriendo.
 * O importar y usar desde el código.
 * 
 * @author Sistema Autónomo SARDIN-AI
 * @date 2025-12-09
 */

import PocketBase from 'pocketbase';

const POCKETBASE_URL = 'http://localhost:8090';

interface SeedConfig {
   adminEmail: string;
   adminPassword: string;
}

/**
 * Datos de semilla para embarcaciones
 */
const VESSELS_SEED = [
   {
      name: 'SARDIN Explorer',
      registration: 'SE-001',
      vessel_type: 'Research Vessel',
      length_meters: 45.5,
      max_speed_knots: 25.0,
      fuel_capacity_liters: 8000.0,
      crew_capacity: 12,
   },
   {
      name: 'Ocean Navigator',
      registration: 'ON-002',
      vessel_type: 'Fishing Vessel',
      length_meters: 32.0,
      max_speed_knots: 18.0,
      fuel_capacity_liters: 5000.0,
      crew_capacity: 8,
   },
   {
      name: 'Pacific Hunter',
      registration: 'PH-003',
      vessel_type: 'Trawler',
      length_meters: 28.5,
      max_speed_knots: 15.0,
      fuel_capacity_liters: 4000.0,
      crew_capacity: 6,
   },
];

/**
 * Datos de semilla para insights de IA
 */
const AI_INSIGHTS_SEED = [
   {
      insight_type: 'fishing_prediction',
      title: 'Zona de Alta Probabilidad de Captura',
      description: 'Análisis de patrones oceanográficos indica alta concentración de cardúmenes en coordenadas 42.3°N, -71.1°W. Condiciones óptimas previstas para las próximas 48 horas.',
      confidence: 0.87,
      priority: 'high' as const,
   },
   {
      insight_type: 'weather_alert',
      title: 'Sistema de Baja Presión Aproximándose',
      description: 'Se anticipa llegada de frente frío en las próximas 24 horas. Se recomienda revisar plan de navegación y considerar rutas alternativas.',
      confidence: 0.92,
      priority: 'medium' as const,
   },
   {
      insight_type: 'maintenance',
      title: 'Mantenimiento Preventivo Sugerido',
      description: 'Basado en horas de operación del motor principal, se recomienda realizar revisión de filtros de combustible antes de la próxima salida.',
      confidence: 0.78,
      priority: 'low' as const,
   },
];

/**
 * Datos de semilla para alertas del sistema
 */
const SYSTEM_ALERTS_SEED = [
   {
      alert_type: 'system',
      severity: 'info' as const,
      message: 'Sistema SARDIN-AI inicializado correctamente. Todos los módulos operativos.',
      acknowledged: false,
   },
   {
      alert_type: 'sensor',
      severity: 'warning' as const,
      message: 'Nivel de combustible por debajo del 40%. Considerar reabastecimiento.',
      acknowledged: false,
   },
];

/**
 * Función principal para sembrar datos
 */
export async function seedDatabase(config: SeedConfig): Promise<void> {
   const pb = new PocketBase(POCKETBASE_URL);

   console.log('🌱 Iniciando siembra de datos...');

   try {
      // Autenticar como admin
      console.log('🔐 Autenticando como administrador...');
      await pb.admins.authWithPassword(config.adminEmail, config.adminPassword);

      // Crear embarcaciones
      console.log('🚢 Creando embarcaciones...');
      const createdVessels = [];
      for (const vessel of VESSELS_SEED) {
         try {
            const created = await pb.collection('vessels').create(vessel);
            createdVessels.push(created);
            console.log(`  ✅ Creada: ${vessel.name}`);
         } catch (e: any) {
            if (e.status === 400) {
               console.log(`  ⚠️ Ya existe: ${vessel.name}`);
            } else {
               throw e;
            }
         }
      }

      // Obtener el primer vessel para asociar datos
      const vessels = await pb.collection('vessels').getFullList();
      const primaryVessel = vessels[0];

      if (primaryVessel) {
         // Crear insights de IA
         console.log('🧠 Creando insights de IA...');
         for (const insight of AI_INSIGHTS_SEED) {
            try {
               await pb.collection('ai_insights').create({
                  ...insight,
                  vessel: primaryVessel.id,
               });
               console.log(`  ✅ Insight: ${insight.title.substring(0, 40)}...`);
            } catch (e) {
               console.log(`  ⚠️ Error creando insight`);
            }
         }

         // Crear alertas
         console.log('🚨 Creando alertas del sistema...');
         for (const alert of SYSTEM_ALERTS_SEED) {
            try {
               await pb.collection('system_alerts').create({
                  ...alert,
                  vessel: primaryVessel.id,
               });
               console.log(`  ✅ Alerta: ${alert.message.substring(0, 40)}...`);
            } catch (e) {
               console.log(`  ⚠️ Error creando alerta`);
            }
         }

         // Crear datos de sensores de ejemplo
         console.log('📊 Creando datos de sensores...');
         const sensorData = {
            vessel: primaryVessel.id,
            timestamp: new Date().toISOString(),
            latitude: 42.3601,
            longitude: -71.0589,
            speed_knots: 12.5,
            heading_degrees: 45,
            depth_meters: 25.3,
            water_temperature_c: 18.7,
            wind_speed_knots: 15.2,
            wind_direction_degrees: 270,
            fuel_level_percent: 75,
            battery_level_percent: 92,
         };

         await pb.collection('sensor_data').create(sensorData);
         console.log('  ✅ Datos de sensores creados');

         // Crear waypoints
         console.log('📍 Creando waypoints...');
         const waypoints = [
            { name: 'Puerto Base', latitude: 42.3601, longitude: -71.0589, waypoint_type: 'port', description: 'Puerto de origen' },
            { name: 'Zona de Pesca A', latitude: 42.4101, longitude: -71.1089, waypoint_type: 'fishing', description: 'Zona de alta captura' },
            { name: 'Punto de Encuentro', latitude: 42.3801, longitude: -71.0789, waypoint_type: 'navigation', description: 'Punto de reunión de flota' },
         ];

         for (const wp of waypoints) {
            await pb.collection('waypoints').create({
               ...wp,
               vessel: primaryVessel.id,
            });
            console.log(`  ✅ Waypoint: ${wp.name}`);
         }
      }

      console.log('\n✨ ¡Siembra de datos completada!');
      console.log(`   - ${vessels.length} embarcaciones`);
      console.log(`   - ${AI_INSIGHTS_SEED.length} insights de IA`);
      console.log(`   - ${SYSTEM_ALERTS_SEED.length} alertas`);
      console.log('   - Datos de sensores iniciales');
      console.log('   - Waypoints de ejemplo');

   } catch (error: any) {
      console.error('❌ Error durante la siembra:', error.message);
      throw error;
   }
}

/**
 * Ejecutar desde la consola del navegador
 */
export async function seedFromConsole(): Promise<void> {
   const email = prompt('Email de admin:');
   const password = prompt('Password de admin:');

   if (!email || !password) {
      console.error('❌ Email y password son requeridos');
      return;
   }

   await seedDatabase({ adminEmail: email, adminPassword: password });
}

// Para uso desde la consola del navegador:
// Copiar este script y pegarlo, luego ejecutar: seedFromConsole()

export default seedDatabase;
