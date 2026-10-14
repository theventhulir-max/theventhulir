'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const TRANSLATIONS = {
  en: {
    // Top Bar & Announcements
    announcement1: '🌿 100% Certified Organic & Single-Origin Direct from Farms',
    announcement2: '🚚 Free Express Delivery Across India on Orders Above ₹499',
    announcement3: '✨ Farm Fresh Harvest — Wood Cold-Pressed & Stone Ground',
    announcement4: '💬 Instant WhatsApp Order & Support: +91 87784 76414',
    purityBadge: '100% PURE',
    shopFreshHarvest: 'Shop Fresh Harvest',
    whatsappOrder: 'WhatsApp Order',

    // Navbar
    home: 'Home',
    allProducts: 'All Products',
    categories: 'Categories',
    browseCategories: 'Browse Organic Categories',
    festiveOffers: 'Festive Offers',
    searchPlaceholder: 'Search spices, oils, masalas...',
    search: 'Search',
    cart: 'Cart',
    signIn: 'Sign In',
    account: 'Account',
    wishlist: 'Wishlist',
    matchingResults: 'Matching Organic Harvest',
    noResultsFound: 'No organic products found for',
    trendingHarvest: 'Trending Organic Harvest',
    viewAllResults: 'View all results',

    // Categories in Nav
    catAll: 'All Harvest',
    catSpices: 'Spices & Powders',
    catOils: 'Cold-Pressed Oils',
    catMasalas: 'Heritage Masalas',
    catRice: 'Ancient Grains',
    catSweeteners: 'Natural Sweeteners',
    catHerbal: 'Herbal Wellness',

    // Hero Section
    heroBadge: 'Pure Traditional Harvest from Native Tamil Soil',
    heroHeading1: 'Rediscover the Pure Essence of',
    heroHeadingAccent: 'Traditional Nutrition',
    heroSubtitle: 'Handcrafted single-origin spices, wood cold-pressed oils, and ancestral grains cultivated with regenerative organic farming — delivered fresh to your kitchen.',
    exploreCatalog: 'Explore All Harvest',
    learnOurStory: 'Our Heritage Story',
    statPurity: '100% Native Wood Chekku',
    statCurcumin: 'Salem High Curcumin Turmeric',
    statOrganic: 'Certified Organic Direct Farms',
    statCustomers: 'Happy Wholesome Families',

    // Categories Section
    catSectionEyebrow: 'HANDCRAFTED HERITAGE COLLECTIONS',
    catSectionHeading: 'Shop By Category',
    catSectionSub: 'From aromatic stone-ground spices and pure single-origin powders to traditional wood cold-pressed oils and native heirloom grains, discover pure staples crafted for wholesome living.',
    exploreCollection: 'Explore Collection',
    shopNow: 'Shop Now',

    // Category Card Names & Descriptions
    catSpicesTitle: 'Single-Origin Spices',
    catSpicesTamil: 'கைமுறை மசாலா பொடிகள்',
    catSpicesDesc: 'High curcumin Salem turmeric, vivid Guntur red chillies, and fragrant Erode coriander stone-ground at low RPMs.',
    catSpicesItems: '6 Pure Powders Available',

    catOilsTitle: 'Cold-Pressed Oils',
    catOilsTamil: 'மரச்செக்கு எண்ணெய்கள்',
    catOilsDesc: 'Extracted in native Vaagai wood mortars without heat or artificial solvents. Retains live natural antioxidants & rich ancestral aroma.',
    catOilsItems: '4 Virgin Oils Available',

    catMasalasTitle: 'Heritage Masala Blends',
    catMasalasTamil: 'பாரம்பரிய கூட்டு மசாலா',
    catMasalasDesc: 'Slow-roasted in small batches following ancestral family recipes. Fragrant heart for wholesome rasam, sambar & curries.',
    catMasalasItems: '5 Authentic Blends Available',

    catRiceTitle: 'Ancient Heirloom Grains',
    catRiceTamil: 'பாரம்பரிய அரிசி ரகங்கள்',
    catRiceDesc: 'Nutrient-dense indigenous paddy cultivated with zero synthetic fertilizers. High natural fiber, minerals & low glycemic index.',
    catRiceItems: '4 Native Grains Available',

    catSweetenersTitle: 'Pure Natural Sweeteners',
    catSweetenersTamil: 'இயற்கை நாட்டு சர்க்கரை & தேன்',
    catSweetenersDesc: 'Naturally clarified country sugar, native palm jaggery, and raw forest honey. Zero bone char, bleaching agents or preservatives.',
    catSweetenersItems: '3 Sweet Staples Available',

    catHerbalTitle: 'Daily Herbal Wellness',
    catHerbalTamil: 'ஆரோக்கிய மூலிகை பொடிகள்',
    catHerbalDesc: 'Handpicked wild-crafted botanicals sun-dried to preserve medicinal phyto-nutrients for daily vitality and gut wellness.',
    catHerbalItems: '4 Herbal Formulations Available',

    // Product Card Buttons & Badges
    addToCart: 'Add',
    addedToCart: 'Added!',
    buyNow: 'Buy Now',
    quickView: 'Quick View',
    outOfStock: 'Out of Stock',
    inStock: 'In Stock',
    freeDeliveryTag: 'Free Delivery',
    organicCertified: '100% Organic',
    savePercent: 'OFF',
    selectSize: 'Select Pack Size',

    // Product Section Top Bar
    catalogHeading: 'Pure Farm Harvest',
    catalogSub: 'Unadulterated staples cultivated with ancestral care and stone-processed for maximum nutrition.',
    allFilter: 'All Products',
    searchProductsPlaceholder: 'Search harvest...',

    // Why Choose Us
    whyEyebrow: 'Our Core Principles',
    whyHeading: 'Why Choose Venthulir?',
    whySub: 'Every drop of oil, grain of rice, and pinch of spice reflects our commitment to uncompromised purity and ethical farming.',
    why1Title: 'Traditional Wood Chekku Extracted',
    why1Desc: 'Extracted slowly at below 40°C in native Vaagai wood mortars, preserving volatile aromatic compounds, delicate vitamins, and live enzymes.',
    why2Title: 'Stone-Ground at Low RPM',
    why2Desc: 'Slow-ground using traditional granite stone mills to ensure zero heat-degradation of precious essential oils and deep natural flavors.',
    why3Title: 'Directly Sourced from Heritage Farmers',
    why3Desc: 'We partner directly with organic family farms in Tamil Nadu, eliminating middlemen and empowering native agricultural heritage.',
    why4Title: 'Zero Preservatives, Colors or Adulterants',
    why4Desc: 'Lab-tested for heavy metals, pesticides, and adulterants. Packed in UV-safe glass bottles and nitrogen-sealed eco pouches for guaranteed freshness.',

    // Testimonials / Reviews
    reviewsEyebrow: 'Real Customer Stories',
    reviewsHeading: 'Loved by 10,000+ Wholesome Kitchens',
    reviewsSub: 'Discover why families across India trust Venthulir for their daily ancestral nutrition.',

    // Footer
    footerTagline: 'Rooted in Tamil heritage, crafted for generational wellness. 100% organic, stone-ground, and cold-pressed staples direct from native farms.',
    footerQuickLinks: 'Quick Links',
    footerCollections: 'Our Collections',
    footerContact: 'Contact & Support',
    footerAddress: 'Salem & Erode Organic Farm Hubs, Tamil Nadu, India',
    footerPhone: '+91 87784 76414',
    footerEmail: 'support@venthulir.com',
    footerRights: 'All rights reserved. Pure heritage organic nutrition.',
    footerPureTamil: 'Made with love for wholesome health in Tamil Nadu 🌿',

    // Cart Drawer
    cartTitle: 'Your Shopping Bag',
    cartEmptyTitle: 'Your bag is empty',
    cartEmptySub: 'Add wholesome stone-ground spices or wood-pressed oils to begin.',
    cartSubtotal: 'Subtotal',
    cartShipping: 'Shipping',
    cartFree: 'FREE',
    cartProceedCheckout: 'Proceed to Secure Checkout',
    cartTotal: 'Grand Total',
    // Product Detail Page (PDP)
    pdpBreadcrumbsHome: 'Home',
    pdpBreadcrumbsProducts: 'Products',
    pdpHoverZoom: 'Hover to Zoom',
    pdpInStock: 'In Stock',
    pdpOutOfStock: 'Out of Stock',
    pdpTaxNotice: 'Inclusive of all taxes • 🚚 Free Delivery on orders above ₹499',
    pdpSelectSize: 'Select Size / Quantity:',
    pdpTotalAmount: 'Total Amount:',
    pdpAddToCart: 'Add to Cart',
    pdpAddedToCart: 'Added To Cart',
    pdpBuyNow: 'Buy Now',
    pdpWhatsappHelp: 'Need help ordering? Chat on WhatsApp',
    pdpDeliveryAvailability: 'Delivery Availability:',
    pdpEnterPincode: 'Enter 6-digit Pincode',
    pdpCheck: 'Check',
    pdpPurePillar1: '100% Pure & Authentic',
    pdpPurePillar1Desc: 'Extracted naturally to preserve maximum nutrients',
    pdpPurePillar2: 'Chemical & Preservative Free',
    pdpPurePillar2Desc: 'Zero artificial colors, flavors, or adulterants',
    pdpPurePillar3: 'Quality & Lab Tested',
    pdpPurePillar3Desc: 'Tested for highest food safety and purity standards',
    pdpPurePillar4: 'Direct From Source',
    pdpPurePillar4Desc: 'Farm fresh produce delivered straight to your home',
    pdpAccordionInfo: 'Product Information & Details',
    pdpAccordionBenefits: 'Key Benefits & Uses',
    pdpAccordionStorage: 'Storage & Shelf Life',
    pdpRelatedTitle: 'Related Products',
    pdpRelatedSub: 'Customers who viewed this item also explored',
    pdpReviewsTitle: 'Based on 520+ Verified Customer Reviews',
    pdpWriteReview: 'Write a Review',
    pdpVerifiedBuyer: 'Verified Buyer',
    pdpPromiseTitle: 'The Venthulir Pure Quality Promise',
    pdpPromiseDesc: 'We are dedicated to delivering authentic, unadulterated organic harvest direct to your home. Every item is produced with zero artificial chemical additives or deceptive dilution.',
    pdpPromise1: '100% Pure Natural Produce',
    pdpPromise2: 'Traditional Cold Processing',
    pdpPromise3: 'Zero Preservatives or Chemicals',
    pdpPromise4: 'Lab Tested Quality Standards',

    // Language Toggle
    languageLabel: 'Language',
    langEnglish: 'English',
    langTamil: 'தமிழ்',
  },

  ta: {
    // Top Bar & Announcements
    announcement1: '🌿 100% இயற்கை பண்ணை நேரடி விளைபொருட்கள்',
    announcement2: '🚚 ₹499-க்கு மேல் இந்தியா முழுவதும் இலவச டெலிவரி',
    announcement3: '✨ பாரம்பரிய மரச்செக்கு எண்ணெய் & நவதானியங்கள்',
    announcement4: '💬 வாட்ஸ்அப் ஆர்டர்: +91 87784 76414',
    purityBadge: '100% அசல்',
    shopFreshHarvest: 'பொருட்கள் வாங்க',
    whatsappOrder: 'வாட்ஸ்அப்',

    // Navbar
    home: 'முகப்பு',
    allProducts: 'பொருட்கள்',
    categories: 'பிரிவுகள்',
    browseCategories: 'இயற்கை உணவுப் பிரிவுகள்',
    festiveOffers: 'சலுகைகள்',
    searchPlaceholder: 'மசாலா, எண்ணெய் தேடுக...',
    search: 'தேடுக',
    cart: 'கார்ட்',
    signIn: 'உள்நுழை',
    account: 'கணக்கு',
    wishlist: 'விருப்பம்',
    matchingResults: 'பொருந்திய விளைபொருட்கள்',
    noResultsFound: 'பொருட்கள் எதுவும் கிடைக்கவில்லை',
    trendingHarvest: 'அதிகம் விரும்பப்படும் பொருட்கள்',
    viewAllResults: 'அனைத்து முடிவுகளையும் காண்க',

    // Categories in Nav
    catAll: 'அனைத்து விளைபொருட்கள்',
    catSpices: 'மசாலா & பொடிகள்',
    catOils: 'மரச்செக்கு எண்ணெய்கள்',
    catMasalas: 'பாரம்பரிய மசாலாக்கள்',
    catRice: 'பாரம்பரிய அரிசிகள்',
    catSweeteners: 'இயற்கை இனிப்புகள்',
    catHerbal: 'மூலிகை பொடிகள்',

    // Hero Section
    heroBadge: 'தமிழ் மண்ணின் பாரம்பரிய இயற்கை விளைபொருட்கள்',
    heroHeading1: 'உண்மையான ஊட்டச்சத்து நிறைந்த',
    heroHeadingAccent: 'பாரம்பரிய நல்வாழ்வு',
    heroSubtitle: 'சேலம் மஞ்சள், மரச்செக்கு சுத்தமான நல்லெண்ணெய், மற்றும் பாரம்பரிய அரிசி ரகங்கள் — எந்தவித ரசாயனமும் இன்றி உங்கள் சமையலறைக்கு நேரடியாக.',
    exploreCatalog: 'பொருட்களைப் பார்க்க',
    learnOurStory: 'எங்கள் பாரம்பரிய வரலாறு',
    statPurity: '100% வாகை மரச்செக்கு',
    statCurcumin: 'சேலம் உயர்தர குர்குமின் மஞ்சள்',
    statOrganic: 'இயற்கை பண்ணை நேரடி விளைச்சல்',
    statCustomers: 'மகிழ்ச்சியான நல்வாழ்வுக் குடும்பங்கள்',

    // Categories Section
    catSectionEyebrow: 'கைமுறை தயாரிப்பு பாரம்பரிய தொகுப்புகள்',
    catSectionHeading: 'பிரிவு வாரியாக வாங்குக',
    catSectionSub: 'மணக்கும் அம்மியில் அரைத்த மசாலாக்கள், தூய மரச்செக்கு எண்ணெய்கள் முதல் பூர்வீக பாரம்பரிய அரிசிகள் வரை நல்வாழ்விற்கான அசல் உணவுப் பொருட்கள்.',
    exploreCollection: 'தொகுப்பை ஆராய்க',
    shopNow: 'இப்போதே வாங்கு',

    // Category Card Names & Descriptions
    catSpicesTitle: 'கைமுறை மசாலா பொடிகள்',
    catSpicesTamil: 'மஞ்சள் & மிளகாய் பொடிகள்',
    catSpicesDesc: 'அதிக குர்குமின் கொண்ட சேலம் விரலி மஞ்சள், குண்டூர் மிளகாய் மற்றும் ஈரோடு கொத்தமல்லி குறைவான வேகத்தில் கல் அரைப்பில் அரைக்கப்பட்டது.',
    catSpicesItems: '6 தூய பொடிகள் உள்ளன',

    catOilsTitle: 'மரச்செக்கு எண்ணெய்கள்',
    catOilsTamil: 'வாகை மரச்செக்கு தயாரிப்பு',
    catOilsDesc: 'பாரம்பரிய வாகை மர உரலில் எந்தவித வெப்பமும் ரசாயனமும் இன்றி பிழியப்பட்ட சுத்தமான நல்லெண்ணெய், தேங்காய் எண்ணெய் & கடலை எண்ணெய்.',
    catOilsItems: '4 மரச்செக்கு எண்ணெய்கள் உள்ளன',

    catMasalasTitle: 'பாரம்பரிய கூட்டு மசாலா',
    catMasalasTamil: 'சாம்பார் & ரசப் பொடிகள்',
    catMasalasDesc: 'பழைய குடும்ப கைமுறை செய்முறையில் வறுத்து அரைக்கப்பட்ட மணமிக்க பாரம்பரிய சாம்பார், ரசம் மற்றும் கரம் மசாலா கூட்டுகள்.',
    catMasalasItems: '5 சுவையான கூட்டுகள் உள்ளன',

    catRiceTitle: 'பாரம்பரிய அரிசி ரகங்கள்',
    catRiceTamil: 'மாப்பிள்ளை சம்பா & காவுனி',
    catRiceDesc: 'ஊட்டச்சத்து மிகுந்த மாப்பிள்ளை சம்பா, கருப்பு கவுனி, பூங்கார் அரிசி மற்றும் சிறுதானியங்கள் — பூச்சிக்கொல்லி இல்லாத இயற்கை விளைச்சல்.',
    catRiceItems: '4 பாரம்பரிய அரிசிகள் உள்ளன',

    catSweetenersTitle: 'இயற்கை நாட்டு சர்க்கரை & தேன்',
    catSweetenersTamil: 'பனை கருப்பட்டி & சுத்த தேன்',
    catSweetenersDesc: 'சுண்ணாம்பு கலக்காத சுத்தமான நாட்டுச் சர்க்கரை, பாரம்பரிய பனை வெல்லம் (கருப்பட்டி) மற்றும் அடர்ந்த மலைத்தேன்.',
    catSweetenersItems: '3 இயற்கை இனிப்புகள் உள்ளன',

    catHerbalTitle: 'ஆரோக்கிய மூலிகை பொடிகள்',
    catHerbalTamil: 'ஆவாரம் பூ & நிலவேம்பு',
    catHerbalDesc: 'மேற்குத் தொடர்ச்சி மலை அடிவாரத்தில் கைமுறையாக சேகரிக்கப்பட்டு நிழலில் உலர்த்தப்பட்ட ஆவாரம் பூ, நிலவேம்பு மற்றும் துளசி பொடிகள்.',
    catHerbalItems: '4 மூலிகை பொடிகள் உள்ளன',

    // Product Card Buttons & Badges
    addToCart: 'சேர்',
    addedToCart: 'சேர்க்கப்பட்டது!',
    buyNow: 'Buy Now',
    quickView: 'விரைவுப் பார்வை',
    outOfStock: 'கையிருப்பில் இல்லை',
    inStock: 'கையிருப்பில் உள்ளது',
    freeDeliveryTag: 'இலவச டெலிவரி',
    organicCertified: '100% இயற்கை',
    savePercent: 'தள்ளுபடி',
    selectSize: 'அளவைத் தேர்ந்தெடுக்கவும்',

    // Product Section Top Bar
    catalogHeading: 'தூய இயற்கை விளைபொருட்கள்',
    catalogSub: 'பாரம்பரிய அக்கறையுடன் விளைவிக்கப்பட்டு ஊட்டச்சத்து குறையாமல் கல் அரைப்பில் பக்குவப்படுத்தப்பட்ட ஆரோக்கிய உணவுகள்.',
    allFilter: 'அனைத்து பொருட்கள்',
    searchProductsPlaceholder: 'பொருட்களைத் தேடுக...',

    // Why Choose Us
    whyEyebrow: 'எங்கள் முதன்மைக் கொள்கைகள்',
    whyHeading: 'ஏன் வெண்துளிர்?',
    whySub: 'ஒவ்வொரு துளி எண்ணெயும், அரிசி மணியும், ஒரு சிட்டிகை மசாலாவும் எங்களின் அசைக்க முடியாத தூய்மையையும் விவசாய அர்ப்பணிப்பையும் பறைசாற்றுகிறது.',
    why1Title: 'பாரம்பரிய வாகை மரச்செக்கு பிழிதல்',
    why1Desc: '40°C க்கும் குறைவான வெப்பநிலையில் வாகை மர உரலில் மெதுவாக பிழியப்பட்டு இயற்கை ஆன்டி-ஆக்சிடன்ட்கள் மற்றும் ஊட்டச்சத்துக்கள் காக்கப்படுகின்றன.',
    why2Title: 'குறைந்த வேகத்தில் கல் அரைப்பு',
    why2Desc: 'பாரம்பரிய கருங்கல் ஆட்டாங்கல் அரைப்பில் மெதுவாக அரைக்கப்படுவதால் நறுமண எண்ணெய்களும் மருத்துவ குணங்களும் வீணாகாமல் காக்கப்படுகின்றன.',
    why3Title: 'விவசாயிகளிடமிருந்து நேரடி கொள்முதல்',
    why3Desc: 'தமிழக இயற்கை விவசாயக் குடும்பங்களுடன் நேரடியாக இணைந்து இடைத்தரகர்கள் இன்றி உழவர் பெருமக்களின் வாழ்வாதாரத்தை உயர்த்துகிறோம்.',
    why4Title: 'பூஜ்ஜிய ரசாயனம் & நிறமூட்டிகள்',
    why4Desc: 'எந்தவித செயற்கை நிறமிகள், பதப்படுத்திகள் மற்றும் கலப்படங்கள் இன்றி பாதுகாப்பான பேக்கிங் முறையில் உங்களுக்கு வழங்கப்படுகிறது.',

    // Testimonials / Reviews
    reviewsEyebrow: 'வாடிக்கையாளர்களின் அனுபவங்கள்',
    reviewsHeading: '10,000+ குடும்பங்களின் நன்மதிப்பைப் பெற்றது',
    reviewsSub: 'இந்தியா முழுவதும் உள்ள குடும்பங்கள் தங்கள் தினசரி பாரம்பரிய உணவுக்கு வெண்துளிரை ஏன் நம்புகின்றன என்பதை அறியுங்கள்.',

    // Footer
    footerTagline: 'தமிழ் பாரம்பரியத்தில் வேரூன்றி, தலைமுறை நல்வாழ்வுக்காக உருவாக்கப்பட்ட 100% இயற்கை விளைபொருட்கள்.',
    footerQuickLinks: 'பயனுள்ள இணைப்புகள்',
    footerCollections: 'எங்கள் தொகுப்புகள்',
    footerContact: 'தொடர்பு & உதவி',
    footerAddress: 'சேலம் & ஈரோடு இயற்கை விவசாய மையங்கள், தமிழ்நாடு, இந்தியா',
    footerPhone: '+91 87784 76414',
    footerEmail: 'support@venthulir.com',
    footerRights: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. பாரம்பரிய இயற்கை ஊட்டச்சத்து.',
    footerPureTamil: 'தமிழ்நாட்டில் தூய அன்புடன் உருவாக்கப்பட்டது 🌿',

    // Cart Drawer
    cartTitle: 'உங்கள் கூடை',
    cartEmptyTitle: 'கூடையில் பொருட்கள் எதுவும் இல்லை',
    cartEmptySub: 'அம்மியில் அரைத்த மசாலாக்கள் அல்லது மரச்செக்கு எண்ணெய்களை கூடையில் சேர்க்கவும்.',
    cartSubtotal: 'பொருட்களின் மதிப்பு',
    cartShipping: 'டெலிவரி கட்டணம்',
    cartFree: 'இலவசம்',
    cartProceedCheckout: 'பணம் செலுத்த தொடரவும்',
    cartTotal: 'மொத்தத் தொகை',
    cartClear: 'கூடையை காலியாக்கு',

    // Product Detail Page (PDP)
    pdpBreadcrumbsHome: 'முகப்பு',
    pdpBreadcrumbsProducts: 'பொருட்கள்',
    pdpHoverZoom: 'பெரிதாக்க தொடுக',
    pdpInStock: 'கையிருப்பில் உள்ளது',
    pdpOutOfStock: 'இருப்பு இல்லை',
    pdpTaxNotice: 'அனைத்து வரிகளும் அடங்கும் • 🚚 ₹499-க்கு மேல் இலவச டெலிவரி',
    pdpSelectSize: 'அளவு / எடையைத் தேர்ந்தெடுக்கவும்:',
    pdpTotalAmount: 'மொத்த மதிப்பு:',
    pdpAddToCart: 'கார்ட்டில் சேர்',
    pdpAddedToCart: 'சேர்க்கப்பட்டது!',
    pdpBuyNow: 'Buy Now',
    pdpWhatsappHelp: 'ஆர்டர் செய்ய உதவி தேவையா? வாட்ஸ்அப்பில் பேசுக',
    pdpDeliveryAvailability: 'டெலிவரி இருப்பு அறிய:',
    pdpEnterPincode: '6-இலக்க பின்கோடு பதிவிடுக',
    pdpCheck: 'சரிபார்க்க',
    pdpPurePillar1: '100% தூய்மையானது & அசலானது',
    pdpPurePillar1Desc: 'ஊட்டச்சத்துக்கள் குறையாமல் பாரம்பரிய முறையில் தயாரிக்கப்பட்டது',
    pdpPurePillar2: 'ரசாயனம் & பதப்படுத்திகள் அற்றது',
    pdpPurePillar2Desc: 'எந்தவித செயற்கை நிறமூட்டிகள் மற்றும் கலப்படங்கள் இல்லை',
    pdpPurePillar3: 'ஆய்வகப் பரிசோதனை செய்யப்பட்டது',
    pdpPurePillar3Desc: 'உணவு பாதுகாப்பு மற்றும் தூய்மைத் தரங்கள் உறுதி செய்யப்பட்டது',
    pdpPurePillar4: 'பண்ணையிலிருந்து நேரடி விளைச்சல்',
    pdpPurePillar4Desc: 'பண்ணை நேரடி அசல் பொருட்கள் உங்கள் இல்லம் தேடி',
    pdpAccordionInfo: 'பொருளின் விவரங்கள் & தயாரிப்பு முறை',
    pdpAccordionBenefits: 'முக்கிய நன்மைகள் & பயன்பாடு',
    pdpAccordionStorage: 'சேமிப்பு & கால அளவு',
    pdpRelatedTitle: 'தொடர்புடைய இயற்கை விளைபொருட்கள்',
    pdpRelatedSub: 'இந்த பொருளைப் பார்த்தவர்கள் இதையும் பார்த்தனர்',
    pdpReviewsTitle: '520+ உண்மை வாடிக்கையாளர் கருத்துக்களின் அடிப்படையில்',
    pdpWriteReview: 'கருத்து எழுதுக',
    pdpVerifiedBuyer: 'உறுதிசெய்யப்பட்ட வாடிக்கையாளர்',
    pdpPromiseTitle: 'வெண்துளிர் அசல் தூய்மை உறுதிமொழி',
    pdpPromiseDesc: 'எந்தவித ரசாயனக் கலப்படமும் இன்றி, 100% தூய்மையான பாரம்பரிய இயற்கை விளைபொருட்களை உங்கள் இல்லத்திற்கு நேர்மையுடன் வழங்குவதே எங்களின் உறுதிமொழி.',
    pdpPromise1: '100% தூய இயற்கை விளைச்சல்',
    pdpPromise2: 'பாரம்பரிய குளிர்ந்த பிழிதல் முறை',
    pdpPromise3: 'பூஜ்ஜிய ரசாயனம் & பிரசர்வேட்டிவ்ஸ்',
    pdpPromise4: 'உயர்தர ஆய்வகப் பரிசோதனை தரம்',

    // Language Toggle
    languageLabel: 'மொழி',
    langEnglish: 'English',
    langTamil: 'தமிழ்',
  }
};

