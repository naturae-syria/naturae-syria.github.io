"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"

export default function ProductCard({ product, usdPrice, onClick }) {
  return (
    <Card
      className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {product.image ? (
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name || product.name_pt || "Product image"}
            fill
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-orange-50">
            <span className="text-orange-300 text-lg">No Image</span>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-orange-700 line-clamp-2 min-h-[3rem]">{product.name_pt || ""}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2 min-h-[2.5rem]">{product.name || ""}</p>
      </CardContent>

      <CardFooter className="flex flex-col items-start p-4 pt-0 gap-2">
        <div className="flex flex-wrap gap-1 mb-2">
          {product.brand && (
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              {product.brand}
            </Badge>
          )}
          {product.category && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              {product.category}
            </Badge>
          )}
        </div>

        {usdPrice && <div className="font-bold text-lg text-orange-600">${usdPrice}</div>}
      </CardFooter>
    </Card>
  )
}
