import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';
import { Toast } from 'react-toastify/dist/components';
import { useProduct } from '../../hooks/useProduct';
interface CartItemsAmount {
  [key: number]: number;
}

export default function Home() {
  const {products} = useProduct();
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    sumAmount[product.id] = (sumAmount[product.id] ?? 0) + product.amount;
    return sumAmount;
  }, {} as CartItemsAmount)


  function handleAddProduct(id: number) {
    addProduct(id);
  }

  return (
    <ProductList>
      {products.map(product => (      
        <li>
        <img src={product.image} alt={product.title} />
        <strong>{product.title}</strong>
        <span>{formatPrice(product.price)}</span>
        <button
          type="button"
          data-testid="add-product-button"
        onClick={() => handleAddProduct(product.id)}
        >
          <div data-testid="cart-product-quantity">
            <MdAddShoppingCart size={16} color="#FFF" />
            {cartItemsAmount[product.id] || 0}
          </div>
          <span>ADICIONAR AO CARRINHO</span>
        </button>
      </li>
      ))}
    </ProductList>
  );
};

