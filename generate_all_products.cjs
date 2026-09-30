// Script to generate the complete comprehensive Saree catalog with all products from the CSV
const fs = require('fs');
const path = require('path');

const RAW_ITEMS = [
  {
    handle: "celestia-embroidered-saree",
    title: "Celestia- Embroidered saree (Off white)",
    category: "Kota Saree",
    price: 599,
    mrp: 3500,
    fabric: "Industrial kota chex",
    work: "Embroidery",
    blouse: "Industrial kota chex with embroidery",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/1_b184d52a-1b8b-4e01-ace5-2e9dbd4a2f49.png?v=1769340913",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/2_8e50b4a6-46e1-4b73-8c5f-4740cb9b0cb9.png?v=1769340914",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/3_5e4b24e5-d560-452c-acdb-87b75946bcc8.png?v=1769340914",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/4_acd0850c-4e6f-432c-ad14-8a77639aa2ff.png?v=1769340914"
    ],
    sizes: ["Unstitched Blouse", "32- Non padded", "32- Padded", "34- Non padded", "34- Padded", "36- Non padded"],
    desc: "A drop-from-heaven kind of saree, with a warm tone of off-white shade over industrial kota fabric with exquisite embroidery brings out the most elegant look."
  },
  {
    handle: "mira-pure-viscose-saree-red-copy",
    title: "Mira- pure viscose saree (Red)",
    category: "Viscose Saree",
    price: 589,
    mrp: 2800,
    fabric: "Pure viscose",
    work: "Contemporary Sequins",
    blouse: "Pure viscose with sequins",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/IMG_0043.jpg?v=1769340913",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/IMG_0018.jpg?v=1769340913",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/IMG_0016_16031962-fc92-46d1-bc63-1e587275161b.jpg?v=1769340914",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/IMG_0047.jpg?v=1769340914"
    ],
    sizes: ["Unstitched Blouse", "32- Non padded", "32- Padded", "34- Non padded", "34- Padded", "36- Non padded", "38- Non padded"],
    desc: "Our bestselling viscose with prettiest minimal contemporary sequins work in softest viscose fabric."
  },
  {
    handle: "shreya-semi-organza-saree",
    title: "Shreya - semi organza saree",
    category: "Organza Saree",
    price: 599,
    mrp: 3999,
    fabric: "Semi organza",
    work: "Coded embroidery",
    blouse: "Soft velvet with coded embroidery",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/1_0bf4aef3-1c8b-4a1f-9406-e96bf432f1c8.png?v=1769340911",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/2_26d839af-2849-4885-9ddb-feec25987c49.png?v=1769340911",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/3_2306d202-1486-4147-b27c-e9b6284bdf00.png?v=1769340912",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/4_9d54c050-532a-4cab-a39a-2ae0ad4b0781.png?v=1769340912"
    ],
    sizes: ["Unstiched blouse", "32 padded", "32 non padded", "34 padded", "36 padded", "38 padded"],
    desc: "Muted Champaign gold designer organza saree paired with most sought-after corset blouse in Wine Red."
  },
  {
    handle: "gulabi-satin-organza-saree",
    title: "Gulabi- Satin organza saree (Pink)",
    category: "Organza Saree",
    price: 594,
    mrp: 5850,
    fabric: "Satin organza",
    work: "Multi coded embroidery",
    blouse: "Raw silk",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/1_19e69b7a-eea7-4d2a-8821-833c45dda902.png?v=1769340910",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/4_760eec0d-b5e1-4b49-91c5-025cd6b8c48b.png?v=1769340910",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/3_8985a07a-72c4-4b7d-898f-27efbd021652.png?v=1769340909",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/5_61a6ef3f-d8c7-4413-88fe-e0d0f49d23d0.png?v=1769340910"
    ],
    sizes: ["Unstitched blouse", "32 Non padded", "32 Padded", "34 Non padded", "34 Padded", "36 Non padded"],
    desc: "Light, airy, and effortlessly beautiful featuring intricate coded embroidery that adds a touch of modern artistry."
  },
  {
    handle: "roop-organza-saree-maroon",
    title: "Roop- Organza saree (Maroon)",
    category: "Organza Saree",
    price: 599,
    mrp: 2750,
    fabric: "Semi organza",
    work: "Embroidery",
    blouse: "Banglore silk blouse",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/8_d2d3bb01-2704-4848-a13d-9fed4ac652df.png?v=1769340909",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/9_13de96a9-1c76-467a-8562-303ee7544826.png?v=1769340909",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/10_2bd87dce-c7a0-4c56-8594-1f8080a8f746.png?v=1769340911"
    ],
    sizes: ["Default Title", "Ready to wear", "Stitched blouse"],
    desc: "Must have minimalist organza edition. Closet staple styled with versatility and Bangalore silk blouse."
  },
  {
    handle: "vani-premium-crushed-chinnon",
    title: "Vani - Premium crushed chinnon saree",
    category: "Chinnon Saree",
    price: 599,
    mrp: 5850,
    fabric: "Premium crushed chinnon",
    work: "Zari weaving",
    blouse: "Semi silk",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/1_04ef6384-aefe-4e7b-9aec-a5bf1b96233b.png?v=1769340907",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/2_34553b4a-2fa8-46fd-8bca-21663c44deef.png?v=1769340907",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/3_d7d4f8c8-85b7-4e5e-921d-f2b61ac03d3c.png?v=1769340908",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/4_f9259ebf-ad1c-4602-afa4-b3029766c477.png?v=1769340907"
    ],
    sizes: ["unstitched blouse", "32 padded", "32 non padded", "34 padded", "34 non padded", "36 padded"],
    desc: "Radiant violet chinnon saree paired with Zari weaved blouse gives a blend of traditional elegance and modern comfort."
  },
  {
    handle: "madras-kapi-premium-crushed-chinnon-saree",
    title: "Madras kapi- Premium crushed chinnon saree",
    category: "Chinnon Saree",
    price: 599,
    mrp: 5850,
    fabric: "Premium crushed chinnon",
    work: "Zari weaving",
    blouse: "Semi silk",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/1_456cd3ba-5355-4a9f-9a1d-875d4fa8b819.png?v=1769340906",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/2_00b8b745-894d-4d6b-9ff0-4d2f1ea6c303.png?v=1769340906",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/3_19923a11-bd8e-41b1-b3c1-71ca7590eff6.png?v=1769340906",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/4_51c2adaf-92e0-4259-aff7-508f45aecf57.png?v=1769340906"
    ],
    sizes: ["Unstitched blouse", "32 Non padded", "32 Padded", "34 Non padded", "34 Padded", "36 Non padded"],
    desc: "Colour inspired by a hot brewing cup of madras kapi in softest fabrics. If subtle is an art, this saree is its inspiration."
  },
  {
    handle: "celestia-embroidered-saree-burgundy",
    title: "Celestia- Embroidered saree (Burgundy)",
    category: "Kota Saree",
    price: 589,
    mrp: 3500,
    fabric: "Industrial kota chex",
    work: "Embroidery",
    blouse: "Industrial kota chex with embroidery",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/1_cbc9bf75-298e-41d2-9db7-4ebd0e8f9107.png?v=1769340905",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/2_fc7e4a81-2bf9-4e3d-ba50-0e8137e0f956.png?v=1769340905",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/3_c04b9211-039b-4b77-a4a2-58412cbfd09b.png?v=1769340905",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/4_c44a71c0-0e7c-4709-aeff-2d6675d6c419.png?v=1769340905"
    ],
    sizes: ["Unstitched Blouse", "32- Non padded", "32- Padded", "34- Non padded", "34- Padded", "36- Non padded"],
    desc: "Warm burgundy shade over industrial kota fabric with exquisite embroidery brings out the most elegant look."
  },
  {
    handle: "deepika-pure-viscose-saree-ruby-creme",
    title: "Deepika- Pure viscose saree (Ruby creme)",
    category: "Viscose Saree",
    price: 599,
    mrp: 3500,
    fabric: "Pure viscose chiffon",
    work: "Zari weaving",
    blouse: "Contrast pure viscose",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/1_d29fa830-a04c-43e7-8f5c-6d95b19b7c4e.png?v=1769340904",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/2_28c14b95-9c81-4227-ba56-e5fa9be22942.png?v=1769340904",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/3_568300a8-cfe9-4213-b844-8cc0557ac836.png?v=1769340903",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/4_240d7eee-be21-4413-bde3-11d2c52b2ad9.png?v=1769340904"
    ],
    sizes: ["Unstitched Blouse", "32- Non padded", "32- Padded", "34-Non padded", "34- Padded", "36- Non padded"],
    desc: "Mauve viscose saree with banaras butta weaving brilliantly merges novelle viscose fabric with traditional motifs."
  },
  {
    handle: "nida-designer-soft-semi-tissue-saree",
    title: "Nida Designer - Soft Semi Tissue Saree",
    category: "Tissue Saree",
    price: 599,
    mrp: 6498,
    fabric: "Soft semi tissue",
    work: "Designer Patchwork",
    blouse: "Banaras designer patchwork",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/5_027e703c-56f9-424e-814c-5effee50e3ea.png?v=1769340457",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/3_7237a8d8-5dbb-4298-bf47-652308854230.png?v=1769340457",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/4_61b57530-48bd-4688-9247-7fd440c63dc8.png?v=1769340457",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/6_c18d75a3-d247-4017-8c47-89ec2ce9abec.png?v=1769340457"
    ],
    sizes: ["Unstitched blouse", "32 Non padded", "32 Padded", "34 Non padded", "34 Padded", "36 Non padded"],
    desc: "Soft semi tissue saree paired with authentic Banaras designer patchwork blouse."
  },
  {
    handle: "falak-chiffon-silk-saree",
    title: "Falak - Chiffon Silk Saree",
    category: "Chiffon Silk",
    price: 549,
    mrp: 6498,
    fabric: "Chiffon Silk",
    work: "Industrial Handwork",
    blouse: "Chiffon Silk",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/6_4a708af9-e7b3-4765-bf8b-4ef0a77e29e5.png?v=1769340456",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/5_eca6e23d-5f8e-4933-a743-aaf6fe73fe79.png?v=1769340456",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/4_a7d5648f-1b80-4b4a-9ee1-80f995f6c45f.png?v=1769340456",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/2_b1b82e69-5954-4d59-be31-e902649307b3.png?v=1769340456"
    ],
    sizes: ["Unstitched Blouse", "32 Padded", "32 Non Padded", "34 Padded", "34 Non Padded", "36 Padded"],
    desc: "Crafted in flowy Chiffon Silk with delicate industrial handwork, offering graceful drape."
  },
  {
    handle: "yerin-crushed-stardust-satin",
    title: "Yerin - Crushed Stardust Satin Saree",
    category: "Stardust Satin",
    price: 599,
    mrp: 7798,
    fabric: "Crushed Stardust Satin",
    work: "Handwork sequin wave",
    blouse: "Crushed Stardust Satin",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/1_610a6698-d355-4369-8ba7-8b93b832e418.png?v=1769340455",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/2_f0467b69-396b-4288-af47-b5140acad89f.png?v=1769340455",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/4_ec79bdcc-775b-4b33-9fb4-918d6be4a2dd.png?v=1769340455",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/3_538f1f38-9593-4fb4-92ca-cf7e9c5b0fd9.png?v=1769340455"
    ],
    sizes: ["Unstitched Blouse", "32 Padded", "32 Non Padded", "34 Padded", "36 Padded", "38-42 Padded"],
    desc: "Mauve velvet saree adorned with sequin wave patterns that bring a soft shimmer to every movement."
  },
  {
    handle: "ritvika-crush-chinnon-saree",
    title: "Ritvika - Crush Chinnon Saree",
    category: "Chinnon Saree",
    price: 579,
    mrp: 4875,
    fabric: "Crush Chinnon",
    work: "Lacework and zari work",
    blouse: "Chinnon",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/4_38a13e2b-717b-48e9-9fbd-389f1a3e7ef1.png?v=1769340453",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/3_9bc2754f-5bcb-4684-8d6f-5970999637f5.png?v=1769340454",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/2_098a612b-6ddc-4b61-b437-645c7516a5db.png?v=1769340453",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/1_5733b8df-31d4-4c39-bb38-ec37b7c69c48.png?v=1769340453"
    ],
    sizes: ["Unstitched Blouse", "32 Padded", "32 Non Padded", "34 Padded", "36 Padded"],
    desc: "An ode to classic beauty — maroon embroidered saree with ornate borders for celebrations."
  },
  {
    handle: "indira-german-silk-saree",
    title: "Indira - German silk saree",
    category: "German Silk",
    price: 549,
    mrp: 3248,
    fabric: "German silk",
    work: "Traditional Prints & Border",
    blouse: "German silk",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/1_3a89da0e-df99-4bd4-94fb-6e51b0feca1f.png?v=1769340452",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/6_a3b4969e-6f48-4967-b738-4a9d1b35913b.png?v=1769340452",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/5_01354801-6f50-459f-a1ed-fc37a883c283.png?v=1769340452",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/4_d3512820-7954-4447-8f8e-5873b9e17105.png?v=1769340452"
    ],
    sizes: ["Unstitched blouse", "32 Non padded", "32 Padded", "34 Non padded", "34 Padded"],
    desc: "Exquisite saree features intricate traditional prints, a rich contrasting blouse, and elegant border detailing."
  },
  {
    handle: "nisha-banaras-tissue-silk-saree",
    title: "Nisha - Banaras Tissue Silk Saree",
    category: "Banarasi Saree",
    price: 579,
    mrp: 8775,
    fabric: "Banaras Tissue Silk",
    work: "Weaving and Lace work",
    blouse: "Banaras Tissue Silk with zari butti",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/6_1f73f4d3-5fd7-4ca9-8732-debaa056db0a.png?v=1769340451",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/4_af0df849-3131-41e6-81d9-f92949fcf4b3.png?v=1769340451",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/5_ee793c1b-13d7-4e14-aa5e-bd33b267815c.png?v=1769340451",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/1_53295139-e3c2-40d0-95b6-36c875eb6ee2.png?v=1769340451"
    ],
    sizes: ["Unstitched blouse", "32 Padded", "32 Non Padded", "34 Padded", "34 Non Padded", "36 Padded"],
    desc: "Dusty pink Banarasi saree featuring delicate floral zari weaving and beautifully detailed gold border."
  },
  {
    handle: "ishita-semi-tissue-silk-saree",
    title: "Ishita - Semi Tissue Silk Saree",
    category: "Tissue Saree",
    price: 549,
    mrp: 7148,
    fabric: "Semi Tissue Silk",
    work: "Silver sequin embroidery",
    blouse: "Banaras",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/3_eceff21b-71dc-4ea8-9c79-314b55394d79.png?v=1769340450",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/4_ecd29829-317e-4a89-ab35-3cb1696b0db8.png?v=1769340450",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/5_3fb84062-fa5c-4ef0-b9b9-ee9d42863ec5.png?v=1769340450",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/1_2155674a-d196-425c-9e19-3daf874ef003.png?v=1769340450"
    ],
    sizes: ["Unstitched Blouse", "32 Padded", "32 Non Padded", "34 Padded", "36 Padded"],
    desc: "Luxurious champagne-toned silk saree adorned with delicate silver sequin embroidery."
  },
  {
    handle: "sana-stardust-satin-saree",
    title: "Sana- Stardust Satin Saree",
    category: "Stardust Satin",
    price: 599,
    mrp: 7799,
    fabric: "Stardust Satin",
    work: "Industrial Handwork",
    blouse: "Stardust Satin",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/4_030f1abb-789b-42ee-8642-3e787bc14975.png?v=1769340447",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/6_b0af0a58-6b46-4a25-9a49-075794b98746.png?v=1769340447",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/5_80face1c-0c18-46ff-a39d-25ead3941f41.png?v=1769340449",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/3_8abe1484-2088-48dd-bed1-f64cc1150981.png?v=1769340447"
    ],
    sizes: ["Unstitched Blouse", "32 Padded", "32 Non Padded", "34 Padded", "36 Padded"],
    desc: "Exquisite emerald waves ensemble crafted in rich deep-green fabric with hand-embroidered detailing."
  },
  {
    handle: "nova-stardust-satin-saree",
    title: "Nova - Stardust satin saree",
    category: "Stardust Satin",
    price: 579,
    mrp: 3898,
    fabric: "Stardust satin",
    work: "Industrial handwork",
    blouse: "Stardust satin",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/1_660d513a-4b24-4816-a83c-f2893944fde1.png?v=1769339865"
    ],
    sizes: ["Unstitched blouse", "Pink"],
    desc: "Northern lights inspired saree with dual tone dominance and buttas inspired by star clusters."
  },
  {
    handle: "isha-handwork-saree-purple-sangria",
    title: "Isha Handwork saree- Purple Sangria",
    category: "Chinnon Saree",
    price: 579,
    mrp: 3750,
    fabric: "Soft Chinon",
    work: "Handwork and cutwork",
    blouse: "Plain raw silk",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/1_32503684-5b0f-4402-b38c-420f3e09cf7c.png?v=1769339862",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/2_6e785e46-0856-496e-bf70-6f1ba6eb083e.png?v=1769339864",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/3_c2bcb41d-1a23-4793-a74e-5de215fc6392.png?v=1769339864"
    ],
    sizes: ["Default Title", "Free Size"],
    desc: "Stunning shade of Purple Sangria with delicate handwork and cutwork border."
  },
  {
    handle: "rini-pure-organza-handwork-saree",
    title: "Rini- Pure organza handwork saree",
    category: "Pure Organza",
    price: 589,
    mrp: 9000,
    fabric: "Pure organza",
    work: "Hand work & golden lace",
    blouse: "Pure organza with handwork",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/2_063fb419-b019-4d7f-b607-dc0b80bbd536.png?v=1769339862",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/SP6_0513.jpg?v=1769339863",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/3_53fad0a2-e31d-4b86-b538-58c1ce77a71f.png?v=1769339863",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/SP6_0517.jpg?v=1769339862"
    ],
    sizes: ["Unstiched blouse", "32 padded", "32 non padded", "34 padded", "34 non padded", "36 padded"],
    desc: "Pure organza handwork saree, meticulously handcrafted with golden hand embroidery and lace work."
  },
  {
    handle: "zarin-crushed-fendy-silk-saree",
    title: "Zarin - Crushed fendy silk saree",
    category: "Fendy Silk",
    price: 599,
    mrp: 8448,
    fabric: "Crushed fendy silk",
    work: "Industrial handwork with pearls",
    blouse: "Crushed fendy silk",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/1_fa34ccbe-6e91-451d-a97f-93b0fda5f688.png?v=1769339861",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/2_4e6843d5-7638-4eeb-bbdd-3367c64b598e.png?v=1769339860",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/3_1d59fd9f-b0a5-4395-864e-ccfe626a0f6c.png?v=1769339860"
    ],
    sizes: ["Unstitched blouse", "32 Non padded", "32 Padded", "34 Non padded", "36 Non padded"],
    desc: "Richness of wine red with constellation of pearl and sequin work for grand soirees."
  },
  {
    handle: "nina-handwork-satin-organza-saree",
    title: "Nina- Handwork satin organza saree",
    category: "Organza Saree",
    price: 599,
    mrp: 6500,
    fabric: "Satin organza",
    work: "Modern handwork (6 motifs)",
    blouse: "Satin organza with handwork",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/1_bc20a962-8fbd-4f40-9392-484558f70e44.png?v=1769339859",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/1_c7d7f66b-cd2a-45b3-81dc-123c4d587681.png?v=1769339859",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/2_5d7942a8-785d-4cad-ac1d-b6042b36551b.png?v=1769339859"
    ],
    sizes: ["Unstitched Blouse", "32- Non padded", "32- Padded", "34- Non padded", "36- Non padded"],
    desc: "Bestselling satin organza with intricate modern handwork motifs on an aesthetic champagne canvas."
  },
  {
    handle: "nina-handwork-satin-organza-saree-red",
    title: "Nina- Handwork satin organza Saree (Red)",
    category: "Organza Saree",
    price: 599,
    mrp: 6500,
    fabric: "Satin organza",
    work: "Modern handwork (6 motifs)",
    blouse: "Satin organza with handwork",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/1_fde4997e-cf23-4428-a163-77c9553a1300.png?v=1769339859",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/2_8197976c-82c6-4260-9ee8-39055dbfce91.png?v=1769339857",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/5_1a6adec1-c691-4ce0-8448-b905b941d29b.png?v=1769339858"
    ],
    sizes: ["Unstitched Blouse", "32- Non padded", "32- Padded", "34- Non padded", "36- Non padded"],
    desc: "Red satin organza saree with exquisite handwork motifs giving modern richness with artistic allure."
  },
  {
    handle: "dear-daisy-handwork-organza-saree-blushed",
    title: "Dear Daisy- Handwork organza saree (Blushed)",
    category: "Organza Saree",
    price: 599,
    mrp: 3500,
    fabric: "Semi organza",
    work: "Print, cut bead and sequins handwork",
    blouse: "Raw silk contrast",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/1_0beff284-b89c-4c8b-af69-db217c945311.png?v=1769339856",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/2_438bada7-ebda-4805-affe-20053ca236bb.png?v=1769339856",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/3_7f13747a-1715-463b-8a65-200c4f9c0f4a.png?v=1769339855"
    ],
    sizes: ["Default Title", "Free Size"],
    desc: "Floral organza in blushed pink embellished with aesthetic contemporary cut beads and sequins."
  },
  {
    handle: "mastani-soft-tissue-saree-rose-gold",
    title: "Mastani - Soft tissue saree (Rose Gold)",
    category: "Soft Tissue",
    price: 549,
    mrp: 8848,
    fabric: "Soft tissue",
    work: "Heavy beadwork",
    blouse: "Soft tissue",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/1_e9e6f368-0c93-413a-9e0a-f0fdcc80066b.png?v=1769339854",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/2_d6b08186-65d6-4deb-b16c-2eb5c94a8df7.png?v=1769340454",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/3_3ccca2eb-7be4-4983-b149-134e74132b25.png?v=1769339854"
    ],
    sizes: ["Unstitched blouse", "32 Non padded", "32 Padded", "34 Non padded", "36 Non padded"],
    desc: "Soft Rose gold fabric with royal fall, heavy beadwork border inspired by timeless vintage elegance."
  },
  {
    handle: "rouge-artisanal-handwork-saree",
    title: "Rouge - Artisanal handwork saree",
    category: "Stardust Satin",
    price: 599,
    mrp: 7400,
    fabric: "Stardust satin",
    work: "Artisanal Handwork",
    blouse: "Stardust satin",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/1_f5bd6b75-999b-4475-9dd1-4491ec2609e8.png?v=1769339854",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/2_39412a60-387f-41f8-b7f5-526ef28229b7.png?v=1769339853",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/3_0e130b96-0657-4eac-b14d-78895933f112.png?v=1769339854"
    ],
    sizes: ["Unstitched blouse", "32 Non padded", "32 Padded", "34 Non padded", "36 Non padded"],
    desc: "Blood red saga forged in regal royalty with artisanal handwork and stardust satin luster."
  },
  {
    handle: "mastani-tissue-saree",
    title: "Mastani - Soft tissue saree (Beige)",
    category: "Soft Tissue",
    price: 549,
    mrp: 8848,
    fabric: "Soft tissue",
    work: "Heavy beadwork",
    blouse: "Soft tissue",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/1_b7b1b22e-aee2-4c01-8075-b24cf0b4e1e3.png?v=1769339852",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/2_fbc7af94-98ea-46ad-984d-eefc36283326.png?v=1769339851",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/3_9b65df5f-0ba5-4616-83b4-f78d8ee3545c.png?v=1769339852"
    ],
    sizes: ["Unstitched blouse", "32 Non padded", "32 Padded", "34 Non padded", "36 Non padded"],
    desc: "Soft beige fabric with a royal fall — made for the woman who wears elegance with quiet power."
  },
  {
    handle: "beautiful-crunchy-embroidery-work-saree",
    title: "BEAUTIFUL CRUNCHY EMBROIDERY WORK SAREE",
    category: "Crunchy Saree",
    price: 569,
    mrp: 3800,
    fabric: "Premium Quality Crunchy Designer Saree",
    work: "Beautiful Embroidery C-Pallu",
    blouse: "Running Embroidery work Blouse",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/beautiful-crunchy-embroidery-work-saree-1045_1.webp?v=1767421899",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/beautiful-crunchy-embroidery-work-saree-5256_1.webp?v=1767421899",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/beautiful-crunchy-embroidery-work-saree-5814_1.webp?v=1767421899",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/beautiful-crunchy-embroidery-work-saree-5900_1.webp?v=1767421899"
    ],
    sizes: ["Pink", "Purple", "Multicolor", "Floral"],
    desc: "Beautiful Premium Quality Crunchy Designer Saree with embroidery C-Pallu and running embroidered blouse."
  },
  {
    handle: "dn-3832-crunchy-embroidery-work-saree",
    title: "DN 3832 CRUNCHY EMBROIDERY WORK SAREE",
    category: "Crunchy Saree",
    price: 569,
    mrp: 3800,
    fabric: "Crunchy Silk",
    work: "Multi Color Zari Embroidery With Cut Work",
    blouse: "Running With Work",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/dn-3832-crunchy-embroidery-work-saree-3568.webp?v=1767421720",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/dn-3832-crunchy-embroidery-work-saree-4905.webp?v=1767421720",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/dn-3832-crunchy-embroidery-work-saree-6225.webp?v=1767421720",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/dn-3832-crunchy-embroidery-work-saree-7893.webp?v=1767421720"
    ],
    sizes: ["Green", "Red", "Yellow", "Blue"],
    desc: "Fancy multi color zari embroidery with delicate cut work and matching embroidered blouse."
  },
  {
    handle: "latest-soft-crunchy-embroidery-work-saree",
    title: "LATEST SOFT CRUNCHY EMBROIDERY WORK SAREE",
    category: "Crunchy Saree",
    price: 569,
    mrp: 3800,
    fabric: "Soft Crunchy Silk",
    work: "Embroidery With Stone Work All Over",
    blouse: "Contrast Embroidery Work Blouse",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/latest-soft-crunchy-embroidery-work-saree-2-5772.webp?v=1767421523",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/latest-soft-crunchy-embroidery-work-saree-2-1054.webp?v=1767421523",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/latest-soft-crunchy-embroidery-work-saree-2-3498.webp?v=1767421523"
    ],
    sizes: ["Red", "Blue", "Green"],
    desc: "Soft crunchy fabric with all-over stone and embroidery work with contrasting embroidered blouse."
  },
  {
    handle: "preeti-soft-crunch-pearl-work-designer-saree",
    title: "PREETI SOFT CRUNCH PEARL WORK DESIGNER SAREE",
    category: "Crunchy Saree",
    price: 569,
    mrp: 4200,
    fabric: "Premium Heavy Soft Crunch",
    work: "Handwork Cutt Dana & Moti Flowers",
    blouse: "Pearl Work Heavy Stitched Blouse (38 to 42)",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/preeti-soft-crunch-pearl-work-designer-saree-675.webp?v=1767421361",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/preeti-soft-crunch-pearl-work-designer-saree-7190.webp?v=1767421361",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/preeti-soft-crunch-pearl-work-designer-saree-7705.webp?v=1767421361"
    ],
    sizes: ["Red", "Black", "Blue"],
    desc: "Heavy soft crunch saree with fully handwork cut dana and moti flowers border and ready stitched blouse."
  },
  {
    handle: "space-silk-with-sequence-emrodairy-saree",
    title: "SPACE SILK WITH SEQUENCE EMRODAIRY SAREE",
    category: "Space Silk",
    price: 529,
    mrp: 3500,
    fabric: "Space Silk",
    work: "Sequence Embroidery",
    blouse: "Full Stitched Worked Blouse (up to 42)",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/space-silk-with-sequence-emrodairy-saree-878.webp?v=1767421094",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/space-silk-with-sequence-emrodairy-saree-1731.webp?v=1767421094",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/space-silk-with-sequence-emrodairy-saree-5182.webp?v=1767421094",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/space-silk-with-sequence-emrodairy-saree-5856.webp?v=1767421094"
    ],
    sizes: ["Floral", "Green", "Pink", "Red"],
    desc: "Space Silk Saree with sequence embroidery and full stitched worked blouse up to size 42."
  },
  {
    handle: "pure-crunchy-embroidery-work-saree",
    title: "PURE CRUNCHY EMBROIDERY WORK SAREE",
    category: "Crunchy Saree",
    price: 529,
    mrp: 3200,
    fabric: "Pure Soft Crunchy",
    work: "C Pallu With Siroski Work All Over",
    blouse: "Running Embroidery Blouse",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/pure-crunchy-embroidery-work-saree-4309.webp?v=1767420887",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/pure-crunchy-embroidery-work-saree-4608.webp?v=1767420888",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/pure-crunchy-embroidery-work-saree-6714.webp?v=1767420887"
    ],
    sizes: ["Red", "Green", "Blue"],
    desc: "Pure soft crunchy saree with embroidery work, C-pallu, and sparkling siroski work throughout."
  },
  {
    handle: "thasta-heavy-resham-badla-jari-embroidery-saree",
    title: "THASTA HEAVY RESHAM BADLA JARI EMBROIDERY SAREE",
    category: "Net Saree",
    price: 569,
    mrp: 4500,
    fabric: "Net with Satin Inner",
    work: "Resham & Badla Jari With Zarkan Diamond",
    blouse: "Heavy Worked Net Blouse",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/thasta-heavy-resham-badla-jari-embroidery-saree-1716.webp?v=1767420128",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/thasta-heavy-resham-badla-jari-embroidery-saree-1950.webp?v=1767420128",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/thasta-heavy-resham-badla-jari-embroidery-saree-4403.webp?v=1767420129"
    ],
    sizes: ["Blue", "White", "Red"],
    desc: "Heavy resham and badla jari embroidery work with zarkan diamond embellishments."
  },
  {
    handle: "pure-soft-embroidery-saree",
    title: "PURE SOFT EMBROIDERY SAREE",
    category: "Soft Silk",
    price: 569,
    mrp: 3500,
    fabric: "Pure Soft Silk",
    work: "Fine Embroidery Work",
    blouse: "Matching Embroidery Blouse",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/pure-soft-embroidery-saree-2623.webp?v=1767419911",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/pure-soft-embroidery-saree-7071.webp?v=1767419911",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/pure-soft-embroidery-saree-9519.webp?v=1767419911"
    ],
    sizes: ["Purple", "White", "Geometric"],
    desc: "Pure soft saree with clean embroidery work and matching embroidered blouse piece."
  },
  {
    handle: "heavy-soft-crushed-cotton-cord-set",
    title: "Heavy Soft Crushed Cotton Cord-Set",
    category: "Cord Set",
    price: 1299,
    mrp: 2999,
    fabric: "Crushed Premium Cotton",
    work: "Ruched loungewear ensemble",
    blouse: "Drawstring top with elastic pants",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/1_fa34ccbe-6e91-451d-a97f-93b0fda5f688.png?v=1769339861"
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    desc: "Two-piece ensemble perfect for lounging in style with drawstring custom fit and elastic pants."
  },
  {
    handle: "neera-saree",
    title: "Neera Saree (Soft Georgette)",
    category: "Georgette Saree",
    price: 569,
    mrp: 3650,
    fabric: "Soft Georgette",
    work: "Floral gold foil handbrush print",
    blouse: "Contrast Art Silk blouse",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/A3118595-2687-4D0A-ABFF-AC6313B17B53.jpg?v=1763570733",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/B934ECBF-D00F-4D2C-AA73-298E08D2A04E.jpg?v=1763570733",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/3392D2F9-41CF-4BDA-8714-49F093DCF8B2.jpg?v=1763570733"
    ],
    sizes: ["Free Size / Unstitched", "Stitched Blouse"],
    desc: "Luxurious Neera saree made of Soft Georgette with gold foil handbrush print and stone-cutwork border."
  },
  {
    handle: "arunima-saree",
    title: "Kusha Embellished Saree (Arunima Premium Cotton)",
    category: "Cotton Saree",
    price: 599,
    mrp: 3650,
    fabric: "Premium Cotton",
    work: "Delicate golden border",
    blouse: "Contrast blouse piece",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/4495E48A-915D-417A-9E3D-0A4E8860FD8D.jpg?v=1763570731",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/484E6087-9300-407E-B397-BDB51926F2F0.jpg?v=1763570732",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/83AC7B11-5134-47CA-B797-56915F8600AD.jpg?v=1763570732"
    ],
    sizes: ["Free Size", "With Stitched Blouse"],
    desc: "Exclusive premium Arunima Saree made with lightweight premium cotton fabric and golden border."
  },
  {
    handle: "kusha-embellished-saree",
    title: "Kusha Embellished Saree (Space Silk)",
    category: "Space Silk",
    price: 569,
    mrp: 3799,
    fabric: "Pure soft space silk",
    work: "Bead and sequin work",
    blouse: "Fully beaded blouse",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/B0AAC690-A384-49AB-87CA-DCA62CC4C07A.jpg?v=1763570732",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/662F42AA-CB16-46DF-8DB7-084833F01BF8.jpg?v=1763570732",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/28EFBE75-EDD9-4896-9B81-DC9235C5C38A.jpg?v=1763570732",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/8A4B61C2-FEFC-493A-90BC-AF63388C37EB.jpg?v=1763570732"
    ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    desc: "Made of pure soft space silk with intricate bead and sequin work and fully beaded blouse."
  },
  {
    handle: "titli-tissue-saree",
    title: "Titli Tissue Saree (Candy Crush)",
    category: "Tissue Saree",
    price: 569,
    mrp: 6499,
    fabric: "Sleek tissue silk",
    work: "Handwork detailing",
    blouse: "Handworked Candy Crush blouse",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/B9DA94C4-3A14-4B10-A14D-718F18C49765.jpg?v=1763570730",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/582A2FB6-1F19-44CA-80A7-2F9FB7329219.jpg?v=1763570730",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/6B4EA593-3A21-4256-93A4-1EB2F2E8860F.jpg?v=1763570730"
    ],
    sizes: ["Deep pink", "Blue", "Teal green", "Orange", "Light Yellow", "Lavender"],
    desc: "Candy Crush Tissue Saree with sleek silk fabric and fully handworked matching blouse."
  },
  {
    handle: "gul-bahar-tissue-saree",
    title: "Gul Bahar Saree",
    category: "Tussar Silk",
    price: 569,
    mrp: 4599,
    fabric: "Premium tussar silk",
    work: "Weaving butties & scalloped coding",
    blouse: "Stitched digital blouse with multi-sequence",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/CADA95A5-BB02-4EFC-8633-A52FB3E4634D.jpg?v=1763570730",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/B9B752DE-D271-4DB4-97EE-76EFB89A5A46.jpg?v=1763570730",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/5997A700-4FB5-4D60-B114-1FEE45898865.jpg?v=1763570730"
    ],
    sizes: ["Ready blouse upto size 42", "Unstitched option"],
    desc: "Premium tussar silk saree with weaving butties and scalloped coding, including designer tassels."
  },
  {
    handle: "faiza-tissue-saree",
    title: "Faiza Tissue Saree",
    category: "Tissue Saree",
    price: 569,
    mrp: 4599,
    fabric: "Premium tissue silk",
    work: "Multi-coloured sequence work & scallops",
    blouse: "Designer contrast satin print blouse",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/3A458393-7B6E-4393-9949-3957146F19D7.jpg?v=1763570729",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/1441D4C7-FA31-44AF-8AAE-695C1EEAC431.jpg?v=1763570729",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/CD013C15-C9C6-49B9-ACA6-4848DDE6E612.jpg?v=1763570729"
    ],
    sizes: ["Ready blouse upto 42", "Unstitched option"],
    desc: "Intricate coding and multi-coloured sequence work with scalloped borders on either side."
  },
  {
    handle: "simran-banarasi-silk-saree",
    title: "Surya Banarasi Silk Saree",
    category: "Banarasi Silk",
    price: 569,
    mrp: 5999,
    fabric: "Banarasi Tissue Silk",
    work: "Dual lace work with brocade body",
    blouse: "Contrast pallu and blouse piece",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/32EBE53E-C168-4D16-B875-FC5F6AE6012E.jpg?v=1763570728",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/F8E9473B-D3BB-4DA2-AAEB-5E25E986ACFE.jpg?v=1763570729",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/40315E06-5FBA-4759-98F1-726949B4A068.jpg?v=1763570728"
    ],
    sizes: ["Unstitched Blouse", "Stitched 38", "Stitched 40", "Stitched 42"],
    desc: "Meticulously crafted with Banarasi Tissue Silk, boasting dual lace work and rich brocade body."
  },
  {
    handle: "nida-banarasi-silk-saree",
    title: "Nida Banarasi Silk Saree",
    category: "Banarasi Silk",
    price: 569,
    mrp: 5999,
    fabric: "Banarasi Kanchipuram Silk",
    work: "Exquisite dual lace work",
    blouse: "Contrast pallu and blouse piece",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/445D8161-0878-4DA1-BE40-FA503C495BE8.jpg?v=1763570726",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/EB1FD8CC-5AB7-4BF0-A4FC-957E6C3A073B.jpg?v=1763570726",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/C01A0608-4063-4693-B066-F0C9B0B11433.jpg?v=1763570726"
    ],
    sizes: ["Unstitched", "Stitched 38", "Stitched 40", "Stitched 42"],
    desc: "Brocade body with dual lace work and sophisticated contrast pallu for grand occasions."
  },
  {
    handle: "rutvi-banarasi-silk-saree",
    title: "Rutvi Banarasi Silk Saree",
    category: "Banarasi Silk",
    price: 569,
    mrp: 5999,
    fabric: "Bridal Waskat Tissue Banarasi Silk",
    work: "Brocade body & diamond lace border",
    blouse: "Designer pallu and blouse piece",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/C7CAE3B2-481A-4DF8-A41B-FCA1C450F0CE.jpg?v=1763570725",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/953B9D22-D06E-429A-9566-BDEA6060D314.jpg?v=1763570725",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/F6106449-50CC-415A-BBBE-A670DCBCAEA9.jpg?v=1763570725"
    ],
    sizes: ["Unstitched Blouse", "Stitched Blouse 38", "Stitched Blouse 40"],
    desc: "Crafted by experienced hands from bridal Waskat Tissue Banarasi Silk with delicate diamond lace border."
  },
  {
    handle: "aaruni-banarasi-silk-saree",
    title: "Aaruni Banarasi Silk Saree",
    category: "Banarasi Silk",
    price: 569,
    mrp: 5999,
    fabric: "Kanjivaram bridal Waskat Tissue",
    work: "Exquisite brocade & diamond lace border",
    blouse: "Designer pallu and blouse piece",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/6FD22633-B187-474A-BED4-A2FE2BFA6579.jpg?v=1763570724",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/BCE6BDA5-96AE-4AE5-B7ED-06ADFAEB7707.jpg?v=1763570724",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/CB007D63-6249-41EF-9B53-07F7EAD13791.jpg?v=1763570724"
    ],
    sizes: ["Unstitched Blouse", "Stitched Blouse"],
    desc: "Finest Kanjivaram bridal Waskat Tissue Banarasi Silk with exquisite brocade body and diamond lace border."
  },
  {
    handle: "cinderella-pre-draped",
    title: "Cinderella (Pre-Draped 1-Minute Saree)",
    category: "Pre-Draped Saree",
    price: 599,
    mrp: 4599,
    fabric: "Crape silk",
    work: "Coded sequences and intricate pearls",
    blouse: "Fully stitched sequences and pearls",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/53D38751-498E-47B9-8A1A-A210C398A863.jpg?v=1763570682",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/D62DAB04-B058-4C6A-AAFC-E766BDF9977D.jpg?v=1763570682",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/32A2D89D-C70B-4042-B75F-86BDB603299C.jpg?v=1763570682",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/1703FE2B-26CF-4F6A-A91F-86682BE363EE.jpg?v=1763570682"
    ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    desc: "Effortless and quick draping in under a minute with crape silk, pearl work, and sequence blouse."
  },
  {
    handle: "cherry-embellished-saree",
    title: "Cherry Embellished Saree (Pearls & Silk)",
    category: "Space Silk",
    price: 569,
    mrp: 6999,
    fabric: "Soft space silk",
    work: "Handcrafted pearls and border",
    blouse: "Stitched blouse with pearls and silver",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/80EC7146-ED21-4190-9B5D-C1DFD9CF05AA.jpg?v=1763570676",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/2252570C-ABC5-4116-952F-AC0DC408F065.jpg?v=1763570676",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/3E6FCAFC-262A-4795-9A9D-7A1D80F6E43B.jpg?v=1763570677"
    ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    desc: "Soft space silk adorned with handcrafted pearls throughout the entire length and borders."
  },
  {
    handle: "zareen-patola-saree",
    title: "Zareen Patola Saree (Lucknowi Georgette)",
    category: "Patola Saree",
    price: 569,
    mrp: 3650,
    fabric: "Georgette",
    work: "Lucknow work with ikkat border",
    blouse: "Printed blouse with foil border",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/05447584-5A18-49B1-9CA3-FA5E2F45D460.jpg?v=1763570666",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/2C96252D-DFC9-4415-B996-2E7564DDADCE.jpg?v=1763570666",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/84CF4F2D-380B-435D-94AC-7CD41207A5D1.jpg?v=1763570667"
    ],
    sizes: ["Ivory", "Yellow", "Lavender", "Pink", "Powder blue", "Deep green"],
    desc: "Exquisite Lucknow work with ikkat border and luxurious Patola pallu with handwoven tassels."
  },
  {
    handle: "surkh-laal-embellised-saree-pre-draped",
    title: "Surkh Laal Embellised Saree (Pre-Draped)",
    category: "Pre-Draped Saree",
    price: 569,
    mrp: 4599,
    fabric: "Finest crape silk",
    work: "Pearl embellishments on border",
    blouse: "Sequins embroidered stitched blouse",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/60AC576D-8B5F-4CA1-A640-2B1FD1B2D76C.jpg?v=1763570642",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/ADF33D34-BE6D-4FC7-9607-D8B88C4BE0A0.jpg?v=1763570642",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/F9DA4BC3-CEC3-430B-89DD-3751021B2BF6.jpg?v=1763570642"
    ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    desc: "Pre-draped Surkh Laal saree allows dressing in under a minute with finest crape silk and pearls."
  },
  {
    handle: "pearls-on-petals-saree",
    title: "Pearls on Petals Saree",
    category: "Space Silk",
    price: 569,
    mrp: 6499,
    fabric: "Space silk",
    work: "Intricate handiwork of pearls and Khatli",
    blouse: "Banglori silk stitched blouse",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/9C51CCC6-6D98-4949-A59F-95A9A2201F96.jpg?v=1763570595",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/D02E3737-1E1B-4718-A1D8-6C3D65BCE7CA.jpg?v=1763570595",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/3120924A-72B3-484F-950A-96A85872F3CD.jpg?v=1763570595"
    ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    desc: "Unique saree adorned with intricate pearls and Khatli designs, accompanied by a stitched blouse."
  },
  {
    handle: "padmaja-silk-saree",
    title: "Padmaja Silk Saree",
    category: "Banarasi Saree",
    price: 569,
    mrp: 5999,
    fabric: "Banarasi Pattu",
    work: "Sequence multi viscose thread work",
    blouse: "Unstitched/Stitched blouse piece",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/06C0DAFC-0C29-4882-8499-D5086C3706E4.jpg?v=1763570582",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/EC5A0CE1-4DD5-414B-B97A-2FDCA7CC4D16.jpg?v=1763570582",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/1C731A0E-5E64-4AA3-A0B1-E5401253D905.jpg?v=1763570582"
    ],
    sizes: ["Unstitched Blouse", "Stitched 38", "Stitched 40", "Stitched 42"],
    desc: "Banarasi Pattu Saree boasting a stunning lace designer border on both sides with designer tassels."
  },
  {
    handle: "panchi-gulabi-saree",
    title: "Panchi Gulabi Chiffon Saree",
    category: "Chiffon Saree",
    price: 569,
    mrp: 3650,
    fabric: "Soft Chiffon",
    work: "Swarovski stone studded with Cut Dana",
    blouse: "Matching worked blouse piece",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/9A918CC5-B627-4901-8A91-5FC008BEB0BB_d21bcb99-a0ef-4bd5-8927-8060bc29da7d.jpg?v=1763570630",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/AEDD4E84-B80C-424E-BF75-367A1EDBF615_0f44fc37-837b-4337-8d0f-81940d3348a6.jpg?v=1763570631",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/3B1CE266-8C45-4940-930C-422469D0D4C0_ac9f353d-ac63-4ca3-80b1-4a520287c098.jpg?v=1763570631"
    ],
    sizes: ["Free Size / Unstitched", "Stitched 38", "Stitched 40", "Stitched 42"],
    desc: "Swarovski stone studded soft chiffon saree with cut Dana embellishments and scalloped edges."
  },
  {
    handle: "swarna-mrig-banarasi-saree",
    title: "Swarna Mrig banarasi saree",
    category: "Banarasi Saree",
    price: 599,
    mrp: 3999,
    fabric: "Banarasi Tissue",
    work: "Gold and Silver Zari Deer Weaving",
    blouse: "Jaquard Weaving blouse piece",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/D31D31F2-8321-4C95-97EE-2E1B79EFADC6.jpg?v=1763570580",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/14D897F1-EB53-4891-AF48-F6B2551A4771.jpg?v=1763570580",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/611DD164-F7CD-4390-9E34-7C4359FE6A34.jpg?v=1763570580"
    ],
    sizes: ["Light Yellow", "Pink", "Yellow", "Soft green"],
    desc: "Intricate Gold and Silver Zari Deer Weaving throughout, adorned with rich Cotton Tassels."
  },
  {
    handle: "pearls-on-lavender-saree",
    title: "Pearls on Lavender Tabi Silk Saree",
    category: "Tabi Silk",
    price: 569,
    mrp: 6499,
    fabric: "Tabi silk",
    work: "Pearl and Khatli handiwork",
    blouse: "Banglori silk stitched blouse",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/1FA93F3C-332A-4260-B330-F3E4DF175D87.jpg?v=1763570593",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/43936688-BCFC-49E4-8BF2-FB2D9AD34E7E.jpg?v=1763570593",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/535FA0C1-DDBD-4770-ACDF-4347B76951A1.jpg?v=1763570593"
    ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    desc: "Adorned with intricate handiwork of pearls and Khatli designs on soft smooth Tabi silk."
  },
  {
    handle: "the-regalia-green-saree",
    title: "The Regalia Green Saree (Mirror Work)",
    category: "Banarasi Saree",
    price: 569,
    mrp: 4599,
    fabric: "Pure Banarasi tissue",
    work: "Delicate handcrafted mirror work",
    blouse: "Heavy worked embroidered blouse",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/IMG-20250312-WA0028.jpg?v=1763570592",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/IMG-20250312-WA0027.jpg?v=1763570590"
    ],
    sizes: ["Free Size / Unstitched", "Stitched 38", "Stitched 40", "Stitched 42"],
    desc: "Exquisite Banarasi tissue saree with delicate handcrafted mirror work."
  },
  {
    handle: "kalindi-kalamkari-saree",
    title: "Kalindi Kalamkari Saree",
    category: "Kalamkari Saree",
    price: 569,
    mrp: 3999,
    fabric: "Soft crape silk",
    work: "Digital print with lace & sequence",
    blouse: "Banglori satin silk with coding",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/IMG-20250318-WA0091.jpg?v=1763570609",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/IMG-20250318-WA0088.jpg?v=1763570608",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/IMG-20250318-WA0090.jpg?v=1763570609"
    ],
    sizes: ["Wine", "Deep green"],
    desc: "Soft crape silk with stunning digital print, exquisite lace detailing, and delicate sequence work."
  },
  {
    handle: "gold-flowers-on-pink",
    title: "Gold flowers On Purple Saree",
    category: "Tabi Silk",
    price: 569,
    mrp: 6499,
    fabric: "Tabi silk",
    work: "Pearl, sequins, and Khatli handwork",
    blouse: "Embellished with pearls",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/IMG-20250318-WA0123.jpg?v=1763570607",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/IMG-20250318-WA0126.jpg?v=1763570608",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/IMG-20250318-WA0125.jpg?v=1763570608"
    ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    desc: "Smooth and soft premium collection made of tabi silk featuring intricate gold flowers and pearls."
  },
  {
    handle: "stars-on-purple-saree",
    title: "Stars on Purple Saree",
    category: "Tabi Silk",
    price: 569,
    mrp: 6499,
    fabric: "Tabi silk",
    work: "Pearl and Khatli handwork",
    blouse: "Stitched Blouse with pearls",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/CE32D023-3BBF-40B4-9E8D-2391CA233224.jpg?v=1763570601",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/BD202C7E-E842-4333-97E1-30CC4D2402C9.jpg?v=1763570601"
    ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    desc: "Crafted with intricate handwork including pearl and Khatli details with stitched worked blouse."
  },
  {
    handle: "stars-on-mustard-saree",
    title: "Stars on Mustard Saree",
    category: "Tabi Silk",
    price: 569,
    mrp: 6499,
    fabric: "Tabi silk",
    work: "Pearl and Khatli handwork",
    blouse: "Stitched Blouse",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/DDA21F27-D3ED-48AB-9130-9D1D5473D86A.jpg?v=1763570600",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/24F513E3-5883-41E9-8FDE-CC2518489811.jpg?v=1763570600"
    ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    desc: "Masterpiece in festive mustard with pearls and Khatli details, accompanied by stitched blouse."
  },
  {
    handle: "reba-embroidered-saree",
    title: "Reba Embroidered Saree",
    category: "Georgette Saree",
    price: 569,
    mrp: 2999,
    fabric: "Satin georgette silk",
    work: "Wildflowers motif with scallop edging",
    blouse: "Contrast embroidered blouse piece",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/DE89C462-ACB1-4343-AD25-0AEC0956A4F7.jpg?v=1763570575",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/4391B3D0-0DA1-4CA3-A2E0-1698B5E8CF08.jpg?v=1763570574",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/F28A1530-2373-4C9A-A36F-6DB32436F69D.jpg?v=1763570575"
    ],
    sizes: ["Wine", "Maroon", "Teal blue", "Dark Green"],
    desc: "Wildflowers motif embroidered satin georgette silk saree with embroidered scallop edging."
  },
  {
    handle: "sequinned-asmaani-saree",
    title: "Sequinned Asmaani Saree",
    category: "Net Saree",
    price: 569,
    mrp: 2899,
    fabric: "Premium semi net",
    work: "Gold sequins with silver lining",
    blouse: "Matching blouse (free size up to 42)",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/42A85BA3-FEA8-439E-985B-428A6E4CA93E.jpg?v=1763570573",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/2FE48588-7073-4A6F-8254-C0C84FCF5951.jpg?v=1763570573",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/1B0D1AF7-2792-48F0-9F20-0ACD6EBA3FFA.jpg?v=1763570573"
    ],
    sizes: ["Free size up to 42", "Unstitched"],
    desc: "Soft powder blue saree boasting dazzling gold sequins with silver lining and elegant edging."
  },
  {
    handle: "sequinned-henna-saree",
    title: "Sequinned Henna Saree",
    category: "Net Saree",
    price: 569,
    mrp: 2899,
    fabric: "Premium semi net",
    work: "Gold sequins with silver lining",
    blouse: "Matching blouse (free size up to 42)",
    images: [
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/34C03963-FC38-4143-9D3C-B9D1A32A0C75.jpg?v=1763570571",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/124D6B93-0868-4CAC-8677-1B0C13564034.jpg?v=1763570572",
      "https://cdn.shopify.com/s/files/1/0984/7989/8907/files/5F016C16-58F1-46BD-BFEE-D8994B3648F0.jpg?v=1763570571"
    ],
    sizes: ["Free size up to 42", "Unstitched"],
    desc: "Soft henna green saree boasting a dazzling display of gold sequins and elegant edging."
  }
];

