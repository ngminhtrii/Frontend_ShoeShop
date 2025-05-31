export interface ProductAttributes {
  genders?: Array<{
    id: string;
    name: string;
  }>;
  colors?: Array<{
    _id: string;
    name: string;
    code: string;
    type: "solid" | "gradient";
    colors?: string[];
  }>;
  sizes?: Array<{
    _id: string;
    value: string | number;
    description?: string;
  }>;
  priceRange?: {
    min: number;
    max: number;
  };
  inventoryMatrix?: {
    summary?: {
      total: number;
    };
  };
}

export interface ProductVariants {
  [key: string]: {
    id: string;
    sizes?: Array<{
      sizeId: string;
      sizeValue?: string | number;
      quantity: number;
      description?: string;
    }>;
    price?: number;
    priceFinal?: number;
    percentDiscount?: number;
  };
}

export interface ProductImages {
  [key: string]: Array<{
    url: string;
    alt?: string;
  }>;
}
