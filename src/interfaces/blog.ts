export interface Post {
  uuid: string;
  title: string;
  slug: string;
  content: string;
  metadata: MetaData;
  created_at: string;
  updated_at: string;
}

interface MetaData {
  author: string;
  image: string;
}
