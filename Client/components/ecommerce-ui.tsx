'use client'

import { ShoppingCart, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useState, useEffect } from 'react'
import { Badge } from './ui/badge'

export function EcommerceUi() {
  
  const products = [
    { id: 1, name: "Sleek Watch", price: 199.99, image: "https://github.com/shadcn.png", category:"Clothing" },
    { id: 2, name: "Designer Sunglasses", price: 129.99, image: "https://github.com/shadcn.png", category:"Clothing" },
    { id: 3, name: "Wireless Earbuds", price: 159.99, image: "https://github.com/shadcn.png", category:"Electroincs" },
    { id: 4, name: "Leather Wallet", price: 79.99, image: "https://github.com/shadcn.png", category:"Clothing" },
    { id: 5, name: "Smart Speaker", price: 99.99, image: "https://github.com/shadcn.png", category:"Electronics" },
    { id: 6, name: "Fitness Tracker", price: 89.99, image: "https://github.com/shadcn.png", category:"Electronics" },
    { id: 7, name: "Portable Charger", price: 49.99, image: "https://github.com/shadcn.png", category:"Electronics" },
    { id: 8, name: "Digital Camera", price: 299.99, image: "https://github.com/shadcn.png", category:"Electronics" },
    { id: 9, name: "Running Shoes", price: 129.99, image: "https://github.com/shadcn.png", category:"Clothing" },
    { id: 10, name: "Backpack", price: 69.99, image: "https://github.com/shadcn.png", category:"Clothing" },
  ]

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });


  


  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Modern Shop</h1>
            <div className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-600" />
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
                <SelectItem value="home">Home & Garden</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="md:col-span-2 lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => ( // Display filtered products
                <Card key={product.id}>
                  <CardContent className="p-0">
                    <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-gray-600">${product.price.toFixed(2)}</p>
                      <Badge className="mt-2 bg-gray-200 text-gray-600">{product.category}</Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Add to Cart</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-4">Cart Summary</h2>
                {[
                  { id: 1, name: "Sleek Watch", quantity: 1, price: 199.99 },
                  { id: 2, name: "Designer Sunglasses", quantity: 2, price: 129.99 },
                ].map((item) => (
                  <div key={item.id} className="flex justify-between items-center mb-2">
                    <span>{item.name}</span>
                    <div className="flex items-center">
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <span className="sr-only">Decrease quantity</span>
                        <span aria-hidden="true">-</span>
                      </Button>
                      <span className="mx-2">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <span className="sr-only">Increase quantity</span>
                        <span aria-hidden="true">+</span>
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="mt-4 text-right">
                  <strong>Total: $459.97</strong>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Checkout</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}