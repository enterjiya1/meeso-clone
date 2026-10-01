# 🛍️ Ethnicora (Meesho-Style Kurtis Store) - Project Documentation
> **પ્રોજેક્ટ વિગતો અને ઉપયોગમાં લેવાયેલ ટેકનોલોજીની સંપૂર્ણ માહિતી (Project Details & Tech Stack)**

---

## 📌 ૧. પ્રોજેક્ટ પરિચય (Project Overview)
**Ethnicora** એ એક અત્યાધુનિક, મોબાઇલ-ફર્સ્ટ (Mobile-First) ઈ-કોમર્સ વેબ એપ્લિકેશન છે, જેને પ્રખ્યાત ભારતીય શોપિંગ એપ **Meesho** ની થીમ, ડિઝાઇન અને યુઝર એક્સપિરિયન્સ મુજબ ખાસ તૈયાર કરવામાં આવી છે.

* **મુખ્ય હેતુ:** મહિલાઓના ટ્રેન્ડિંગ કુર્તી કલેક્શનનું હોલસેલ ભાવે વેચાણ, સુરક્ષિત ડાયરેક્ટ UPI પેમેન્ટ (GPay, PhonePe, Paytm, QR Code), ઓર્ડર ટ્રેકિંગ અને સંપૂર્ણ એડમિન મેનેજમેન્ટ.
* **સ્ટોરનું નામ:** Ethnicora / Meeso
* **સેલર/મર્ચન્ટ:** YUG ENTERPRISE
* **મર્ચન્ટ UPI ID:** `MAB.037326003010052@AXISBANK`

---

## 🛠️ ૨. કઈ કઈ ટેકનોલોજી અને લાઇબ્રેરીઝનો ઉપયોગ થયો છે? (Tech Stack)

આ પ્રોજેક્ટ સંપૂર્ણપણે આધુનિક ફ્રન્ટએન્ડ ટેકનોલોજી સ્ટેક પર બનાવવામાં આવ્યો છે:

### 🔹 ૧. Core Framework & Routing
* **React 19 (`v19.2.8`):** UI કોમ્પોનન્ટ્સ, સ્ટેટ મેનેજમેન્ટ અને હાઇ-પરફોર્મન્સ વર્ચ્યુઅલ DOM રેન્ડરિંગ માટે.
* **React DOM (`v19.2.8`):** બ્રાઉઝર DOM સાથે React નું ઇન્ટિગ્રેશન.
* **React Router DOM (`v7.18.4`):** ક્લાયન્ટ-સાઇડ SPA (Single Page Application) રાઉટિંગ માટે.
  * `/` ➔ હોમપેજ
  * `/kurtis` ➔ કેટલોગ લિસ્ટિંગ પેજ
  * `/kurtis/:id` ➔ પ્રોડક્ટ ડિટેલ પેજ
  * `/cart` ➔ શોપિંગ કાર્ટ પેજ
  * `/checkout` ➔ ચેકઆઉટ પેજ
  * `/admin` ➔ ઓર્ડર અને સ્ટોર એડમિન ડેશબોર્ડ
  * `/wishlist` ➔ વિશલિસ્ટ પેજ

### 🔹 ૨. Build Tools & Bundler
* **Vite (`v8.3.0`):** લાઈટનિંગ-ફાસ્ટ ડેવલપમેન્ટ સર્વર અને ઑપ્ટિમાઇઝ્ડ પ્રોડક્શન બિલ્ડર.
* **@vitejs/plugin-react (`v6.1.1`):** React Fast Refresh અને JSX ટ્રાન્સફોર્મેશન માટે.
* **Oxlint (`v1.81.0`):** હાઇ-સ્પીડ રસ્ટ-બેઝ્ડ કોડ લિન્ટિંગ અને ક્વોલિટી ચેકિંગ.

