import { useState, useEffect, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const categories = ["All", "Furniture", "Books", "Clothing", "Electronics", "Kitchen", "Toys", "Garden", "Sports"];
const categoryEmojis = { Furniture: "🪑", Books: "📚", Clothing: "👕", Electronics: "💻", Kitchen: "🍳", Toys: "🧸", Garden: "🌿", Sports: "🚲", All: "✨" };

const ITEMS_BASE = [
  { id: 1, title: "Oak Bookshelf", category: "Furniture", condition: "Good", distanceNum: 0.3, distance: "0.3 mi", neighborhood: "Koregaon Park", postedAgo: "2h ago", postedMs: Date.now() - 7200000, description: "Solid oak, 5 shelves. Some scuffs but very sturdy. Perfect for a home study or living room. Dimensions: 180cm H × 80cm W × 30cm D. Can be disassembled for transport.", giverName: "Meera S.", giverInitial: "M", giverId: "u2", giverPhone: "+91 98765 43210", emoji: "📚", color: "#c8a97a", tags: ["heavy", "self-pickup"], requests: 3, views: 47, reposted: false },
  { id: 2, title: "Children's Bicycle", category: "Sports", condition: "Great", distanceNum: 0.7, distance: "0.7 mi", neighborhood: "Aundh", postedAgo: "5h ago", postedMs: Date.now() - 18000000, description: "14\" wheels, suitable for ages 4–6. Comes with matching helmet (size S). My daughter outgrew it last summer — it still has a lot of life left. Chain recently oiled.", giverName: "Rajesh K.", giverInitial: "R", giverId: "u3", giverPhone: "+91 87654 32109", emoji: "🚲", color: "#7aaa7a", tags: ["helmet included", "kids"], requests: 7, views: 112, reposted: false },
  { id: 3, title: "Collection of Classic Novels", category: "Books", condition: "Good", distanceNum: 1.1, distance: "1.1 mi", neighborhood: "Baner", postedAgo: "1d ago", postedMs: Date.now() - 86400000, description: "12 books including works by Thomas Hardy, Charles Dickens, and Jane Austen. All in readable condition.", giverName: "Priya N.", giverInitial: "P", giverId: "u4", giverPhone: "+91 76543 21098", emoji: "📖", color: "#b07ab0", tags: ["12 books", "classics"], requests: 2, views: 34, reposted: false },
  { id: 4, title: "Cast Iron Skillet", category: "Kitchen", condition: "Like New", distanceNum: 0.5, distance: "0.5 mi", neighborhood: "Viman Nagar", postedAgo: "3h ago", postedMs: Date.now() - 10800000, description: "Lodge 10-inch cast iron skillet. Barely used — only cooked in it 3-4 times. Already well-seasoned. No rust, no cracks.", giverName: "Anil T.", giverInitial: "A", giverId: "u5", giverPhone: "+91 65432 10987", emoji: "🍳", color: "#c87a7a", tags: ["heavy", "Lodge brand"], requests: 5, views: 88, reposted: false },
  { id: 5, title: "Lego Technic Set", category: "Toys", condition: "Complete", distanceNum: 1.4, distance: "1.4 mi", neighborhood: "Wakad", postedAgo: "2d ago", postedMs: Date.now() - 172800000, description: "Lego Technic 42093 Chevrolet Corvette. All 1145 pieces verified and present. Instruction booklet included.", giverName: "Sneha B.", giverInitial: "S", giverId: "u6", giverPhone: "+91 54321 09876", emoji: "🧱", color: "#7aa0c8", tags: ["all pieces", "ages 10+"], requests: 9, views: 156, reposted: false },
  { id: 6, title: "Monstera Plant", category: "Garden", condition: "Healthy", distanceNum: 0.2, distance: "0.2 mi", neighborhood: "Kalyani Nagar", postedAgo: "6h ago", postedMs: Date.now() - 21600000, description: "Thriving Monstera Deliciosa, approx 3 ft tall in a 10\" ceramic pot. Needs bright indirect light, water once a week.", giverName: "Divya M.", giverInitial: "D", giverId: "u7", giverPhone: "+91 43210 98765", emoji: "🌿", color: "#5aaa6a", tags: ["pot included", "indoor"], requests: 11, views: 203, reposted: false },
];

const INIT_MY_REQUESTS = [
  { id: 101, itemTitle: "Children's Bicycle", itemEmoji: "🚲", giverId: "u3", giverName: "Rajesh K.", giverPhone: "+91 87654 32109", status: "pending", requestedAgo: "3h ago", myNote: "I have a 5-year-old daughter who just learned to balance. This would be perfect for her first real bike!", pickupAddress: "", pickupDate: "", pickupTime: "", confirmed: false },
  { id: 102, itemTitle: "Lego Technic Set", itemEmoji: "🧱", giverId: "u6", giverName: "Sneha B.", giverPhone: "+91 54321 09876", status: "approved", requestedAgo: "1d ago", myNote: "My nephew is visiting for the holidays and he's obsessed with Lego. This would make his trip unforgettable.", pickupAddress: "Wakad, near D-Mart entrance, Opp. Central Park", pickupDate: "", pickupTime: "", confirmed: false },
  { id: 103, title: "Cast Iron Skillet", itemEmoji: "🍳", giverId: "u5", giverName: "Anil T.", giverPhone: "+91 65432 10987", status: "rejected", requestedAgo: "3d ago", myNote: "I just moved into my first apartment and I'm building my kitchen from scratch on a tight budget.", pickupAddress: "", pickupDate: "", pickupTime: "", confirmed: false },
];

const INIT_MY_LISTINGS = [
  {
    id: 201, title: "Wooden Study Chair", emoji: "🪑", category: "Furniture", description: "Solid teak chair with cushion. Great condition, minor scratches on legs.", neighborhood: "Koregaon Park", postedAgo: "2w ago", status: "active", rating: 4.8, ratingCount: 3, condition: "Good", reposted: false,
    requestors: [
      { id: "r1", name: "Arjun M.", initial: "A", note: "I'm a college student and really need a proper chair for studying. Currently using a plastic chair that hurts my back.", requestedAgo: "3d ago", approved: false },
      { id: "r2", name: "Kavya S.", initial: "K", note: "My daughter just started her 10th board exams prep and needs a dedicated study spot.", requestedAgo: "5d ago", approved: false },
      { id: "r3", name: "Rohan P.", initial: "R", note: "Starting work from home next month, this would complete my home office setup.", requestedAgo: "1w ago", approved: false },
      { id: "r4", name: "Nisha T.", initial: "N", note: "Renovating my room and this chair fits exactly what I was looking for!", requestedAgo: "1w ago", approved: false },
    ]
  },
  { id: 202, title: "Harry Potter Box Set", emoji: "📚", category: "Books", description: "Complete 7-book set. Good condition, all spines intact.", neighborhood: "Koregaon Park", postedAgo: "1mo ago", status: "given", rating: 5.0, ratingCount: 1, condition: "Great", reposted: false, requestors: [] },
  {
    id: 203, title: "Yoga Mat", emoji: "🧘", category: "Sports", description: "6mm thick, non-slip, barely used. Comes with carry strap.", neighborhood: "Koregaon Park", postedAgo: "3w ago", status: "active", rating: null, ratingCount: 0, condition: "Like New", reposted: false,
    requestors: [
      { id: "r5", name: "Preethi V.", initial: "P", note: "Just started yoga classes and can't afford a mat yet. Would be so grateful!", requestedAgo: "2d ago", approved: false },
      { id: "r6", name: "Sunita B.", initial: "S", note: "Recovering from back injury, doctor recommended yoga. This would help a lot.", requestedAgo: "4d ago", approved: false },
    ]
  },
];

const COMMUNITY_MEMBERS = [
  { id: "u1", name: "Suresh Patil", initial: "S", color: "#b07a50", neighborhood: "Shivajinagar", joinedMs: Date.now() - 1051200000 * 2.8, memberSince: "3 years ago", followers: 92, following: 14, itemsGiven: 31, peopleHelped: 31, wasteSaved: "68kg", avgRating: 4.8, badges: ["🏅 Founding Member", "🎁 Super Giver", "🌱 Eco Warrior"], listings: [{ emoji: "🛏️", title: "Wooden Cot Frame", status: "given", requests: 11 }, { emoji: "🪞", title: "Full-Length Mirror", status: "given", requests: 7 }, { emoji: "🖥️", title: "Old iMac 2015", status: "active", requests: 5 }] },
  { id: "u8", name: "Lakshmi Rao", initial: "L", color: "#e07a9a", neighborhood: "Deccan", joinedMs: Date.now() - 1051200000 * 2.4, memberSince: "2.5 years ago", followers: 61, following: 20, itemsGiven: 19, peopleHelped: 19, wasteSaved: "41kg", avgRating: 4.9, badges: ["🌸 Community Pillar", "📦 Generous Giver"], listings: [{ emoji: "🪴", title: "Potted Hibiscus", status: "active", requests: 8 }, { emoji: "🧺", title: "Cane Basket Set", status: "given", requests: 5 }] },
  { id: "u6", name: "Sneha Bhatt", initial: "S", color: "#7aa0c8", neighborhood: "Wakad", joinedMs: Date.now() - 1051200000 * 2, memberSince: "2 years ago", followers: 87, following: 31, itemsGiven: 23, peopleHelped: 23, wasteSaved: "52kg", avgRating: 5.0, badges: ["🏆 Community Hero", "✨ Legend", "🎁 Super Giver"], listings: [{ emoji: "🧱", title: "Lego Technic Set", status: "active", requests: 9 }, { emoji: "🎮", title: "PS4 Controller", status: "given", requests: 14 }] },
  { id: "u9", name: "Vikram Joshi", initial: "V", color: "#7a8ec8", neighborhood: "Kothrud", joinedMs: Date.now() - 1051200000 * 1.7, memberSince: "1.5 years ago", followers: 38, following: 11, itemsGiven: 16, peopleHelped: 16, wasteSaved: "35kg", avgRating: 4.7, badges: ["🚀 Power Giver", "🔧 Handy Helper"], listings: [{ emoji: "🔧", title: "Toolkit Set", status: "given", requests: 9 }, { emoji: "🪑", title: "Folding Chair Pair", status: "active", requests: 4 }] },
  { id: "u3", name: "Rajesh Kumar", initial: "R", color: "#7aaa7a", neighborhood: "Aundh", joinedMs: Date.now() - 1051200000 * 1.3, memberSince: "1 year ago", followers: 51, following: 8, itemsGiven: 14, peopleHelped: 14, wasteSaved: "31kg", avgRating: 4.9, badges: ["🏆 Community Hero", "🚲 Active Giver"], listings: [{ emoji: "🚲", title: "Children's Bicycle", status: "active", requests: 7 }, { emoji: "🛋️", title: "Bean Bag", status: "given", requests: 9 }] },
  { id: "u5", name: "Anil Thakur", initial: "A", color: "#c87a7a", neighborhood: "Viman Nagar", joinedMs: Date.now() - 1051200000 * 1.1, memberSince: "11 months ago", followers: 28, following: 15, itemsGiven: 11, peopleHelped: 11, wasteSaved: "24kg", avgRating: 4.8, badges: ["🍳 Kitchen Expert", "🌱 Eco Warrior"], listings: [{ emoji: "🍳", title: "Cast Iron Skillet", status: "active", requests: 5 }, { emoji: "🥘", title: "Pressure Cooker", status: "given", requests: 7 }] },
  { id: "u2", name: "Meera Sharma", initial: "M", color: "#c8a97a", neighborhood: "Koregaon Park", joinedMs: Date.now() - 1051200000 * 0.9, memberSince: "8 months ago", followers: 34, following: 12, itemsGiven: 8, peopleHelped: 8, wasteSaved: "18kg", avgRating: 4.7, badges: ["🌟 Top Giver", "📚 Book Lover"], listings: [{ emoji: "📚", title: "Oak Bookshelf", status: "active", requests: 3 }, { emoji: "🖼️", title: "Wall Art Set", status: "given", requests: 6 }] },
  { id: "u10", name: "Farhan Shaikh", initial: "F", color: "#a07ac8", neighborhood: "Hadapsar", joinedMs: Date.now() - 1051200000 * 0.7, memberSince: "7 months ago", followers: 22, following: 9, itemsGiven: 9, peopleHelped: 9, wasteSaved: "20kg", avgRating: 4.6, badges: ["🎨 Creative Giver"], listings: [{ emoji: "🎸", title: "Acoustic Guitar", status: "active", requests: 12 }, { emoji: "🎨", title: "Canvas Painting Set", status: "given", requests: 6 }] },
  { id: "u7", name: "Divya Menon", initial: "D", color: "#5aaa6a", neighborhood: "Kalyani Nagar", joinedMs: Date.now() - 1051200000 * 0.55, memberSince: "6 months ago", followers: 42, following: 19, itemsGiven: 7, peopleHelped: 7, wasteSaved: "12kg", avgRating: 4.6, badges: ["🌿 Plant Parent", "🌱 Eco Warrior"], listings: [{ emoji: "🌿", title: "Monstera Plant", status: "active", requests: 11 }, { emoji: "🌵", title: "Succulent Set", status: "given", requests: 3 }] },
  { id: "u4", name: "Priya Nair", initial: "P", color: "#b07ab0", neighborhood: "Baner", joinedMs: Date.now() - 1051200000 * 0.4, memberSince: "5 months ago", followers: 19, following: 22, itemsGiven: 5, peopleHelped: 5, wasteSaved: "9kg", avgRating: 4.5, badges: ["📖 Bibliophile"], listings: [{ emoji: "📖", title: "Classic Novels", status: "active", requests: 2 }, { emoji: "🎨", title: "Acrylic Paint Set", status: "given", requests: 3 }] },
  { id: "u11", name: "Neha Kulkarni", initial: "N", color: "#c8b06a", neighborhood: "Pimple Saudagar", joinedMs: Date.now() - 1051200000 * 0.25, memberSince: "3 months ago", followers: 11, following: 7, itemsGiven: 3, peopleHelped: 3, wasteSaved: "6kg", avgRating: 4.4, badges: ["🌱 New Member"], listings: [{ emoji: "📦", title: "Moving Boxes (10)", status: "active", requests: 4 }, { emoji: "🧸", title: "Stuffed Animal Set", status: "given", requests: 3 }] },
  { id: "u12", name: "Arjun Mehta", initial: "A", color: "#6ab0c8", neighborhood: "Yerawada", joinedMs: Date.now() - 1051200000 * 0.1, memberSince: "1 month ago", followers: 6, following: 4, itemsGiven: 2, peopleHelped: 2, wasteSaved: "4kg", avgRating: 4.3, badges: ["🌱 New Member"], listings: [{ emoji: "🎒", title: "School Backpack", status: "active", requests: 2 }] },
];

const MEMBERS_BY_OLDEST = [...COMMUNITY_MEMBERS].sort((a, b) => a.joinedMs - b.joinedMs);
const calcScore = m => m.itemsGiven * 30 + m.peopleHelped * 20 + parseInt(m.wasteSaved) * 2 + m.followers;
const LEADERBOARD = [...COMMUNITY_MEMBERS].sort((a, b) => calcScore(b) - calcScore(a));

const conditionColor = { "Like New": "#5aaa6a", "Great": "#7aaa7a", "Good": "#c8a97a", "Complete": "#5aaa6a", "Healthy": "#5aaa6a" };
const statusColor = { pending: "#c8a97a", approved: "#5aaa6a", rejected: "#c87a7a" };
const statusLabel = { pending: "⏳ Pending", approved: "✅ Approved", rejected: "❌ Not selected" };
const SEARCH_HINTS = ["a sofa or armchair…", "children's books…", "a bicycle…", "kitchen appliances…", "indoor plants…", "board games…", "winter clothing…", "a study table…", "sports equipment…", "something for your garden…"];
const HOW_STEPS = [
  { icon: "📦", title: "Post what you're giving", desc: "Take a quick photo, describe the item, set a pickup spot — done in under 2 minutes." },
  { icon: "🙋", title: "Neighbours express interest", desc: "People nearby see your item and tap 'I want this'. You choose who gets it." },
  { icon: "🤝", title: "Arrange a pickup", desc: "Chat briefly, agree on a time, and hand it over. No payments, no courier, no fuss." },
  { icon: "🌱", title: "The item finds a new home", desc: "Your preloved item gets a second life with someone who really needs it nearby." },
];
const TESTIMONIALS = [
  { name: "Meera S.", initial: "M", color: "#c8a97a", role: "Giver", neighborhood: "Koregaon Park", rating: 5, type: "giver", quote: "I was about to leave my bookshelf on the street. Within an hour of posting, three families reached out. Knowing it went to a student furnished her room made my whole week.", tag: "🎁 Item found a home" },
  { name: "Arjun M.", initial: "A", color: "#6ab0c8", role: "Receiver", neighborhood: "Yerawada", rating: 5, type: "receiver", quote: "I'm a college student on a very tight budget. I needed a proper chair desperately and found one two streets away. This platform restored my faith in neighbourhoods.", tag: "🤝 Trusted exchange" },
  { name: "Divya M.", initial: "D", color: "#5aaa6a", role: "Giver", neighborhood: "Kalyani Nagar", rating: 5, type: "giver", quote: "My Monstera had grown too big for my apartment. I was nervous but the whole process felt completely safe and personal.", tag: "🌿 Safe & personal" },
  { name: "Rajesh K.", initial: "R", color: "#7aaa7a", role: "Giver", neighborhood: "Aundh", rating: 5, type: "giver", quote: "My daughter had outgrown her bicycle. Within 2 days a father collected it for his 5-year-old. He sent me a photo of her first ride.", tag: "💛 More than giving" },
  { name: "Preethi V.", initial: "P", color: "#b07ab0", role: "Receiver", neighborhood: "Baner", rating: 5, type: "receiver", quote: "I'd just started yoga on doctor's advice and couldn't afford a mat. I found one nearby, and the owner included a beginner's routine card.", tag: "🧘 Community care" },
  { name: "Sneha B.", initial: "S", color: "#7aa0c8", role: "Giver", neighborhood: "Wakad", rating: 5, type: "giver", quote: "I loved that I could choose who got it. I picked someone whose story genuinely moved me. That control made giving feel so meaningful.", tag: "✨ Intentional giving" },
  { name: "Anil T.", initial: "A", color: "#c87a7a", role: "Giver", neighborhood: "Viman Nagar", rating: 5, type: "giver", quote: "Seeing the request from someone who just moved into their first apartment — knowing my pan would be their first kitchen tool — felt wonderful.", tag: "🍳 First home moment" },
];

// ─── GLOBAL STYLES + ALL MEDIA QUERIES ───────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,500&family=Lora:wght@400;500&family=DM+Sans:wght@400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 100%; overflow-x: hidden; }

    @keyframes fadeUp       { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes float        { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px) rotate(8deg)} }
    @keyframes blink        { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes slideUp      { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn       { from{opacity:0} to{opacity:1} }
    @keyframes slideDown    { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes timerSweepFull { from{width:0%} to{width:100%} }

    input { caret-color:#3a5c2a; }
    input:focus, select:focus, textarea:focus { outline: none; }
    button:hover { filter: brightness(1.06); }
    ::-webkit-scrollbar { width:5px; }
    ::-webkit-scrollbar-thumb { background:#d8cfc4; border-radius:3px; }
    .tw-nav-btn:hover  { background:rgba(255,255,255,0.26)!important; transform:scale(1.1); }
    .tw-dot:hover      { background:rgba(255,255,255,0.6)!important; }
    .side-card:hover   { opacity:0.72!important; }

    /* ── MOBILE MENU (hidden by default) ── */
    .mob-menu {
      display: none;
      position: fixed;
      top: 56px; left: 0; right: 0;
      background: rgba(250,246,239,0.98);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid #e8ddd0;
      box-shadow: 0 8px 24px rgba(80,50,20,0.12);
      z-index: 180;
      animation: slideDown 0.18s ease;
    }
    .mob-menu.open { display: block; }
    .mob-item {
      display: block; width: 100%;
      padding: 15px 20px;
      text-align: left;
      font-size: 15px; font-weight: 500;
      font-family: 'DM Sans', sans-serif;
      color: #3a2c1e;
      background: none; border: none; border-bottom: 1px solid #f0ebe3;
      cursor: pointer;
    }
    .mob-item:last-child { border-bottom: none; }
    .mob-item.active     { color: #3a5c2a; font-weight: 700; }
    .mob-item:hover      { background: #f5f0e8; filter: none; }

    /* ── TABLET (≤ 768px) ── */
    @media (max-width: 768px) {
      .hide-mobile   { display: none !important; }
      .show-mobile   { display: flex !important; }

      .hero-wrap     { padding: 44px 16px 36px !important; }
      .hero-title    { font-size: 30px !important; }
      .hero-sub      { font-size: 14px !important; }
      .hero-eyebrow  { display: none !important; }
      .hero-decor    { display: none !important; }

      .stats-strip   { gap: 12px !important; padding: 14px 12px !important; }

      .browse-main   { padding: 20px 12px 90px !important; }
      .cat-row       { overflow-x: auto !important; flex-wrap: nowrap !important; padding-bottom: 4px !important; scrollbar-width: none !important; }
      .cat-row::-webkit-scrollbar { display: none; }
      .items-grid    { grid-template-columns: 1fr 1fr !important; gap: 12px !important; }

      .form-wrap     { padding: 28px 14px 80px !important; }
      .form-grid     { grid-template-columns: 1fr !important; }

      .sub-wrap      { padding: 28px 14px 70px !important; }

      .steps-grid    { grid-template-columns: 1fr 1fr !important; }
      .values-grid   { grid-template-columns: 1fr 1fr !important; }

      .pickup-grid   { grid-template-columns: 1fr !important; }

      .members-grid  { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
      .lb-podium     { gap: 8px !important; }
      .lb-podium-card { width: 96px !important; }
      .lb-row-stats  { display: none !important; }

      .tw-stage      { height: 320px !important; }
      .tw-header     { padding: 22px 18px 0 !important; }
      .tw-dots       { padding: 16px 18px 6px !important; }
      .tw-timer      { margin: 0 18px 18px !important; }
    }

    /* ── PHONE (≤ 480px) ── */
    @media (max-width: 480px) {
      .items-grid    { grid-template-columns: 1fr !important; }
      .hero-title    { font-size: 26px !important; }
      .members-grid  { grid-template-columns: 1fr !important; }
      .steps-grid    { grid-template-columns: 1fr !important; }
      .profile-header-row { flex-direction: column !important; align-items: flex-start !important; }
      .impact-grid   { grid-template-columns: repeat(3,1fr) !important; gap: 6px !important; }
      .contact-row   { flex-wrap: wrap !important; }
      .contact-row > * { flex: 1 1 auto !important; text-align: center !important; justify-content: center !important; }
      .req-card-top  { flex-wrap: wrap !important; }
      .status-badge  { width: 100% !important; text-align: center !important; margin-top: 4px !important; }
      .listing-card  { flex-wrap: wrap !important; }
    }
  `}</style>
);

// ─── HOOKS ───────────────────────────────────────────────────────────────────
function useAnimatedPlaceholder(hints, pauseDuration = 2800) {
  const [displayed, setDisplayed] = useState("");
  const [hintIdx, setHintIdx] = useState(0);
  const [phase, setPhase] = useState("typing");
  const charRef = useRef(0);
  const timerRef = useRef(null);
  useEffect(() => {
    const hint = hints[hintIdx];
    const tick = () => {
      if (phase === "typing") {
        if (charRef.current <= hint.length) { setDisplayed(hint.slice(0, charRef.current)); charRef.current++; timerRef.current = setTimeout(tick, 48); }
        else { timerRef.current = setTimeout(() => setPhase("erasing"), pauseDuration); }
      } else {
        if (charRef.current > 0) { charRef.current--; setDisplayed(hint.slice(0, charRef.current)); timerRef.current = setTimeout(tick, 28); }
        else { setHintIdx(i => (i + 1) % hints.length); setPhase("typing"); }
      }
    };
    charRef.current = phase === "typing" ? 0 : hint.length;
    timerRef.current = setTimeout(tick, 60);
    return () => clearTimeout(timerRef.current);
  }, [phase, hintIdx]);
  return displayed;
}

function useIsMobile(bp = 768) {
  const [v, setV] = useState(() => typeof window !== "undefined" && window.innerWidth <= bp);
  useEffect(() => {
    const h = () => setV(window.innerWidth <= bp);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, [bp]);
  return v;
}

// ─── PICKUP MAP ───────────────────────────────────────────────────────────────
function PickupMap({ address }) {
  const buildings = [{ x: 10, y: 70, w: 60, h: 40 }, { x: 90, y: 70, w: 40, h: 40 }, { x: 145, y: 70, w: 45, h: 40 }, { x: 210, y: 70, w: 100, h: 40 }, { x: 330, y: 70, w: 60, h: 40 }, { x: 10, y: 130, w: 60, h: 60 }, { x: 90, y: 130, w: 40, h: 60 }, { x: 145, y: 130, w: 45, h: 60 }, { x: 210, y: 130, w: 100, h: 60 }, { x: 330, y: 130, w: 60, h: 60 }];
  const streets = [{ x1: 0, y1: 120, x2: 400, y2: 120 }, { x1: 0, y1: 200, x2: 400, y2: 200 }, { x1: 0, y1: 60, x2: 400, y2: 60 }, { x1: 80, y1: 0, x2: 80, y2: 260 }, { x1: 200, y1: 0, x2: 200, y2: 260 }, { x1: 320, y1: 0, x2: 320, y2: 260 }];
  return (
    <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #c8e0b0", marginTop: 0 }}>
      <svg viewBox="0 0 400 260" style={{ width: "100%", display: "block" }}>
        <rect width="400" height="260" fill="#eae4d8" />
        {buildings.map((b, i) => <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} fill="#d8d0c4" rx="3" />)}
        {streets.map((st, i) => <line key={i} x1={st.x1} y1={st.y1} x2={st.x2} y2={st.y2} stroke="#c8c0b4" strokeWidth="16" />)}
        {streets.map((st, i) => <line key={`d${i}`} x1={st.x1} y1={st.y1} x2={st.x2} y2={st.y2} stroke="#d8d2c6" strokeWidth="12" />)}
        <circle cx={190} cy={150} r="10" fill="#7aa0c8" stroke="#fff" strokeWidth="2" />
        <text x={190} y={154} textAnchor="middle" fontSize="10" fill="#fff">You</text>
        <g transform="translate(240,110)"><circle cx="0" cy="0" r="14" fill="#3a5c2a" stroke="#fff" strokeWidth="2.5" /><text x="0" y="5" textAnchor="middle" fontSize="14">📦</text><polygon points="0,14 -5,22 5,22" fill="#3a5c2a" /></g>
        <rect x="8" y="8" width={Math.min(address.length * 6 + 20, 382)} height="22" rx="11" fill="rgba(255,255,255,0.92)" />
        <text x={Math.min(address.length * 3 + 14, 196)} y="23" textAnchor="middle" fontSize="10" fill="#3a5c2a" fontWeight="600">📍 {address.length > 44 ? address.slice(0, 44) + "…" : address}</text>
      </svg>
      <div style={{ padding: "8px 12px", background: "#f0f8ea", fontSize: 11, color: "#5a7a4a", display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#3a5c2a", display: "inline-block" }} />Pickup point
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#7aa0c8", display: "inline-block", marginLeft: 6 }} />Your location
        <span style={{ marginLeft: "auto", fontWeight: 600 }}>Exact address shown above</span>
      </div>
    </div>
  );
}

// ─── ITEM DETAIL MODAL ────────────────────────────────────────────────────────
function ItemDetail({ item, onClose }) {
  const [justification, setJustification] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [contactRevealed, setContactRevealed] = useState(false);
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  return (
    <div style={Z.overlay} onClick={onClose}>
      <div style={Z.modal} onClick={e => e.stopPropagation()}>
        <button style={Z.closeBtn} onClick={onClose}>✕</button>
        <div style={{ ...Z.hero, background: `${item.color}22` }}>
          <span style={Z.heroEmoji}>{item.emoji}</span>
          <div style={Z.heroBadges}>
            <span style={{ ...Z.badge, background: "rgba(255,255,255,0.9)", color: "#3a5c2a", fontWeight: 700 }}>{item.distance}</span>
            <span style={{ ...Z.badge, background: conditionColor[item.condition] + "33", color: conditionColor[item.condition], border: `1px solid ${conditionColor[item.condition]}55` }}>{item.condition}</span>
          </div>
        </div>
        <div style={Z.body}>
          <div style={Z.metaRow}><span style={Z.cat}>{item.category}</span><span style={Z.sep}>·</span><span style={Z.nbh}>📍 {item.neighborhood}</span><span style={Z.sep}>·</span><span style={Z.time}>{item.postedAgo}</span></div>
          <h2 style={Z.title}>{item.title}</h2>
          <p style={Z.desc}>{item.description}</p>
          <div style={Z.tagRow}>{item.tags.map(t => <span key={t} style={Z.tag}>{t}</span>)}</div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: "#7a6a5a", marginBottom: 5 }}>🙋 {item.requests} people want this · 👁 {item.views} views</div>
            <div style={{ height: 5, background: "#ede5d8", borderRadius: 3, overflow: "hidden" }}><div style={{ height: "100%", width: `${Math.min(item.requests * 8, 100)}%`, background: "linear-gradient(90deg,#7aaa7a,#3a5c2a)", borderRadius: 3 }} /></div>
          </div>
          <div style={Z.locationNote}>🔒 <strong>Location is private.</strong> Exact pickup address is shared if your request is approved.</div>
          <div style={Z.giverCard}>
            <div style={{ ...Z.giverAv, background: `${item.color}44`, color: item.color }}>{item.giverInitial}</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600, color: "#2a1e10" }}>{item.giverName}</div><div style={{ fontSize: 11, color: "#8a7a6a" }}>Item owner · {item.neighborhood}</div></div>
            <button style={Z.contactBtn} onClick={() => setContactRevealed(r => !r)}>{contactRevealed ? "📵 Hide" : "📞 Contact"}</button>
          </div>
          {contactRevealed && <div style={Z.contactReveal}><span style={{ fontSize: 13, fontWeight: 600, color: "#2a4a1a" }}>📱 {item.giverPhone}</span><span style={{ fontSize: 10, color: "#5a7a4a" }}>WhatsApp preferred · Mention the Giving Tree</span></div>}
          {!requestSent ? (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, color: "#2a1e10", marginBottom: 4 }}>Why should this go to you?</div>
              <p style={{ fontSize: 12, color: "#7a6a5a", marginBottom: 8 }}>A thoughtful message increases your chances.</p>
              <textarea style={Z.textarea} placeholder={`e.g. "I'm a first-year student furnishing my room…"`} value={justification} onChange={e => setJustification(e.target.value)} rows={4} maxLength={300} />
              <div style={{ fontSize: 10, color: "#9a8a7a", textAlign: "right", marginBottom: 10 }}>{justification.length}/300</div>
              <button style={{ ...Z.sendBtn, opacity: justification.trim().length > 10 ? 1 : 0.45 }} onClick={() => justification.trim().length > 10 && setRequestSent(true)}>🌳 Send Request to {item.giverName.split(" ")[0]}</button>
            </div>
          ) : (
            <div style={Z.sentBox}><span style={{ fontSize: 30 }}>🎉</span><div><div style={{ fontSize: 15, fontWeight: 700, color: "#2a4a1a", marginBottom: 3 }}>Request sent!</div><div style={{ fontSize: 12, color: "#5a7a4a" }}>{item.giverName.split(" ")[0]} will review and get back to you.</div></div></div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE DROPDOWN ─────────────────────────────────────────────────────────
function ProfileMenu({ onClose, onViewProfile, onViewRequests }) {
  return (
    <div style={PM.wrap}>
      <div style={PM.arrow} />
      <button style={PM.item} onClick={() => { onViewProfile(); onClose(); }}><span style={{ fontSize: 18 }}>👤</span><div><div style={{ fontSize: 13, fontWeight: 600, color: "#2a1e10" }}>My Profile</div><div style={{ fontSize: 11, color: "#8a7a6a" }}>Listings, ratings & impact</div></div></button>
      <div style={{ height: 1, background: "#f0ebe3", margin: "0 14px" }} />
      <button style={PM.item} onClick={() => { onViewRequests(); onClose(); }}><span style={{ fontSize: 18 }}>📬</span><div><div style={{ fontSize: 13, fontWeight: 600, color: "#2a1e10" }}>My Requests</div><div style={{ fontSize: 11, color: "#8a7a6a" }}>Track what you've asked for</div></div></button>
    </div>
  );
}

// ─── LISTING MANAGER ──────────────────────────────────────────────────────────
function ListingManager({ listing, onClose, onEditListing }) {
  const [requestors, setRequestors] = useState(listing.requestors);
  const [approvedId, setApprovedId] = useState(requestors.find(r => r.approved)?.id || null);
  const [pickupAddress, setPickupAddress] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [pickupSent, setPickupSent] = useState(false);
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  const approve = id => { setApprovedId(id); setRequestors(prev => prev.map(r => ({ ...r, approved: r.id === id }))); };
  const approved = requestors.find(r => r.id === approvedId);
  const canSend = pickupAddress.trim().length > 5 && pickupDate && pickupTime;
  return (
    <div style={Z.overlay} onClick={onClose}>
      <div style={{ ...Z.modal, maxWidth: 600 }} onClick={e => e.stopPropagation()}>
        <button style={Z.closeBtn} onClick={onClose}>✕</button>
        <div style={{ ...Z.hero, height: 100, justifyContent: "flex-start", padding: "0 18px", gap: 12, paddingRight: 52, flexShrink: 0 }}>
          <span style={{ fontSize: 36 }}>{listing.emoji}</span>
          <div><div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, color: "#2a1e10", fontWeight: 600 }}>{listing.title}</div><div style={{ fontSize: 12, color: "#8a7a6a" }}>{listing.condition} · {listing.category}</div><button style={{ ...LM.editBtn, marginTop: 4 }} onClick={() => { onClose(); onEditListing(listing); }}>✏️ Edit Listing</button></div>
        </div>
        <div style={{ ...Z.body, paddingTop: 14 }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, color: "#2a1e10", marginBottom: 10 }}>Requests ({requestors.length})</div>
          {requestors.length === 0 && <p style={{ fontSize: 13, color: "#9a8a7a", fontStyle: "italic", marginBottom: 14 }}>No requests yet.</p>}
          <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 14 }}>
            {requestors.map(r => (
              <div key={r.id} style={{ ...LM.card, ...(r.id === approvedId ? LM.cardApproved : {}) }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 5 }}>
                  <div style={{ ...LM.av, background: r.id === approvedId ? "#3a5c2a" : "#e8ddd0", color: r.id === approvedId ? "#d4e8c4" : "#5a4a3a" }}>{r.initial}</div>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600, color: "#2a1e10" }}>{r.name}</div><div style={{ fontSize: 11, color: "#9a8a7a" }}>{r.requestedAgo}</div></div>
                  {r.id === approvedId ? <span style={LM.approvedBadge}>✅ Approved</span> : <button style={LM.approveBtn} onClick={() => approve(r.id)}>Approve</button>}
                </div>
                <p style={{ fontSize: 12, color: "#5a4a3a", fontStyle: "italic", lineHeight: 1.55, background: "rgba(255,255,255,0.6)", padding: "7px 9px", borderRadius: 8 }}>"{r.note}"</p>
              </div>
            ))}
          </div>
          {approvedId && !pickupSent && (
            <div style={{ marginTop: 4, padding: "13px", background: "#f0f8ea", borderRadius: 12, border: "1px solid #c0dca8" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#2a4a1a", marginBottom: 10 }}>📦 Arrange Pickup with {approved?.name}</div>
              <div style={{ marginBottom: 9 }}><label style={S.lbl}>📍 Pickup Address *</label><input style={{ ...S.inp, width: "100%", marginTop: 4 }} placeholder="e.g. Flat 402, Tower B, Aundh" value={pickupAddress} onChange={e => setPickupAddress(e.target.value)} /></div>
              <div className="pickup-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 9 }}>
                <div><label style={S.lbl}>📅 Date *</label><input type="date" style={{ ...S.inp, width: "100%", marginTop: 4 }} value={pickupDate} onChange={e => setPickupDate(e.target.value)} /></div>
                <div><label style={S.lbl}>🕐 Time *</label><select style={{ ...S.inp, width: "100%", marginTop: 4 }} value={pickupTime} onChange={e => setPickupTime(e.target.value)}><option value="">Select</option>{["Morning (8–12)", "Afternoon (12–4)", "Evening (4–8)", "Flexible"].map(t => <option key={t}>{t}</option>)}</select></div>
              </div>
              {pickupAddress.trim().length > 3 && <div style={{ marginBottom: 10 }}><PickupMap address={pickupAddress} /></div>}
              <button style={{ ...Z.sendBtn, opacity: canSend ? 1 : 0.4 }} onClick={() => canSend && setPickupSent(true)}>📨 Send Pickup Details</button>
            </div>
          )}
          {pickupSent && <div style={Z.sentBox}><span style={{ fontSize: 22 }}>📬</span><div><div style={{ fontSize: 14, fontWeight: 700, color: "#2a4a1a" }}>Pickup details sent!</div><div style={{ fontSize: 12, color: "#5a7a4a" }}>{pickupDate} · {pickupTime} · {pickupAddress}</div></div></div>}
        </div>
      </div>
    </div>
  );
}

// ─── MY PROFILE ───────────────────────────────────────────────────────────────
function ProfilePage({ onBack, savedItems, onOpenItem, onEditListing }) {
  const [managingListing, setManagingListing] = useState(null);
  const [listings, setListings] = useState(INIT_MY_LISTINGS);
  const [openCat, setOpenCat] = useState(null);
  const savedList = ITEMS_BASE.filter(i => savedItems.has(i.id));
  const catBuckets = {};
  savedList.forEach(i => { if (!catBuckets[i.category]) catBuckets[i.category] = []; catBuckets[i.category].push(i); });
  const avgRating = (listings.filter(l => l.ratingCount > 0).reduce((a, l) => a + l.rating, 0) / Math.max(1, listings.filter(l => l.ratingCount > 0).length)).toFixed(1);
  return (
    <div style={S.subPage}>
      <div className="sub-wrap" style={S.subWrap}>
        {managingListing && <ListingManager listing={managingListing} onClose={() => setManagingListing(null)} onEditListing={l => { setManagingListing(null); onEditListing(l, updated => setListings(prev => prev.map(x => x.id === updated.id ? updated : x))); }} />}
        <button style={S.backBtn} onClick={onBack}>← Back to Browse</button>
        {/* Header */}
        <div className="profile-header-row" style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 20, padding: "16px", background: "#fff", borderRadius: 16, border: "1px solid #e8ddd0" }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#3a5c2a", color: "#d4e8c4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, flexShrink: 0 }}>K</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(18px,4vw,24px)", color: "#2a1e10", marginBottom: 2 }}>Kiran Desai</h2>
            <p style={{ fontSize: 11, color: "#8a7a6a", marginBottom: 5 }}>Member since January 2024 · Pune, MH</p>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>{"★★★★★".split("").map((s, i) => <span key={i} style={{ color: i < Math.round(avgRating) ? "#c8a97a" : "#ddd", fontSize: 15 }}>{s}</span>)}<span style={{ fontSize: 11, color: "#6b5a4a", marginLeft: 4 }}>{avgRating} avg</span></div>
          </div>
          <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
            {[{ n: listings.length, l: "Listings" }, { n: 24, l: "Followers" }].map(x => <div key={x.l} style={{ textAlign: "center", padding: "7px 10px", background: "#f5f0e8", borderRadius: 10, border: "1px solid #e8ddd0", minWidth: 52 }}><div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: "#2a1e10" }}>{x.n}</div><div style={{ fontSize: 10, color: "#8a7a6a" }}>{x.l}</div></div>)}
          </div>
        </div>
        {/* Impact */}
        <div style={{ background: "#3a5c2a", borderRadius: 14, padding: "18px", marginBottom: 20 }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, color: "#d4e8c4", marginBottom: 12 }}>🌍 Community Impact</div>
          <div className="impact-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {[["📦", "Items Reused", "1,245"], ["🤝", "People Helped", "842"], ["🌱", "Waste Saved", "520 kg"]].map(([icon, label, val]) => (
              <div key={label} style={{ textAlign: "center" }}><span style={{ fontSize: 20, display: "block", marginBottom: 3 }}>{icon}</span><span style={{ display: "block", fontFamily: "'Playfair Display',serif", fontSize: "clamp(14px,3vw,18px)", fontWeight: 600, color: "#d4e8c4" }}>{val}</span><span style={{ fontSize: 10, color: "#a0c890" }}>{label}</span></div>
            ))}
          </div>
        </div>
        {/* Saved */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}><h3 style={S.secTitle}>❤️ Saved Items</h3><span style={{ fontSize: 12, color: "#9a8a7a" }}>({savedList.length})</span></div>
          {Object.keys(catBuckets).length === 0
            ? <div style={{ textAlign: "center", padding: "24px 16px", background: "#f8f4ee", borderRadius: 12, border: "1px dashed #d8cfc4" }}><span style={{ fontSize: 32 }}>🤍</span><p style={{ fontSize: 13, color: "#6b5a4a", marginTop: 8 }}>Nothing saved yet. Tap ♡ on any item.</p></div>
            : <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {Object.keys(catBuckets).map(cat => {
                const items = catBuckets[cat]; const open = openCat === cat;
                return (
                  <div key={cat} style={{ borderRadius: 12, border: "1px solid #e8ddd0", overflow: "hidden", background: "#fff" }}>
                    <button style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", gap: 10 }} onClick={() => setOpenCat(open ? null : cat)}>
                      <div style={{ display: "flex", alignItems: "center", gap: 9 }}><span style={{ fontSize: 22 }}>{categoryEmojis[cat] || "📦"}</span><div style={{ textAlign: "left" }}><div style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, fontWeight: 600, color: "#2a1e10" }}>{cat}</div><div style={{ fontSize: 11, color: "#8a7a6a" }}>{items.length} saved</div></div></div>
                      <span style={{ fontSize: 16, color: "#8a7a6a", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}>▾</span>
                    </button>
                    {open && <div style={{ borderTop: "1px solid #f0ebe3", padding: "12px 14px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 9 }}>
                        {items.map(item => (
                          <div key={item.id} style={{ background: "#faf6ef", borderRadius: 10, border: "1px solid #e8ddd0", overflow: "hidden", cursor: "pointer" }} onClick={() => onOpenItem(item)}>
                            <div style={{ height: 72, display: "flex", alignItems: "center", justifyContent: "center", background: `${item.color}22`, position: "relative" }}><span style={{ fontSize: 36 }}>{item.emoji}</span></div>
                            <div style={{ padding: "7px 9px" }}><div style={{ fontFamily: "'Playfair Display',serif", fontSize: 12, fontWeight: 600, color: "#2a1e10", marginBottom: 2 }}>{item.title}</div><div style={{ fontSize: 10, color: "#8a7a6a" }}>📍 {item.neighborhood}</div></div>
                          </div>
                        ))}
                      </div>
                    </div>}
                  </div>
                );
              })}
            </div>}
        </div>
        {/* Listings */}
        <h3 style={{ ...S.secTitle, marginBottom: 10 }}>My Listings ({listings.length})</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {listings.map(l => (
            <div key={l.id} className="listing-card" style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 13px", background: "#fff", borderRadius: 12, border: "1px solid #e8ddd0" }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{l.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#2a1e10", marginBottom: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.title}</div>
                <div style={{ fontSize: 11, color: "#8a7a6a" }}>{l.category} · {l.condition} · {l.requestors.length} request{l.requestors.length !== 1 ? "s" : ""}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end", flexShrink: 0 }}>
                <span style={{ display: "inline-block", padding: "3px 9px", borderRadius: 20, fontSize: 10, fontWeight: 600, background: l.status === "active" ? "#e8f5e0" : "#f0ebe3", color: l.status === "active" ? "#3a5c2a" : "#8a7a6a" }}>{l.status === "active" ? "🟢 Active" : "✅ Given"}</span>
                {l.status === "active" && <button style={LM.manageBtn} onClick={() => setManagingListing(l)}>Manage →</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MY REQUESTS ─────────────────────────────────────────────────────────────
function RequestsPage({ onBack }) {
  const [requests, setRequests] = useState(INIT_MY_REQUESTS);
  const upd = (id, field, val) => setRequests(prev => prev.map(r => r.id === id ? { ...r, [field]: val } : r));
  const confirm = id => setRequests(prev => prev.map(r => r.id === id ? { ...r, confirmed: true } : r));
  return (
    <div style={S.subPage}><div className="sub-wrap" style={S.subWrap}>
      <button style={S.backBtn} onClick={onBack}>← Back to Browse</button>
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(22px,5vw,30px)", color: "#2a1e10", marginBottom: 4 }}>My Requests</h2>
      <p style={{ fontFamily: "'Lora',serif", fontSize: 13, color: "#7a6a5a", marginBottom: 20 }}>Items you've asked for and their current status.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {requests.map(req => (
          <div key={req.id} style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8ddd0", padding: "15px", boxShadow: "0 2px 8px rgba(80,50,20,0.06)" }}>
            <div className="req-card-top" style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 10 }}>
              <span style={{ fontSize: 30, flexShrink: 0 }}>{req.itemEmoji}</span>
              <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600, color: "#2a1e10", marginBottom: 1 }}>{req.itemTitle}</div><div style={{ fontSize: 11, color: "#8a7a6a" }}>From {req.giverName} · {req.requestedAgo}</div></div>
              <span className="status-badge" style={{ padding: "5px 11px", borderRadius: 20, fontSize: 11, fontWeight: 600, flexShrink: 0, background: statusColor[req.status] + "22", color: statusColor[req.status], border: `1px solid ${statusColor[req.status]}55` }}>{statusLabel[req.status]}</span>
            </div>
            <div style={{ fontSize: 12, color: "#6b5a4a", background: "#f8f4ee", borderRadius: 9, padding: "8px 11px", fontStyle: "italic", lineHeight: 1.6, marginBottom: 10 }}>"{req.myNote}"</div>
            {req.status === "approved" && !req.confirmed && (
              <div style={{ padding: "12px", background: "#f0f8ea", borderRadius: 11, border: "1px solid #c8e8b0" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 10 }}><span style={{ fontSize: 18 }}>🎉</span><div><div style={{ fontSize: 13, fontWeight: 700, color: "#2a4a1a" }}>You've been selected!</div><div style={{ fontSize: 11, color: "#5a7a4a" }}>{req.giverName} approved your request.</div></div></div>
                <div className="pickup-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 9 }}>
                  <div><label style={S.lbl}>📅 Date</label><input type="date" style={{ ...S.inp, width: "100%", marginTop: 3 }} value={req.pickupDate} onChange={e => upd(req.id, "pickupDate", e.target.value)} /></div>
                  <div><label style={S.lbl}>🕐 Time</label><select style={{ ...S.inp, width: "100%", marginTop: 3 }} value={req.pickupTime} onChange={e => upd(req.id, "pickupTime", e.target.value)}><option value="">Select</option>{["Morning (8–12)", "Afternoon (12–4)", "Evening (4–8)", "Flexible"].map(t => <option key={t}>{t}</option>)}</select></div>
                  {req.pickupAddress && <div style={{ gridColumn: "1/-1" }}><label style={S.lbl}>📍 Pickup Address</label><input style={{ ...S.inp, width: "100%", marginTop: 3, background: "#f8f4ee", color: "#3a5c2a", fontWeight: 500 }} value={req.pickupAddress} readOnly /></div>}
                </div>
                {req.pickupAddress && <div style={{ marginBottom: 10 }}><PickupMap address={req.pickupAddress} /></div>}
                <div className="contact-row" style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                  <a href={`tel:${req.giverPhone}`} style={{ ...S.callBtn, textDecoration: "none" }}>📞 Call {req.giverName.split(" ")[0]}</a>
                  <a href={`https://wa.me/${req.giverPhone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" style={{ ...S.waBtn, textDecoration: "none" }}>💬 WhatsApp</a>
                  <button style={{ ...S.confirmBtn, opacity: req.pickupDate && req.pickupTime ? 1 : 0.45, marginLeft: "auto" }} onClick={() => req.pickupDate && req.pickupTime && confirm(req.id)}>✓ Confirm</button>
                </div>
              </div>
            )}
            {req.status === "approved" && req.confirmed && <div style={Z.sentBox}><span style={{ fontSize: 20 }}>📦</span><div><div style={{ fontSize: 13, fontWeight: 700, color: "#2a4a1a" }}>Pickup confirmed!</div><div style={{ fontSize: 11, color: "#5a7a4a" }}>{req.pickupDate} · {req.pickupTime}</div></div></div>}
            {req.status === "rejected" && <div style={{ padding: "8px 12px", background: "#fdf0e8", borderRadius: 9, fontSize: 12, color: "#7a4a2a", border: "1px solid #e8c8a8", marginTop: 6 }}>This item went to someone else. Keep browsing — more items are added daily!</div>}
          </div>
        ))}
      </div>
    </div></div>
  );
}

// ─── MEMBER CARD ──────────────────────────────────────────────────────────────
function MemberCard({ member, isFollowing, onToggleFollow, onOpenProfile }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #ede5d8", overflow: "hidden", cursor: "pointer", transition: "transform 0.2s,box-shadow 0.2s", transform: hov ? "translateY(-3px)" : "none", boxShadow: hov ? "0 8px 20px rgba(80,50,20,0.14)" : "0 2px 8px rgba(80,50,20,0.06)" }} onClick={onOpenProfile} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div style={{ height: 46, background: `${member.color}28`, display: "flex", alignItems: "flex-end", justifyContent: "center" }}><div style={{ width: 44, height: 44, borderRadius: "50%", background: member.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 700, border: "3px solid #fff", marginBottom: -22, zIndex: 1, position: "relative", boxShadow: "0 4px 10px rgba(0,0,0,0.12)" }}>{member.initial}</div></div>
      <div style={{ padding: "26px 11px 11px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, fontWeight: 600, color: "#2a1e10", marginBottom: 2 }}>{member.name}</div>
        <div style={{ fontSize: 10, color: "#8a7a6a", marginBottom: 2 }}>📍 {member.neighborhood}</div>
        <div style={{ fontSize: 9, color: "#7a8a6a", background: "#f0f5ec", borderRadius: 20, padding: "2px 7px", display: "inline-block", marginBottom: 5, border: "1px solid #d8ecd0" }}>{member.memberSince}</div>
        <div style={{ display: "flex", gap: 3, justifyContent: "center", flexWrap: "wrap", marginBottom: 6 }}>{member.badges.slice(0, 2).map(b => <span key={b} style={{ padding: "2px 5px", borderRadius: 20, background: "#f5f0e8", border: "1px solid #e8ddd0", fontSize: 8, color: "#6b5a4a" }}>{b}</span>)}</div>
        <div style={{ display: "flex", marginBottom: 7, borderTop: "1px solid #f0ebe3", paddingTop: 6 }}>{[{ n: member.itemsGiven, l: "Given" }, { n: member.followers, l: "Followers" }, { n: member.wasteSaved, l: "Saved" }].map(x => <div key={x.l} style={{ flex: 1, textAlign: "center" }}><div style={{ fontFamily: "'Playfair Display',serif", fontSize: 12, fontWeight: 700, color: "#2a1e10" }}>{x.n}</div><div style={{ fontSize: 9, color: "#9a8a7a" }}>{x.l}</div></div>)}</div>
        <button style={{ width: "100%", padding: "6px", borderRadius: 20, border: isFollowing ? "1px solid #d8cfc4" : "none", background: isFollowing ? "#f0ebe3" : "#3a5c2a", color: isFollowing ? "#5a4a3a" : "#d4e8c4", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }} onClick={e => { e.stopPropagation(); onToggleFollow(); }}>{isFollowing ? "✓ Following" : "+ Follow"}</button>
      </div>
    </div>
  );
}

// ─── MEMBER PROFILE ───────────────────────────────────────────────────────────
function MemberProfilePage({ member, isFollowing, onToggleFollow, onBack }) {
  return (
    <div style={S.subPage}><div className="sub-wrap" style={{ ...S.subWrap, maxWidth: 700 }}>
      <button style={S.backBtn} onClick={onBack}>← Back to Community</button>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 20, padding: "16px", background: "#fff", borderRadius: 16, border: "1px solid #e8ddd0", flexWrap: "wrap", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `${member.color}18`, zIndex: 0 }} />
        <div style={{ width: 58, height: 58, borderRadius: "50%", background: member.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, flexShrink: 0, zIndex: 1 }}>{member.initial}</div>
        <div style={{ flex: 1, minWidth: 140, zIndex: 1 }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(18px,4vw,24px)", color: "#2a1e10", marginBottom: 2 }}>{member.name}</h2>
          <p style={{ fontSize: 11, color: "#8a7a6a", marginBottom: 5 }}>{member.memberSince} · {member.neighborhood}</p>
          <div style={{ display: "flex", gap: 3, marginBottom: 6 }}>{member.badges.map(b => <span key={b} style={{ padding: "2px 7px", borderRadius: 20, background: "rgba(255,255,255,0.7)", fontSize: 9, color: "#3a2c1e", border: "1px solid rgba(0,0,0,0.07)" }}>{b}</span>)}</div>
        </div>
        <div style={{ zIndex: 1, display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-end" }}>
          <button style={{ padding: "8px 18px", borderRadius: 20, background: isFollowing ? "#f0ebe3" : "#3a5c2a", color: isFollowing ? "#5a4a3a" : "#d4e8c4", border: isFollowing ? "1px solid #d8cfc4" : "none", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }} onClick={onToggleFollow}>{isFollowing ? "✓ Following" : "+ Follow"}</button>
          <div style={{ fontSize: 10, color: "#8a7a6a" }}>{member.followers + (isFollowing ? 1 : 0)} followers</div>
        </div>
      </div>
      <div style={{ background: "#3a5c2a", borderRadius: 14, padding: "16px", marginBottom: 20 }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, color: "#d4e8c4", marginBottom: 10 }}>🌍 Impact</div>
        <div className="impact-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 9 }}>
          {[["📦", "Items Given", member.itemsGiven], ["🤝", "Helped", member.peopleHelped], ["🌱", "Saved", member.wasteSaved]].map(([icon, label, val]) => (
            <div key={label} style={{ textAlign: "center" }}><span style={{ fontSize: 18, display: "block", marginBottom: 2 }}>{icon}</span><span style={{ display: "block", fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 600, color: "#d4e8c4" }}>{val}</span><span style={{ fontSize: 9, color: "#a0c890" }}>{label}</span></div>
          ))}
        </div>
      </div>
      <h3 style={{ ...S.secTitle, marginBottom: 9 }}>Listings</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {member.listings.map((l, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#fff", borderRadius: 11, border: "1px solid #e8ddd0" }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>{l.emoji}</span>
            <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600, color: "#2a1e10" }}>{l.title}</div><div style={{ fontSize: 11, color: "#8a7a6a" }}>{l.requests} requests</div></div>
            <span style={{ padding: "3px 9px", borderRadius: 20, fontSize: 10, fontWeight: 600, background: l.status === "active" ? "#e8f5e0" : "#f0ebe3", color: l.status === "active" ? "#3a5c2a" : "#8a7a6a" }}>{l.status === "active" ? "🟢 Available" : "✅ Given"}</span>
          </div>
        ))}
      </div>
    </div></div>
  );
}

