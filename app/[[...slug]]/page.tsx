"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  slug: string;
  category: string;
  sport: string;
  gender: "Nam" | "Nữ" | "Unisex";
  price: number;
  oldPrice?: number;
  badge?: string;
  soldOut?: boolean;
  image: string;
  hover?: string;
};

const logo =
  "https://cdn.hstatic.net/themes/1000312752/1001500748/14/logo_compact.png?v=165";

const heroSlides = [
  "https://cdn.hstatic.net/themes/1000312752/1001500748/14/slideshow_1.jpg?v=165",
  "https://cdn.hstatic.net/themes/1000312752/1001500748/14/slideshow_3.jpg?v=165",
  "https://cdn.hstatic.net/themes/1000312752/1001500748/14/slideshow_4.jpg?v=165",
  "https://cdn.hstatic.net/themes/1000312752/1001500748/14/slideshow_6.jpg?v=165",
];

const sportTiles = [
  {
    label: "PICKLEBALL",
    href: "/collections/pickleball",
    img: "https://cdn.hstatic.net/themes/1000312752/1001500748/14/groupbuy_1_img_large.jpg?v=165",
  },
  {
    label: "CẦU LÔNG",
    href: "/collections/cau-long-2",
    img: "https://cdn.hstatic.net/themes/1000312752/1001500748/14/groupbuy_2_img_large.jpg?v=165",
  },
  {
    label: "CHẠY BỘ",
    href: "/collections/chay-bo-1",
    img: "https://cdn.hstatic.net/themes/1000312752/1001500748/14/groupbuy_4_img_large.jpg?v=165",
  },
  {
    label: "TẬP LUYỆN",
    href: "/collections/luyen-tap-1",
    img: "https://cdn.hstatic.net/themes/1000312752/1001500748/14/groupbuy_6_img_large.jpg?v=165",
  },
  {
    label: "BÓNG RỔ",
    href: "/collections/bong-ro-2",
    img: "https://cdn.hstatic.net/themes/1000312752/1001500748/14/groupbuy_7_img_large.jpg?v=165",
  },
  {
    label: "GOLF",
    href: "/collections/golf-1",
    img: "https://cdn.hstatic.net/themes/1000312752/1001500748/14/groupbuy_10_img_large.jpg?v=165",
  },
];

const shoeCats = [
  ["Giày thời trang", "/collections/giay-thoi-trang-nam", "https://cdn.hstatic.net/products/1000312752/dsc08674_d6a079d990a14a58b59fe1242b6df1e0_medium.jpg"],
  ["Giày chạy bộ", "/collections/giay-chay-bo-nam-2", "https://cdn.hstatic.net/products/1000312752/arbw007-8-mxk-white-1_0c3d7a172ea447a5a2286d914bb5d6cc_medium.jpg"],
  ["Giày cầu lông", "/collections/giay-cau-long-nam", "https://cdn.hstatic.net/products/1000312752/4989_1abbc82ea7da4ec78d5dd54e298a0cdf_81bc204d07dc45bcbe9dee0a23ec81b7_fc725c724bef4ebda3ea4730b98864e8_medium.jpg"],
  ["Giày bóng rổ", "/collections/giay-bong-ro-nam-2", "https://cdn.hstatic.net/products/1000312752/27e2ad987cdffe0c643a1918d39081bbdd2fd2b72fe1ac8f2bfeb5b38624078f777ed3_7154051f0eb4415db00b31a07693ec4f_medium.jpg"],
  ["Giày bóng đá", "/collections/giay-bong-da-nam", "https://product.hstatic.net/1000312752/product/xx_05167_2a30501094524af9a706471282532ea1_medium.jpg"],
  ["Giày bóng bàn", "/collections/giay-bong-ban", "https://cdn.hstatic.net/products/1000312752/gi_3_vn-11134201-7ra0g-m9b4xgbbdsucf7_5b2f462f0f21444e9df689ee45154253_cee3010aaf834b05965de4e2ba9e90f0_medium.jpg"],
  ["Dép", "/collections/dep", "https://product.hstatic.net/1000312752/product/agau005-12v9__3__b6cc3a16cd6b4c578d79922d5bdaba13_medium.jpg"],
];