### 🔹 ૩. Styling & UI Design
* **Tailwind CSS (`v3.4.17`):** મોર્ડન યુટિલિટી-ફર્સ્ટ CSS ફ્રેમવર્ક.
* **PostCSS (`v8.5.28`) & Autoprefixer (`v10.6.1`):** ક્રોસ-બ્રાઉઝર CSS સપોર્ટ માટે.
* **Google Fonts:**
  * *Plus Jakarta Sans:* સ્વચ્છ અને આધુનિક UI ટાઇપોગ્રાફી માટે.
  * *Playfair Display:* પ્રીમિયમ એથનિક લુક અને હેડલાઇન્સ માટે.
* **કલર પેલેટ:** Meesho Signature Magenta (`#931b6e`), Trust Green (`#038d63`), Warm Beige & Slate Grays.

### 🔹 ૪. Icons & Visual Animation
* **Lucide React (`v1.47.0`):** 50+ પ્રોફેશનલ SVG આઇકોન્સ (ShoppingBag, Truck, ShieldCheck, QrCode, Lock, CheckCircle2, Chevron, Clock, વગેરે).
* **Canvas-Confetti (`v1.9.4`):** ઓર્ડર કન્ફર્મ થવા પર સ્ક્રીન પર સેલિબ્રેશન ઇફેક્ટ (પાર્ટિકલ્સ) માટે.

### 🔹 ૫. Dynamic QR Code & Payment Engine
* **qrcode (`v1.5.4`):** બ્રાઉઝરમાં કોઈપણ એક્સટર્નલ API વગર ક્લાયન્ટ-સાઇડ લાઈવ Dynamic NPCI UPI QR Code જનરેટ કરવા માટે.
* **NPCI Deep-Linking Protocol:** Universal `upi://pay` સ્કીમા દ્વારા Google Pay, PhonePe, Paytm અને BHIM એપ્સ સાથે સીધું કનેક્શન.

### 🔹 ૬. State Management & Data Storage
* **React Context API:**
  * `CartContext.jsx` ➔ કાર્ટ આઇટમ્સ અને ક્વાન્ટિટી કંટ્રોલ.
  * `OrderContext.jsx` ➔ નવા ઓર્ડર્સનું કલેક્શન અને સ્ટેટસ મેનેજમેન્ટ.
  * `ToastContext.jsx` ➔ સ્ક્રીન પર નોટિફિકેશન ટોસ્ટ પોપઅપ.
  * `WishlistContext.jsx` ➔ મનપસંદ કુર્તીઓનું વિશલિસ્ટ.
* **Browser LocalStorage:** પેજ રિફ્રેશ થયા પછી પણ કાર્ટ, વિશલિસ્ટ, ઓર્ડર્સ અને એડમિન સેટિંગ્સ સચવાય તે માટે.

### 🔹 ૭. Image Processing & Hosting
* **Sharp (`v0.35.4`):** નોડ સ્ક્રિપ્ટ્સ દ્વારા કેટલોગ ફોટોઝ ઑપ્ટિમાઇઝ કરવા માટે.
* **Cloudflare Tunnel (`cloudflared.exe`):** લોકલ હોસ્ટને ઇન્ટરનેટ પર સુરક્ષિત HTTPS લાઈવ લિંક આપવા માટે HTTP/2 પ્રોટોકોલ સાથે.

---

## 📱 ૩. પ્રોજેક્ટમાં શું શું ફીચર્સ છે? (Detailed Features)

### ૧. Meesho-Style હોમપેજ અને કેટલોગ
* **કેટેગરી કેરોસલ:** Anarkali, Straight Kurti, Cotton, Rayon, Silk, Embroidered કુર્તીઓની કેટેગરીઝ.
* **લાઈવ સર્ચ એન્જિન:** પ્રોડક્ટનું નામ, કલર કે ફેબ્રિક લખતાં જ લાઈવ ફિલ્ટર થાય તેવું સર્ચબાર.
* **મલ્ટી-લેવલ ફિલ્ટર્સ:** ભાવ (Low to High, High to Low), રેટિંગ (4★+), ફેબ્રિક અને કલર મુજબ ફિલ્ટર.
* **Meesho Trust Badges:** "Lowest Price Guaranteed", "Free Delivery", "7 Days Easy Return".

