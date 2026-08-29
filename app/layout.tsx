import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Li-Ning Sport Vietnam - Cửa hàng trực tuyến chính thức',
  description: 'Li-Ning Sport Vietnam - Cửa hàng trực tuyến chính thức của Li-Ning tại Việt Nam.',
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
      <body>
        {children}
      </body>
    </html>
  );
}
