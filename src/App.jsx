import { useState, useEffect, useRef } from "react";
import { ShoppingBag, Search, Plus, Minus, Trash2, Menu } from "lucide-react";
import clsx from "classnames";
import CartPopup from "./components/CartPopup";
import ThemeToggle from "./components/ThemeToggle";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";


const allProducts = [
  { id: 1, name: "Ralph Lauren Polo", brand: "Ralph Lauren", category: "tshirts", price: 89, size: "M", color: "Musta", image: "https://via.placeholder.com/600x600?text=Ralph+Lauren" },
  { id: 2, name: "Lacoste T-Shirt", brand: "Lacoste", category: "tshirts", price: 79, image: "https://via.placeholder.com/600x600?text=Lacoste" },
  { id: 3, name: "Tommy Denim Jacket", brand: "Tommy Hilfiger", category: "jackets", price: 129, image: "https://via.placeholder.com/600x600?text=Tommy" },
  { id: 4, name: "Nike Air Max", brand: "Nike", category: "sneakers", price: 110, image: "https://via.placeholder.com/600x600?text=Nike+Air+Max" },
  { id: 5, name: "Adidas Hoodie", brand: "Adidas", category: "hoodies", price: 95, image: "https://via.placeholder.com/600x600?text=Adidas+Hoodie" },
  { id: 6, name: "New Balance 550", brand: "New Balance", category: "sneakers", price: 105, image: "https://via.placeholder.com/600x600?text=NB+550" },
  { id: 7, name: "Calvin Klein Sweatshirt", brand: "Calvin Klein", category: "sweaters", price: 85, image: "https://via.placeholder.com/600x600?text=Calvin+Klein" },
  { id: 8, name: "Armani Coat", brand: "Armani", category: "jackets", price: 199, image: "https://via.placeholder.com/600x600?text=Armani+Coat" },
  { id: 9, name: "Puma Tee", brand: "Puma", category: "tshirts", price: 45, image: "https://via.placeholder.com/600x600?text=Puma+Tee" },
  { id: 10, name: "Levi’s Denim Jacket", brand: "Levi’s", category: "jackets", price: 119, image: "https://via.placeholder.com/600x600?text=Levi's+Jacket" },
  { id: 11, name: "Champion Hoodie", brand: "Champion", category: "hoodies", price: 78, image: "https://via.placeholder.com/600x600?text=Champion" },
  { id: 12, name: "Balenciaga Sneakers", brand: "Balenciaga", category: "sneakers", price: 350, image: "https://via.placeholder.com/600x600?text=Balenciaga" }
];
const availableBrands = Array.from(new Set(allProducts.map(p => p.brand)));

const categories = {
  all: "Kaikki",
  tshirts: "T-paidat",
  hoodies: "Hupparit",
  jackets: "Takki",
  sneakers: "Kengät"
};

