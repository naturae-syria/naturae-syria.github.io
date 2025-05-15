import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"

// استخدام طريقة بديلة لتضمين الخط بدلاً من next/font
export const metadata = {
  title: "دليل المنتجات - ناتورا وأفون",
  description: "دليل منتجات ناتورا وأفون للعناية الشخصية والجمال",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* تضمين خط Tajawal من Google Fonts مباشرة */}
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Tajawal', sans-serif" }}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
