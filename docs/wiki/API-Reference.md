# 📡 API Reference

This document details the external APIs SARDIN-AI integrates with and the internal data structure managed by PocketBase.

## External Integrations

### 1. Open-Meteo (Weather)

- **Base URL**: `https://marine-api.open-meteo.com/v1/marine`
- **Purpose**: Real-time marine weather forecasting.
- **Key Parameters**:
  - `wave_height_max`
  - `wind_speed_10m`
  - `temperature_2m`
- **Docs**: [Open-Meteo Marine API](https://open-meteo.com/en/docs/marine-weather-api)

### 2. NOAA ERDDAP (Oceanography)

- **Base URL**: `https://coastwatch.pfeg.noaa.gov/erddap`
- **Purpose**: Scientific grade ocean data (Sea Surface Temp, Chlorophyll).
- **Format**: `.json`, `.csv`

---

## Internal PocketBase Schema

SARDIN-AI uses a relational schema within PocketBase's SQLite engine.

### Collections

#### `users`

Standard PocketBase user collection with extended profile fields.

- `id`: Record ID
- `email`: User email
- `name`: Captain's name
- `avatar`: Profile picture
- `cooperative`: Relation to `cooperatives` collection

#### `vessels`

- `id`: Record ID
- `name`: Vessel name
- `captain`: Relation to `users`
- `fuel_capacity`: Number (Liters)
- `sensor_id`: String (IoT Device ID)

#### `catch_reports`

- `id`: Record ID
- `vessel_id`: Relation to `vessels`
- `location`: JSON (Lat, Lon)
- `species`: String
- `weight_kg`: Number
- `timestamp`: Date

#### `routes`

- `id`: Record ID
- `waypoints`: JSON Array
- `status`: Select (Planned, Active, Completed)

---

## Authentication

All internal API calls must be authenticated via the PocketBase SDK.

```typescript
import pb from "@/integrations/pocketbase/client";

// Example: Authenticate
await pb.collection('users').authWithPassword('email', 'password');
```
