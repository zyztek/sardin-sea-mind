export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      ai_insights: {
        Row: {
          confidence: number | null
          created_at: string
          created_by: string | null
          description: string
          id: string
          insight_type: string
          priority: string | null
          resolved_at: string | null
          title: string
          vessel_id: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          insight_type: string
          priority?: string | null
          resolved_at?: string | null
          title: string
          vessel_id?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          insight_type?: string
          priority?: string | null
          resolved_at?: string | null
          title?: string
          vessel_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_insights_vessel_id_fkey"
            columns: ["vessel_id"]
            isOneToOne: false
            referencedRelation: "vessels"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          maritime_role: Database["public"]["Enums"]["maritime_role"]
          updated_at: string
          user_id: string
          vessel_assignment: string | null
        }
        Insert: {
          created_at?: string
          full_name: string
          id?: string
          maritime_role?: Database["public"]["Enums"]["maritime_role"]
          updated_at?: string
          user_id: string
          vessel_assignment?: string | null
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          maritime_role?: Database["public"]["Enums"]["maritime_role"]
          updated_at?: string
          user_id?: string
          vessel_assignment?: string | null
        }
        Relationships: []
      }
      sensor_data: {
        Row: {
          battery_level_percent: number | null
          created_by: string | null
          depth_meters: number | null
          fuel_level_percent: number | null
          heading_degrees: number | null
          id: string
          latitude: number | null
          longitude: number | null
          speed_knots: number | null
          timestamp: string
          vessel_id: string | null
          water_temperature_c: number | null
          wind_direction_degrees: number | null
          wind_speed_knots: number | null
        }
        Insert: {
          battery_level_percent?: number | null
          created_by?: string | null
          depth_meters?: number | null
          fuel_level_percent?: number | null
          heading_degrees?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          speed_knots?: number | null
          timestamp?: string
          vessel_id?: string | null
          water_temperature_c?: number | null
          wind_direction_degrees?: number | null
          wind_speed_knots?: number | null
        }
        Update: {
          battery_level_percent?: number | null
          created_by?: string | null
          depth_meters?: number | null
          fuel_level_percent?: number | null
          heading_degrees?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          speed_knots?: number | null
          timestamp?: string
          vessel_id?: string | null
          water_temperature_c?: number | null
          wind_direction_degrees?: number | null
          wind_speed_knots?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sensor_data_vessel_id_fkey"
            columns: ["vessel_id"]
            isOneToOne: false
            referencedRelation: "vessels"
            referencedColumns: ["id"]
          },
        ]
      }
      system_alerts: {
        Row: {
          acknowledged: boolean | null
          acknowledged_at: string | null
          acknowledged_by: string | null
          alert_type: string
          created_at: string
          id: string
          message: string
          severity: string | null
          vessel_id: string | null
        }
        Insert: {
          acknowledged?: boolean | null
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type: string
          created_at?: string
          id?: string
          message: string
          severity?: string | null
          vessel_id?: string | null
        }
        Update: {
          acknowledged?: boolean | null
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type?: string
          created_at?: string
          id?: string
          message?: string
          severity?: string | null
          vessel_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_alerts_vessel_id_fkey"
            columns: ["vessel_id"]
            isOneToOne: false
            referencedRelation: "vessels"
            referencedColumns: ["id"]
          },
        ]
      }
      vessels: {
        Row: {
          created_at: string
          crew_capacity: number | null
          fuel_capacity_liters: number | null
          id: string
          length_meters: number | null
          max_speed_knots: number | null
          name: string
          registration: string
          updated_at: string
          vessel_type: string
        }
        Insert: {
          created_at?: string
          crew_capacity?: number | null
          fuel_capacity_liters?: number | null
          id?: string
          length_meters?: number | null
          max_speed_knots?: number | null
          name: string
          registration: string
          updated_at?: string
          vessel_type: string
        }
        Update: {
          created_at?: string
          crew_capacity?: number | null
          fuel_capacity_liters?: number | null
          id?: string
          length_meters?: number | null
          max_speed_knots?: number | null
          name?: string
          registration?: string
          updated_at?: string
          vessel_type?: string
        }
        Relationships: []
      }
      waypoints: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          latitude: number
          longitude: number
          name: string
          vessel_id: string | null
          waypoint_type: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          latitude: number
          longitude: number
          name: string
          vessel_id?: string | null
          waypoint_type?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          vessel_id?: string | null
          waypoint_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "waypoints_vessel_id_fkey"
            columns: ["vessel_id"]
            isOneToOne: false
            referencedRelation: "vessels"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      maritime_role: "captain" | "engineer" | "navigator" | "observer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      maritime_role: ["captain", "engineer", "navigator", "observer"],
    },
  },
} as const