const products: Product[] = [
  {
    id: 1,
    name: "Giày cầu lông ALMIGHTY V 2.0 Nam P-AYTV029-1V",
    slug: "giay-cau-long-nam-p-aytv029-1v",
    category: "Giày cầu lông",
    sport: "Cầu lông",
    gender: "Nam",
    price: 1325455,
    image: "https://cdn.hstatic.net/products/1000312752/4989_1abbc82ea7da4ec78d5dd54e298a0cdf_81bc204d07dc45bcbe9dee0a23ec81b7_fc725c724bef4ebda3ea4730b98864e8.jpg",
    hover: "https://cdn.hstatic.net/products/1000312752/4987_3f1444edf15c48b396b1ae078cdb4c31_e85f366742c4415e9db26af67bde50e8_f3c59008ff05498bac734bbd0b6f13cc.jpg",
  },
  {
    id: 2,
    name: "Giày cầu lông Feiying Nam P-AYTU001-4V",
    slug: "giay-cau-long-feiying-nam-p-aytu001-4v",
    category: "Giày cầu lông",
    sport: "Cầu lông",
    gender: "Nam",
    price: 1178182,
    image: "https://cdn.hstatic.net/products/1000312752/5289_67591bcd9bbe4c98b9fd058a4df11ace_af646d358b424293b32c4d6d3433f05b_fcb65d425dfa4ee0a39b946917527c40.jpg",
  },
  {
    id: 3,
    name: "Giày cầu lông Ground-Flying III LITE Nam P-AYTV003-2V",
    slug: "giay-cau-long-ground-flying-iii-lite-nam-p-aytv003-2v",
    category: "Giày cầu lông",
    sport: "Cầu lông",
    gender: "Nam",
    price: 1472727,
    image: "https://cdn.hstatic.net/products/1000312752/7def_e68c6bab503e4446831184f91151407f_2bf4ba1719e8450ab27babf5e66760e5_b14066cf5d9244b4a7ef6f175645c935.jpeg",
  },
  {
    id: 4,
    name: "Giày cầu lông Nam AYTT001-1",
    slug: "giay-cau-long-nam-aytt001-1",
    category: "Giày cầu lông",
    sport: "Cầu lông",
    gender: "Nam",
    price: 824727,
    oldPrice: 1178182,
    badge: "-30%",
    image: "https://cdn.hstatic.net/products/1000312752/2efb_6646451cb2824e3699d741dd31dc9f86_07e55fc63f3644bfbfa971b0a84d6c79_71aee0aa7b42437ea64d8fcab903b4a0.jpg",
  },
  {
    id: 5,
    name: "Áo Polo Nam P-APLR125-10V",
    slug: "ao-polo-nam-p-aplr125-10v",
    category: "Áo",
    sport: "Summer",
    gender: "Nam",
    price: 579273,
    image: "https://cdn.hstatic.net/products/1000312752/p-aplr125-10v__1__af68eb06330c47a0963f4b53b993ba3f_fa1c3956deed46ddacc847fa5edb2fad.jpg",
    hover: "https://cdn.hstatic.net/products/1000312752/p-aplr125-10v__2__699e6ed7de44480284dc0d68f371c788_0d37cb41267e49a695dc63b8b4556b09.jpg",
  },
  {
    id: 6,
    name: "Áo Polo Nam APLV659-2V",
    slug: "ao-polo-nam-aplv659-2v",
    category: "Áo",
    sport: "Summer",
    gender: "Nam",
    price: 817855,
    oldPrice: 1168364,
    badge: "-30%",
    image: "https://product.hstatic.net/1000312752/product/aplv659-2v__1__62d7b96cd047402f9865b5e088361441.jpg",
  },
  {
    id: 7,
    name: "Áo Polo Nam APLV039-9V",
    slug: "ao-polo-nam-aplv039-9v",
    category: "Áo",
    sport: "Summer",
    gender: "Nam",
    price: 486000,
    oldPrice: 972000,
    badge: "-50%",
    image: "https://product.hstatic.net/1000312752/product/aplv039-9_ab05b0ed17764926baf6eab49072aae8.jpg",
  },
  {
    id: 8,
    name: "Vợt Pickleball Hyperpower 50 16mm P-ACPV015-16",
    slug: "vot-pickleball-hyperpower-50-16mm-p-acpv015-16",
    category: "Vợt",
    sport: "Pickleball",
    gender: "Unisex",
    price: 1993091,
    oldPrice: 2847273,
    badge: "-30%",
    image: "https://cdn.hstatic.net/products/1000312752/3e83_6507281460634c88866d827ddf4769d1_1b15a9a9c5af4e0b922350a7c6f85e88.jpg",
  },
  {
    id: 9,
    name: "Vợt Pickleball HyperPower Cannon Pro Unisex P-ACPW003-161V",
    slug: "vot-pickleball-hyperpower-cannon-pro-unisex-p-acpw003-161v",
    category: "Vợt",
    sport: "Pickleball",
    gender: "Unisex",
    price: 2454545,
    image: "https://cdn.hstatic.net/products/1000312752/f04f_f016dd6ad04b4956867f326ba47b0558_22d663a4f34a4a15a93eef633f9fd818.jpg",
  },
  {
    id: 10,
    name: "Áo T-shirt Nữ AHSV410-4V",
    slug: "ao-t-shirt-nu-ahsv410-4v",
    category: "Áo",
    sport: "Summer",
    gender: "Nữ",
    price: 203237,
    oldPrice: 677455,
    badge: "-70%",
    image: "https://cdn.hstatic.net/products/1000312752/5c87_76b8b8eaf47746498ec2a44ed0570a15.jpg",
  },
  {
    id: 11,
    name: "Giày cầu lông Nam P-AYTV015-3",
    slug: "giay-cau-long-nam-p-aytv015-3",
    category: "Giày cầu lông",
    sport: "Cầu lông",
    gender: "Nam",
    price: 613637,
    soldOut: true,
    image: "https://cdn.hstatic.net/products/1000312752/4c70_24abfab2d7684a1caf9c34e32e89636b_c3006620ae09469090cf2a8c7242bdb6_05bd5c4b044641608008c8cd18c371be.jpeg",
  },
  {
    id: 12,
    name: "Quần short Nam P-AAPS047-2V",
    slug: "quan-short-nam-p-aaps047-2v",
    category: "Quần",
    sport: "Cầu lông",
    gender: "Nam",
    price: 392727,
    image: "https://cdn.hstatic.net/products/1000312752/79e9_79c450f30acc47cbad229d4e9e3f89be.jpg",
  },
];

