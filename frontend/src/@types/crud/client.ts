export type ClientSchema = {
    client_id?: number;
    client_importid?: string | null;
    client_created_at?: string | null; // ISO datetime string
    client_updated_at?: string | null; // ISO datetime string
    client_fk_creator_id: number;
    client_created_from_lead_id: number;
    client_fk_category_id?: number | null; // Default 2
    client_company_name: string;
    client_description?: string | null;
    client_phone?: string | null;
    client_logo_folder?: string | null;
    client_logo_filename?: string | null;
    client_website?: string | null;
    client_street?: string | null;
    client_city?: string | null;
    client_state?: string | null;
    client_zip?: string | null;
    client_country?: string | null;
    client_status: string; // "active" | "suspended"
    client_app_modules?: string; // Default "system"
};