### ૨. પ્રોડક્ટ ડિટેલ પેજ (Product Details)
* **હાઈ-ક્વોલિટી ઇમેજ ગેલેરી:** મલ્ટીપલ એંગલ ફોટોઝ અને ઝૂમ પ્રિવ્યૂ.
* **સાઇઝ સિલેક્ટર:** S, M, L, XL, XXL અને Free Size ના સાઇઝ બટન અને લાઈવ પ્રાઇસિંગ.
* **સેલર પ્રોફાઇલ કાર્ડ:** YUG ENTERPRISE (4.1 ★ રેટિંગ, સુરત ટેક્સટાઈલ હબ).
* **કસ્ટમર રિવ્યૂઝ:** સાચા રેટિંગ્સ, ગ્રાહકોના ફોટોઝ અને રિવ્યૂ કોમેન્ટ્સ.
* **સિમિલર પ્રોડક્ટ્સ સજેશન:** પેજની નીચે મળતી આવતી કુર્તીઓનું લિસ્ટ.

### ૩. સ્માર્ટ ઓનલાઇન પેમેન્ટ સિસ્ટમ (`OnlinePaymentModal.jsx`)
* **1-ટેપ ડાયરેક્ટ UPI App લોન્ચ:**
  ```
  upi://pay?pa=MAB.037326003010052@AXISBANK&pn=YUG%20ENTERPRISE&am=9&cu=INR
  ```
  * Google Pay, PhonePe, Paytm બટન પર ક્લિક કરતાં જ સીધી એપ ખૂલે છે.
* **Dynamic QR Code (100% સક્સેસ - Risk Policy બાયપાસ):**
  * જેમના ફોનમાં GPay બ્રાઉઝર લિંક બ્લોક કરે, તેઓ QR Code સ્કેન કરીને તરત જ ₹9 પેમેન્ટ કરી શકે છે.
  * **"Save QR to Gallery"** બટનથી QR ડાઉનલોડ કરીને GPay/PhonePe સ્કેનરમાં ગેલેરીમાંથી પણ સ્કેન થાય છે.
* **1-ટેપ Copy UPI ID:** `MAB.037326003010052@AXISBANK` ની બાજુમાં Copy બટન આપેલું છે.
* **વેબસાઇટ બેકગ્રાઉન્ડ સેફગાર્ડ (`target="_blank"`):**
  * GPay પર રીડાયરેક્ટ થતી વખતે વેબસાઇટની ટેબ ક્યારેય બંધ કે ડિસ્કનેક્ટ થતી નથી.
* **10-સેકન્ડ Server Keep-Alive Heartbeat:**
  * યુઝર GPay માં હોય ત્યારે પણ સર્વર અને ક્લાઉડફ્લેર ટનલ ચાલુ રહે છે.
* **કડક એન્ટિ-ચીટ વેરિફિકેશન (Strict Bank Verification):**
  * પેમેન્ટ કર્યા વિના "Check Payment Status" દબાવવાથી ખોટો ઓર્ડર કન્ફર્મ થતો નથી, Axis Bank માં પૈસા જમા થયા છે કે નહીં તે ચકાસે છે.

### ૪. લાઈવ ડિલિવરી ટ્રેકિંગ અને ટેક્સ ઇનવોઇસ
* **Delhivery Express 5-સ્ટેજ ટ્રેકર:**
  1. Order Confirmed (સુરત સેન્ટ્રલ લોજિસ્ટિક્સ)
  2. Packed & Ready to Dispatch
  3. Shipped (Delhivery Air Cargo)
  4. Out for Delivery
  5. Delivered (અંદાજિત 4 દિવસમાં ડિલિવરી)
* **AWB ટ્રેકિંગ નંબર:** ઓટો-જનરેટેડ Delhivery AWB નંબર.
* **ટેક્સ ઇનવોઇસ PDF:** જીએસટી નંબર, ઓર્ડર આઈડી, પ્રોડક્ટ ડિટેલ અને પેમેન્ટ બ્રેકડાઉન સાથેનું પ્રિન્ટેબલ/ડાઉનલોડેબલ ઇનવોઇસ (`InvoiceModal.jsx`).