// Dictionary of Tamil Product Names and Subtitles
export const PRODUCT_TAMIL_MAP = {
  'wood cold-pressed gingelly sesame oil': {
    name: 'மரச்செக்கு சுத்தமான நல்லெண்ணெய்',
    desc: 'பாரம்பரிய முறையில் இயற்கை பனை வெல்லம் (கருப்பட்டி) சேர்த்து வாகை மர உரலில் பிழியப்பட்ட தூய நல்லெண்ணெய்.',
    badge: 'மரச்செக்கு தயாரிப்பு'
  },
  'wood cold-pressed groundnut oil': {
    name: 'மரச்செக்கு கடலை எண்ணெய்',
    desc: 'பாரம்பரிய நாட்டு நிலக்கடலை கொண்டு எந்தவித சூடாக்குதலும் இன்றி பிழியப்பட்ட மணமிக்க தூய கடலை எண்ணெய்.',
    badge: '100% மரச்செக்கு'
  },
  'wood cold-pressed pure coconut oil': {
    name: 'மரச்செக்கு தூய தேங்காய் எண்ணெய்',
    desc: 'வெயிலில் உலர்த்தப்பட்ட கொப்பரைத் தேங்காயிலிருந்து பிழியப்பட்ட அசல் சமையல் மற்றும் தலைமுடி தேங்காய் எண்ணெய்.',
    badge: 'அசல் கொப்பரை'
  },
  'salem pure turmeric powder': {
    name: 'சேலம் அசல் விரலி மஞ்சள் பொடி',
    desc: 'அதிக குர்குமின் (5.2%) கொண்ட சேலம் விரலி மஞ்சள் வெயிலில் உலர்த்தி குறைந்த வேகத்தில் கல் அரைப்பில் அரைக்கப்பட்டது.',
    badge: '100% இயற்கை'
  },
  'guntur red chilli powder': {
    name: 'குண்டூர் சிகப்பு மிளகாய் பொடி',
    desc: 'இயற்கை நிறமும் அசல் காரமும் கொண்ட குண்டூர் மிளகாய் கல் அரைப்பில் அரைக்கப்பட்டது. செயற்கை நிறமிகள் இல்லை.',
    badge: 'கல் அரைப்பு'
  },
  'native coriander powder': {
    name: 'நாட்டு கொத்தமல்லி மல்லிப் பொடி',
    desc: 'பழைய பாரம்பரிய முறையில் பக்குவமாக வறுத்து அரைக்கப்பட்ட மணமிக்க சமையல் கொத்தமல்லி பொடி.',
    badge: 'அசல் பண்ணை நேரடி'
  },
  'heritage garam masala': {
    name: 'பாரம்பரிய மணமிக்க கரம் மசாலா',
    desc: '12 முழு நறுமண வாசனைப் பொருட்கள் சரியான விகிதத்தில் கைமுறையாக வறுத்து அரைக்கப்பட்ட கூட்டு மசாலா.',
    badge: 'பாரம்பரிய செய்முறை'
  },
  'traditional sambar powder': {
    name: 'வீட்டு கைமுறை சாம்பார் பொடி',
    desc: 'தலைமுறை தலைமுறையாக தொடரும் பாரம்பரிய கிராமத்து கைமுறை சாம்பார் பொடி.',
    badge: 'மணமிக்க சாம்பார்'
  },
  'royal chettinad garam masala blend': {
    name: 'செட்டிநாடு கைமுறை கரம் மசாலா',
    desc: 'காரைக்குடி பாரம்பரிய கைமுறை நறுமண மசாலாப் பொருட்களின் கலவை.',
    badge: 'செட்டிநாடு மணம்'
  },
  'heritage grandmothers sambar powder': {
    name: 'பாட்டி கைமுறை பாரம்பரிய சாம்பார் பொடி',
    desc: 'அசல் கிராமத்து சுவை தரும் கைமுறை சாம்பார் பொடி.',
    badge: 'பாட்டி கைபக்குவம்'
  },
  'single-origin stone ground coriander powder': {
    name: 'அசல் கல் அரைப்பு கொத்தமல்லி பொடி',
    desc: 'இயற்கை முறையில் விளைந்த கொத்தமல்லி விதைகள் கொண்டு தயாரிக்கப்பட்டது.',
    badge: 'கல் அரைப்பு'
  },
  'authentic guntur red chilli powder': {
    name: 'அசல் குண்டூர் சிகப்பு மிளகாய் பொடி',
    desc: 'அசல் குண்டூர் மிளகாய் பொடி.',
    badge: 'அசல் காரம்'
  },
  'high-curcumin salem turmeric powder': {
    name: 'உயர்தர குர்குமின் சேலம் மஞ்சள் பொடி',
    desc: 'சேலம் விரலி மஞ்சள் பொடி.',
    badge: 'குர்குமின் 5.2%'
  }
};

