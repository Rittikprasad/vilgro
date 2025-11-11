export interface AdminProfileUser {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
}

export interface AdminProfileOrganization {
  name: string;
  registration_type: string;
  date_of_incorporation: string;
  gst_number: string;
  cin_number: string;
}

export interface AdminProfileResponse {
  user: AdminProfileUser;
  organization: AdminProfileOrganization | null;
}

export interface AdminProfileState {
  user: AdminProfileUser | null;
  organization: AdminProfileOrganization | null;
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: string | null;
}

