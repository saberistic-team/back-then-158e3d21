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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          event: string
          id: string
          metadata: Json
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event: string
          id?: string
          metadata?: Json
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event?: string
          id?: string
          metadata?: Json
          user_id?: string | null
        }
        Relationships: []
      }
      chapter_memories: {
        Row: {
          chapter_id: string
          memory_id: string
          sort_order: number
          user_id: string
        }
        Insert: {
          chapter_id: string
          memory_id: string
          sort_order?: number
          user_id: string
        }
        Update: {
          chapter_id?: string
          memory_id?: string
          sort_order?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapter_memories_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chapter_memories_memory_id_fkey"
            columns: ["memory_id"]
            isOneToOne: false
            referencedRelation: "memories"
            referencedColumns: ["id"]
          },
        ]
      }
      chapters: {
        Row: {
          created_at: string
          description: string | null
          hidden: boolean
          id: string
          sort_order: number
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          hidden?: boolean
          id?: string
          sort_order?: number
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          hidden?: boolean
          id?: string
          sort_order?: number
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      contributed_memories: {
        Row: {
          audio_path: string | null
          contribution_request_id: string
          contributor_name: string | null
          created_at: string
          id: string
          owner_user_id: string
          status: string
          text: string | null
          transcript: string | null
        }
        Insert: {
          audio_path?: string | null
          contribution_request_id: string
          contributor_name?: string | null
          created_at?: string
          id?: string
          owner_user_id: string
          status?: string
          text?: string | null
          transcript?: string | null
        }
        Update: {
          audio_path?: string | null
          contribution_request_id?: string
          contributor_name?: string | null
          created_at?: string
          id?: string
          owner_user_id?: string
          status?: string
          text?: string | null
          transcript?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contributed_memories_contribution_request_id_fkey"
            columns: ["contribution_request_id"]
            isOneToOne: false
            referencedRelation: "contribution_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      contribution_requests: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          owner_display_name: string | null
          owner_user_id: string
          question: string
          recipient_name: string | null
          status: string
          token: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          owner_display_name?: string | null
          owner_user_id: string
          question: string
          recipient_name?: string | null
          status?: string
          token: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          owner_display_name?: string | null
          owner_user_id?: string
          question?: string
          recipient_name?: string | null
          status?: string
          token?: string
        }
        Relationships: []
      }
      generated_books: {
        Row: {
          configuration: Json
          content: Json
          created_at: string
          id: string
          status: string
          subtitle: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          configuration?: Json
          content?: Json
          created_at?: string
          id?: string
          status?: string
          subtitle?: string | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          configuration?: Json
          content?: Json
          created_at?: string
          id?: string
          status?: string
          subtitle?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      interview_memories: {
        Row: {
          created_at: string
          id: string
          interview_project_id: string
          memory_id: string | null
          owner_user_id: string
          question_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          interview_project_id: string
          memory_id?: string | null
          owner_user_id: string
          question_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          interview_project_id?: string
          memory_id?: string | null
          owner_user_id?: string
          question_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interview_memories_interview_project_id_fkey"
            columns: ["interview_project_id"]
            isOneToOne: false
            referencedRelation: "interview_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interview_memories_memory_id_fkey"
            columns: ["memory_id"]
            isOneToOne: false
            referencedRelation: "memories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interview_memories_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_projects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          owner_user_id: string
          relationship: string | null
          subject_name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          owner_user_id: string
          relationship?: string | null
          subject_name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          owner_user_id?: string
          relationship?: string | null
          subject_name?: string
        }
        Relationships: []
      }
      memories: {
        Row: {
          approximate_age: number | null
          approximate_year: number | null
          created_at: string
          id: string
          life_period: string | null
          memory_date: string | null
          memory_date_type: string
          original_text: string | null
          parent_memory_id: string | null
          polished_text: string | null
          privacy_status: string
          question_id: string | null
          question_text: string | null
          share_token: string | null
          source: string
          status: string
          title: string | null
          topics: string[]
          updated_at: string
          use_polished: boolean
          user_id: string
        }
        Insert: {
          approximate_age?: number | null
          approximate_year?: number | null
          created_at?: string
          id?: string
          life_period?: string | null
          memory_date?: string | null
          memory_date_type?: string
          original_text?: string | null
          parent_memory_id?: string | null
          polished_text?: string | null
          privacy_status?: string
          question_id?: string | null
          question_text?: string | null
          share_token?: string | null
          source?: string
          status?: string
          title?: string | null
          topics?: string[]
          updated_at?: string
          use_polished?: boolean
          user_id: string
        }
        Update: {
          approximate_age?: number | null
          approximate_year?: number | null
          created_at?: string
          id?: string
          life_period?: string | null
          memory_date?: string | null
          memory_date_type?: string
          original_text?: string | null
          parent_memory_id?: string | null
          polished_text?: string | null
          privacy_status?: string
          question_id?: string | null
          question_text?: string | null
          share_token?: string | null
          source?: string
          status?: string
          title?: string | null
          topics?: string[]
          updated_at?: string
          use_polished?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memories_parent_memory_id_fkey"
            columns: ["parent_memory_id"]
            isOneToOne: false
            referencedRelation: "memories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memories_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_people: {
        Row: {
          confidence: number | null
          confirmed: boolean
          memory_id: string
          person_id: string
          user_id: string
        }
        Insert: {
          confidence?: number | null
          confirmed?: boolean
          memory_id: string
          person_id: string
          user_id: string
        }
        Update: {
          confidence?: number | null
          confirmed?: boolean
          memory_id?: string
          person_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memory_people_memory_id_fkey"
            columns: ["memory_id"]
            isOneToOne: false
            referencedRelation: "memories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memory_people_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_photos: {
        Row: {
          approximate_date: string | null
          caption: string | null
          created_at: string
          id: string
          memory_id: string | null
          storage_path: string
          user_id: string
        }
        Insert: {
          approximate_date?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          memory_id?: string | null
          storage_path: string
          user_id: string
        }
        Update: {
          approximate_date?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          memory_id?: string | null
          storage_path?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memory_photos_memory_id_fkey"
            columns: ["memory_id"]
            isOneToOne: false
            referencedRelation: "memories"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_places: {
        Row: {
          confidence: number | null
          confirmed: boolean
          memory_id: string
          place_id: string
          user_id: string
        }
        Insert: {
          confidence?: number | null
          confirmed?: boolean
          memory_id: string
          place_id: string
          user_id: string
        }
        Update: {
          confidence?: number | null
          confirmed?: boolean
          memory_id?: string
          place_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memory_places_memory_id_fkey"
            columns: ["memory_id"]
            isOneToOne: false
            referencedRelation: "memories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memory_places_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      people: {
        Row: {
          confirmed: boolean
          created_at: string
          id: string
          name: string
          notes: string | null
          relationship: string | null
          user_id: string
        }
        Insert: {
          confirmed?: boolean
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          relationship?: string | null
          user_id: string
        }
        Update: {
          confirmed?: boolean
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          relationship?: string | null
          user_id?: string
        }
        Relationships: []
      }
      places: {
        Row: {
          confirmed: boolean
          created_at: string
          id: string
          latitude: number | null
          location_text: string | null
          longitude: number | null
          name: string
          user_id: string
        }
        Insert: {
          confirmed?: boolean
          created_at?: string
          id?: string
          latitude?: number | null
          location_text?: string | null
          longitude?: number | null
          name: string
          user_id: string
        }
        Update: {
          confirmed?: boolean
          created_at?: string
          id?: string
          latitude?: number | null
          location_text?: string | null
          longitude?: number | null
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avoid_topics: string[]
          birth_date: string | null
          birth_year: number | null
          childhood_location: string | null
          created_at: string
          delivery_day: string
          delivery_time: string
          first_name: string | null
          id: string
          is_demo: boolean
          onboarded_at: string | null
          preserve_topics: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          avoid_topics?: string[]
          birth_date?: string | null
          birth_year?: number | null
          childhood_location?: string | null
          created_at?: string
          delivery_day?: string
          delivery_time?: string
          first_name?: string | null
          id?: string
          is_demo?: boolean
          onboarded_at?: string | null
          preserve_topics?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          avoid_topics?: string[]
          birth_date?: string | null
          birth_year?: number | null
          childhood_location?: string | null
          created_at?: string
          delivery_day?: string
          delivery_time?: string
          first_name?: string | null
          id?: string
          is_demo?: boolean
          onboarded_at?: string | null
          preserve_topics?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          active: boolean
          age_max: number | null
          age_min: number | null
          category: string
          created_at: string
          depth: string
          follow_up_allowed: boolean
          follow_up_themes: string[]
          good_for_interview: boolean
          good_for_photo: boolean
          id: string
          life_stage: string | null
          question_text: string
          sensitive_topics: string[]
          sensitivity_level: number
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          age_max?: number | null
          age_min?: number | null
          category: string
          created_at?: string
          depth?: string
          follow_up_allowed?: boolean
          follow_up_themes?: string[]
          good_for_interview?: boolean
          good_for_photo?: boolean
          id?: string
          life_stage?: string | null
          question_text: string
          sensitive_topics?: string[]
          sensitivity_level?: number
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          age_max?: number | null
          age_min?: number | null
          category?: string
          created_at?: string
          depth?: string
          follow_up_allowed?: boolean
          follow_up_themes?: string[]
          good_for_interview?: boolean
          good_for_photo?: boolean
          id?: string
          life_stage?: string | null
          question_text?: string
          sensitive_topics?: string[]
          sensitivity_level?: number
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      recordings: {
        Row: {
          created_at: string
          duration_seconds: number | null
          id: string
          memory_id: string | null
          raw_transcript: string | null
          storage_path: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_seconds?: number | null
          id?: string
          memory_id?: string | null
          raw_transcript?: string | null
          storage_path: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration_seconds?: number | null
          id?: string
          memory_id?: string | null
          raw_transcript?: string | null
          storage_path?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recordings_memory_id_fkey"
            columns: ["memory_id"]
            isOneToOne: false
            referencedRelation: "memories"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_questions: {
        Row: {
          answered_memory_id: string | null
          created_at: string
          custom_question_text: string | null
          id: string
          question_id: string | null
          scheduled_for: string
          skipped_reason: string | null
          source: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          answered_memory_id?: string | null
          created_at?: string
          custom_question_text?: string | null
          id?: string
          question_id?: string | null
          scheduled_for?: string
          skipped_reason?: string | null
          source?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          answered_memory_id?: string | null
          created_at?: string
          custom_question_text?: string | null
          id?: string
          question_id?: string | null
          scheduled_for?: string
          skipped_reason?: string | null
          source?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_questions_answered_memory_id_fkey"
            columns: ["answered_memory_id"]
            isOneToOne: false
            referencedRelation: "memories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
