import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from './lib/cart-context';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileBottomBar from './components/MobileBottomBar';
import SocialFloating from './components/SocialFloating';
import ScrollToTop from './components/ScrollToTop';

export const metadata: Metadata = {
  title: 'Li-Ning Sport Vietnam - Cửa hàng trực tuyến chính thức',
  description: 'Li-Ning Sport Vietnam - Cửa hàng trực tuyến chính thức của Li-Ning tại Việt Nam. Giày thể thao, quần áo, vợt cầu lông, pickleball chính hãng.',
  keywords: 'Li-Ning, thể thao, giày, cầu lông, pickleball, chạy bộ, bóng rổ',
  icons: { icon: 'https://cdn.hstatic.net/themes/1000312752/1001500748/14/favicon.png?v=165' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                theme: {
                  extend: {
                    colors: {
                      brand: '#f30d29',
                      'brand-dark': '#d10b23',
                      dark: '#111111',
                      'gray-bg': '#f7f7f7',
                      'gray-border': '#e5e5e5',
                      price: '#d0021b',
                      'price-old': '#999999',
                    }
                  }
                }
              }
            `,
          }}
        />
      </head>
      <body className="bg-white text-[#333333] min-h-screen flex flex-col antialiased">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileBottomBar />
          <SocialFloating />
          <ScrollToTop />
        </CartProvider>
      </body>
    </html>
  );
}
