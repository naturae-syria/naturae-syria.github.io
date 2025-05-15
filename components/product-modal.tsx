"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { X } from "lucide-react"

export default function ProductModal({ product, usdPrice, isOpen, onClose }) {
  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-right">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          <DialogTitle className="text-2xl font-bold text-orange-700">{product.name_pt || ""}</DialogTitle>
          <DialogDescription className="text-lg text-gray-700">{product.name || ""}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="relative h-[300px] md:h-[400px] bg-gray-50 rounded-lg overflow-hidden">
            {product.image ? (
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name || product.name_pt || "Product image"}
                fill
                className="object-contain p-4"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-orange-50">
                <span className="text-orange-300 text-lg">No Image</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {product.brand && (
                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">{product.brand}</Badge>
              )}
              {product.line && <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">{product.line}</Badge>}
              {product.category && (
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">{product.category}</Badge>
              )}
            </div>

            {usdPrice && <div className="text-2xl font-bold text-orange-600 mb-4">${usdPrice}</div>}

            <div className="space-y-3 text-gray-700">
              {product.description && (
                <div>
                  <h4 className="font-semibold text-orange-800">الوصف:</h4>
                  <p>{product.description}</p>
                </div>
              )}

              {product.usage && (
                <div>
                  <h4 className="font-semibold text-orange-800">طريقة الاستخدام:</h4>
                  <p>{product.usage}</p>
                </div>
              )}

              {product.explanation && (
                <div>
                  <h4 className="font-semibold text-orange-800">الشرح:</h4>
                  <p>{product.explanation}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
