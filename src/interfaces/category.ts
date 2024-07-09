import {Product} from "@/interfaces/product";

export interface Category {
  uuid: string;
  title: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryWithProducts extends Category {
  products: Product[];

}