### ૫. એડમિન કંટ્રોલ પેનલ (`/admin`)
* **ડાયનેમિક મર્ચન્ટ UPI અપડેટ:** કોઈપણ સમયે એડમિન પેનલમાંથી સ્ટોરનું રીસીવિંગ UPI ID બદલી શકાય છે.
* **ઓર્ડર મેનેજમેન્ટ લિસ્ટ:** કસ્ટમરનું નામ, ફોન નંબર, સરનામું, પીનકોડ, ચૂકવેલ રકમ અને પેમેન્ટ મોડ લાઈવ દેખાય છે.
* **સ્ટેટસ ફિલ્ટર:** Pending Verification, Accepted, Shipped, Delivered.
* **ઓર્ડર ડિસ્પેચ કંટ્રોલ:** પેમેન્ટ વેરિફાય કરીને ઓર્ડર એક્સેપ્ટ કે કેન્સલ કરી શકાય છે.

---

## 📂 ૪. પ્રોજેક્ટ ફાઈલ સ્ટ્રક્ચર (Project Directory Structure)

```
ethnicora/
├── index.html                     # મુખ્ય HTML5 ટેમ્પલેટ (Google Fonts & Meta tags)
├── package.json                   # પ્રોજેક્ટ ડિપેન્ડન્સીઝ અને સ્ક્રિપ્ટ્સ
├── vite.config.js                 # Vite બિલ્ડ અને સર્વર કન્ફિગરેશન
├── tailwind.config.js             # Tailwind CSS થીમ કસ્ટમાઇઝેશન
├── postcss.config.js              # PostCSS કન્ફિગરેશન
├── cloudflared.exe                # Cloudflare Tunnel એક્ઝિક્યુટેબલ
│
├── dist/                          # પ્રોડક્શન રેડી કમ્પાઈલ થયેલ ફાઈલ્સ (Live Build)
│   ├── index.html
│   ├── 200.html                   # SPA સપોર્ટ માટે ફોલબેક
│   └── assets/                    # મિનિફાઈડ JS & CSS બંડલ્સ
│
├── public/                        # સ્ટેટિક એસેટ્સ (પ્રોડક્ટ ફોટોઝ, આઇકોન્સ)
│   ├── favicon.svg
│   └── *.jpg                      # કુર્તી પ્રોડક્ટ ઇમેજીસ
│
└── src/                           # સોર્સ કોડ
    ├── main.jsx                   # એપ્લિકેશન એન્ટ્રી પોઈન્ટ
    ├── App.jsx                    # મુખ્ય રાઉટિંગ અને લેઆઉટ સ્ટ્રક્ચર
    ├── App.css                    # ગ્લોબલ કસ્ટમ CSS અને એનિમેશન્સ
    │
    ├── components/                # રિયુઝેબલ UI કોમ્પોનન્ટ્સ
    │   ├── common/                # હેડર, નેવબાર, ફૂટર, બ્રાન્ડ આઇકોન્સ
    │   │   ├── AppHeader.jsx      # Meesho સ્ટાઇલ ટોપ સર્ચબાર અને કાર્ટ બેજ
    │   │   ├── Navbar.jsx         # કેટેગરી નેવિગેશન બાર
    │   │   ├── BrandIcons.jsx     # Google Pay, PhonePe, Paytm ના SVG લોગો
    │   │   ├── CartDrawer.jsx     # સ્લાઇડિંગ કાર્ટ ડ્રોઅર
    │   │   └── Footer.jsx         # વિશ્વાસપાત્ર Meesho ફૂટર
    │   │
    │   ├── checkout/              # પેમેન્ટ અને ચેકઆઉટ મોડ્યુલ્સ
    │   │   ├── OnlinePaymentModal.jsx # મુખ્ય પેમેન્ટ મોડલ (UPI, QR, Verification)
    │   │   ├── InvoiceModal.jsx       # ડાઉનલોડેબલ ટેક્સ ઇનવોઇસ
    │   │   └── OrderTrackingModal.jsx # Delhivery લાઈવ ટ્રેકિંગ સ્ટેપર
    │   │
    │   ├── product/               # પ્રોડક્ટ પેજ કોમ્પોનન્ટ્સ
    │   │   ├── ProductCard.jsx    # હોમપેજ કુર્તી કાર્ડ
    │   │   ├── ProductInfo.jsx    # ટાઇટલ, પ્રાઇસ, ડિસ્કાઉન્ટ, રેટિંગ
    │   │   ├── SizeSelector.jsx   # સાઇઝ સિલેક્શન
    │   │   ├── SellerCard.jsx     # YUG ENTERPRISE સેલર માહિતી
    │   │   └── Reviews.jsx        # કસ્ટમર રેટિંગ્સ અને રિવ્યૂઝ
    │   │
    │   └── cart/                  # કાર્ટ સમરી અને આઇટમ્સ
    │
    ├── context/                   # ગ્લોબલ સ્ટેટ પ્રોવાઇડર્સ (React Context)
    │   ├── CartContext.jsx        # કાર્ટ મેનેજમેન્ટ
    │   ├── OrderContext.jsx       # ઓર્ડર ડેટા મેનેજમેન્ટ
    │   ├── ToastContext.jsx       # ટોસ્ટ મેસેજ પોપઅપ
    │   └── WishlistContext.jsx    # વિશલિસ્ટ મેનેજમેન્ટ
    │
    ├── data/                      # પ્રોડક્ટ્સ અને પેમેન્ટ કન્ફિગરેશન
    │   ├── paymentConfig.js       # UPI લિંક, QR Code સ્ટ્રિંગ, વેલિડેશન
    │   └── products.js            # કુર્તી પ્રોડક્ટ્સ ડેટાબેઝ (50+ કુર્તીઓ)
    │
    └── pages/                     # મુખ્ય પેજીસ
        ├── HomePage.jsx           # હોમપેજ
        ├── KurtiListingPage.jsx   # કુર્તી કેટેગરી પેજ
        ├── KurtiDetailPage.jsx    # પ્રોડક્ટ ડીટેલ પેજ
        ├── CartPage.jsx           # કાર્ટ પેજ
        ├── CheckoutPage.jsx       # ચેકઆઉટ પેજ
        └── AdminOrdersPage.jsx    # એડમિન કંટ્રોલ પેનલ
```

