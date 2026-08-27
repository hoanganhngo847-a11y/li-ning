import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Li-Ning Sport Vietnam - Cửa hàng trực tuyến chính thức',
  description:
    'Clone giao diện cửa hàng Li-Ning Vietnam với trang chủ, danh mục, sản phẩm, giỏ hàng, tin tức và hệ thống cửa hàng.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
