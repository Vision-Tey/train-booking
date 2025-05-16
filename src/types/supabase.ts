export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      booking_seats: {
        Row: {
          booking_id: string
          created_at: string | null
          id: string
          seat_id: string
        }
        Insert: {
          booking_id: string
          created_at?: string | null
          id?: string
          seat_id: string
        }
        Update: {
          booking_id?: string
          created_at?: string | null
          id?: string
          seat_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_seats_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_seats_seat_id_fkey"
            columns: ["seat_id"]
            isOneToOne: false
            referencedRelation: "seats"
            referencedColumns: ["id"]
          }
        ]
      }
      bookings: {
        Row: {
          booking_reference: string
          booking_status: string
          created_at: string | null
          id: string
          passenger_count: number
          payment_status: string
          schedule_id: string
          total_price: number
          user_id: string
        }
        Insert: {
          booking_reference: string
          booking_status: string
          created_at?: string | null
          id?: string
          passenger_count: number
          payment_status: string
          schedule_id: string
          total_price: number
          user_id: string
        }
        Update: {
          booking_reference?: string
          booking_status?: string
          created_at?: string | null
          id?: string
          passenger_count?: number
          payment_status?: string
          schedule_id?: string
          total_price?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          is_admin: boolean | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      routes: {
        Row: {
          arrival_time: string
          created_at: string | null
          departure_time: string
          destination_id: string
          duration: string
          id: string
          origin_id: string
          price: number
          train_id: string
        }
        Insert: {
          arrival_time: string
          created_at?: string | null
          departure_time: string
          destination_id: string
          duration: string
          id?: string
          origin_id: string
          price: number
          train_id: string
        }
        Update: {
          arrival_time?: string
          created_at?: string | null
          departure_time?: string
          destination_id?: string
          duration?: string
          id?: string
          origin_id?: string
          price?: number
          train_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "routes_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routes_origin_id_fkey"
            columns: ["origin_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routes_train_id_fkey"
            columns: ["train_id"]
            isOneToOne: false
            referencedRelation: "trains"
            referencedColumns: ["id"]
          }
        ]
      }
      schedules: {
        Row: {
          created_at: string | null
          date: string
          id: string
          route_id: string
          seats_available: number
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          route_id: string
          seats_available: number
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          route_id?: string
          seats_available?: number
        }
        Relationships: [
          {
            foreignKeyName: "schedules_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          }
        ]
      }
      seat_availability: {
        Row: {
          created_at: string | null
          id: string
          is_available: boolean | null
          schedule_id: string
          seat_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_available?: boolean | null
          schedule_id: string
          seat_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_available?: boolean | null
          schedule_id?: string
          seat_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seat_availability_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seat_availability_seat_id_fkey"
            columns: ["seat_id"]
            isOneToOne: false
            referencedRelation: "seats"
            referencedColumns: ["id"]
          }
        ]
      }
      seats: {
        Row: {
          coach: string
          created_at: string | null
          id: string
          position: string
          seat_number: string
          seat_type: string
          train_id: string
        }
        Insert: {
          coach: string
          created_at?: string | null
          id?: string
          position: string
          seat_number: string
          seat_type: string
          train_id: string
        }
        Update: {
          coach?: string
          created_at?: string | null
          id?: string
          position?: string
          seat_number?: string
          seat_type?: string
          train_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seats_train_id_fkey"
            columns: ["train_id"]
            isOneToOne: false
            referencedRelation: "trains"
            referencedColumns: ["id"]
          }
        ]
      }
      stations: {
        Row: {
          created_at: string | null
          id: string
          location: string | null
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          location?: string | null
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          location?: string | null
          name?: string
        }
        Relationships: []
      }
      trains: {
        Row: {
          capacity: number
          created_at: string | null
          id: string
          name: string | null
          train_number: string
        }
        Insert: {
          capacity: number
          created_at?: string | null
          id?: string
          name?: string | null
          train_number: string
        }
        Update: {
          capacity?: number
          created_at?: string | null
          id?: string
          name?: string | null
          train_number?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]["Views"]])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