// ─── COMMUNITY PAGE ───────────────────────────────────────────────────────────
function CommunityPage({ onBack }) {
  const [tab, setTab] = useState("members");
  const [following, setFollowing] = useState(new Set(["u6", "u3", "u1"]));
  const [openMember, setOpenMember] = useState(null);
  const toggleFollow = id => setFollowing(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const medalColors = ["#d4af37", "#adb5bd", "#cd7f32"];
  const followingMembers = COMMUNITY_MEMBERS.filter(m => following.has(m.id));
  const notFollowing = MEMBERS_BY_OLDEST.filter(m => !following.has(m.id));
  if (openMember) return <MemberProfilePage member={openMember} isFollowing={following.has(openMember.id)} onToggleFollow={() => toggleFollow(openMember.id)} onBack={() => setOpenMember(null)} />;
  return (
    <div style={S.subPage}><div className="sub-wrap" style={{ ...S.subWrap, maxWidth: 1100 }}>
      <button style={S.backBtn} onClick={onBack}>← Back to Browse</button>
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(22px,5vw,32px)", color: "#2a1e10", marginBottom: 4 }}>Community</h2>
      <p style={{ fontFamily: "'Lora',serif", fontSize: 13, color: "#7a6a5a", marginBottom: 18 }}>Meet the neighbours who make giving possible.</p>
      <div style={{ display: "flex", gap: 5, marginBottom: 22, borderBottom: "1px solid #e8ddd0" }}>
        {[["members", "👥 Members"], ["leaderboard", "🏆 Leaderboard"]].map(([t, lbl]) => (
          <button key={t} style={{ padding: "8px 14px", borderRadius: "7px 7px 0 0", border: "none", background: "none", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", color: tab === t ? "#3a5c2a" : "#8a7a6a", borderBottom: tab === t ? "2px solid #3a5c2a" : "2px solid transparent", marginBottom: "-1px", background: tab === t ? "#f5f0e8" : "none" }} onClick={() => setTab(t)}>{lbl}</button>
        ))}
      </div>
      {tab === "members" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {followingMembers.length > 0 && <><h3 style={S.secTitle}>💚 Following ({followingMembers.length})</h3><div className="members-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: 12, marginBottom: 8 }}>{followingMembers.map(m => <MemberCard key={m.id} member={m} isFollowing={true} onToggleFollow={() => toggleFollow(m.id)} onOpenProfile={() => setOpenMember(m)} />)}</div></>}
          {notFollowing.length > 0 && <><h3 style={S.secTitle}>🔍 Discover</h3><div className="members-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: 12 }}>{notFollowing.map(m => <MemberCard key={m.id} member={m} isFollowing={false} onToggleFollow={() => toggleFollow(m.id)} onOpenProfile={() => setOpenMember(m)} />)}</div></>}
        </div>
      )}
      {tab === "leaderboard" && (
        <div>
          <div className="lb-podium" style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 10, marginBottom: 18 }}>
            {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((m, i) => {
              const rank = i === 1 ? 1 : i === 0 ? 2 : 3;
              return (<div key={m.id} className="lb-podium-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "14px 8px 10px", background: rank === 1 ? "linear-gradient(180deg,#fdf8ec,#fff)" : "#fff", borderRadius: 12, border: rank === 1 ? "1px solid #e8d090" : "1px solid #e8ddd0", cursor: "pointer", width: 104, position: "relative", transform: rank === 1 ? "translateY(-8px)" : "none", boxShadow: rank === 1 ? "0 8px 24px rgba(200,169,122,0.2)" : "none" }} onClick={() => setOpenMember(m)}>
                <div style={{ position: "absolute", top: -9, width: 22, height: 22, borderRadius: "50%", background: medalColors[rank - 1], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.18)" }}>{rank}</div>
                <div style={{ width: rank === 1 ? 52 : 42, height: rank === 1 ? 52 : 42, borderRadius: "50%", background: m.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: rank === 1 ? 20 : 16, fontWeight: 700, marginBottom: 5, boxShadow: "0 4px 10px rgba(0,0,0,0.12)" }}>{m.initial}</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 11, fontWeight: 600, color: "#2a1e10", marginBottom: 2, textAlign: "center" }}>{m.name.split(" ")[0]}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#3a5c2a" }}>{calcScore(m).toLocaleString()} pts</div>
              </div>);
            })}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {LEADERBOARD.map((m, i) => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 11px", background: i < 3 ? "linear-gradient(90deg,#fdfaf5,#fff)" : "#fff", borderRadius: 10, border: "1px solid #e8ddd0", cursor: "pointer" }} onClick={() => setOpenMember(m)}>
                <div style={{ width: 20, fontSize: 13, fontWeight: 700, textAlign: "center", color: i < 3 ? medalColors[i] : "#9a8a7a", flexShrink: 0 }}>{i + 1}</div>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: m.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{m.initial}</div>
                <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12, fontWeight: 600, color: "#2a1e10", marginBottom: 1 }}>{m.name}</div><div style={{ fontSize: 10, color: "#9a8a7a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.neighborhood}</div></div>
                <div className="lb-row-stats" style={{ display: "flex", gap: 9, flexShrink: 0 }}><span style={{ fontSize: 11, color: "#5a4a3a" }}>📦 {m.itemsGiven}</span><span style={{ fontSize: 11, color: "#5a4a3a" }}>🌱 {m.wasteSaved}</span></div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#3a5c2a", textAlign: "right", flexShrink: 0, minWidth: 44 }}>{calcScore(m).toLocaleString()}<span style={{ display: "block", fontSize: 9, color: "#9a8a7a", fontWeight: 400 }}>pts</span></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div></div>
  );
}

// ─── GIVE ITEM PAGE ───────────────────────────────────────────────────────────
function GiveItemPage({ onBack, prefillData, onSaveEdit }) {
  const isEditing = !!prefillData;
  const [form, setForm] = useState(prefillData ? { title: prefillData.title || "", category: prefillData.category || "", condition: prefillData.condition || "", description: prefillData.description || "", neighborhood: prefillData.neighborhood || "", name: "Kiran", phone: "" } : { title: "", category: "", condition: "", description: "", neighborhood: "", name: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const canSubmit = form.title && form.category && form.condition && form.description;
  const handleFile = e => { const f = e.dataTransfer?.files[0] || e.target.files?.[0]; if (f) setImagePreview(URL.createObjectURL(f)); };
  if (submitted) return (
    <div style={{ width: "100%", minHeight: "calc(100vh - 56px)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1, padding: "20px" }}>
      <div style={{ textAlign: "center", maxWidth: 380, padding: "36px 20px" }}>
        <span style={{ fontSize: 52 }}>{isEditing ? "✨" : "🎉"}</span>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(22px,5vw,28px)", color: "#2a1e10", marginTop: 12, marginBottom: 8 }}>{isEditing ? "Listing updated!" : "Your item is live!"}</h2>
        <p style={{ fontFamily: "'Lora',serif", fontSize: 14, color: "#7a6a5a", lineHeight: 1.6, marginBottom: 24 }}>{isEditing ? <>Changes to <strong>{form.title}</strong> saved.</> : <>Neighbours can now see <strong>{form.title}</strong>.</>}</p>
        <button style={S.submitBtn} onClick={onBack}>{isEditing ? "← Back to Profile" : "Browse other items →"}</button>
      </div>
    </div>
  );
  return (
    <div style={{ width: "100%", minHeight: "calc(100vh - 56px)", position: "relative", zIndex: 1 }}>
      <div className="form-wrap" style={{ maxWidth: 680, margin: "0 auto", padding: "36px 18px 80px" }}>
        <button style={S.backBtn} onClick={onBack}>← Back</button>
        {isEditing
          ? <div style={{ marginBottom: 22 }}><div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}><span style={{ fontSize: 26 }}>{prefillData.emoji}</span><div><h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(20px,5vw,28px)", color: "#2a1e10", marginBottom: 3 }}>Edit Listing</h2><span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 20, background: "#e8f0f8", color: "#3a6a8a", fontSize: 10, fontWeight: 600, border: "1px solid #b0c8e0" }}>🔄 Will be marked Reposted</span></div></div></div>
          : <><h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(24px,5vw,34px)", color: "#2a1e10", marginBottom: 5 }}>Give an Item</h2><p style={{ fontFamily: "'Lora',serif", fontSize: 14, color: "#7a6a5a", marginBottom: 24 }}>Someone nearby will treasure what you no longer need.</p></>}
        <div style={{ border: "2px dashed #d8cfc4", borderRadius: 13, padding: "28px 16px", textAlign: "center", cursor: "pointer", marginBottom: 24, background: dragOver ? "#f0f5ec" : "#f8f4ee", transition: "all 0.2s", overflow: "hidden", ...(imagePreview ? { padding: 0, border: "2px solid #d8cfc4" } : {}) }} onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e); }} onClick={() => document.getElementById("imgInput").click()}>
          {imagePreview ? <img src={imagePreview} alt="preview" style={{ width: "100%", maxHeight: 240, objectFit: "cover", display: "block" }} /> : <><span style={{ fontSize: 30 }}>📷</span><p style={{ fontSize: 13, color: "#6b5a4a", marginTop: 8, fontWeight: 500 }}>Tap to upload a photo</p><p style={{ fontSize: 11, color: "#9a8a7a", marginTop: 3 }}>A clear photo gets 3× more responses</p></>}
          <input id="imgInput" type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
        </div>
        <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}><label style={S.lbl}>Item name *</label><input style={S.inp} placeholder="e.g. Wooden dining table" value={form.title} onChange={e => set("title", e.target.value)} /></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}><label style={S.lbl}>Category *</label><select style={S.inp} value={form.category} onChange={e => set("category", e.target.value)}><option value="">Select</option>{categories.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}</select></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, gridColumn: "1/-1" }}><label style={S.lbl}>Condition *</label><div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>{["Like New", "Great", "Good", "Fair"].map(c => <button key={c} style={{ padding: "7px 13px", borderRadius: 20, border: form.condition === c ? "1.5px solid #3a5c2a" : "1.5px solid #d8cfc4", background: form.condition === c ? "#3a5c2a" : "#fff", color: form.condition === c ? "#d4e8c4" : "#6b5a4a", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }} onClick={() => set("condition", c)}>{c}</button>)}</div></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}><label style={S.lbl}>Neighbourhood</label><input style={S.inp} placeholder="e.g. Koregaon Park" value={form.neighborhood} onChange={e => set("neighborhood", e.target.value)} /></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, gridColumn: "1/-1" }}><label style={S.lbl}>Description *</label><textarea style={{ ...S.inp, minHeight: 88, resize: "vertical" }} placeholder="Describe the item — condition, size, any quirks…" value={form.description} onChange={e => set("description", e.target.value)} /></div>
          {!isEditing && <>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}><label style={S.lbl}>Your name</label><input style={S.inp} placeholder="First name" value={form.name} onChange={e => set("name", e.target.value)} /></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}><label style={S.lbl}>Phone / WhatsApp</label><input style={S.inp} placeholder="So recipients can reach you" value={form.phone} onChange={e => set("phone", e.target.value)} /></div>
          </>}
        </div>
        <button style={{ ...S.submitBtn, opacity: canSubmit ? 1 : 0.45 }} onClick={() => canSubmit && (isEditing && onSaveEdit ? onSaveEdit({ ...prefillData, title: form.title, category: form.category, condition: form.condition, description: form.description, neighborhood: form.neighborhood, postedAgo: "just now", reposted: true }) : null) || setSubmitted(true)}>{isEditing ? "✨ Save Changes" : "🌳 Post this item for free"}</button>
      </div>
    </div>
  );
}