const news = [
  {
    title: "[NEW COLLECTION] LI-NING SUMMER 2026: MOVE TOGETHER - STAY TOGETHER",
    desc: "Mùa hè đẹp nhất không nằm ở điểm đến, mà ở những khoảnh khắc cùng nhau vận động, tận hưởng và giữ nhịp sống tích cực.",
    img: heroSlides[0],
  },
  {
    title: "THÔNG BÁO: CÔNG BỐ CHẤT LƯỢNG BÌNH ĐỰNG NƯỚC AQTW121",
    desc: "Tại Li-Ning, sức khỏe và sự an tâm của khách hàng luôn là ưu tiên trong từng sản phẩm được phân phối.",
    img: "https://cdn.hstatic.net/themes/1000312752/1001500748/14/payment_4_img.png?v=165",
  },
  {
    title: "THÔNG BÁO: CÔNG BỐ CHẤT LƯỢNG BÌNH ĐỰNG NƯỚC AQTW109",
    desc: "Thông tin chứng nhận chất lượng, hướng dẫn sử dụng và khuyến nghị bảo quản sản phẩm chính hãng.",
    img: "https://cdn.hstatic.net/themes/1000312752/1001500748/14/payment_3_img.png?v=165",
  },
];

const mega = [
  ["MÔN THỂ THAO", "PICKLEBALL", "CẦU LÔNG", "CHẠY BỘ", "TẬP LUYỆN", "BÓNG RỔ", "BÓNG ĐÁ", "GOLF"],
  ["THỜI TRANG", "SPORTLIFE", "SPORTWEAR", "ISAAC"],
  ["YOUNG", "BÉ TRAI (7 - 14 tuổi)", "BÉ GÁI (7 - 14 tuổi)", "PHỤ KIỆN BƠI"],
  ["NAM", "GIÀY DÉP", "Giày thời trang", "Giày chạy bộ", "Giày cầu lông", "Giày bóng rổ", "ÁO", "Áo T-Shirt", "Áo Polo", "QUẦN", "Quần Short", "PHỤ KIỆN"],
  ["NỮ", "GIÀY DÉP", "Giày thời trang", "Giày chạy bộ", "Giày cầu lông", "ÁO", "Áo T-Shirt", "Áo Polo", "VÁY - CHÂN VÁY", "PHỤ KIỆN"],
  ["SALE", "GIẢM 30%", "GIẢM 40%", "GIẢM 50%"],
];

