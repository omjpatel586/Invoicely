import { ProductUnit } from './product';

export const LEGACY_PRODUCT_UNITS: Record<string, ProductUnit> = {
  kg: ProductUnit.KILOGRAMS,
  litre: ProductUnit.LITRES,
  gram: ProductUnit.GRAMS,
  pcs: ProductUnit.PIECES,
};
