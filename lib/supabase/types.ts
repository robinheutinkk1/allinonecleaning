/**
 * Database-typen voor Supabase.
 * Handmatig bijgehouden; houd in sync met supabase/migrations/*.sql.
 * (Alternatief: `supabase gen types typescript --project-id … > lib/supabase/types.ts`)
 */

export type QuoteStatus = "new" | "reviewing" | "contacted" | "quoted" | "won" | "lost" | "cancelled";

export type QuoteRequestRow = {
  id: string;
  created_at: string;
  updated_at: string;
  quote_number: string;
  status: QuoteStatus;

  customer_name: string;
  phone: string;
  email: string;

  address: string | null;
  postal_code: string;
  house_number: string;
  city: string;

  service: string;
  service_other: string | null;
  property_type: string;
  surface_type: string;
  surface_other: string | null;

  estimated_size: string;
  estimated_m2: number | null;
  contamination_types: string[];
  contamination_other: string | null;

  desired_period: string;
  desired_date: string | null;

  message: string | null;
  photo_paths: string[];

  source: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;

  admin_notes: string | null;
  assigned_to: string | null;

  privacy_accepted_at: string;
  ip_hash: string | null;
  user_agent: string | null;
};

export type QuoteRequestInsert = Omit<QuoteRequestRow, "id" | "created_at" | "updated_at" | "quote_number" | "status"> &
  Partial<Pick<QuoteRequestRow, "status">>;

export type ProjectRow = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  description: string | null;
  result: string | null;
  service: string;
  location: string | null;
  before_image: string;
  after_image: string;
  before_alt: string | null;
  after_alt: string | null;
  gallery_images: string[] | null;
  published: boolean;
  featured: boolean;
  sort_order: number;
};

export type ContactMessageRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  ip_hash: string | null;
};

export type ContactMessageInsert = Omit<ContactMessageRow, "id" | "created_at" | "status">;

/** Minimale Database-typing zodat supabase-js query's getypeerd zijn. */
export type Database = {
  public: {
    Tables: {
      quote_requests: {
        Row: QuoteRequestRow;
        Insert: QuoteRequestInsert;
        Update: Partial<QuoteRequestRow>;
        Relationships: [];
      };
      projects: {
        Row: ProjectRow;
        Insert: Omit<ProjectRow, "id" | "created_at" | "updated_at">;
        Update: Partial<ProjectRow>;
        Relationships: [];
      };
      contact_messages: {
        Row: ContactMessageRow;
        Insert: ContactMessageInsert;
        Update: Partial<ContactMessageRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      next_quote_number: {
        Args: { prefix: string };
        Returns: string;
      };
    };
    Enums: {
      quote_status: QuoteStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