function money(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value) + "₫";
}

function hrefForLabel(label: string) {
  const slug = label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (label === "GIỚI THIỆU") return "/pages/professionalsports";
  if (label === "HỆ THỐNG CỬA HÀNG") return "/pages/he-thong-cua-hang-2";
  if (label === "TIN TỨC") return "/blogs/news";
  if (label.includes("GIẢM")) return "/collections/khuyen-mai-sale";
  return `/collections/${slug || "the-thao"}`;
}

export default function LiNingClone() {
  const [path, setPath] = useState("/");
  const [popup, setPopup] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [cart, setCart] = useState<Product[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("7");

  useEffect(() => {
    setPath(window.location.pathname);
  }, []);

  const currentProduct =
    products.find((p) => path.includes(`/products/${p.slug}`)) || products[0];
  const isProduct = path.includes("/products/");
  const isCart = path.includes("/cart");
  const isAccount = path.includes("/account");
  const isNews = path.includes("/blogs");
  const isPage = path.includes("/pages/");
  const isCollection = path.includes("/collections/");

  const visibleProducts = useMemo(() => {
    let list = [...products];
    if (path.includes("pickleball")) list = list.filter((p) => p.sport === "Pickleball");
    if (path.includes("cau-long") || path.includes("giay-cau-long")) {
      list = list.filter((p) => p.sport === "Cầu lông" || p.category === "Giày cầu lông");
    }
    if (path.includes("ao-") || path.includes("summer")) list = list.filter((p) => p.category === "Áo");
    if (path.includes("khuyen-mai") || path.includes("sale")) list = list.filter((p) => p.oldPrice);
    if (path.includes("nu-") || path.includes("ao-polo-nu")) list = list.filter((p) => p.gender !== "Nam");
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "az") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "za") list.sort((a, b) => b.name.localeCompare(a.name));
    return list;
  }, [path, sort]);

  const searchResults = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  function addToCart(product: Product) {
    setCart((items) => [...items, product]);
    setCartOpen(true);
  }

  return (
    <main>
      <Header
        cartCount={cart.length}
        onCart={() => setCartOpen(true)}
        onSearch={() => setSearchOpen(true)}
      />
      {searchOpen && (
        <SearchPanel
          query={query}
          setQuery={setQuery}
          results={searchResults}
          onClose={() => setSearchOpen(false)}
        />
      )}
      {isProduct ? (
        <ProductPage
          product={currentProduct}
          qty={qty}
          size={size}
          setQty={setQty}
          setSize={setSize}
          onAdd={addToCart}
        />
      ) : isCart ? (
        <CartPage cart={cart} onAdd={() => addToCart(products[0])} />
      ) : isAccount ? (
        <AccountPage register={path.includes("register")} />
      ) : isNews ? (
        <NewsPage />
      ) : isPage ? (
        <InfoPage path={path} />
      ) : isCollection ? (
        <CollectionPage products={visibleProducts} sort={sort} setSort={setSort} onAdd={addToCart} />
      ) : (
        <HomePage onAdd={addToCart} />
      )}
      <Footer />
      <FloatingTools />
      <BestSellerWidget product={products[5]} onClose={() => null} />
      {popup && <SalePopup onClose={() => setPopup(false)} />}
      {cartOpen && <CartDrawer cart={cart} onClose={() => setCartOpen(false)} />}
    </main>
  );
}

