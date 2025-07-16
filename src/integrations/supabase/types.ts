export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string
          country: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          is_primary: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          order_index: number | null
          postal_code: string | null
          street_address: string
          updated_at: string | null
        }
        Insert: {
          city: string
          country?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          order_index?: number | null
          postal_code?: string | null
          street_address: string
          updated_at?: string | null
        }
        Update: {
          city?: string
          country?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          order_index?: number | null
          postal_code?: string | null
          street_address?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          role: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      appointment_services: {
        Row: {
          appointment_id: string
          created_at: string
          id: string
          price: number
          service_id: string
        }
        Insert: {
          appointment_id: string
          created_at?: string
          id?: string
          price?: number
          service_id: string
        }
        Update: {
          appointment_id?: string
          created_at?: string
          id?: string
          price?: number
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointment_services_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_date: string
          client_email: string | null
          client_id: string | null
          client_name: string
          client_phone: string
          created_at: string
          id: string
          next_session_date: string | null
          notes: string | null
          status: string
          status_history: Json | null
          time_slot_id: string
          total_price: number | null
          updated_at: string
        }
        Insert: {
          appointment_date: string
          client_email?: string | null
          client_id?: string | null
          client_name: string
          client_phone: string
          created_at?: string
          id?: string
          next_session_date?: string | null
          notes?: string | null
          status?: string
          status_history?: Json | null
          time_slot_id: string
          total_price?: number | null
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          client_email?: string | null
          client_id?: string | null
          client_name?: string
          client_phone?: string
          created_at?: string
          id?: string
          next_session_date?: string | null
          notes?: string | null
          status?: string
          status_history?: Json | null
          time_slot_id?: string
          total_price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_time_slot_id_fkey"
            columns: ["time_slot_id"]
            isOneToOne: false
            referencedRelation: "time_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      banners: {
        Row: {
          button_link: string | null
          button_text: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          order_index: number | null
          position: string | null
          service_id: string | null
          start_date: string | null
          subtitle: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          button_link?: string | null
          button_text?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          order_index?: number | null
          position?: string | null
          service_id?: string | null
          start_date?: string | null
          subtitle?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          button_link?: string | null
          button_text?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          order_index?: number | null
          position?: string | null
          service_id?: string | null
          start_date?: string | null
          subtitle?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "banners_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      business_hours: {
        Row: {
          close_time: string
          created_at: string
          day_of_week: number
          id: string
          is_active: boolean
          open_time: string
          updated_at: string
        }
        Insert: {
          close_time: string
          created_at?: string
          day_of_week: number
          id?: string
          is_active?: boolean
          open_time: string
          updated_at?: string
        }
        Update: {
          close_time?: string
          created_at?: string
          day_of_week?: number
          id?: string
          is_active?: boolean
          open_time?: string
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string
          preferences: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone: string
          preferences?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string
          preferences?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      contact_info: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          is_primary: boolean | null
          label: string
          order_index: number | null
          type: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          label: string
          order_index?: number | null
          type: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          label?: string
          order_index?: number | null
          type?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      content_sections: {
        Row: {
          button_link: string | null
          button_text: string | null
          content: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          order_index: number | null
          section_type: Database["public"]["Enums"]["content_type"]
          subtitle: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          button_link?: string | null
          button_text?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          section_type: Database["public"]["Enums"]["content_type"]
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          button_link?: string | null
          button_text?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          section_type?: Database["public"]["Enums"]["content_type"]
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          category: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          order_index: number | null
          question: string
          updated_at: string | null
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          question: string
          updated_at?: string | null
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          question?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      gallery_tags: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      media_gallery: {
        Row: {
          alt_text: string | null
          category: string | null
          created_at: string | null
          description: string | null
          dimensions: string | null
          file_size: number | null
          file_type: Database["public"]["Enums"]["media_type"]
          file_url: string
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          order_index: number | null
          service_id: string | null
          title: string | null
          updated_at: string | null
          upload_date: string | null
        }
        Insert: {
          alt_text?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          dimensions?: string | null
          file_size?: number | null
          file_type: Database["public"]["Enums"]["media_type"]
          file_url: string
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          order_index?: number | null
          service_id?: string | null
          title?: string | null
          updated_at?: string | null
          upload_date?: string | null
        }
        Update: {
          alt_text?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          dimensions?: string | null
          file_size?: number | null
          file_type?: Database["public"]["Enums"]["media_type"]
          file_url?: string
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          order_index?: number | null
          service_id?: string | null
          title?: string | null
          updated_at?: string | null
          upload_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_gallery_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      media_gallery_tags: {
        Row: {
          created_at: string | null
          id: string
          media_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          media_id: string
          tag_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          media_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_gallery_tags_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_gallery"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_gallery_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "gallery_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      message_templates: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean
          is_default: boolean
          name: string
          subject: string | null
          type: string
          updated_at: string
          variables: Json | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_default?: boolean
          name: string
          subject?: string | null
          type?: string
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_default?: boolean
          name?: string
          subject?: string | null
          type?: string
          updated_at?: string
          variables?: Json | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          appointment_id: string | null
          client_name: string | null
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          type: string
        }
        Insert: {
          appointment_id?: string | null
          client_name?: string | null
          created_at?: string
          id?: string
          message: string
          read?: boolean
          title: string
          type?: string
        }
        Update: {
          appointment_id?: string | null
          client_name?: string | null
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          order_index: number | null
          price_range: string | null
          short_description: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          order_index?: number | null
          price_range?: string | null
          short_description?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          order_index?: number | null
          price_range?: string | null
          short_description?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      social_media: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          order_index: number | null
          platform: Database["public"]["Enums"]["social_platform"]
          updated_at: string | null
          url: string
          username: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          platform: Database["public"]["Enums"]["social_platform"]
          updated_at?: string | null
          url: string
          username?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          platform?: Database["public"]["Enums"]["social_platform"]
          updated_at?: string | null
          url?: string
          username?: string | null
        }
        Relationships: []
      }
      time_slots: {
        Row: {
          created_at: string
          duration_minutes: number
          id: string
          is_available: boolean
          max_concurrent: number
          time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number
          id?: string
          is_available?: boolean
          max_concurrent?: number
          time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number
          id?: string
          is_available?: boolean
          max_concurrent?: number
          time?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      content_type:
        | "hero_banner"
        | "about_section"
        | "services_section"
        | "contact_section"
        | "footer"
      media_type: "image" | "video"
      social_platform: "instagram" | "facebook" | "whatsapp" | "phone" | "email"
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
      content_type: [
        "hero_banner",
        "about_section",
        "services_section",
        "contact_section",
        "footer",
      ],
      media_type: ["image", "video"],
      social_platform: ["instagram", "facebook", "whatsapp", "phone", "email"],
    },
  },
} as const
