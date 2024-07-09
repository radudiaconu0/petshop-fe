export interface Promotion {
  uuid: string;
  title: string;
  content: string;
  metadata: MetaData;
  created_at: string;
  updated_at: string;
}

interface MetaData {
  image?: string;
  valid_to?: string;
  valid_from?: string;
}
