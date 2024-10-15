'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader,CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SmileIcon , Search, Car, Trash, Trash2} from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
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
  //Filter product and search product
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
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
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-1 sm:px-3 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Modern Shop</h1>
            <div className="relative">
              <SmileIcon/>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                3
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <Select onValueChange={(value) => setSelectedCategory(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="books">Books</SelectItem>
                <SelectItem value="home & garden">Home & Garden</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.product_id}>
              <CardContent className="p-0">
                <img src={product.image} alt={product.name} className="w-full h-48 object-fit p-1 rounded-md" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600">
                    ${typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price).toFixed(2)}
                  </p>
                  <Badge className="mt-2 bg-gray-200 text-gray-600">{product.category}</Badge>
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
      <aside>
        <Card className="w-80 mx-2 my-5" style={{ minHeight: "200px", maxHeight: "60vh" }}>
          <CardHeader>
            <CardTitle>Cart</CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <ul className="space-y-2">
                {cart.map((item, index) => (
                  <li key={index} className="flex items-center space-x-2">
                  <span className="text-sm truncate flex-grow">{item.name}</span>
                  <span className="text-sm font-medium whitespace-nowrap">
                    ${parseFloat(item.price.toString()).toFixed(2)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(index)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Remove item</span>
                  </Button>
                </li>
                ))}
              </ul>
            )}
          </CardContent>
          {cart.length > 0 && (
            <CardFooter className="flex flex-col items-stretch gap-4">
              <div className="text-lg font-bold">Total: ${totalPrice.toFixed(2)}</div>
              <Button className="w-full" onClick={handleCheckout}>
                Checkout
              </Button>
            </CardFooter>
          )}
        </Card>
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
