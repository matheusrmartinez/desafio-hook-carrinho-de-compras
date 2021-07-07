import { MdAddShoppingCart } from 'react-icons/md';

import { useCart } from '../../hooks/useCart';
import { useProduct } from '../../hooks/useProduct';
import { ProductList } from './styles';

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
        <li key={product.id}>
        <img src={product.image} alt={product.title} />
        <strong>{product.title}</strong>
        <span>{(product.priceFormatted)}</span>
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