function Header({
  cartCount,
  onCart,
  onSearch,
}: {
  cartCount: number;
  onCart: () => void;
  onSearch: () => void;
}) {
  return (
    <header className="site-header">
      <a className="brand" href="/">
        <img src={logo} alt="Li-Ning Sport Vietnam - Cửa hàng trực tuyến chính thức" />
      </a>
      <nav className="desktop-nav" aria-label="Sitemap chính">
        {mega.map((col) => (
          <div className="nav-item" key={col[0]}>
            <a href={hrefForLabel(col[0])}>{col[0]}</a>
            <span>⌄</span>
            <div className="mega-menu">
              <div className="mega-title">{col[0]}</div>
              {col.slice(1).map((label) => (
                <a key={label} href={hrefForLabel(label)}>
                  {label}
                </a>
              ))}
            </div>
          </div>
        ))}
        <a href="/collections/lookboook">MIX & MATCH</a>
        <a href="/pages/he-thong-cua-hang-2">HỆ THỐNG CỬA HÀNG</a>
        <a href="/blogs/news">TIN TỨC</a>
      </nav>
      <div className="header-actions">
        <a className="icon-link" href="/account/login" aria-label="Tài khoản">
          ♙
        </a>
        <button className="icon-link" onClick={onSearch} aria-label="Tìm kiếm">
          ⌕
        </button>
        <button className="cart-button" onClick={onCart} aria-label="Giỏ hàng">
          <span>▢</span>
          <b>{cartCount}</b>
        </button>
        <span className="flag">★</span>
        <select aria-label="Chọn Ngôn ngữ">
          <option>Chọn Ngôn ngữ</option>
          <option>Tiếng Việt</option>
          <option>English</option>
          <option>日本語</option>
        </select>
      </div>
    </header>
  );
}

function HomePage({ onAdd }: { onAdd: (product: Product) => void }) {
  return (
    <>
      <section className="hero">
        {heroSlides.map((slide, index) => (
          <img key={slide} src={slide} alt={`slideshow_${index + 1}`} />
        ))}
        <button className="hero-arrow left">‹</button>
        <button className="hero-arrow right">›</button>
        <div className="hero-dots">1 2 3 4 5</div>
      </section>
      <SectionTitle title="MÔN THỂ THAO" />
      <div className="sport-strip">
        {sportTiles.map((tile) => (
          <a className="sport-tile" key={tile.label} href={tile.href}>
            <img src={tile.img} alt={tile.label} />
            <strong>{tile.label}</strong>
          </a>
        ))}
      </div>
      <ProductSection title="SUMMER COLLECTION" tabs={["ÁO", "QUẦN", "BỘ QUẦN ÁO", "VÁY - CHÂN VÁY"]} products={products.filter((p) => p.sport === "Summer")} onAdd={onAdd} />
      <ProductSection title="PICKLEBALL COLLECTION" tabs={["VỢT", "GIÀY", "ÁO", "QUẦN", "PHỤ KIỆN"]} products={products.filter((p) => p.sport === "Pickleball")} onAdd={onAdd} />
      <ProductSection title="Badminton Collection" tabs={["GIÀY", "ÁO", "QUẦN", "VỢT"]} products={products.filter((p) => p.sport === "Cầu lông")} onAdd={onAdd} />
      <NewsPreview />
    </>
  );
}

function ProductSection({
  title,
  tabs,
  products: list,
  onAdd,
}: {
  title: string;
  tabs: string[];
  products: Product[];
  onAdd: (product: Product) => void;
}) {
  return (
    <section className="product-section">
      <SectionTitle title={title} />
      <div className="tab-row">
        {tabs.map((tab) => (
          <button key={tab}>{tab}</button>
        ))}
      </div>
      <div className="product-grid home-grid">
        {list.slice(0, 10).map((product) => (
          <ProductCard key={product.id} product={product} onAdd={onAdd} />
        ))}
      </div>
      <a className="view-all" href="/collections/the-thao">Xem tất cả</a>
    </section>
  );
}

