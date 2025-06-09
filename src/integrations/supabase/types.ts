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
      beds: {
        Row: {
          created_at: string | null
          department: string
          id: string
          is_custom: boolean | null
          name: string
          patient_admission_date: string | null
          patient_admission_time: string | null
          patient_age: number | null
          patient_birth_date: string | null
          patient_diagnosis: string | null
          patient_expected_discharge_date: string | null
          patient_gender: string | null
          patient_id: string | null
          patient_name: string | null
          patient_origin_city: string | null
          patient_tfd: boolean | null
          patient_tfd_type: string | null
          reservation_diagnosis: string | null
          reservation_origin_clinic: string | null
          reservation_patient_name: string | null
          status: Database["public"]["Enums"]["bed_status"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department: string
          id?: string
          is_custom?: boolean | null
          name: string
          patient_admission_date?: string | null
          patient_admission_time?: string | null
          patient_age?: number | null
          patient_birth_date?: string | null
          patient_diagnosis?: string | null
          patient_expected_discharge_date?: string | null
          patient_gender?: string | null
          patient_id?: string | null
          patient_name?: string | null
          patient_origin_city?: string | null
          patient_tfd?: boolean | null
          patient_tfd_type?: string | null
          reservation_diagnosis?: string | null
          reservation_origin_clinic?: string | null
          reservation_patient_name?: string | null
          status?: Database["public"]["Enums"]["bed_status"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string
          id?: string
          is_custom?: boolean | null
          name?: string
          patient_admission_date?: string | null
          patient_admission_time?: string | null
          patient_age?: number | null
          patient_birth_date?: string | null
          patient_diagnosis?: string | null
          patient_expected_discharge_date?: string | null
          patient_gender?: string | null
          patient_id?: string | null
          patient_name?: string | null
          patient_origin_city?: string | null
          patient_tfd?: boolean | null
          patient_tfd_type?: string | null
          reservation_diagnosis?: string | null
          reservation_origin_clinic?: string | null
          reservation_patient_name?: string | null
          status?: Database["public"]["Enums"]["bed_status"]
          updated_at?: string | null
        }
        Relationships: []
      }
      departments: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      discharge_records: {
        Row: {
          admission_date: string
          admission_time: string
          age: number
          birth_date: string
          created_at: string | null
          days_occupied: number
          delay_justification: string | null
          diagnosis: string
          discharge_date: string
          discharge_time: string
          discharge_type: Database["public"]["Enums"]["discharge_type"]
          effective_discharge_time: string | null
          expected_discharge_date: string | null
          gender: string
          id: string
          investigated: boolean | null
          investigation_by: string | null
          investigation_date: string | null
          investigation_status: string | null
          is_tfd: boolean | null
          name: string
          origin_city: string
          patient_id: string
          tfd_type: string | null
        }
        Insert: {
          admission_date: string
          admission_time: string
          age: number
          birth_date: string
          created_at?: string | null
          days_occupied: number
          delay_justification?: string | null
          diagnosis: string
          discharge_date: string
          discharge_time: string
          discharge_type: Database["public"]["Enums"]["discharge_type"]
          effective_discharge_time?: string | null
          expected_discharge_date?: string | null
          gender?: string
          id?: string
          investigated?: boolean | null
          investigation_by?: string | null
          investigation_date?: string | null
          investigation_status?: string | null
          is_tfd?: boolean | null
          name: string
          origin_city: string
          patient_id: string
          tfd_type?: string | null
        }
        Update: {
          admission_date?: string
          admission_time?: string
          age?: number
          birth_date?: string
          created_at?: string | null
          days_occupied?: number
          delay_justification?: string | null
          diagnosis?: string
          discharge_date?: string
          discharge_time?: string
          discharge_type?: Database["public"]["Enums"]["discharge_type"]
          effective_discharge_time?: string | null
          expected_discharge_date?: string | null
          gender?: string
          id?: string
          investigated?: boolean | null
          investigation_by?: string | null
          investigation_date?: string | null
          investigation_status?: string | null
          is_tfd?: boolean | null
          name?: string
          origin_city?: string
          patient_id?: string
          tfd_type?: string | null
        }
        Relationships: []
      }
      investigation_history: {
        Row: {
          created_at: string
          id: string
          investigation_by: string | null
          investigation_date: string
          investigation_status: string
          investigation_type: string
          notes: string | null
          patient_id: string | null
          patient_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          investigation_by?: string | null
          investigation_date?: string
          investigation_status: string
          investigation_type: string
          notes?: string | null
          patient_id?: string | null
          patient_name: string
        }
        Update: {
          created_at?: string
          id?: string
          investigation_by?: string | null
          investigation_date?: string
          investigation_status?: string
          investigation_type?: string
          notes?: string | null
          patient_id?: string | null
          patient_name?: string
        }
        Relationships: []
      }
      patient_interventions: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          id: string
          intervention_type: string
          patient_id: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          intervention_type: string
          patient_id: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          intervention_type?: string
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_interventions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          admission_date: string
          admission_time: string
          age: number
          bed_id: string | null
          birth_date: string
          created_at: string | null
          days_occupied: number | null
          diagnosis: string
          expected_discharge_date: string | null
          gender: string | null
          id: string
          investigated: boolean | null
          investigation_by: string | null
          investigation_date: string | null
          investigation_status: string | null
          is_tfd: boolean | null
          name: string
          origin_city: string
          status: string | null
          tfd_type: string | null
          updated_at: string | null
        }
        Insert: {
          admission_date: string
          admission_time: string
          age: number
          bed_id?: string | null
          birth_date: string
          created_at?: string | null
          days_occupied?: number | null
          diagnosis: string
          expected_discharge_date?: string | null
          gender?: string | null
          id?: string
          investigated?: boolean | null
          investigation_by?: string | null
          investigation_date?: string | null
          investigation_status?: string | null
          is_tfd?: boolean | null
          name: string
          origin_city: string
          status?: string | null
          tfd_type?: string | null
          updated_at?: string | null
        }
        Update: {
          admission_date?: string
          admission_time?: string
          age?: number
          bed_id?: string | null
          birth_date?: string
          created_at?: string | null
          days_occupied?: number | null
          diagnosis?: string
          expected_discharge_date?: string | null
          gender?: string | null
          id?: string
          investigated?: boolean | null
          investigation_by?: string | null
          investigation_date?: string | null
          investigation_status?: string | null
          is_tfd?: boolean | null
          name?: string
          origin_city?: string
          status?: string | null
          tfd_type?: string | null
          updated_at?: string | null
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
      reservations: {
        Row: {
          bed_id: string | null
          created_at: string | null
          diagnosis: string
          id: string
          origin_clinic: string
          patient_name: string
        }
        Insert: {
          bed_id?: string | null
          created_at?: string | null
          diagnosis: string
          id?: string
          origin_clinic: string
          patient_name: string
        }
        Update: {
          bed_id?: string | null
          created_at?: string | null
          diagnosis?: string
          id?: string
          origin_clinic?: string
          patient_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_bed_id_fkey"
            columns: ["bed_id"]
            isOneToOne: false
            referencedRelation: "beds"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      alphanumeric_sort: {
        Args: { "": string }
        Returns: string
      }
    }
    Enums: {
      bed_status: "available" | "occupied" | "reserved"
      department_type:
        | "CLINICA MEDICA"
        | "PRONTO SOCORRO"
        | "CLINICA CIRURGICA"
        | "UTI ADULTO"
        | "UTI NEONATAL"
        | "PEDIATRIA"
        | "PRONTO SOCORRO PEDIATRIA"
        | "MATERNIDADE"
      discharge_type:
        | "melhora"
        | "evasao"
        | "transferencia"
        | "obito"
        | "contra_referencia"
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
      bed_status: ["available", "occupied", "reserved"],
      department_type: [
        "CLINICA MEDICA",
        "PRONTO SOCORRO",
        "CLINICA CIRURGICA",
        "UTI ADULTO",
        "UTI NEONATAL",
        "PEDIATRIA",
        "PRONTO SOCORRO PEDIATRIA",
        "MATERNIDADE",
      ],
      discharge_type: [
        "melhora",
        "evasao",
        "transferencia",
        "obito",
        "contra_referencia",
      ],
    },
  },
} as const