// ─── TESTIMONIAL CAROUSEL ─────────────────────────────────────────────────────
function TestimonialCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const isMobile = useIsMobile(640);
  const total = TESTIMONIALS.length;
  const goTo = idx => setActive(((idx % total) + total) % total);
  const goNext = () => goTo(active + 1);
  const goPrev = () => goTo(active - 1);
  useEffect(() => { if (paused) return; const id = setInterval(goNext, 4800); return () => clearInterval(id); }, [active, paused]);
  const t = TESTIMONIALS[active];

  if (isMobile) {
    return (
      <div style={TW.section} onTouchStart={() => setPaused(true)} onTouchEnd={() => setPaused(false)}>
        <div className="tw-header" style={{ ...TW.header, padding: "22px 18px 0" }}>
          <div><h3 style={{ ...TW.heading, fontSize: 17 }}>💬 What our community says</h3></div>
          <div style={TW.navBtns}><button style={TW.navBtn} onClick={goPrev}>‹</button><button style={TW.navBtn} onClick={goNext}>›</button></div>
        </div>
        <div style={{ padding: "16px 14px 0" }}>
          <div style={{ ...TW.cardFace, background: "linear-gradient(148deg,#324e24 0%,#3e6230 55%,#2c4820 100%)", boxShadow: "0 14px 36px rgba(10,28,8,0.5)", height: "auto", minHeight: 220 }}>
            <div style={TW.quoteMark}>"</div>
            <p style={{ ...TW.quote, fontSize: 13, display: "block" }}>{t.quote}</p>
            <span style={TW.tagPill}>{t.tag}</span>
            <div style={{ ...TW.divider, opacity: 0.2 }} />
            <div style={TW.personRow}>
              <div style={{ ...TW.avatar, background: t.color, width: 38, height: 38, fontSize: 14 }}>{t.initial}</div>
              <div style={{ flex: 1 }}><div style={{ ...TW.personName, fontSize: 12 }}>{t.name}</div><div style={{ ...TW.personMeta, fontSize: 10 }}>{t.role} · 📍 {t.neighborhood}</div></div>
              <span style={{ ...TW.roleChip, background: t.type === "giver" ? "rgba(160,220,140,0.18)" : "rgba(140,180,240,0.18)", color: t.type === "giver" ? "#b8e8a0" : "#a8c8f0", border: `1px solid ${t.type === "giver" ? "rgba(160,220,140,0.3)" : "rgba(140,180,240,0.3)"}`, fontSize: 9 }}>{t.type === "giver" ? "🎁 Giver" : "🙏 Receiver"}</span>
            </div>
            <div style={TW.starsRow}><span style={TW.stars}>{"★".repeat(t.rating)}</span></div>
          </div>
        </div>
        <div className="tw-dots" style={TW.dotsRow}>{TESTIMONIALS.map((_, i) => <button key={i} style={{ ...TW.dot, ...(i === active ? TW.dotActive : {}) }} onClick={() => goTo(i)} />)}</div>
        <div className="tw-timer" style={TW.timerTrack}><div key={active} style={{ ...TW.timerBar, animation: "timerSweepFull 4.8s linear forwards", animationPlayState: paused ? "paused" : "running" }} /></div>
      </div>
    );
  }

  // Desktop multi-card
  return (
    <div style={TW.section} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="tw-header" style={TW.header}>
        <div><h3 style={TW.heading}>💬 What our community says</h3><p style={TW.subheading}>Real stories from givers and receivers across Pune</p></div>
        <div style={TW.navBtns}><button className="tw-nav-btn" style={TW.navBtn} onClick={goPrev}>‹</button><button className="tw-nav-btn" style={TW.navBtn} onClick={goNext}>›</button></div>
      </div>
      <div style={{ overflow: "hidden", position: "relative" }}>
        <div className="tw-stage" style={TW.stage}>
          {[-2, -1, 0, 1, 2].map(offset => {
            const idx = ((active + offset) % total + total) % total;
            const tc = TESTIMONIALS[idx]; const isCenter = offset === 0;
            return (
              <div key={offset} className={Math.abs(offset) === 1 ? "side-card" : ""} style={{ position: "absolute", top: 0, left: "50%", width: 420, marginLeft: -210, transform: `translateX(${offset * 265}px) scale(${offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.78 : 0.60})`, transformOrigin: "center top", opacity: offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.52 : 0.24, zIndex: 10 - Math.abs(offset) * 3, transition: "transform 0.62s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.62s ease", cursor: Math.abs(offset) === 1 ? "pointer" : "default", pointerEvents: Math.abs(offset) > 1 ? "none" : "auto" }} onClick={() => Math.abs(offset) === 1 && goTo(active + offset)}>
                <div style={{ ...TW.cardFace, background: isCenter ? "linear-gradient(148deg,#324e24 0%,#3e6230 55%,#2c4820 100%)" : "linear-gradient(148deg,#223518 0%,#2e4a22 100%)", boxShadow: isCenter ? "0 28px 70px rgba(10,28,8,0.6)" : "0 6px 20px rgba(10,28,8,0.4)" }}>
                  <div style={TW.quoteMark}>"</div>
                  <p style={{ ...TW.quote, fontSize: isCenter ? 15 : 13, WebkitLineClamp: isCenter ? 5 : 3, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden" }}>{tc.quote}</p>
                  {isCenter && <span style={TW.tagPill}>{tc.tag}</span>}
                  <div style={{ ...TW.divider, opacity: isCenter ? 0.2 : 0.1 }} />
                  <div style={TW.personRow}>
                    <div style={{ ...TW.avatar, background: tc.color, width: isCenter ? 44 : 34, height: isCenter ? 44 : 34, fontSize: isCenter ? 17 : 13 }}>{tc.initial}</div>
                    <div style={{ flex: 1, minWidth: 0 }}><div style={{ ...TW.personName, fontSize: isCenter ? 14 : 12 }}>{tc.name}</div><div style={{ ...TW.personMeta, fontSize: isCenter ? 11 : 10 }}>{tc.role} · 📍 {tc.neighborhood}</div></div>
                    {isCenter && <span style={{ ...TW.roleChip, background: tc.type === "giver" ? "rgba(160,220,140,0.18)" : "rgba(140,180,240,0.18)", color: tc.type === "giver" ? "#b8e8a0" : "#a8c8f0", border: `1px solid ${tc.type === "giver" ? "rgba(160,220,140,0.3)" : "rgba(140,180,240,0.3)"}`, fontSize: 10 }}>{tc.type === "giver" ? "🎁 Giver" : "🙏 Receiver"}</span>}
                  </div>
                  {isCenter && <div style={TW.starsRow}><span style={TW.stars}>{"★".repeat(tc.rating)}{"☆".repeat(5 - tc.rating)}</span></div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="tw-dots" style={TW.dotsRow}>{TESTIMONIALS.map((_, i) => <button key={i} className="tw-dot" style={{ ...TW.dot, ...(i === active ? TW.dotActive : {}) }} onClick={() => goTo(i)} />)}</div>
      <div className="tw-timer" style={TW.timerTrack}><div key={active} style={{ ...TW.timerBar, animation: "timerSweepFull 4.8s linear forwards", animationPlayState: paused ? "paused" : "running" }} /></div>
    </div>
  );
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
function HowItWorksPage({ onBack, onGive }) {
  return (
    <div style={S.subPage}><div className="sub-wrap" style={{ ...S.subWrap, maxWidth: 860 }}>
      <button style={S.backBtn} onClick={onBack}>← Back</button>
      <div style={{ textAlign: "center", marginBottom: 40 }}><span style={{ fontSize: 46 }}>🌳</span><h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(22px,4vw,36px)", color: "#2a1e10", marginTop: 10, marginBottom: 8 }}>How the Giving Tree works</h2><p style={{ fontFamily: "'Lora',serif", fontSize: 15, color: "#7a6a5a", maxWidth: 500, margin: "0 auto", lineHeight: 1.65 }}>A simple, human way to give quality items a second life — right in your neighbourhood.</p></div>
      <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 18, marginBottom: 44 }}>
        {HOW_STEPS.map((step, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 13, padding: "22px 16px", border: "1px solid #ede5d8", textAlign: "center", boxShadow: "0 4px 14px rgba(80,50,20,0.06)" }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#3a5c2a", color: "#d4e8c4", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>{i + 1}</div>
            <div style={{ fontSize: 30, marginBottom: 10 }}>{step.icon}</div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, color: "#2a1e10", marginBottom: 5 }}>{step.title}</h3>
            <p style={{ fontSize: 12, color: "#7a6a5a", lineHeight: 1.6 }}>{step.desc}</p>
          </div>
        ))}
      </div>
      <TestimonialCarousel />
      <div style={{ marginBottom: 44 }}>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "#2a1e10", marginBottom: 18, textAlign: "center" }}>Our values</h3>
        <div className="values-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 14 }}>
          {[["🆓", "Always free", "No fees, no premium tiers, no ads."], ["📍", "Hyper-local", "Items stay in the neighbourhood."], ["🔒", "Safe & simple", "No accounts needed to browse."], ["♻️", "Less waste", "Every rehomed item saves landfill space."]].map(([icon, title, desc]) => (
            <div key={title} style={{ background: "#f5f0e8", borderRadius: 11, padding: "16px 14px", border: "1px solid #e8ddd0" }}><span style={{ fontSize: 24, display: "block", marginBottom: 7 }}>{icon}</span><h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, color: "#2a1e10", marginBottom: 3 }}>{title}</h4><p style={{ fontSize: 12, color: "#7a6a5a", lineHeight: 1.55 }}>{desc}</p></div>
          ))}
        </div>
      </div>
      <div style={{ background: "#3a5c2a", borderRadius: 16, padding: "28px 20px", textAlign: "center" }}>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(18px,4vw,24px)", color: "#d4e8c4", marginBottom: 5 }}>Ready to give something away?</h3>
        <p style={{ fontFamily: "'Lora',serif", fontSize: 13, color: "#a0c890", marginBottom: 20 }}>It takes under 2 minutes.</p>
        <button style={{ padding: "12px 26px", borderRadius: 40, background: "#d4e8c4", color: "#2a4a1a", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }} onClick={onGive}>＋ Give an item now</button>
      </div>
    </div></div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function GivingTreeApp() {
  const [page, setPage] = useState("browse");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [hoveredItem, setHoveredItem] = useState(null);
  const [savedItems, setSavedItems] = useState(new Set());
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobMenuOpen, setMobMenuOpen] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [editSaveCallback, setEditSaveCallback] = useState(null);
  const animatedPlaceholder = useAnimatedPlaceholder(SEARCH_HINTS);

  useEffect(() => { if (!profileMenuOpen) return; const h = () => setProfileMenuOpen(false); window.addEventListener("click", h); return () => window.removeEventListener("click", h); }, [profileMenuOpen]);
  useEffect(() => { setMobMenuOpen(false); }, [page]);

  const navigate = pg => { if (pg === "give") { setEditingListing(null); setEditSaveCallback(null); } setPage(pg); setMobMenuOpen(false); };
  const handleEditListing = (listing, cb) => { setEditingListing(listing); setEditSaveCallback(() => cb); setPage("give"); };
  const handleSaveEdit = updated => { if (editSaveCallback) editSaveCallback(updated); setEditingListing(null); setEditSaveCallback(null); };
  const toggleSave = (id, e) => { e.stopPropagation(); setSavedItems(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }); };

  const filtered = (() => {
    let list = ITEMS_BASE.filter(item => {
      const matchCat = activeCategory === "All" || item.category === activeCategory;
      const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
    if (sortBy === "newest") list = [...list].sort((a, b) => b.postedMs - a.postedMs);
    if (sortBy === "closest") list = [...list].sort((a, b) => a.distanceNum - b.distanceNum);
    if (sortBy === "requested") list = [...list].sort((a, b) => b.requests - a.requests);
    return list;
  })();

  const NAV_LINKS = [["browse", "Browse"], ["give", "Give an Item"], ["community", "Community"], ["how", "How it Works"]];

  const Nav = () => (
    <nav style={{ position: "sticky", top: 0, zIndex: 200, background: "rgba(250,246,239,0.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid #e8ddd0", width: "100%" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 14px", height: 56, display: "flex", alignItems: "center", gap: 12 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer", flexShrink: 0 }} onClick={() => navigate("browse")}>
          <span style={{ fontSize: 21 }}>🌳</span>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, fontWeight: 600, color: "#3a5c2a", letterSpacing: "-0.5px" }}>giving tree</span>
        </div>
        {/* Desktop links */}
        <div className="hide-mobile" style={{ display: "flex", gap: 18, flex: 1, justifyContent: "center" }}>
          {NAV_LINKS.map(([pg, lbl]) => (
            <span key={pg} style={{ fontSize: 13, fontWeight: 500, color: page === pg ? "#3a5c2a" : "#6b5a4a", cursor: "pointer", paddingBottom: 2, borderBottom: page === pg ? "2px solid #3a5c2a" : "2px solid transparent", whiteSpace: "nowrap" }} onClick={() => navigate(pg)}>{lbl}</span>
          ))}
        </div>
        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 9px", background: "#f0ebe3", borderRadius: 20, border: "1px solid #ddd0c0" }}>
            <span style={{ fontSize: 11 }}>📍</span>
            <span className="hide-mobile" style={{ fontSize: 12, fontWeight: 500, color: "#5a4a3a" }}>Pune, MH</span>
          </div>
          <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 33, height: 33, borderRadius: "50%", background: "#3a5c2a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, cursor: "pointer", userSelect: "none" }} onClick={() => setProfileMenuOpen(o => !o)}>K</div>
            {profileMenuOpen && <ProfileMenu onClose={() => setProfileMenuOpen(false)} onViewProfile={() => navigate("profile")} onViewRequests={() => navigate("requests")} />}
          </div>
          {/* Hamburger */}
          <button className="show-mobile" style={{ display: "none", flexDirection: "column", gap: 4, background: "none", border: "none", cursor: "pointer", padding: "5px", borderRadius: 7 }} onClick={() => setMobMenuOpen(o => !o)}>
            <span style={{ display: "block", width: 21, height: 2, background: mobMenuOpen ? "#3a5c2a" : "#5a4a3a", borderRadius: 2, transition: "transform 0.2s", transform: mobMenuOpen ? "rotate(45deg) translate(4px,4px)" : "none" }} />
            <span style={{ display: "block", width: 21, height: 2, background: mobMenuOpen ? "transparent" : "#5a4a3a", borderRadius: 2 }} />
            <span style={{ display: "block", width: 21, height: 2, background: mobMenuOpen ? "#3a5c2a" : "#5a4a3a", borderRadius: 2, transition: "transform 0.2s", transform: mobMenuOpen ? "rotate(-45deg) translate(4px,-4px)" : "none" }} />
          </button>
        </div>
      </div>
      {/* Mobile dropdown */}
      <div className={`mob-menu${mobMenuOpen ? " open" : ""}`}>
        {[...NAV_LINKS, ["profile", "👤 My Profile"], ["requests", "📬 My Requests"]].map(([pg, lbl]) => (
          <button key={pg} className={`mob-item${page === pg ? " active" : ""}`} onClick={() => navigate(pg)}>{lbl}</button>
        ))}
      </div>
    </nav>
  );

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "#faf6ef", minHeight: "100vh", width: "100%", overflowX: "hidden", color: "#3a2c1e", position: "relative" }}>
      <GlobalStyles />
      {/* Grain texture */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`, opacity: 0.5 }} />
      <Nav />

      {/* ── BROWSE ── */}
      {page === "browse" && (
        <>
          {selectedItem && <ItemDetail item={selectedItem} onClose={() => setSelectedItem(null)} />}
          {/* Hero */}
          <section className="hero-wrap" style={{ position: "relative", padding: "60px 20px 44px", textAlign: "center", background: "linear-gradient(180deg,#f0ebe0 0%,#faf6ef 100%)", borderBottom: "1px solid #e8ddd0", overflow: "hidden", width: "100%" }}>
            <div className="hero-decor" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>{["🌿", "🍃", "🌱"].map((e, i) => <span key={i} style={{ position: "absolute", fontSize: 22, opacity: 0.4, animation: "float 4s ease-in-out infinite", animationDelay: `${i * 0.4}s`, top: `${20 + i * 25}%`, left: `${5 + i * 8}%` }}>{e}</span>)}</div>
            <div style={{ position: "relative", zIndex: 1, maxWidth: 580, margin: "0 auto" }}>
              <p className="hero-eyebrow" style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8a6a4a", marginBottom: 12 }}>Koregaon Park · Aundh · Baner · and around</p>
              <h1 className="hero-title" style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,5vw,50px)", fontWeight: 600, lineHeight: 1.15, color: "#2a1e10", marginBottom: 12 }}>Give what you love.<br /><em style={{ fontStyle: "italic", color: "#3a5c2a" }}>To someone nearby.</em></h1>
              <p className="hero-sub" style={{ fontFamily: "'Lora',serif", fontSize: 15, color: "#6b5a4a", lineHeight: 1.6, marginBottom: 24 }}>Everything here is free. No strings, no shipping — just neighbours helping neighbours.</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", border: `1.5px solid ${searchFocused ? "#3a5c2a" : "#d8cfc4"}`, borderRadius: 40, padding: "10px 16px", boxShadow: searchFocused ? "0 4px 20px rgba(58,92,42,0.16)" : "0 4px 16px rgba(80,50,20,0.09)", maxWidth: 440, margin: "0 auto", transition: "border-color 0.2s,box-shadow 0.2s" }}>
                <span style={{ fontSize: 15, opacity: 0.6, flexShrink: 0 }}>🔍</span>
                <div style={{ flex: 1, position: "relative", height: 22 }}>
                  <input style={{ position: "absolute", inset: 0, width: "100%", border: "none", background: "transparent", fontSize: 14, color: "#3a2c1e", fontFamily: "'DM Sans',sans-serif", zIndex: 2 }} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} />
                  {!searchQuery && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", pointerEvents: "none", zIndex: 1, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden" }}><span style={{ color: "#b0a090" }}>Search for </span><span style={{ color: "#7a6a5a", fontStyle: "italic" }}>{animatedPlaceholder}</span><span style={{ color: "#3a5c2a", animation: "blink 1s step-end infinite" }}>|</span></div>}
                </div>
                {searchQuery && <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#9a8a7a", padding: 0 }} onClick={() => setSearchQuery("")}>✕</button>}
              </div>
            </div>
            <div className="hero-decor" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>{["🍂", "🌾", "🍁"].map((e, i) => <span key={i} style={{ position: "absolute", fontSize: 22, opacity: 0.4, animation: "float 4s ease-in-out infinite", animationDelay: `${i * 0.6 + 0.2}s`, top: `${15 + i * 28}%`, right: `${5 + i * 7}%` }}>{e}</span>)}</div>
          </section>
          {/* Stats */}
          <div className="stats-strip" style={{ display: "flex", justifyContent: "center", gap: 36, padding: "14px 20px", background: "#3a5c2a", width: "100%" }}>
            {[["47", "items available"], ["312", "neighbours giving"], ["1,240", "items rehomed"]].map(([num, label]) => (
              <div key={label} style={{ textAlign: "center" }}><span style={{ display: "block", fontFamily: "'Playfair Display',serif", fontSize: "clamp(16px,4vw,22px)", fontWeight: 600, color: "#d4e8c4" }}>{num}</span><span style={{ fontSize: 10, color: "#a0c890", letterSpacing: "0.04em" }}>{label}</span></div>
            ))}
          </div>
          {/* Main */}
          <main className="browse-main" style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 14px 90px", position: "relative", zIndex: 1 }}>
            <div className="cat-row" style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 20 }}>
              {categories.map(cat => <button key={cat} style={{ padding: "7px 14px", borderRadius: 20, border: activeCategory === cat ? "1.5px solid #3a5c2a" : "1.5px solid #d8cfc4", background: activeCategory === cat ? "#3a5c2a" : "#fff", color: activeCategory === cat ? "#d4e8c4" : "#6b5a4a", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", flexShrink: 0, whiteSpace: "nowrap" }} onClick={() => setActiveCategory(cat)}>{cat}</button>)}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, gap: 8 }}>
              <span style={{ fontFamily: "'Lora',serif", fontSize: 13, color: "#6b5a4a", fontStyle: "italic" }}>{filtered.length} item{filtered.length !== 1 ? "s" : ""} near you</span>
              <select style={{ padding: "6px 11px", borderRadius: 8, border: "1.5px solid #d8cfc4", background: "#fff", fontSize: 12, color: "#3a2c1e", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="newest">Newest first</option><option value="closest">Closest first</option><option value="requested">Most requested</option>
              </select>
            </div>
            <div className="items-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 18 }}>
              {filtered.map((item, i) => (
                <div key={item.id} style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1px solid #ede5d8", cursor: "pointer", transition: "transform 0.25s,box-shadow 0.25s", animation: "fadeUp 0.4s ease forwards", opacity: 0, animationFillMode: "forwards", animationDelay: `${i * 0.07}s`, transform: hoveredItem === item.id ? "translateY(-4px)" : "none", boxShadow: hoveredItem === item.id ? "0 12px 32px rgba(80,50,20,0.17)" : "0 4px 14px rgba(80,50,20,0.08)" }} onMouseEnter={() => setHoveredItem(item.id)} onMouseLeave={() => setHoveredItem(null)} onClick={() => setSelectedItem(item)}>
                  <div style={{ height: 148, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", background: `${item.color}22` }}>
                    <span style={{ fontSize: 58, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.12))" }}>{item.emoji}</span>
                    <button style={{ position: "absolute", top: 9, right: 9, background: "rgba(255,255,255,0.88)", border: "none", borderRadius: "50%", width: 31, height: 31, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: savedItems.has(item.id) ? 21 : 17, color: savedItems.has(item.id) ? "#e05a5a" : "#b8a898" }} onClick={e => toggleSave(item.id, e)}>{savedItems.has(item.id) ? "♥" : "♡"}</button>
                    <span style={{ position: "absolute", bottom: 7, left: 9, background: "rgba(255,255,255,0.88)", backdropFilter: "blur(4px)", padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 600, color: "#5a4a3a" }}>{item.distance}</span>
                  </div>
                  <div style={{ padding: "13px 15px 11px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: conditionColor[item.condition] || "#aaa", flexShrink: 0 }} /><span style={{ fontSize: 10, fontWeight: 600, color: "#5a6a4a", textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.condition}</span><span style={{ color: "#c0b0a0", fontSize: 10 }}>·</span><span style={{ fontSize: 10, color: "#8a7a6a" }}>{item.category}</span></div>
                    <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 600, color: "#2a1e10", marginBottom: 4, lineHeight: 1.25 }}>{item.title}</h3>
                    <p style={{ fontSize: 12, color: "#7a6a5a", lineHeight: 1.55, marginBottom: 9, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.description}</p>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>{item.tags.map(t => <span key={t} style={{ padding: "2px 8px", borderRadius: 20, background: "#f0ebe3", border: "1px solid #e0d5c5", fontSize: 10, color: "#7a6a5a" }}>{t}</span>)}</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 9, borderTop: "1px solid #f0e8dc", gap: 7 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
                        <div style={{ width: 27, height: 27, borderRadius: "50%", background: `${item.color}55`, color: item.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{item.giverInitial}</div>
                        <div style={{ minWidth: 0 }}><div style={{ fontSize: 11, fontWeight: 600, color: "#3a2c1e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.giverName}</div><div style={{ fontSize: 10, color: "#9a8a7a" }}>{item.neighborhood} · {item.postedAgo}</div></div>
                      </div>
                      <button style={{ padding: "7px 12px", borderRadius: 20, background: "#3a5c2a", color: "#d4e8c4", border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", flexShrink: 0 }} onClick={e => { e.stopPropagation(); setSelectedItem(item); }}>I want this</button>
                    </div>
                    {item.requests > 0 && <div style={{ marginTop: 7, fontSize: 10, color: "#8a7a6a", fontStyle: "italic" }}>🙋 {item.requests} {item.requests === 1 ? "person wants" : "people want"} this</div>}
                  </div>
                </div>
              ))}
            </div>
            {filtered.length === 0 && <div style={{ textAlign: "center", padding: "56px 20px" }}><span style={{ fontSize: 44 }}>🌱</span><p style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, color: "#5a4a3a", marginTop: 12, marginBottom: 5 }}>Nothing found{searchQuery ? ` for "${searchQuery}"` : ""}.</p><p style={{ fontSize: 13, color: "#8a7a6a" }}>Try a different search or be the first to give one!</p></div>}
          </main>
          <div style={{ position: "fixed", bottom: 22, right: 18, zIndex: 199 }}>
            <button style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 18px", borderRadius: 40, background: "#3a5c2a", color: "#d4e8c4", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 8px 24px rgba(58,92,42,0.38)" }} onClick={() => navigate("give")}><span style={{ fontSize: 17 }}>＋</span> Give an Item</button>
          </div>
        </>
      )}

      {page === "give" && <GiveItemPage onBack={() => { setEditingListing(null); setEditSaveCallback(null); setPage(editingListing ? "profile" : "browse"); }} prefillData={editingListing} onSaveEdit={handleSaveEdit} />}
      {page === "how" && <HowItWorksPage onBack={() => setPage("browse")} onGive={() => setPage("give")} />}
      {page === "profile" && <><ProfilePage onBack={() => setPage("browse")} savedItems={savedItems} onOpenItem={setSelectedItem} onEditListing={handleEditListing} />{selectedItem && <ItemDetail item={selectedItem} onClose={() => setSelectedItem(null)} />}</>}
      {page === "requests" && <RequestsPage onBack={() => setPage("browse")} />}
      {page === "community" && <CommunityPage onBack={() => setPage("browse")} />}
    </div>
  );
}

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const S = {
  subPage: { width: "100%", minHeight: "calc(100vh - 56px)", fontFamily: "'DM Sans',sans-serif", position: "relative", zIndex: 1 },
  subWrap: { maxWidth: 740, margin: "0 auto", padding: "34px 16px 68px" },
  backBtn: { background: "none", border: "none", color: "#7a6a5a", fontSize: 13, cursor: "pointer", marginBottom: 22, fontFamily: "'DM Sans',sans-serif", padding: 0, display: "block" },
  secTitle: { fontFamily: "'Playfair Display',serif", fontSize: 17, color: "#2a1e10" },
  lbl: { fontSize: 12, fontWeight: 600, color: "#5a4a3a" },
  inp: { padding: "10px 12px", borderRadius: 9, border: "1.5px solid #d8cfc4", background: "#fff", fontSize: 14, color: "#2a1e10", fontFamily: "'DM Sans',sans-serif" },
  submitBtn: { width: "100%", padding: "14px", borderRadius: 40, background: "#3a5c2a", color: "#d4e8c4", border: "none", fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", boxShadow: "0 6px 20px rgba(58,92,42,0.28)", cursor: "pointer", transition: "opacity 0.2s" },
  callBtn: { padding: "8px 14px", borderRadius: 20, background: "#3a5c2a", color: "#d4e8c4", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", display: "inline-flex", alignItems: "center", gap: 4 },
  waBtn: { padding: "8px 14px", borderRadius: 20, background: "#25D366", color: "#fff", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", display: "inline-flex", alignItems: "center", gap: 4 },
  confirmBtn: { padding: "8px 14px", borderRadius: 20, background: "#c8a97a", color: "#fff", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "opacity 0.2s" },
};

const Z = {
  overlay: { position: "fixed", inset: 0, zIndex: 999, background: "rgba(30,20,10,0.58)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-end", justifyContent: "center", animation: "fadeIn 0.2s ease", fontFamily: "'DM Sans',sans-serif" },
  modal: { background: "#faf6ef", width: "100%", maxWidth: 640, maxHeight: "92vh", borderRadius: "20px 20px 0 0", overflow: "hidden", display: "flex", flexDirection: "column", animation: "slideUp 0.3s cubic-bezier(0.34,1.3,0.64,1)", position: "relative" },
  closeBtn: { position: "absolute", top: 13, right: 13, zIndex: 10, background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: 31, height: 31, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 7px rgba(0,0,0,0.11)" },
  hero: { height: 150, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0 },
  heroEmoji: { fontSize: 70, filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.14))" },
  heroBadges: { position: "absolute", bottom: 9, left: 13, display: "flex", gap: 6, flexWrap: "wrap" },
  badge: { padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600 },
  body: { overflowY: "auto", padding: "14px 18px 26px", flex: 1, WebkitOverflowScrolling: "touch" },
  metaRow: { display: "flex", alignItems: "center", gap: 5, marginBottom: 5, flexWrap: "wrap" },
  cat: { fontSize: 10, fontWeight: 600, color: "#8a7a6a", textTransform: "uppercase", letterSpacing: "0.08em" },
  sep: { color: "#c0b0a0", fontSize: 11 },
  nbh: { fontSize: 11, color: "#6b5a4a" },
  time: { fontSize: 11, color: "#9a8a7a" },
  title: { fontFamily: "'Playfair Display',serif", fontSize: "clamp(19px,4vw,23px)", fontWeight: 600, color: "#2a1e10", marginBottom: 12, lineHeight: 1.2 },
  desc: { fontSize: 13, color: "#5a4a3a", lineHeight: 1.7, marginBottom: 12 },
  tagRow: { display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 },
  tag: { padding: "3px 9px", borderRadius: 20, background: "#f0ebe3", border: "1px solid #e0d5c5", fontSize: 11, color: "#7a6a5a" },
  locationNote: { fontSize: 11, color: "#6b5a4a", background: "#f5f0e8", padding: "8px 11px", borderRadius: 9, marginBottom: 11, border: "1px solid #e0d5c5", lineHeight: 1.5 },
  giverCard: { display: "flex", alignItems: "center", gap: 9, padding: "11px 13px", background: "#f5f0e8", borderRadius: 11, marginBottom: 7, border: "1px solid #e8ddd0" },
  giverAv: { width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 },
  contactBtn: { padding: "6px 11px", borderRadius: 20, background: "#3a5c2a", color: "#d4e8c4", border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", flexShrink: 0 },
  contactReveal: { display: "flex", flexDirection: "column", gap: 3, padding: "8px 12px", background: "#eaf5e2", borderRadius: 9, marginBottom: 12, border: "1px solid #c0dca8" },
  textarea: { width: "100%", padding: "10px 12px", borderRadius: 11, border: "1.5px solid #d8cfc4", background: "#fff", fontSize: 13, color: "#2a1e10", fontFamily: "'DM Sans',sans-serif", resize: "vertical" },
  sendBtn: { width: "100%", padding: "13px", borderRadius: 40, background: "#3a5c2a", color: "#d4e8c4", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 4px 14px rgba(58,92,42,0.24)", transition: "opacity 0.2s" },
  sentBox: { display: "flex", alignItems: "center", gap: 13, padding: "16px", background: "#eaf5e2", borderRadius: 12, border: "1px solid #c0dca8", marginTop: 14 },
};

const PM = {
  wrap: { position: "absolute", top: "calc(100% + 7px)", right: 0, background: "#fff", borderRadius: 13, border: "1px solid #e8ddd0", boxShadow: "0 12px 36px rgba(60,40,20,0.15)", width: 214, zIndex: 300, overflow: "hidden", animation: "fadeIn 0.14s ease", fontFamily: "'DM Sans',sans-serif" },
  arrow: { position: "absolute", top: -5, right: 11, width: 10, height: 10, background: "#fff", border: "1px solid #e8ddd0", borderBottom: "none", borderRight: "none", transform: "rotate(45deg)" },
  item: { width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "12px 14px", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", textAlign: "left" },
};

const LM = {
  editBtn: { padding: "4px 10px", borderRadius: 20, background: "#f5f0e8", border: "1px solid #d8cfc4", color: "#5a4a3a", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" },
  card: { padding: "9px", background: "#f8f4ee", borderRadius: 10, border: "1px solid #e8ddd0" },
  cardApproved: { background: "#f0f8ea", border: "1px solid #b8dca0" },
  av: { width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 },
  approvedBadge: { padding: "3px 8px", borderRadius: 20, background: "#d4f0c8", color: "#2a5a1a", fontSize: 10, fontWeight: 600, border: "1px solid #b0dca0", whiteSpace: "nowrap" },
  approveBtn: { padding: "4px 10px", borderRadius: 20, background: "#3a5c2a", color: "#d4e8c4", border: "none", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" },
  manageBtn: { padding: "4px 11px", borderRadius: 20, background: "#3a5c2a", color: "#d4e8c4", border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" },
};

const TW = {
  section: { margin: "0 0 44px", borderRadius: 18, overflow: "hidden", background: "linear-gradient(155deg,#1e3018 0%,#2e4a22 50%,#243820 100%)", boxShadow: "0 20px 56px rgba(20,40,10,0.30)", fontFamily: "'DM Sans',sans-serif", paddingBottom: 6 },
  header: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "28px 36px 0", gap: 12, flexWrap: "wrap" },
  heading: { fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 600, color: "#d4e8c4", marginBottom: 3 },
  subheading: { fontSize: 12, color: "rgba(212,232,196,0.6)" },
  navBtns: { display: "flex", gap: 7, flexShrink: 0, marginTop: 2 },
  navBtn: { width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", color: "#d4e8c4", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 },
  stage: { position: "relative", height: 284, margin: "22px 0 0", overflow: "visible" },
  cardFace: { borderRadius: 16, padding: "22px 22px 18px", height: 264, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" },
  quoteMark: { position: "absolute", top: -8, right: 12, fontFamily: "'Playfair Display',serif", fontSize: 96, color: "rgba(255,255,255,0.05)", lineHeight: 1, pointerEvents: "none", userSelect: "none" },
  quote: { fontFamily: "'Lora',serif", fontSize: 14, lineHeight: 1.68, color: "rgba(255,255,255,0.9)", flex: 1, position: "relative", zIndex: 1, marginBottom: 9 },
  tagPill: { display: "inline-block", fontSize: 10, color: "rgba(212,232,196,0.75)", background: "rgba(255,255,255,0.08)", padding: "3px 9px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.1)", marginBottom: 9, alignSelf: "flex-start" },
  divider: { height: 1, background: "rgba(255,255,255,0.15)", margin: "0 0 9px" },
  personRow: { display: "flex", alignItems: "center", gap: 8 },
  avatar: { borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", border: "2px solid rgba(255,255,255,0.25)", flexShrink: 0 },
  personName: { fontWeight: 700, color: "#d4e8c4", marginBottom: 1 },
  personMeta: { color: "rgba(212,232,196,0.55)" },
  roleChip: { padding: "3px 8px", borderRadius: 20, fontWeight: 600, marginLeft: "auto", flexShrink: 0 },
  starsRow: { display: "flex", alignItems: "center", marginTop: 6 },
  stars: { color: "#f0c060", fontSize: 12, letterSpacing: "1.5px" },
  dotsRow: { display: "flex", justifyContent: "center", gap: 6, padding: "18px 36px 7px", position: "relative", zIndex: 20 },
  dot: { width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.22)", border: "none", cursor: "pointer", padding: 0, transition: "background 0.22s, transform 0.22s" },
  dotActive: { background: "#d4e8c4", transform: "scale(1.5)" },
  timerTrack: { height: 3, background: "rgba(255,255,255,0.1)", margin: "0 36px 22px", borderRadius: 2, overflow: "hidden", position: "relative", zIndex: 20 },
  timerBar: { height: "100%", background: "linear-gradient(90deg,#a0c890,#d4e8c4)", borderRadius: 2, width: 0 },
};