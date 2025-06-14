export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      alert_investigations: {
        Row: {
          alert_key: string
          alert_type: string
          created_at: string
          id: string
          investigated: boolean
          investigated_at: string | null
          investigated_by: string | null
          investigation_date: string | null
          investigation_notes: string | null
          investigation_status: string | null
          patient_id: string
          updated_at: string
        }
        Insert: {
          alert_key: string
          alert_type: string
          created_at?: string
          id?: string
          investigated?: boolean
          investigated_at?: string | null
          investigated_by?: string | null
          investigation_date?: string | null
          investigation_notes?: string | null
          investigation_status?: string | null
          patient_id: string
          updated_at?: string
        }
        Update: {
          alert_key?: string
          alert_type?: string
          created_at?: string
          id?: string
          investigated?: boolean
          investigated_at?: string | null
          investigated_by?: string | null
          investigation_date?: string | null
          investigation_notes?: string | null
          investigation_status?: string | null
          patient_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      ambulance_requests: {
        Row: {
          appropriate_crib: boolean | null
          bed: string | null
          cancelled_at: string | null
          confirmed_at: string | null
          created_at: string
          id: string
          is_puerpera: boolean
          mobility: string
          origin_city: string
          patient_name: string
          request_date: string
          request_time: string
          sector: string | null
          status: string
          updated_at: string
          vehicle_subtype: string | null
          vehicle_type: string
        }
        Insert: {
          appropriate_crib?: boolean | null
          bed?: string | null
          cancelled_at?: string | null
          confirmed_at?: string | null
          created_at?: string
          id?: string
          is_puerpera?: boolean
          mobility: string
          origin_city: string
          patient_name: string
          request_date?: string
          request_time?: string
          sector?: string | null
          status?: string
          updated_at?: string
          vehicle_subtype?: string | null
          vehicle_type: string
        }
        Update: {
          appropriate_crib?: boolean | null
          bed?: string | null
          cancelled_at?: string | null
          confirmed_at?: string | null
          created_at?: string
          id?: string
          is_puerpera?: boolean
          mobility?: string
          origin_city?: string
          patient_name?: string
          request_date?: string
          request_time?: string
          sector?: string | null
          status?: string
          updated_at?: string
          vehicle_subtype?: string | null
          vehicle_type?: string
        }
        Relationships: []
      }
      bed_occupations: {
        Row: {
          bed_id: string | null
          created_at: string
          department: Database["public"]["Enums"]["department_type"]
          end_date: string | null
          id: string
          occupation_type: string
          patient_id: string | null
          start_date: string
        }
        Insert: {
          bed_id?: string | null
          created_at?: string
          department: Database["public"]["Enums"]["department_type"]
          end_date?: string | null
          id?: string
          occupation_type: string
          patient_id?: string | null
          start_date?: string
        }
        Update: {
          bed_id?: string | null
          created_at?: string
          department?: Database["public"]["Enums"]["department_type"]
          end_date?: string | null
          id?: string
          occupation_type?: string
          patient_id?: string | null
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "bed_occupations_bed_id_fkey"
            columns: ["bed_id"]
            isOneToOne: false
            referencedRelation: "beds"
            referencedColumns: ["id"]
          },
        ]
      }
      bed_reservations: {
        Row: {
          bed_id: string | null
          created_at: string
          department: Database["public"]["Enums"]["department_type"]
          diagnosis: string
          id: string
          origin_clinic: string
          patient_name: string
          updated_at: string
        }
        Insert: {
          bed_id?: string | null
          created_at?: string
          department: Database["public"]["Enums"]["department_type"]
          diagnosis: string
          id?: string
          origin_clinic: string
          patient_name: string
          updated_at?: string
        }
        Update: {
          bed_id?: string | null
          created_at?: string
          department?: Database["public"]["Enums"]["department_type"]
          diagnosis?: string
          id?: string
          origin_clinic?: string
          patient_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bed_reservations_bed_id_fkey"
            columns: ["bed_id"]
            isOneToOne: false
            referencedRelation: "beds"
            referencedColumns: ["id"]
          },
        ]
      }
      beds: {
        Row: {
          created_at: string
          department: Database["public"]["Enums"]["department_type"]
          department_id: string | null
          id: string
          is_custom: boolean | null
          is_occupied: boolean | null
          is_reserved: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department: Database["public"]["Enums"]["department_type"]
          department_id?: string | null
          id?: string
          is_custom?: boolean | null
          is_occupied?: boolean | null
          is_reserved?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: Database["public"]["Enums"]["department_type"]
          department_id?: string | null
          id?: string
          is_custom?: boolean | null
          is_occupied?: boolean | null
          is_reserved?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "beds_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: Database["public"]["Enums"]["department_type"]
          occupied_beds: number | null
          reserved_beds: number | null
          total_beds: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: Database["public"]["Enums"]["department_type"]
          occupied_beds?: number | null
          reserved_beds?: number | null
          total_beds?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: Database["public"]["Enums"]["department_type"]
          occupied_beds?: number | null
          reserved_beds?: number | null
          total_beds?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      discharge_control: {
        Row: {
          bed_id: string
          created_at: string
          department: string
          discharge_effective_at: string | null
          discharge_requested_at: string
          id: string
          justification: string | null
          patient_id: string
          patient_name: string
          status: string
          updated_at: string
        }
        Insert: {
          bed_id: string
          created_at?: string
          department: string
          discharge_effective_at?: string | null
          discharge_requested_at?: string
          id?: string
          justification?: string | null
          patient_id: string
          patient_name: string
          status?: string
          updated_at?: string
        }
        Update: {
          bed_id?: string
          created_at?: string
          department?: string
          discharge_effective_at?: string | null
          discharge_requested_at?: string
          id?: string
          justification?: string | null
          patient_id?: string
          patient_name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      mg_cities: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      patient_discharges: {
        Row: {
          actual_stay_days: number
          admission_date: string
          admission_time: string | null
          age: number
          bed_id: string
          birth_date: string
          created_at: string
          department: Database["public"]["Enums"]["department_type"]
          diagnosis: string
          discharge_date: string
          discharge_type: Database["public"]["Enums"]["discharge_type"]
          expected_discharge_date: string
          id: string
          is_tfd: boolean | null
          name: string
          occupation_days: number
          origin_city: string
          patient_id: string
          sex: Database["public"]["Enums"]["sex_type"]
          specialty: string | null
          tfd_type: string | null
        }
        Insert: {
          actual_stay_days: number
          admission_date: string
          admission_time?: string | null
          age: number
          bed_id: string
          birth_date: string
          created_at?: string
          department: Database["public"]["Enums"]["department_type"]
          diagnosis: string
          discharge_date: string
          discharge_type: Database["public"]["Enums"]["discharge_type"]
          expected_discharge_date: string
          id?: string
          is_tfd?: boolean | null
          name: string
          occupation_days: number
          origin_city: string
          patient_id: string
          sex: Database["public"]["Enums"]["sex_type"]
          specialty?: string | null
          tfd_type?: string | null
        }
        Update: {
          actual_stay_days?: number
          admission_date?: string
          admission_time?: string | null
          age?: number
          bed_id?: string
          birth_date?: string
          created_at?: string
          department?: Database["public"]["Enums"]["department_type"]
          diagnosis?: string
          discharge_date?: string
          discharge_type?: Database["public"]["Enums"]["discharge_type"]
          expected_discharge_date?: string
          id?: string
          is_tfd?: boolean | null
          name?: string
          occupation_days?: number
          origin_city?: string
          patient_id?: string
          sex?: Database["public"]["Enums"]["sex_type"]
          specialty?: string | null
          tfd_type?: string | null
        }
        Relationships: []
      }
      patient_transfers: {
        Row: {
          created_at: string
          from_bed_id: string | null
          from_department: Database["public"]["Enums"]["department_type"]
          id: string
          notes: string | null
          patient_id: string | null
          to_bed_id: string | null
          to_department: Database["public"]["Enums"]["department_type"]
          transfer_date: string
        }
        Insert: {
          created_at?: string
          from_bed_id?: string | null
          from_department: Database["public"]["Enums"]["department_type"]
          id?: string
          notes?: string | null
          patient_id?: string | null
          to_bed_id?: string | null
          to_department: Database["public"]["Enums"]["department_type"]
          transfer_date?: string
        }
        Update: {
          created_at?: string
          from_bed_id?: string | null
          from_department?: Database["public"]["Enums"]["department_type"]
          id?: string
          notes?: string | null
          patient_id?: string | null
          to_bed_id?: string | null
          to_department?: Database["public"]["Enums"]["department_type"]
          transfer_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_transfers_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_transfers_to_bed_id_fkey"
            columns: ["to_bed_id"]
            isOneToOne: false
            referencedRelation: "beds"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          admission_date: string
          admission_time: string | null
          age: number
          bed_id: string | null
          birth_date: string
          created_at: string
          department: Database["public"]["Enums"]["department_type"]
          diagnosis: string
          expected_discharge_date: string
          id: string
          is_tfd: boolean | null
          name: string
          occupation_days: number | null
          origin_city: string
          sex: Database["public"]["Enums"]["sex_type"]
          specialty: string | null
          tfd_type: string | null
          updated_at: string
        }
        Insert: {
          admission_date: string
          admission_time?: string | null
          age: number
          bed_id?: string | null
          birth_date: string
          created_at?: string
          department: Database["public"]["Enums"]["department_type"]
          diagnosis: string
          expected_discharge_date: string
          id?: string
          is_tfd?: boolean | null
          name: string
          occupation_days?: number | null
          origin_city: string
          sex: Database["public"]["Enums"]["sex_type"]
          specialty?: string | null
          tfd_type?: string | null
          updated_at?: string
        }
        Update: {
          admission_date?: string
          admission_time?: string | null
          age?: number
          bed_id?: string | null
          birth_date?: string
          created_at?: string
          department?: Database["public"]["Enums"]["department_type"]
          diagnosis?: string
          expected_discharge_date?: string
          id?: string
          is_tfd?: boolean | null
          name?: string
          occupation_days?: number | null
          origin_city?: string
          sex?: Database["public"]["Enums"]["sex_type"]
          specialty?: string | null
          tfd_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patients_bed_id_fkey"
            columns: ["bed_id"]
            isOneToOne: false
            referencedRelation: "beds"
            referencedColumns: ["id"]
          },
        ]
      }
      tfd_archives: {
        Row: {
          archived_at: string
          archived_by: string | null
          id: string
          interventions: Json | null
          patient_data: Json
          patient_id: string
          patient_name: string
        }
        Insert: {
          archived_at?: string
          archived_by?: string | null
          id?: string
          interventions?: Json | null
          patient_data: Json
          patient_id: string
          patient_name: string
        }
        Update: {
          archived_at?: string
          archived_by?: string | null
          id?: string
          interventions?: Json | null
          patient_data?: Json
          patient_id?: string
          patient_name?: string
        }
        Relationships: []
      }
      tfd_interventions: {
        Row: {
          created_at: string
          description: string
          id: string
          intervention_type: string
          patient_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          intervention_type: string
          patient_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          intervention_type?: string
          patient_id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_occupation_days: {
        Args: { admission_date: string }
        Returns: number
      }
      cancel_ambulance_transport: {
        Args: { p_request_id: string }
        Returns: boolean
      }
      cancel_discharge_and_restore_patient: {
        Args: { p_discharge_id: string }
        Returns: boolean
      }
      complete_discharge_and_remove_patient: {
        Args: { p_discharge_id: string; p_justification?: string }
        Returns: boolean
      }
      confirm_ambulance_transport: {
        Args: { p_request_id: string }
        Returns: boolean
      }
      create_bed: {
        Args: { p_name: string; p_department: string }
        Returns: string
      }
      get_ambulance_stats_by_city: {
        Args: { p_start_date?: string; p_end_date?: string }
        Returns: {
          origin_city: string
          total_requests: number
          avg_response_time_minutes: number
          confirmed_requests: number
        }[]
      }
      get_ambulance_stats_by_city_and_sector: {
        Args: { p_start_date?: string; p_end_date?: string }
        Returns: {
          origin_city: string
          sector: string
          total_requests: number
          avg_response_time_minutes: number
          confirmed_requests: number
        }[]
      }
      get_average_discharge_time_by_department: {
        Args: Record<PropertyKey, never>
        Returns: {
          department: string
          avg_discharge_time_hours: number
          total_discharges: number
        }[]
      }
      get_delayed_discharges: {
        Args: Record<PropertyKey, never>
        Returns: {
          patient_name: string
          department: string
          discharge_requested_at: string
          discharge_effective_at: string
          delay_hours: number
          justification: string
        }[]
      }
      get_department_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          department: string
          total_beds: number
          occupied_beds: number
          reserved_beds: number
          available_beds: number
          occupation_rate: number
        }[]
      }
      get_discharge_time_stats_by_city: {
        Args: { p_start_date?: string; p_end_date?: string }
        Returns: {
          origin_city: string
          avg_hours: number
          total_discharges: number
        }[]
      }
      get_discharge_time_stats_by_department: {
        Args: { p_start_date?: string; p_end_date?: string }
        Returns: {
          department: string
          avg_hours: number
          total_discharges: number
          delayed_discharges: number
        }[]
      }
      get_readmissions_within_30_days: {
        Args: Record<PropertyKey, never>
        Returns: {
          patient_name: string
          discharge_date: string
          readmission_date: string
          diagnosis: string
          origin_city: string
          days_between: number
        }[]
      }
      request_discharge_for_patient: {
        Args: {
          p_patient_id: string
          p_patient_name: string
          p_bed_id: string
          p_department: string
        }
        Returns: string
      }
      update_all_occupation_days: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_bed: {
        Args: { p_bed_id: string; p_name: string; p_department: string }
        Returns: boolean
      }
    }
    Enums: {
      department_type:
        | "CLINICA MEDICA"
        | "PRONTO SOCORRO"
        | "CLINICA CIRURGICA"
        | "UTI ADULTO"
        | "UTI NEONATAL"
        | "PEDIATRIA"
        | "MATERNIDADE"
      discharge_type: "POR MELHORA" | "EVASÃO" | "TRANSFERENCIA" | "OBITO"
      sex_type: "masculino" | "feminino"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      department_type: [
        "CLINICA MEDICA",
        "PRONTO SOCORRO",
        "CLINICA CIRURGICA",
        "UTI ADULTO",
        "UTI NEONATAL",
        "PEDIATRIA",
        "MATERNIDADE",
      ],
      discharge_type: ["POR MELHORA", "EVASÃO", "TRANSFERENCIA", "OBITO"],
      sex_type: ["masculino", "feminino"],
    },
  },
} as const