export const getLocalizedProductName = (product, isTamil) => {
  if (!product) return '';
  if (!isTamil) return product.name || '';
  if (product.tamilName) return product.tamilName;
  const key = (product.name || '').toLowerCase().trim();
  if (PRODUCT_TAMIL_MAP[key]) return PRODUCT_TAMIL_MAP[key].name;
  for (const [k, val] of Object.entries(PRODUCT_TAMIL_MAP)) {
    if (key.includes(k) || k.includes(key)) return val.name;
  }
  // Keyword fallbacks
  if (key.includes('turmeric') || key.includes('manjal')) return 'சேலம் அசல் விரலி மஞ்சள் பொடி';
  if (key.includes('chilli') || key.includes('chili') || key.includes('red')) return 'குண்டூர் சிகப்பு மிளகாய் பொடி';
  if (key.includes('coriander') || key.includes('malli') || key.includes('mallie')) return 'நாட்டு கொத்தமல்லி மல்லிப் பொடி';
  if (key.includes('sambar')) return 'பாட்டி கைமுறை சாம்பார் பொடி';
  if (key.includes('garam') || key.includes('chettinad') || key.includes('masala')) return 'செட்டிநாடு கைமுறை கரம் மசாலா';
  if (key.includes('gingelly') || key.includes('sesame')) return 'மரச்செக்கு சுத்தமான நல்லெண்ணெய்';
  if (key.includes('groundnut') || key.includes('peanut')) return 'மரச்செக்கு கடலை எண்ணெய்';
  if (key.includes('coconut')) return 'மரச்செக்கு தூய தேங்காய் எண்ணெய்';
  if (key.includes('oil')) return 'மரச்செக்கு சுத்தமான எண்ணெய்';
  return product.name || '';
};