---

## 🚀 ૫. પ્રોજેક્ટ રન કરવાની કમાન્ડ્સ (How to Run)

```bash
# ૧. ડિપેન્ડન્સી ઇન્સ્ટોલ કરવા
npm install

# ૨. લોકલ ડેવલપમેન્ટ સર્વર શરૂ કરવા (Port 5173)
npm run dev

# ૩. પ્રોડક્શન બિલ્ડ તૈયાર કરવા
npm run build

# ૪. પ્રોડક્શન પ્રિવ્યૂ સર્વર ચલાવવા
npm run preview -- --host --port 5173

# ૫. ઇન્ટરનેટ પર લાઈવ કરવા માટે Cloudflare ટનલ ચલાવવા
.\cloudflared.exe tunnel --protocol http2 --url http://localhost:5173
```

---

## 🌐 ૬. હાલના લાઈવ એન્ડપોઈન્ટ્સ (Current Live Endpoints)
* 🛒 **લાઈવ સ્ટોર:** [https://granny-percent-librarian-liked.trycloudflare.com](https://granny-percent-librarian-liked.trycloudflare.com)
* ⚙️ **એડમિન પેનલ:** [https://granny-percent-librarian-liked.trycloudflare.com/admin](https://granny-percent-librarian-liked.trycloudflare.com/admin)
* 💳 **સક્રિય મર્ચન્ટ UPI ID:** `MAB.037326003010052@AXISBANK` (YUG ENTERPRISE)
* 🏷️ **ટેસ્ટ કિંમત:** ₹9.00