export default function App() {
  const availableSizes = ["XS", "S", "M", "L", "XL"];
  const availableColors = ["Musta", "Valkoinen", "Punainen", "Sininen", "Beige"];
  const [openSections, setOpenSections] = useState({
  category: true,
  brand: true,
  size: false,
  color: false,
});

const toggleSection = (key) => {
  setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
};
  const [search, setSearch] = useState("");
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [cart, setCart] = useState([]);
  const [checkoutStep, setCheckoutStep] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", address: "", phone: "" });
  const [page, setPage] = useState(1);
  const perPage = 6;

  let filtered = allProducts.filter((p) =>
  (category === "all" || p.category === category) &&
  (selectedBrands.length === 0 || selectedBrands.includes(p.brand)) &&
  (selectedSizes.length === 0 || selectedSizes.includes(p.size)) &&
  (selectedColors.length === 0 || selectedColors.includes(p.color)) &&
  (p.name.toLowerCase().includes(search.toLowerCase()) ||
   p.brand.toLowerCase().includes(search.toLowerCase()))
);


  if (sort === "brand") filtered = filtered.sort((a, b) => a.brand.localeCompare(b.brand));
  else if (sort === "price") filtered = filtered.sort((a, b) => a.price - b.price);

  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const addToCart = (product) => {
  const exists = cart.find(i => i.id === product.id);
  if (exists) {
    setCart(cart.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
  } else {
    setCart([...cart, { ...product, qty: 1 }]);
  }

  // Показываем popup на 2 секунды
  setPopupVisible(true);
  setTimeout(() => setPopupVisible(false), 2000);
};


  const total = cart.reduce((s, i) => s + i.qty * i.price, 0);

  const changeQty = (id, delta) => {
    setCart(cart.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };

  const removeItem = (id) => setCart(cart.filter(i => i.id !== id));

  const goToStep = (n) => setCheckoutStep(n);

  return (
  <Router>
    <Routes>
      <Route
        path="/"
        element={
  <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors">
    <CartPopup visible={popupVisible} />

    <header className="flex items-center justify-between px-4 py-4 shadow-md">
      <button
        onClick={() => { setCheckoutStep(null); setPage(1); }}
        className="text-2xl font-bold tracking-tight"
      >
        Designer Outlet
      </button>

      <div className="flex items-center gap-3">
        <div className="relative">
  <input
    className="border p-2 rounded w-40 sm:w-64"
    placeholder="Etsi..."
    value={search}
    onChange={(e) => {
      setSearch(e.target.value);
      setSuggestionsVisible(true);
    }}
    onFocus={() => setSuggestionsVisible(true)}
    onBlur={() => setTimeout(() => setSuggestionsVisible(false), 150)}
  />
  {suggestionsVisible && search && (
    <ul className="absolute left-0 top-full mt-1 bg-white dark:bg-gray-800 border rounded shadow z-50 w-full max-h-60 overflow-y-auto text-sm">
      {allProducts
        .filter(p =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.brand.toLowerCase().includes(search.toLowerCase())
        )
        .slice(0, 6)
        .map(p => (
          <li
            key={p.id}
            className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            onClick={() => {
              setSearch(p.name);
              setSuggestionsVisible(false);
            }}
          >
            <span className="font-medium">{p.name}</span> — <span className="text-gray-500">{p.brand}</span>
          </li>
        ))}
      {allProducts.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase())
      ).length === 0 && (
        <li className="px-3 py-2 text-gray-500 italic">Ei tuloksia</li>
      )}
    </ul>
  )}
</div>
        <ThemeToggle />
        <button onClick={() => goToStep(0)} className="relative">
          <ShoppingBag className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {cart.reduce((a, b) => a + b.qty, 0)}
          </span>
        </button>
        <button onClick={() => setMenuOpen(!menuOpen)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </header>

    <div className="flex">
      <aside
  ref={menuRef}
  className={clsx(
    "fixed top-0 right-0 h-full w-72 bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out",
    menuOpen ? "translate-x-0" : "translate-x-full"
  )}
>
  <div className="p-4 border-b font-bold flex justify-between items-center">
    Suodata
    <button onClick={() => setMenuOpen(false)} className="text-sm text-gray-500">Sulje</button>
  </div>

  <div className="p-4 space-y-6 overflow-y-auto h-[calc(100%-4rem)]">

    {/* Tuoteryhmä */}
    <div>
      <button
        className="w-full flex justify-between items-center font-medium mb-2"
        onClick={() => toggleSection("category")}
      >
        <span>Tuoteryhmä</span>
        <span>{openSections.category ? "−" : "+"}</span>
      </button>
      {openSections.category && (
        <ul className="space-y-2">
          {Object.entries(categories).map(([key, name]) => (
            <li key={key}>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="category"
                  value={key}
                  checked={category === key}
                  onChange={() => {
                    setCategory(key);
                    setPage(1);
                  }}
                />
                {name}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>

    {/* Tuotemerkki */}
    <div>
      <button
        className="w-full flex justify-between items-center font-medium mb-2"
        onClick={() => toggleSection("brand")}
      >
        <span>Tuotemerkki</span>
        <span>{openSections.brand ? "−" : "+"}</span>
      </button>
      {openSections.brand && (
        <ul className="space-y-2 max-h-40 overflow-auto">
          {availableBrands.map((brand) => (
            <li key={brand}>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedBrands([...selectedBrands, brand]);
                    } else {
                      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
                    }
                    setPage(1);
                  }}
                />
                {brand}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>

    <div>
  <button
    className="w-full flex justify-between items-center font-medium mb-2"
    onClick={() => toggleSection("size")}
  >
    <span>Koko</span>
    <span>{openSections.size ? "−" : "+"}</span>
  </button>
  {openSections.size && (
    <ul className="space-y-2">
      {availableSizes.map(size => (
        <li key={size}>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedSizes.includes(size)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedSizes([...selectedSizes, size]);
                } else {
                  setSelectedSizes(selectedSizes.filter((s) => s !== size));
                }
                setPage(1);
              }}
            />
            {size}
          </label>
        </li>
      ))}
    </ul>
  )}
</div>


    <div>
  <button
    onClick={() => toggleSection("color")}
    className="w-full flex justify-between items-center font-medium mb-2"
  >
    <span>Väri</span>
    <span>{openSections.color ? "−" : "+"}</span>
  </button>

  {openSections.color && (
    <ul className="space-y-2">
      {availableColors.map(color => (
        <li key={color}>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedColors.includes(color)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedColors([...selectedColors, color]);
                } else {
                  setSelectedColors(selectedColors.filter((c) => c !== color));
                }
                setPage(1);
              }}
            />
            {color}
          </label>
        </li>
      ))}
    </ul>
  )}
</div>

  </div>
</aside>


      <main className="flex-1 p-6">
        {checkoutStep === null ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {paged.map((product) => (
                <div
                  key={product.id}
                  className="rounded shadow hover:shadow-lg transition overflow-hidden"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="font-bold">{product.name}</h2>
                    <p className="text-sm text-gray-500">{product.brand}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="font-semibold">{product.price}€</span>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                      >
                        Lisää
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={clsx(
                    "px-3 py-1 rounded",
                    i + 1 === page ? "bg-black text-white" : "hover:bg-gray-200"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="max-w-2xl mx-auto bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow mt-6">
            {checkoutStep === 0 && (
              <>
                <h2 className="text-2xl font-bold mb-4">Tarkista ostoskori (1/3)</h2>
                {cart.length === 0 ? (
                  <p>Ostoskori on tyhjä.</p>
                ) : (
                  <>
                    <ul className="mb-4 divide-y">
                      {cart.map((item) => (
                        <li key={item.id} className="flex justify-between items-center py-2">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <div className="flex items-center gap-2">
                              <button onClick={() => changeQty(item.id, -1)} className="border p-1 rounded">
                                <Minus className="w-4 h-4" />
                              </button>
                              <span>{item.qty}</span>
                              <button onClick={() => changeQty(item.id, 1)} className="border p-1 rounded">
                                <Plus className="w-4 h-4" />
                              </button>
                              <button onClick={() => removeItem(item.id)} className="text-red-500">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <span className="font-semibold">{item.qty * item.price}€</span>
                        </li>
                      ))}
                    </ul>
                    <p className="font-semibold text-right mb-4">Yhteensä: {total}€</p>
                    <button
                      onClick={() => goToStep(1)}
                      className="bg-black text-white w-full py-2 rounded hover:bg-gray-800 transition"
                    >
                      Jatka toimitukseen
                    </button>
                  </>
                )}
              </>
            )}
            {checkoutStep === 1 && (
              <>
                <h2 className="text-2xl font-bold mb-4">Toimitustiedot (2/3)</h2>
                <div className="space-y-3 mb-4">
                  <input
                    className="w-full p-2 border rounded"
                    placeholder="Nimi"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <input
                    className="w-full p-2 border rounded"
                    placeholder="Sähköposti"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  <input
                    className="w-full p-2 border rounded"
                    placeholder="Osoite"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                  <input
                    className="w-full p-2 border rounded"
                    placeholder="Puhelin (valinnainen)"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="flex justify-between">
                  <button onClick={() => goToStep(0)} className="border px-4 py-2 rounded">
                    Takaisin
                  </button>
                  <button
                    onClick={() => goToStep(2)}
                    className="bg-black text-white px-4 py-2 rounded"
                    disabled={!form.name || !form.email || !form.address}
                  >
                    Siirry maksamaan
                  </button>
                </div>
              </>
            )}
            {checkoutStep === 2 && (
              <>
                <h2 className="text-2xl font-bold mb-4">Maksu (3/3)</h2>
                <ul className="mb-4 divide-y">
                  {cart.map((item) => (
                    <li key={item.id} className="flex justify-between py-2">
                      {item.name} x{item.qty}
                      <span>{item.qty * item.price}€</span>
                    </li>
                  ))}
                </ul>
                <p className="font-semibold text-right mb-4">Yhteensä: {total}€</p>
                <div className="flex justify-between">
                  <button onClick={() => goToStep(1)} className="border px-4 py-2 rounded">
                    Takaisin
                  </button>
                  <button
                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                    onClick={() =>
                      window.location.href = "https://buy.stripe.com/test_dRm5kw99b4YYfDBcp39oc00"
                    }
                  >
                    Maksa Stripe-maksulla
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>

    <footer className="text-center text-xs text-gray-400 p-6">
      © {new Date().getFullYear()} Designer Outlet
    </footer>
  </div>
}
/>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);}