export const getLocalizedProductDesc = (product, isTamil) => {
  if (!product) return '';
  if (!isTamil) return product.description || '';
  if (product.tamilDescription) return product.tamilDescription;
  const key = (product.name || '').toLowerCase().trim();
  if (PRODUCT_TAMIL_MAP[key]) return PRODUCT_TAMIL_MAP[key].desc;
  for (const [k, val] of Object.entries(PRODUCT_TAMIL_MAP)) {
    if (key.includes(k) || k.includes(key)) return val.desc;
  }
  // Keyword fallbacks
  if (key.includes('turmeric') || key.includes('manjal')) return 'அதிக குர்குமின் (5.2%) கொண்ட சேலம் விரலி மஞ்சள் வெயிலில் உலர்த்தி குறைந்த வேகத்தில் கல் அரைப்பில் அரைக்கப்பட்டது.';
  if (key.includes('chilli') || key.includes('chili')) return 'இயற்கை நிறமும் அசல் காரமும் கொண்ட குண்டூர் மிளகாய் கல் அரைப்பில் அரைக்கப்பட்டது. செயற்கை நிறமிகள் இல்லை.';
  if (key.includes('coriander') || key.includes('malli')) return 'பழைய பாரம்பரிய முறையில் பக்குவமாக வறுத்து அரைக்கப்பட்ட மணமிக்க சமையல் கொத்தமல்லி பொடி.';
  if (key.includes('sambar')) return 'தலைமுறை தலைமுறையாக தொடரும் பாரம்பரிய கிராமத்து கைமுறை சாம்பார் பொடி.';
  if (key.includes('garam') || key.includes('masala')) return '12 முழு நறுமண வாசனைப் பொருட்கள் சரியான விகிதத்தில் கைமுறையாக வறுத்து அரைக்கப்பட்ட கூட்டு மசாலா.';
  if (key.includes('gingelly') || key.includes('sesame')) return 'பாரம்பரிய முறையில் இயற்கை பனை வெல்லம் (கருப்பட்டி) சேர்த்து வாகை மர உரலில் பிழியப்பட்ட தூய நல்லெண்ணெய்.';
  if (key.includes('groundnut')) return 'பாரம்பரிய நாட்டு நிலக்கடலை கொண்டு எந்தவித சூடாக்குதலும் இன்றி பிழியப்பட்ட மணமிக்க தூய கடலை எண்ணெய்.';
  if (key.includes('coconut')) return 'வெயிலில் உலர்த்தப்பட்ட கொப்பரைத் தேங்காயிலிருந்து பிழியப்பட்ட அசல் சமையல் மற்றும் தலைமுடி தேங்காய் எண்ணெய்.';
  return product.description || '';
};

