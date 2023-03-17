export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bots: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
      }
      documents: {
        Row: {
          bot_id: string
          content: string | null
          embedding: unknown | null
          id: number
          metadata: Json
          source_id: number
        }
        Insert: {
          bot_id: string
          content?: string | null
          embedding?: unknown | null
          id?: number
          metadata: Json
          source_id: number
        }
        Update: {
          bot_id?: string
          content?: string | null
          embedding?: unknown | null
          id?: number
          metadata?: Json
          source_id?: number
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          subscription_status: boolean
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          subscription_status?: boolean
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          subscription_status?: boolean
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
      }
      sources: {
        Row: {
          bot_id: string
          created_at: string
          id: number
          meta: string
        }
        Insert: {
          bot_id: string
          created_at?: string
          id?: number
          meta: string
        }
        Update: {
          bot_id?: string
          created_at?: string
          id?: number
          meta?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      match_documents: {
        Args: {
          query_embedding: unknown
          similarity_threshold: number
          match_count: number
        }
        Returns: {
          id: number
          content: string
          similarity: number
        }[]
      }
      match_documents_by_id: {
        Args: {
          query_embedding: unknown
          similarity_threshold: number
          match_count: number
          query_bot_id: string
        }
        Returns: {
          id: number
          content: string
          similarity: number
        }[]
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      vector_dims: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      vector_norm: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
