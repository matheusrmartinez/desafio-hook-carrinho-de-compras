import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api } from "../services/api";
import { ProductFormatted } from "../types";
import { formatPrice } from "../util/format";

interface ProductContextData {
  products: ProductFormatted[];
  setProducts(value: ProductFormatted[]): void;
}

interface ProductProviderProps {
  children: ReactNode;
}

const ProductContext = createContext<ProductContextData>({} as ProductContextData);

export function ProductProvider({children}: ProductProviderProps){
  const [products, setProducts] = useState<ProductFormatted[]>([] as ProductFormatted[]);

  useEffect(() => {
    async function loadProducts() {
      const response = await api.get('products');

      const productsApi: ProductFormatted[] = response.data;

      const productsFormatted = productsApi.map(product => {
        product.priceFormatted = formatPrice(product.price);
        return product;
      })

      setProducts(productsFormatted);
    }

    loadProducts();

  }, [])

return (
  <ProductContext.Provider
  value={{ products, setProducts}}
  >
    {children}
  </ProductContext.Provider>
)
}

export function useProduct(): ProductContextData {
  const context = useContext(ProductContext);
  return context;
}