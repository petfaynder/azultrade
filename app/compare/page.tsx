"use client"

import { useCompare } from "@/contexts/CompareContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { XCircle } from "lucide-react";

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Comparison</h1>
        <p className="text-lg text-gray-600 mb-8">You haven't added any products to compare yet.</p>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Product Comparison ({compareList.length} / 4)</h1>
        <Button variant="destructive" onClick={clearCompare}>Clear All</Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-4 font-semibold text-left w-1/5">Feature</th>
              {compareList.map(product => (
                <th key={product.id} className="border p-4 text-center">
                  <div className="relative">
                    <Button variant="ghost" size="sm" className="absolute -top-2 -right-2" onClick={() => removeFromCompare(product.id)}>
                      <XCircle className="h-5 w-5 text-red-500" />
                    </Button>
                    <Link href={`/products/${product.id}`}>
                      <Image src={product.images[0] || "/placeholder.svg"} alt={product.name} width={150} height={150} className="mx-auto mb-2" />
                      <h3 className="font-semibold text-blue-600 hover:underline">{product.name}</h3>
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-4 font-semibold">Category</td>
              {compareList.map(product => <td key={product.id} className="border p-4 text-center">{product.category_name}</td>)}
            </tr>
            <tr>
              <td className="border p-4 font-semibold">Manufacturer</td>
              {compareList.map(product => <td key={product.id} className="border p-4 text-center">{product.manufacturer}</td>)}
            </tr>
            <tr>
              <td className="border p-4 font-semibold">Price</td>
              {compareList.map(product => <td key={product.id} className="border p-4 text-center">{product.price}</td>)}
            </tr>
            <tr>
              <td className="border p-4 font-semibold align-top">Features</td>
              {compareList.map(product => (
                <td key={product.id} className="border p-4 align-top">
                  <ul className="list-disc list-inside text-left">
                    {product.features.map((feature, index) => <li key={index}>{feature}</li>)}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}