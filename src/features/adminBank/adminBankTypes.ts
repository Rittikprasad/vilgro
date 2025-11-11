export type AdminBankStatus = "ACTIVE" | "INACTIVE";

export interface AdminBankPayload {
  name: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  status: AdminBankStatus;
}

export interface AdminBankEntry extends AdminBankPayload {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface AdminBankState {
  items: AdminBankEntry[];
  isLoading: boolean;
  error: string | null;
  isCreating: boolean;
  createError: string | null;
  isUpdating: boolean;
  updateError: string | null;
  lastFetchedAt: string | null;
  isDeleting: boolean;
  deleteError: string | null;
}

