export interface Category {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
  deletedAt?: string | null;
  deletedBy?: string | { _id: string; name?: string } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Brand {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  logo?: { url: string; public_id?: string };
  isActive?: boolean;
  deletedAt?: string | null;
  deletedBy?: string | { _id: string; name?: string } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface VariantSize {
  size: string; // ObjectId của Size
  quantity: number;
  sku?: string;
  isSizeAvailable?: boolean;
}

export interface Variant {
  _id: string;
  product: string; // ObjectId của Product
  imagesvariant: {
    url: string;
    public_id: string;
    isMain: boolean;
    displayOrder?: number;
  }[];
  price: number;
  costPrice: number;
  percentDiscount: number;
  priceFinal: number;
  profit: number;
  profitPercentage: number;
  gender: "male" | "female";
  color: string; // ObjectId của Color
  sizes: VariantSize[];
  isActive: boolean;
  deletedAt?: string | null;
  deletedBy?: string | { _id: string; name?: string } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  images: {
    url: string;
    public_id: string;
    isMain: boolean;
    displayOrder?: number;
  }[];
  category: Category;
  brand: Brand;
  variants: Variant[];
  totalQuantity: number;
  stockStatus: "in_stock" | "low_stock" | "out_of_stock";
  isActive: boolean;
  rating: number;
  numReviews: number;
  deletedAt?: string | null;
  deletedBy?: string | { _id: string; name?: string } | null;
  createdAt?: string;
  updatedAt?: string;
}
