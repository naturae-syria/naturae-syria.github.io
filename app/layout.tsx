import "@/app/globals.css"
import { Tajawal } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
})

export const metadata = {
  title: "دليل المنتجات - ناتورا وأفون",
  description: "دليل منتجات ناتورا وأفون للعناية الشخصية والجمال",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={tajawal.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
