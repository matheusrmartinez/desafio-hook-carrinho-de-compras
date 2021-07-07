import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';

import { api } from '../services/api';
import { Product, Stock } from '../types';
import { useProduct } from './useProduct';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const {products} = useProduct();
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const productCart = cart.find(product => product.id === productId);  
      const product = products.find(product => product.id === productId);
      const amount = (productCart?.amount ?? 0) + 1

      const { data } = await api.get<Stock>(`/stock/${productId}`)
      
      if (amount > data.amount){
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }

      let newCart: Product[] = [];

      if (!product)
      return;

      if (!productCart) {
        product.amount = 1;
        newCart = [...cart, product]
      }
      else {
        newCart = cart.map(product => {
          if (product.id === productId) {
            return {
              ...product,
              amount: product.amount + 1
            }
          }
          return product;
        })
      }
      
      setCart(newCart)
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart))
    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      let newCart: Product[] = []; 
      
      newCart = cart.filter(product => product.id !== productId)
      setCart(newCart);
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart))
    } catch {
      toast.error('Erro na remoção do produto')
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {

      if(amount <= 0)
      return;

      const { data } = await api.get<Stock>(`/stock/${productId}`)

      if (amount > data.amount) {
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }

      let newCart = cart.map(product => {
        if (product.id === productId){
          return {
            ...product,
            amount
          }
        }
        return product;
      } )

      setCart(newCart);
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart))
    } catch {
      toast.error('')
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
