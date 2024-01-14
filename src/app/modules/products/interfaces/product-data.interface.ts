import { CategoryData } from "../../categories/components/interfaces/category-data.interface";

export interface ProductData {
  _id?: string;
  code: string;
  name: string;
  description: string;
  category: Partial<CategoryData>;
  unitMeasurement: string;
  minQuantity: number;
  quantity: number;
  price: number;
  status: string;
}
