'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

// Type for product data
type Product = {
  product_id: number;
  name: string;
  description: string;
  price: number | string;
  quantity_in_stock: number;
  created_at: string;
  image: string;
};

// Type for cart item
type CartItem = Product; // No quantity needed, just the product itself

export default function EcommerceUi() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<any>(null); // State to hold user info (username)
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [transactionComplete, setTransactionComplete] = useState<boolean>(false);
  const [transactionDetails, setTransactionDetails] = useState<CartItem[]>([]);
  const [finalTotalPrice, setFinalTotalPrice] = useState<number>(0); // New state for storing the total price at checkout

  // Fetch user information from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser); // Retrieve user info from localStorage
    } else {
      console.error("User info is missing from localStorage");
    }
  }, []);

  // Fetch product data from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/items'); // Fetch from the API route
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        const data: Product[] = await res.json();
        setProducts(data); // Set the products state with fetched data
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Add product to the cart
  const addToCart = (product: Product) => {
    if (!product.product_id) {
      console.error('Product ID is missing');
      return;
    }
    const newCart = [...cart, product];
    setCart(newCart); // Update the cart state
  };

  // Remove product from the cart
  const removeFromCart = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart); // Update the cart state
  };

  // Calculate total price of the cart
  const totalPrice = cart.reduce(
    (total, item) => total + parseFloat(item.price.toString()), // Sum up prices of each item in the cart
    0
  );

  // Checkout function: Handle the transaction
  const handleCheckout = async () => {
    if (!user || !user.username) {
      alert('You must be logged in to complete a transaction');
      return;
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart, user }), // Send the cart items and username to the backend
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to complete transaction');
      }

      // Store the total price at the time of checkout in a separate state
      setFinalTotalPrice(totalPrice);
      
      // After transaction is completed, clear the cart and show the transaction details
      setTransactionComplete(true);
      setTransactionDetails(cart); // Store transaction details
      setCart([]); // Clear the cart after checkout
    } catch (error: any) {
      setError(error.message);
    }
  };

  // Handle loading and error states
  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="flex">
      {/* Main content displaying products */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.product_id}>
              <CardContent className="p-0">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600">
                    ${typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price).toFixed(2)}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => addToCart(product)}>Add to Cart</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      {/* Sidebar for Cart */}
      <aside className="w-80 bg-gray-100 p-4">
        <h2 className="text-lg font-semibold">Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <div>
            <ul>
              {cart.map((item, index) => (
                <li key={index} className="flex justify-between my-2">
                  <span>{item.name}</span>
                  <span>${parseFloat(item.price.toString()).toFixed(2)}</span>
                  <Button onClick={() => removeFromCart(index)} size="sm">Remove</Button>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <strong>Total: ${totalPrice.toFixed(2)}</strong>
            </div>
            <Button className="w-full mt-4" onClick={handleCheckout}>Checkout</Button>
          </div>
        )}
      </aside>

      {/* Transaction Complete Modal */}
      {transactionComplete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Transaction Completed!</h2>
            <ul>
              {transactionDetails.map((item, index) => (
                <li key={index} className="my-2">
                  {item.name} - ${parseFloat(item.price.toString()).toFixed(2)}
                </li>
              ))}
            </ul>
            <p className="mt-4">
              <strong>Total: ${finalTotalPrice.toFixed(2)}</strong> {/* Use finalTotalPrice instead of recalculating */}
            </p>
            <Button className="mt-4" onClick={() => setTransactionComplete(false)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}
