import { CartProvider } from '../lib/cart-context';
import { FitRoomProvider } from '../components/fitroom/FitRoomContext';
import FitRoomModal from '../components/fitroom/FitRoomModal';
import CustomerProfileModal from '../components/fitroom/CustomerProfileModal';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MobileBottomBar from '../components/MobileBottomBar';
import SocialFloating from '../components/SocialFloating';
import ScrollToTop from '../components/ScrollToTop';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white text-[#333333] min-h-screen flex flex-col antialiased">
      <CartProvider>
        <FitRoomProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileBottomBar />
          <SocialFloating />
          <ScrollToTop />
          <FitRoomModal />
          <CustomerProfileModal />
        </FitRoomProvider>
      </CartProvider>
    </div>
  );
}