function CollectionPage({
  products: list,
  sort,
  setSort,
  onAdd,
}: {
  products: Product[];
  sort: string;
  setSort: (sort: string) => void;
  onAdd: (product: Product) => void;
}) {
  return (
    <section className="collection-page">
      <div className="breadcrumb">Trang chủ / Danh mục / GIÀY CẦU LÔNG NAM</div>
      <div className="collection-layout">
        <aside className="filters">
          <h2>BỘ LỌC</h2>
          {["Kích Cỡ Giày Dép", "Kích cỡ quần áo", "Màu sắc", "Dòng Sản Phẩm", "Giới Tính"].map((item) => (
            <details key={item}>
              <summary>{item}</summary>
              <label><input type="checkbox" /> Nam</label>
              <label><input type="checkbox" /> Nữ</label>
              <label><input type="checkbox" /> Trắng</label>
            </details>
          ))}
        </aside>
        <div className="collection-main">
          <div className="category-carousel">
            {shoeCats.map(([label, href, img]) => (
              <a className={label === "Giày cầu lông" ? "active" : ""} href={href} key={label}>
                <img src={img} alt={label} />
                <span>{label}</span>
              </a>
            ))}
          </div>
          <div className="collection-toolbar">
            <a href="/collections/nam-1">Show All</a>
            <label>
              Sắp xếp theo:
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="featured">Sản phẩm nổi bật</option>
                <option value="price-asc">Giá: Tăng dần</option>
                <option value="price-desc">Giá: Giảm dần</option>
                <option value="az">Tên: A-Z</option>
                <option value="za">Tên: Z-A</option>
              </select>
            </label>
          </div>
          <div className="product-grid">
            {list.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={onAdd} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (product: Product) => void;
}) {
  return (
    <article className="product-card">
      <a href={`/products/${product.slug}`} className="product-image">
        {product.badge && <span className="sale-badge">{product.badge}</span>}
        {product.soldOut && <span className="soldout">SOLD OUT</span>}
        <img className="base-img" src={product.image} alt={product.name} />
        {product.hover && <img className="hover-img" src={product.hover} alt={product.name} />}
      </a>
      <a href={`/products/${product.slug}`} className="product-name">{product.name}</a>
      <div className="price">
        <strong>{money(product.price)}</strong>
        {product.oldPrice && <del>{money(product.oldPrice)}</del>}
      </div>
      <button disabled={product.soldOut} onClick={() => onAdd(product)}>
        {product.soldOut ? "Hết hàng" : "Thêm nhanh"}
      </button>
    </article>
  );
}

function ProductPage({
  product,
  qty,
  size,
  setQty,
  setSize,
  onAdd,
}: {
  product: Product;
  qty: number;
  size: string;
  setQty: (qty: number) => void;
  setSize: (size: string) => void;
  onAdd: (product: Product) => void;
}) {
  const gallery = [
    product.image,
    product.hover || "https://cdn.hstatic.net/products/1000312752/4992_660681c1cd914e779d99b7279d73cb41_05e7fb96b3c64ac1b3f5a0c36e4f8862_8faaac35dba54e9f9aff3e6e1f85bc06.jpg",
    "https://cdn.hstatic.net/products/1000312752/4994_576598a2423d4d50805a19effa9fc69d_c2fe9cfe19d548ce998385360413f194_7173deeb5f1a413dbc556ac578aa8965.jpg",
  ];
  return (
    <section className="product-detail">
      <div className="breadcrumb">Trang chủ / {product.category.toUpperCase()} / {product.name}</div>
      <div className="detail-grid">
        <aside className="thumbs">
          <button>⌃</button>
          {gallery.map((img) => <img key={img} src={img} alt="" />)}
          <button>⌄</button>
        </aside>
        <div className="main-photo">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-info">
          <h1>{product.name}</h1>
          <p>Loại: {product.category} <span>|</span> Mã SP: P-AYTV029-1V7</p>
          <div className="detail-price">{money(product.price)}</div>
          <Option label="Màu sắc"><button className="choice">Neon Lime/Black</button></Option>
          <Option label="Chất liệu"><button className="choice">Giả da (Synthetic Leather)+EVA</button></Option>
          <Option label="Kích thước">
            {["7", "7.5", "8", "8.5", "9", "9.5", "10.5"].map((item) => (
              <button className={size === item ? "size active" : "size"} onClick={() => setSize(item)} key={item}>{item}</button>
            ))}
          </Option>
          <div className="quantity-row">
            <span>Số lượng:</span>
            <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
            <strong>{qty}</strong>
            <button onClick={() => setQty(qty + 1)}>+</button>
            <button className="size-guide">Hướng dẫn chọn size</button>
          </div>
          <div className="buy-row">
            <button onClick={() => onAdd(product)}>Thêm vào giỏ</button>
            <button className="buy-now">Mua ngay</button>
          </div>
          <Voucher text="Nhập mã VC80K cho đơn hàng từ 750.000đ trở lên" />
          <Voucher text="Nhập mã VC130K cho đơn hàng từ 1.200.000đ trở lên" />
        </div>
      </div>
      <div className="detail-tabs">
        {["MÔ TẢ SẢN PHẨM", "HƯỚNG DẪN ĐO SIZE VÀ BẢO QUẢN", "CHÍNH SÁCH BÁN HÀNG"].map((title) => <button key={title}>{title}</button>)}
      </div>
      <article className="description">
        <p>Giày tập cầu lông Li-Ning sử dụng cách phối màu đơn giản, phần trên bằng chất liệu mềm mại và thiết kế chống va chạm ở ngón chân giúp bảo vệ từng bước đi.</p>
        <p>Phần trên: da tổng hợp. Đế: cao su + EVA. Đường khâu gọn gàng làm nổi bật cảm giác chất lượng.</p>
      </article>
      <ProductSection title="CÓ THỂ BẠN CŨNG THÍCH" tabs={["GỢI Ý", "BÁN CHẠY"]} products={products.slice(3, 11)} onAdd={onAdd} />
    </section>
  );
}

function Option({ label, children }: { label: string; children: ReactNode }) {
  return <div className="option-row"><span>{label}</span><div>{children}</div></div>;
}

function Voucher({ text }: { text: string }) {
  return <div className="voucher"><b>VOUCHER<br />ONLINE ONLY</b><p><strong>ONLINE ONLY ( 05.08-03.09.2026)</strong><br />{text} <a href="/pages/huong-dan-mua-hang">Xem chi tiết</a></p></div>;
}

function CartPage({ cart, onAdd }: { cart: Product[]; onAdd: () => void }) {
  const total = cart.reduce((sum, p) => sum + p.price, 0);
  return (
    <section className="simple-page cart-page">
      <h1>Giỏ hàng</h1>
      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Giỏ hàng của bạn đang trống</p>
          <button onClick={onAdd}>Thêm sản phẩm mẫu</button>
        </div>
      ) : (
        <>
          {cart.map((item, index) => <CartLine key={`${item.id}-${index}`} item={item} />)}
          <div className="cart-total"><span>Tổng tiền</span><strong>{money(total)}</strong></div>
          <button className="checkout">Thanh toán</button>
        </>
      )}
    </section>
  );
}

