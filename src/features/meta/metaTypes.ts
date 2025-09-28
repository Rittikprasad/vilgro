/**
 * Type definitions for meta options API
 * Defines the structure of meta data used in signup forms
 */

export interface OptionItem {
  key: string;
  label: string;
}

export interface MetaOptions {
  registration_types: OptionItem[];
  innovation_types: OptionItem[];
  geo_scopes: OptionItem[];
  focus_sectors: OptionItem[];
  stages: OptionItem[];
  impact_focus: OptionItem[];
  use_of_questionnaire: OptionItem[];
  states: string[];
  top_states_limit: number;
}

export interface MetaState {
  options: MetaOptions | null;
  isLoading: boolean;
  error: string | null;
}

export interface MetaApiResponse {
  registration_types: OptionItem[];
  innovation_types: OptionItem[];
  geo_scopes: OptionItem[];
  focus_sectors: OptionItem[];
  stages: OptionItem[];
  impact_focus: OptionItem[];
  use_of_questionnaire: OptionItem[];
  states: string[];
  top_states_limit: number;
}
