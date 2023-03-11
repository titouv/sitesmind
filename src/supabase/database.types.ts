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
      documents: {
        Row: {
          content: string | null
          embedding: unknown | null
          id: number
          site_id: number | null
        }
        Insert: {
          content?: string | null
          embedding?: unknown | null
          id?: number
          site_id?: number | null
        }
        Update: {
          content?: string | null
          embedding?: unknown | null
          id?: number
          site_id?: number | null
        }
      }
      sites: {
        Row: {
          created_at: string | null
          id: number
          url: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          url?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          url?: string | null
          user_id?: string | null
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
          my_site_id: number
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