function CartLine({ item }: { item: Product }) {
  return <div className="cart-line"><img src={item.image} alt="" /><div><b>{item.name}</b><span>Size: 7 / Số lượng: 1</span></div><strong>{money(item.price)}</strong></div>;
}

function AccountPage({ register }: { register: boolean }) {
  return (
    <section className="simple-page account-page">
      <h1>{register ? "Đăng ký" : "Đăng nhập"}</h1>
      <form>
        {register && <input placeholder="Họ và tên" />}
        <input placeholder="Email" />
        <input placeholder="Mật khẩu" type="password" />
        <button type="button">{register ? "Tạo tài khoản" : "Đăng nhập"}</button>
      </form>
      <a href={register ? "/account/login" : "/account/register"}>{register ? "Đã có tài khoản?" : "Tạo tài khoản mới"}</a>
    </section>
  );
}

function NewsPage() {
  return (
    <section className="simple-page">
      <h1>TIN TỨC SẢN PHẨM</h1>
      <div className="news-grid page-news">
        {news.map((item) => <NewsCard item={item} key={item.title} />)}
      </div>
    </section>
  );
}

function InfoPage({ path }: { path: string }) {
  const store = path.includes("he-thong-cua-hang");
  return (
    <section className="simple-page policy">
      <h1>{store ? "HỆ THỐNG CỬA HÀNG" : path.includes("professionalsports") ? "GIỚI THIỆU" : "CHÍNH SÁCH BÁN HÀNG"}</h1>
      {store ? (
        <div className="store-list">
          {["Hà Nội - 31 Lê Văn Lương", "TP. Hồ Chí Minh - Crescent Mall", "Đà Nẵng - Vincom Ngô Quyền", "Cần Thơ - Sense City"].map((storeName) => <p key={storeName}><b>{storeName}</b><span>Hotline: 1900633083 - Mở cửa 09:00 - 22:00</span></p>)}
        </div>
      ) : (
        <p>Li-Ning Distributor in Viet Nam cung cấp sản phẩm thể thao chính hãng, chính sách đổi trả rõ ràng, vận chuyển toàn quốc và hỗ trợ khách hàng qua hotline 1900633083.</p>
      )}
    </section>
  );
}

function NewsPreview() {
  return (
    <section className="news-preview">
      <SectionTitle title="TIN TỨC SẢN PHẨM" />
      <div className="news-grid">
        {news.map((item) => <NewsCard item={item} key={item.title} />)}
      </div>
      <a className="view-all" href="/blogs/news">XEM TẤT CẢ</a>
    </section>
  );
}

