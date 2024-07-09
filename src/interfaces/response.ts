export interface Response<T> {
  success: boolean;
  data: T;
  message: string;
  error: string;
  errors: string[];
  extras: any;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  from_page_url: string;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url?: string;
  per_page: number;
  prev_page_url?: string;
  to: number;
  total: number;
  from: number;
}

interface Link {
  url?: string;
  label: string;
  active: boolean;
}


export interface LoginResponse {
  token: string;
}