// Map into rich PRODUCTS array
const products = RAW_ITEMS.map((item, index) => {
  const id = index + 1;
  const discount = Math.round(((item.mrp - item.price) / item.mrp) * 100);
  const payLaterPrice = item.price - 14;

  const sizes = item.sizes.map((sz) => ({
    size: sz,
    price: item.price
  }));

  const similarProducts = [
    {
      id,
      color: item.category,
      image: item.images[0],
      mainImg: item.images[0],
      price: item.price
    }
  ];

  if (item.images[1]) {
    similarProducts.push({
      id: id * 100 + 2,
      color: "Variant 2",
      image: item.images[1],
      mainImg: item.images[1],
      price: item.price
    });
  }

  return {
    id,
    handle: item.handle,
    isAd: index % 5 === 0,
    name: item.title,
    listingTitle: item.title.length > 30 ? item.title.substring(0, 30) + "..." : item.title,
    category: item.category,
    price: item.price,
    mrp: item.mrp,
    discount,
    payLaterPrice,
    rating: Number((4.3 + (index % 6) * 0.1).toFixed(1)),
    reviewsCount: 1200 + ((index * 347) % 4800),
    hasUpi: true,
    seller: "HAFSAAD ETHNIC WEAVES",
    sellerRating: 4.5,
    sellerFollowers: "42.5k",
    image: item.images[0],
    detailImage: item.images[0],
    galleryImages: item.images,
    similarProducts,
    sizes,
    highlights: {
      Fabric: item.fabric,
      Work: item.work,
      Blouse: item.blouse,
      Shipping: "Free Delivery in 2-3 Days",
      Care: "Dry clean only"
    },
    description: item.desc,
    reviews: [
      {
        id: "r1",
        userName: "Pooja Sharma",
        rating: 5,
        date: "14 Sep 2026",
        comment: "Fabric quality is beyond expectations! Colors are bright and saree fall is very smooth."
      },
      {
        id: "r2",
        userName: "Ananya Deshmukh",
        rating: 5,
        date: "10 Sep 2026",
        comment: "Delivered in 3 days. Exact same as shown in photos. Blouse work is very neat."
      }
    ]
  };
});

const content = `// Comprehensive Saree & Ethnic Wear Catalog populated with ALL products from Shopify CSV export
// Real Shopify CDN image links, wholesale Meeso pricing, sizes/options, and specifications

export const PRODUCTS = ${JSON.stringify(products, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, 'src', 'data', 'products.js'), content, 'utf8');
console.log('Successfully generated products.js with ' + products.length + ' complete products!');
