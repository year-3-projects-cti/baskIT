export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  gallery: string[];
  description: string;
  longDescription: string;
  components: string[];
  stock: number;
  tags: string[];
  occasion: string;
  isNew?: boolean;
  isBestseller?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  count: number;
}

export const categories: Category[] = [
  { id: "1", name: "Crăciun", slug: "craciun", image: "", count: 12 },
  { id: "2", name: "Paște", slug: "paste", image: "", count: 8 },
  { id: "3", name: "Valentine's Day", slug: "valentines", image: "", count: 10 },
  { id: "4", name: "Baby & Părinți Noi", slug: "baby", image: "", count: 6 },
  { id: "5", name: "Mulțumesc", slug: "multumesc", image: "", count: 5 },
  { id: "6", name: "Corporate", slug: "corporate", image: "", count: 7 },
  { id: "7", name: "Cafea & Ceai", slug: "cafea-ceai", image: "", count: 9 },
  { id: "8", name: "Gourmet", slug: "gourmet", image: "", count: 11 },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Crăciun Clasic",
    slug: "craciun-clasic",
    category: "Crăciun",
    price: 249.99,
    image: "",
    gallery: [],
    description: "Coș cadou perfect pentru magia sărbătorilor de iarnă",
    longDescription: "Un coș festiv plin cu delicatesele tradiționale ale sărbătorilor: ciocolată premium, nuci glazurate, vin spumos și decorațiuni elegante. Perfect pentru a împărți bucuria Crăciunului cu cei dragi.",
    components: [
      "Ciocolată artizanală belgiană 200g",
      "Vin spumos Prosecco 750ml",
      "Nuci caramelizate mix 150g",
      "Biscuiți cu scorțișoară",
      "Lumânare parfumată Crăciun",
      "Decorațiuni festive handmade"
    ],
    stock: 15,
    tags: ["festiv", "tradițional", "premium"],
    occasion: "Crăciun",
    isBestseller: true,
  },
  {
    id: "2",
    name: "Love & Roses",
    slug: "love-roses",
    category: "Valentine's Day",
    price: 299.99,
    originalPrice: 349.99,
    image: "",
    gallery: [],
    description: "Romantism și eleganță într-un singur cadou",
    longDescription: "Exprimă-ți dragostea cu acest coș luxos care combină trandafiri proaspeți cu delicatese gourmet și surprize romantice. Include vin roșu premium și ciocolată artizanală.",
    components: [
      "Buchet 7 trandafiri roșii premium",
      "Vin roșu sec Merlot 750ml",
      "Praline de ciocolată handmade 12 buc",
      "Lumânări parfumate aromă vanilie",
      "Cartonaș personalizabil",
      "Cutie cadou premium cu panglică"
    ],
    stock: 8,
    tags: ["romantic", "luxos", "exclusiv"],
    occasion: "Valentine's Day",
    isNew: true,
  },
  {
    id: "3",
    name: "Baby Welcome",
    slug: "baby-welcome",
    category: "Baby & Părinți Noi",
    price: 189.99,
    image: "",
    gallery: [],
    description: "Bucurie și răsfăț pentru cei mai mici",
    longDescription: "Întâmpină noul membru al familiei cu un coș plin de produse premium pentru bebeluși și delicatesuri pentru părinții obosiți. Include jucării de pluș hipoalergenice și produse de îngrijire organice.",
    components: [
      "Jucărie de pluș organică",
      "Set prosop + păturică bebe",
      "Produse de îngrijire organice",
      "Ciocolată premium pentru părinți",
      "Ceai relaxant natural",
      "Felicitare personalizabilă"
    ],
    stock: 12,
    tags: ["bebeluși", "organic", "delicat"],
    occasion: "Naștere",
    isBestseller: true,
  },
  {
    id: "4",
    name: "Corporate Care Mini",
    slug: "corporate-care-mini",
    category: "Corporate",
    price: 149.99,
    image: "",
    gallery: [],
    description: "Apreciază echipa cu un cadou elegant",
    longDescription: "Coș corporate elegant, perfect pentru a arăta apreciere colegilor și partenerilor de business. Include snacks-uri premium, cafea de specialitate și accesorii de birou stilate.",
    components: [
      "Cafea boabe specialitate 250g",
      "Mix snacks-uri premium",
      "Notebook elegant cu pix",
      "Ceai verde organic",
      "Biscuiți artizanali",
      "Logo personalizabil al companiei"
    ],
    stock: 20,
    tags: ["business", "elegant", "profesional"],
    occasion: "Corporate",
  },
  {
    id: "5",
    name: "Primăvara Dulce",
    slug: "primavara-dulce",
    category: "Paște",
    price: 169.99,
    image: "",
    gallery: [],
    description: "Sărbătorește Paștele cu tradiție și gust",
    longDescription: "Coș festiv de Paște cu delicatese tradiționale și decorațiuni primare. Perfect pentru a împărți bucuria primăverii și a sărbătorilor pascale cu familia.",
    components: [
      "Cozonac artizanal cu nucă 800g",
      "Ouă de ciocolată artizanale",
      "Vin dulce de desert 500ml",
      "Brânză dulce în hârtie de Paște",
      "Decorațiuni pascale handmade",
      "Lumânare parfumată florală"
    ],
    stock: 10,
    tags: ["tradițional", "festiv", "primăvară"],
    occasion: "Paște",
    isNew: true,
  },
  {
    id: "6",
    name: "Dimineață cu Ceai",
    slug: "dimineata-cu-ceai",
    category: "Cafea & Ceai",
    price: 129.99,
    image: "",
    gallery: [],
    description: "Relaxare și arome fine pentru diminețile perfecte",
    longDescription: "Coș dedicat iubitorilor de ceai, cu o selecție de ceaiuri premium din întreaga lume, biscuiți artizanali și accesorii elegante pentru ceremonia ceaiului.",
    components: [
      "Set 5 ceaiuri premium loose leaf",
      "Ceainic ceramic japonez",
      "Biscuiți englezești shortbread",
      "Miere organică 250g",
      "Infuzor de ceai inox",
      "Cană ceramică artizanală"
    ],
    stock: 18,
    tags: ["relaxare", "wellness", "rafinat"],
    occasion: "Orice moment",
  },
  {
    id: "7",
    name: "Gourmet Delight",
    slug: "gourmet-delight",
    category: "Gourmet",
    price: 349.99,
    image: "",
    gallery: [],
    description: "Experiență culinară de excepție",
    longDescription: "Pentru cunoscătorii rafinați, acest coș conține o selecție exclusivă de produse gourmet internaționale: trufe, foie gras, vinuri premium și delicatese rare.",
    components: [
      "Ulei de trufe albă 100ml",
      "Foie gras import Franța 180g",
      "Vin roșu Grand Cru 750ml",
      "Parmezan Reggiano DOP 200g",
      "Prosciutto di Parma 150g",
      "Ciocolată single origin Ecuador"
    ],
    stock: 5,
    tags: ["luxos", "exclusiv", "gourmet"],
    occasion: "Ocazii speciale",
    isBestseller: true,
  },
  {
    id: "8",
    name: "Mulțumesc cu Drag",
    slug: "multumesc-cu-drag",
    category: "Mulțumesc",
    price: 119.99,
    image: "",
    gallery: [],
    description: "Arată-ți recunoștința cu stil",
    longDescription: "Un cadou plin de gust și atenție pentru a mulțumi celor care fac diferența în viața ta. Include o selecție de dulciuri artizanale și o carte personalizabilă.",
    components: [
      "Praline ciocolată asortate 150g",
      "Carte cu mesaj personalizabil",
      "Ceai organic premium 50g",
      "Biscuiți cu migdale",
      "Lumânare parfumată lavandă",
      "Cutie cadou elegantă"
    ],
    stock: 25,
    tags: ["apreciere", "atenție", "elegant"],
    occasion: "Mulțumire",
  },
];

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: "created" | "paid" | "fulfilled" | "delivered" | "cancelled";
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  shipping: number;
  vat: number;
  total: number;
  giftNote?: string;
  trackingNumber?: string;
}

export const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "BK-2025-001",
    date: "2025-01-15",
    status: "delivered",
    customer: {
      name: "Maria Popescu",
      email: "maria.popescu@email.ro",
      phone: "+40721123456",
    },
    items: [
      {
        productId: "1",
        productName: "Crăciun Clasic",
        quantity: 2,
        price: 249.99,
      },
    ],
    subtotal: 499.98,
    shipping: 25.00,
    vat: 99.95,
    total: 624.93,
    giftNote: "La mulți ani cu sănătate!",
    trackingNumber: "FAN123456789",
  },
  {
    id: "2",
    orderNumber: "BK-2025-002",
    date: "2025-01-16",
    status: "paid",
    customer: {
      name: "Ion Ionescu",
      email: "ion.ionescu@email.ro",
      phone: "+40732987654",
    },
    items: [
      {
        productId: "2",
        productName: "Love & Roses",
        quantity: 1,
        price: 299.99,
      },
    ],
    subtotal: 299.99,
    shipping: 20.00,
    vat: 63.99,
    total: 383.98,
  },
];
