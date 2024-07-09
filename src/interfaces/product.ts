export interface Product {
  uuid: string,
  title: string,
  price: number,
  description: string,
  metadata: any,
  brand: Brand,
  category: Category,
}

export interface Brand {
  uuid: string,
  title: string,
  slug: string,
  created_at: string,
}

export interface Category {
  uuid: string,
  title: string,
  slug: string,
  created_at: string,
}