export const getLocalizedCategory = (category, isTamil) => {
  if (!category) return '';
  if (!isTamil) return category;
  const c = category.toLowerCase();
  if (c.includes('oil')) return 'மரச்செக்கு எண்ணெய்கள்';
  if (c.includes('spice') || c.includes('powder')) return 'மசாலா & பொடிகள்';
  if (c.includes('masala')) return 'பாரம்பரிய மசாலாக்கள்';
  if (c.includes('grain') || c.includes('rice')) return 'பாரம்பரிய அரிசிகள்';
  if (c.includes('sweet') || c.includes('sugar') || c.includes('honey')) return 'இயற்கை இனிப்புகள்';
  if (c.includes('herb')) return 'மூலிகை பொடிகள்';
  return category;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('venthulir_lang');
    if (saved === 'ta' || saved === 'en') {
      setLanguageState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLanguage = (lang) => {
    if (lang === 'ta' || lang === 'en') {
      setLanguageState(lang);
      if (typeof window !== 'undefined') {
        localStorage.setItem('venthulir_lang', lang);
        document.documentElement.lang = lang;
      }
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ta' : 'en');
  };

  const t = (key, fallback = '') => {
    if (!key) return fallback;
    const currentDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (currentDict[key] !== undefined) {
      return currentDict[key];
    }
    const fallbackDict = TRANSLATIONS.en;
    return fallbackDict[key] !== undefined ? fallbackDict[key] : fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      toggleLanguage, 
      t, 
      isTamil: language === 'ta',
      getProductName: (p) => getLocalizedProductName(p, language === 'ta'),
      getProductDesc: (p) => getLocalizedProductDesc(p, language === 'ta'),
      getCategory: (c) => getLocalizedCategory(c, language === 'ta')
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'en',
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: (k, fb = '') => fb || k,
      isTamil: false,
      getProductName: (p) => p?.name || '',
      getProductDesc: (p) => p?.description || '',
      getCategory: (c) => c || ''
    };
  }
  return context;
};

export default LanguageContext;
