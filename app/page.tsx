"use client"

import { useState, useEffect } from "react"
import { Search, X, Info, ShoppingBag } from "lucide-react"
import ProductCard from "@/components/product-card"
import ProductModal from "@/components/product-modal"
import AboutSection from "@/components/about-section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import products from "../data/products.js"
import { transformPrice, convertToUSD } from "@/lib/pricing"

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBrand, setSelectedBrand] = useState("")
  const [selectedLine, setSelectedLine] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [usdRate, setUsdRate] = useState(1 / 5.2)
  const [activeTab, setActiveTab] = useState("catalog")

  // Get unique values for filters
  const uniqueBrands = [...new Set(products.map((item) => item.brand).filter(Boolean))]
  const uniqueLines = [...new Set(products.map((item) => item.line).filter(Boolean))]
  const uniqueCategories = [...new Set(products.map((item) => item.category).filter(Boolean))]

  // Fetch USD exchange rate
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const res = await fetch("https://api.exchangerate.host/latest?base=BRL&symbols=USD")
        const data = await res.json()

        // Check if data.rates and data.rates.USD exist
        if (data && data.rates && data.rates.USD) {
          setUsdRate(data.rates.USD)
        } else {
          console.error("Exchange rate API returned unexpected format:", data)
          setUsdRate(1 / 5.2) // Fallback rate
        }
      } catch (err) {
        console.error("Error fetching exchange rate:", err)
        setUsdRate(1 / 5.2) // Fallback rate
      }
    }

    fetchExchangeRate()
  }, [])

  // Filter products when search or filters change
  useEffect(() => {
    const filtered = products.filter((product) => {
      const nameMatch =
        (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.name_pt && product.name_pt.toLowerCase().includes(searchTerm.toLowerCase()))

      return (
        (!searchTerm || nameMatch) &&
        (!selectedBrand || selectedBrand === "all" || product.brand === selectedBrand) &&
        (!selectedLine || selectedLine === "all" || product.line === selectedLine) &&
        (!selectedCategory || selectedCategory === "all" || product.category === selectedCategory)
      )
    })

    setFilteredProducts(filtered)
  }, [searchTerm, selectedBrand, selectedLine, selectedCategory])


  // Open product modal
  const openProductModal = (product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("")
    setSelectedBrand("")
    setSelectedLine("")
    setSelectedCategory("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
              <ShoppingBag className="h-8 w-8 text-orange-500" />
            </div>
            <h1 className="text-2xl font-bold text-orange-600">دليل المنتجات</h1>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto mt-4 md:mt-0">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="catalog">المنتجات</TabsTrigger>
              <TabsTrigger value="about">عن الشركة</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeTab === "catalog" ? (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="ابحث عن منتج..."
                  className="pr-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="العلامة التجارية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل العلامات التجارية</SelectItem>
                  {uniqueBrands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLine} onValueChange={setSelectedLine}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="الخط" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل الخطوط</SelectItem>
                  {uniqueLines.map((line) => (
                    <SelectItem key={line} value={line}>
                      {line}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="الفئة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل الفئات</SelectItem>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(searchTerm || selectedBrand || selectedLine || selectedCategory) && (
                <Button variant="outline" className="flex items-center gap-2" onClick={resetFilters}>
                  <X className="h-4 w-4" />
                  <span>إعادة ضبط</span>
                </Button>
              )}
            </div>

            <div className="text-sm text-gray-500 mb-4">تم العثور على {filteredProducts.length} منتج</div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => {
                  const adjustedBRL = transformPrice(product.price).toFixed(2)
                  const usdPrice = convertToUSD(adjustedBRL, usdRate)

                  return (
                    <ProductCard
                      key={index}
                      product={product}
                      usdPrice={usdPrice}
                      onClick={() => openProductModal(product)}
                    />
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
                  <Info className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">لم يتم العثور على منتجات</h3>
                <p className="text-gray-500">حاول تغيير معايير البحث أو إعادة ضبط الفلترة</p>
                <Button className="mt-4" onClick={resetFilters}>
                  إعادة ضبط الفلترة
                </Button>
              </div>
            )}
          </div>
        ) : (
          <AboutSection />
        )}
      </main>

      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">&copy; {new Date().getFullYear()} جميع الحقوق محفوظة لشركة المؤيد</p>
          <div className="mt-2">
            <a
              href="https://wa.me/963933255667"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-orange-600 hover:text-orange-800 transition-colors"
            >
              تواصل معنا عبر واتساب
            </a>
          </div>
        </div>
      </footer>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          usdPrice={convertToUSD(
            transformPrice(selectedProduct.price).toFixed(2),
            usdRate
          )}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}
