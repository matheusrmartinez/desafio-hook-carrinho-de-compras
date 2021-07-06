import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api } from "../services/api";
import { Product } from "../types";

interface ProductContextData {
  products: Product[];
  setProducts(value: Product[]): void;
}

interface ProductProviderProps {
  children: ReactNode;
}

const ProductContext = createContext<ProductContextData>({} as ProductContextData);

export function ProductProvider({children}: ProductProviderProps){
  const [products, setProducts] = useState<Product[]>([] as Product[]);

  useEffect(() => {
    async function loadProducts() {
      api.get('products').then(response => setProducts(response.data)).catch(error => {console.log('Falha ao buscar produtos')})
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