function NewsCard({ item }: { item: (typeof news)[number] }) {
  return <article className="news-card"><img src={item.img} alt="" /><h3>{item.title}</h3><p>{item.desc}</p></article>;
}

function SectionTitle({ title }: { title: string }) {
  return <h2 className="section-title">{title}</h2>;
}

function Footer() {
  return (
    <footer className="footer">
      <div>
        <h3>LI-NING DISTRIBUTOR IN VIET NAM</h3>
        <a href="/pages/professionalsports">GIỚI THIỆU</a>
        <a href="/pages/he-thong-cua-hang-2">HỆ THỐNG CỬA HÀNG</a>
        <a href="/pages/thong-tin-lien-he">THÔNG TIN LIÊN HỆ</a>
      </div>
      <div>
        <h3>CHÍNH SÁCH BÁN HÀNG</h3>
        <a href="/pages/bao-mat">BẢO MẬT</a>
        <a href="/pages/thanh-toan">THANH TOÁN</a>
        <a href="/pages/van-chuyen">VẬN CHUYỂN</a>
        <a href="/pages/doi-tra-hang-mua-online">ĐỔI TRẢ HÀNG MUA ONLINE</a>
      </div>
      <div>
        <h3>HỖ TRỢ KHÁCH HÀNG</h3>
        <a href="/pages/dieu-khoan-dich-vu">ĐIỀU KHOẢN DỊCH VỤ</a>
        <a href="/pages/huong-dan-mua-hang">HƯỚNG DẪN MUA HÀNG</a>
        <a href="/pages/huong-dan-do-size-va-bao-quan">HƯỚNG DẪN ĐO SIZE VÀ BẢO QUẢN</a>
      </div>
      <div>
        <h3>NEWSLETTER</h3>
        <p>Đăng ký nhận bản tin để cập nhật những tin tức mới về Li-Ning Distributor in Vietnam</p>
        <input placeholder="Email của bạn" />
        <p><b>CÔNG TY TNHH QUỐC TẾ HẢI LONG</b><br />Hotline : 1900633083<br />info.liningvn@gmail.com</p>
      </div>
      <small>© Bản quyền thuộc về Li-Ning Distributor in Vietnam | Powered by Haravan</small>
    </footer>
  );
}

function SearchPanel({ query, setQuery, results, onClose }: { query: string; setQuery: (q: string) => void; results: Product[]; onClose: () => void }) {
  return (
    <div className="search-panel">
      <button onClick={onClose}>×</button>
      <input autoFocus placeholder="Tìm kiếm sản phẩm..." value={query} onChange={(event) => setQuery(event.target.value)} />
      <div>
        {(query ? results : products.slice(0, 4)).map((p) => <a href={`/products/${p.slug}`} key={p.id}>{p.name}<span>{money(p.price)}</span></a>)}
      </div>
    </div>
  );
}

function CartDrawer({ cart, onClose }: { cart: Product[]; onClose: () => void }) {
  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside className="cart-drawer" onClick={(event) => event.stopPropagation()}>
        <button onClick={onClose}>×</button>
        <h2>Sản phẩm đã được thêm vào giỏ hàng</h2>
        {cart.length ? cart.map((item, index) => <CartLine item={item} key={`${item.id}-drawer-${index}`} />) : <p>Giỏ hàng đang trống.</p>}
        <a href="/cart">Xem giỏ hàng</a>
      </aside>
    </div>
  );
}

function SalePopup({ onClose }: { onClose: () => void }) {
  return (
    <div className="sale-popup">
      <button onClick={onClose}>×</button>
      <div className="sale-art">
        <img src={logo} alt="" />
        <span>MỪNG QUỐC KHÁNH</span>
        <strong>20-50%</strong>
        <p>TOÀN BỘ SẢN PHẨM</p>
        <small>ÁP DỤNG ĐẾN 02/09/2026</small>
      </div>
    </div>
  );
}

function FloatingTools() {
  return <div className="floating-tools"><span>Zalo</span><span>💬</span><span>☎</span><span>♪</span><span>▶</span><span>◎</span></div>;
}

function BestSellerWidget({ product }: { product: Product; onClose: () => void }) {
  return <div className="best-widget"><button>×</button><img src={product.image} alt="" /><b>🔔BEST SELLER</b></div>;
}
