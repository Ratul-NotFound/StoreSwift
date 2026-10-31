/**
 * Bangladesh 64 Districts, Divisions & Automatic Courier Delivery Zone Mapping
 * Powers StoreSwift 1-Page Express Checkout with 100% automated delivery zone pricing.
 */

export interface DistrictInfo {
  id: string;
  nameEN: string;
  nameBN: string;
  division: string;
  defaultZone: "metro" | "suburbs" | "national";
  popularUpazilas: string[];
}

export const BANGLADESH_DISTRICTS: DistrictInfo[] = [
  // ─── Dhaka Division ────────────────────────────────────────────────
  {
    id: "dhaka",
    nameEN: "Dhaka",
    nameBN: "ঢাকা",
    division: "Dhaka",
    defaultZone: "metro",
    popularUpazilas: ["Dhanmondi", "Gulshan", "Banani", "Uttara", "Mirpur", "Mohammadpur", "Badda", "Tejgaon", "Motijheel", "Old Dhaka", "Bashundhara", "Khilkhet"]
  },
  {
    id: "gazipur",
    nameEN: "Gazipur",
    nameBN: "গাজীপুর",
    division: "Dhaka",
    defaultZone: "suburbs",
    popularUpazilas: ["Gazipur Sadar", "Tongi", "Kaliakair", "Kapasia", "Sreepur"]
  },
  {
    id: "narayanganj",
    nameEN: "Narayanganj",
    nameBN: "নারায়ণগঞ্জ",
    division: "Dhaka",
    defaultZone: "suburbs",
    popularUpazilas: ["Narayanganj Sadar", "Fatullah", "Siddhirganj", "Bandar", "Araihazar", "Sonargaon", "Rupganj"]
  },
  {
    id: "savar",
    nameEN: "Savar & Keraniganj",
    nameBN: "সাভার ও কেরানীগঞ্জ",
    division: "Dhaka",
    defaultZone: "suburbs",
    popularUpazilas: ["Savar", "Ashulia", "Keraniganj", "Dhamrai"]
  },
  {
    id: "narsingdi",
    nameEN: "Narsingdi",
    nameBN: "নরসিংদী",
    division: "Dhaka",
    defaultZone: "national",
    popularUpazilas: ["Narsingdi Sadar", "Palash", "Belabo", "Monohardi", "Shibpur", "Raipura"]
  },
  {
    id: "munshiganj",
    nameEN: "Munshiganj",
    nameBN: "মুন্সীগঞ্জ",
    division: "Dhaka",
    defaultZone: "national",
    popularUpazilas: ["Munshiganj Sadar", "Sreenagar", "Sirajdikhan", "Louhajang", "Tongibari", "Gazaria"]
  },
  {
    id: "manikganj",
    nameEN: "Manikganj",
    nameBN: "মানিকগঞ্জ",
    division: "Dhaka",
    defaultZone: "national",
    popularUpazilas: ["Manikganj Sadar", "Singair", "Saturia", "Shivalaya", "Harirampur", "Ghior"]
  },
  {
    id: "tangail",
    nameEN: "Tangail",
    nameBN: "টাঙ্গাইল",
    division: "Dhaka",
    defaultZone: "national",
    popularUpazilas: ["Tangail Sadar", "Mirzapur", "Delduar", "Nagarpur", "Sakhipur", "Madhupur", "Gopalpur"]
  },
  {
    id: "kishoreganj",
    nameEN: "Kishoreganj",
    nameBN: "কিশোরগঞ্জ",
    division: "Dhaka",
    defaultZone: "national",
    popularUpazilas: ["Kishoreganj Sadar", "Bhairab", "Bajitpur", "Katiadi", "Pakundia", "Karimganj"]
  },
  {
    id: "faridpur",
    nameEN: "Faridpur",
    nameBN: "ফরিদপুর",
    division: "Dhaka",
    defaultZone: "national",
    popularUpazilas: ["Faridpur Sadar", "Bhanga", "Boalmari", "Madhukhali", "Nagarkanda"]
  },
  {
    id: "gopalganj",
    nameEN: "Gopalganj",
    nameBN: "গোপালগঞ্জ",
    division: "Dhaka",
    defaultZone: "national",
    popularUpazilas: ["Gopalganj Sadar", "Kashiani", "Kotalipara", "Muksudpur", "Tungipara"]
  },
  {
    id: "madaripur",
    nameEN: "Madaripur",
    nameBN: "মাদারীপুর",
    division: "Dhaka",
    defaultZone: "national",
    popularUpazilas: ["Madaripur Sadar", "Shibchar", "Kalkini", "Rajoir"]
  },
  {
    id: "rajbari",
    nameEN: "Rajbari",
    nameBN: "রাজবাড়ী",
    division: "Dhaka",
    defaultZone: "national",
    popularUpazilas: ["Rajbari Sadar", "Goalanda", "Pangsha", "Baliakandi", "Kalukhali"]
  },
  {
    id: "shariatpur",
    nameEN: "Shariatpur",
    nameBN: "শরীয়তপুর",
    division: "Dhaka",
    defaultZone: "national",
    popularUpazilas: ["Shariatpur Sadar", "Zajira", "Naria", "Bhedarganj", "Damudya", "Gosairhat"]
  },

  // ─── Chattogram Division ───────────────────────────────────────────
  {
    id: "chattogram",
    nameEN: "Chattogram",
    nameBN: "চট্টগ্রাম",
    division: "Chattogram",
    defaultZone: "national",
    popularUpazilas: ["Kotwali", "Panchlaish", "Agrabad", "Nasirabad", "Halishahar", "Hathazari", "Sitakunda", "Patiya"]
  },
  {
    id: "coxsbazar",
    nameEN: "Cox's Bazar",
    nameBN: "কক্সবাজার",
    division: "Chattogram",
    defaultZone: "national",
    popularUpazilas: ["Cox's Bazar Sadar", "Chakaria", "Teknaf", "Ramu", "Ukhia", "Maheshkhali"]
  },
  {
    id: "cumilla",
    nameEN: "Cumilla",
    nameBN: "কুমিল্লা",
    division: "Chattogram",
    defaultZone: "national",
    popularUpazilas: ["Cumilla Adarsha Sadar", "Daudkandi", "Chandina", "Debidwar", "Laksam", "Barura", "Burichang"]
  },
  {
    id: "feni",
    nameEN: "Feni",
    nameBN: "ফেনী",
    division: "Chattogram",
    defaultZone: "national",
    popularUpazilas: ["Feni Sadar", "Daganbhuiyan", "Chhagalnaiya", "Parshuram", "Sonagazi", "Fulgazi"]
  },
  {
    id: "brahmanbaria",
    nameEN: "Brahmanbaria",
    nameBN: "ব্রাহ্মণবাড়িয়া",
    division: "Chattogram",
    defaultZone: "national",
    popularUpazilas: ["Brahmanbaria Sadar", "Kasba", "Nabinagar", "Sarail", "Ashuganj", "Bancharampur"]
  },
  {
    id: "noakhali",
    nameEN: "Noakhali",
    nameBN: "নোয়াখালী",
    division: "Chattogram",
    defaultZone: "national",
    popularUpazilas: ["Noakhali Sadar", "Begumganj", "Chatkhil", "Senbagh", "Companiganj", "Hatiya"]
  },
  {
    id: "chandpur",
    nameEN: "Chandpur",
    nameBN: "চাঁদপুর",
    division: "Chattogram",
    defaultZone: "national",
    popularUpazilas: ["Chandpur Sadar", "Hajiganj", "Faridganj", "Matlab Dakshin", "Shahrasti", "Kachua"]
  },
  {
    id: "lakshmipur",
    nameEN: "Lakshmipur",
    nameBN: "লক্ষ্মীপুর",
    division: "Chattogram",
    defaultZone: "national",
    popularUpazilas: ["Lakshmipur Sadar", "Raipur", "Ramganj", "Ramgati", "Kamalnagar"]
  },
  {
    id: "rangamati",
    nameEN: "Rangamati",
    nameBN: "রাঙ্গামাটি",
    division: "Chattogram",
    defaultZone: "national",
    popularUpazilas: ["Rangamati Sadar", "Kaptai", "Kawkhali", "Baghaichhari"]
  },
  {
    id: "bandarban",
    nameEN: "Bandarban",
    nameBN: "বান্দরবান",
    division: "Chattogram",
    defaultZone: "national",
    popularUpazilas: ["Bandarban Sadar", "Ruma", "Thanchi", "Lama", "Ali Kadam"]
  },
  {
    id: "khagrachhari",
    nameEN: "Khagrachhari",
    nameBN: "খাগড়াছড়ি",
    division: "Chattogram",
    defaultZone: "national",
    popularUpazilas: ["Khagrachhari Sadar", "Dighinala", "Panchhari", "Ramgarh"]
  },

  // ─── Sylhet Division ───────────────────────────────────────────────
  {
    id: "sylhet",
    nameEN: "Sylhet",
    nameBN: "সিলেট",
    division: "Sylhet",
    defaultZone: "national",
    popularUpazilas: ["Sylhet Sadar", "Beanibazar", "Golapganj", "Zakiganj", "Kanaighat", "Fenchuganj", "Osmani Nagar"]
  },
  {
    id: "moulvibazar",
    nameEN: "Moulvibazar",
    nameBN: "মৌলভীবাজার",
    division: "Sylhet",
    defaultZone: "national",
    popularUpazilas: ["Moulvibazar Sadar", "Sreemangal", "Kulaura", "Kamalganj", "Barlekha"]
  },
  {
    id: "habiganj",
    nameEN: "Habiganj",
    nameBN: "হবিগঞ্জ",
    division: "Sylhet",
    defaultZone: "national",
    popularUpazilas: ["Habiganj Sadar", "Madhabpur", "Nabiganj", "Bahubal", "Chunarughat", "Baniachang"]
  },
  {
    id: "sunamganj",
    nameEN: "Sunamganj",
    nameBN: "সুনামগঞ্জ",
    division: "Sylhet",
    defaultZone: "national",
    popularUpazilas: ["Sunamganj Sadar", "Jagannathpur", "Chhatak", "Derai", "Tahirpur"]
  },

  // ─── Rajshahi Division ─────────────────────────────────────────────
  {
    id: "rajshahi",
    nameEN: "Rajshahi",
    nameBN: "রাজশাহী",
    division: "Rajshahi",
    defaultZone: "national",
    popularUpazilas: ["Boalia", "Motihar", "Rajpara", "Paba", "Godagari", "Tanore", "Bagmara", "Charghat", "Puthia"]
  },
  {
    id: "bogura",
    nameEN: "Bogura",
    nameBN: "বগুড়া",
    division: "Rajshahi",
    defaultZone: "national",
    popularUpazilas: ["Bogura Sadar", "Sherpur", "Shajahanpur", "Gabtali", "Shibganj", "Kahaloo", "Dhunat"]
  },
  {
    id: "pabna",
    nameEN: "Pabna",
    nameBN: "পাবনা",
    division: "Rajshahi",
    defaultZone: "national",
    popularUpazilas: ["Pabna Sadar", "Ishwardi", "Santhia", "Bera", "Chatmohar", "Sujanagar"]
  },
  {
    id: "sirajganj",
    nameEN: "Sirajganj",
    nameBN: "সিরাজগঞ্জ",
    division: "Rajshahi",
    defaultZone: "national",
    popularUpazilas: ["Sirajganj Sadar", "Ullapara", "Shahjadpur", "Belkuchi", "Kamarkhanda", "Kazipur"]
  },
  {
    id: "natore",
    nameEN: "Natore",
    nameBN: "নাটোর",
    division: "Rajshahi",
    defaultZone: "national",
    popularUpazilas: ["Natore Sadar", "Singra", "Baraigram", "Bagatipara", "Lalpur", "Gurudaspur"]
  },
  {
    id: "naogaon",
    nameEN: "Naogaon",
    nameBN: "নওগাঁ",
    division: "Rajshahi",
    defaultZone: "national",
    popularUpazilas: ["Naogaon Sadar", "Manda", "Mohadevpur", "Patnitala", "Niamatpur", "Badalgachhi"]
  },
  {
    id: "chapainawabganj",
    nameEN: "Chapainawabganj",
    nameBN: "চাঁপাইনবাবগঞ্জ",
    division: "Rajshahi",
    defaultZone: "national",
    popularUpazilas: ["Nawabganj Sadar", "Shibganj", "Gomastapur", "Nachole", "Bholahat"]
  },
  {
    id: "joypurhat",
    nameEN: "Joypurhat",
    nameBN: "জয়পুরহাট",
    division: "Rajshahi",
    defaultZone: "national",
    popularUpazilas: ["Joypurhat Sadar", "Panchbibi", "Kalai", "Khetlal", "Akkelpur"]
  },

  // ─── Khulna Division ───────────────────────────────────────────────
  {
    id: "khulna",
    nameEN: "Khulna",
    nameBN: "খুলনা",
    division: "Khulna",
    defaultZone: "national",
    popularUpazilas: ["Khulna Sadar", "Sonadanga", "Khalishpur", "Daulatpur", "Dumuria", "Rupsha", "Phultala"]
  },
  {
    id: "jashore",
    nameEN: "Jashore",
    nameBN: "যশোর",
    division: "Khulna",
    defaultZone: "national",
    popularUpazilas: ["Jashore Sadar", "Jhikargachha", "Manirampur", "Keshabpur", "Chaugachha", "Abhaynagar"]
  },
  {
    id: "kushtia",
    nameEN: "Kushtia",
    nameBN: "কুষ্টিয়া",
    division: "Khulna",
    defaultZone: "national",
    popularUpazilas: ["Kushtia Sadar", "Kumarkhali", "Bheramara", "Mirpur", "Daulatpur", "Khoksa"]
  },
  {
    id: "satkhira",
    nameEN: "Satkhira",
    nameBN: "সাতক্ষীরা",
    division: "Khulna",
    defaultZone: "national",
    popularUpazilas: ["Satkhira Sadar", "Kalaroa", "Tala", "Debhata", "Kaliganj", "Shyamnagar"]
  },
  {
    id: "jhenaidah",
    nameEN: "Jhenaidah",
    nameBN: "ঝিনাইদহ",
    division: "Khulna",
    defaultZone: "national",
    popularUpazilas: ["Jhenaidah Sadar", "Kaliganj", "Kotchandpur", "Maheshpur", "Shailkupa", "Harinakundu"]
  },
  {
    id: "chuadanga",
    nameEN: "Chuadanga",
    nameBN: "চুয়াডাঙ্গা",
    division: "Khulna",
    defaultZone: "national",
    popularUpazilas: ["Chuadanga Sadar", "Alamdanga", "Damurhuda", "Jibannagar"]
  },
  {
    id: "bagerhat",
    nameEN: "Bagerhat",
    nameBN: "বাগেরহাট",
    division: "Khulna",
    defaultZone: "national",
    popularUpazilas: ["Bagerhat Sadar", "Mongla", "Fakirhat", "Rampal", "Kachua", "Morrelganj"]
  },
  {
    id: "meherpur",
    nameEN: "Meherpur",
    nameBN: "মেহেরপুর",
    division: "Khulna",
    defaultZone: "national",
    popularUpazilas: ["Meherpur Sadar", "Gangni", "Mujibnagar"]
  },
  {
    id: "magura",
    nameEN: "Magura",
    nameBN: "মাগুরা",
    division: "Khulna",
    defaultZone: "national",
    popularUpazilas: ["Magura Sadar", "Sreepur", "Mohammadpur", "Shalikha"]
  },
  {
    id: "narail",
    nameEN: "Narail",
    nameBN: "নড়াইল",
    division: "Khulna",
    defaultZone: "national",
    popularUpazilas: ["Narail Sadar", "Lohagara", "Kalia"]
  },

  // ─── Barishal Division ─────────────────────────────────────────────
  {
    id: "barishal",
    nameEN: "Barishal",
    nameBN: "বরিশাল",
    division: "Barishal",
    defaultZone: "national",
    popularUpazilas: ["Barishal Sadar", "Bakerganj", "Babuganj", "Banaripara", "Gournadi", "Muladi", "Mehendiganj"]
  },
  {
    id: "patuakhali",
    nameEN: "Patuakhali",
    nameBN: "পটুয়াখালী",
    division: "Barishal",
    defaultZone: "national",
    popularUpazilas: ["Patuakhali Sadar", "Kalapara", "Galachipa", "Bauphal", "Dumki", "Mirzaganj"]
  },
  {
    id: "bhola",
    nameEN: "Bhola",
    nameBN: "ভোলা",
    division: "Barishal",
    defaultZone: "national",
    popularUpazilas: ["Bhola Sadar", "Borhanuddin", "Lalmohan", "Char Fasson", "Daulatkhan", "Tazumuddin"]
  },
  {
    id: "pirojpur",
    nameEN: "Pirojpur",
    nameBN: "পিরোজপুর",
    division: "Barishal",
    defaultZone: "national",
    popularUpazilas: ["Pirojpur Sadar", "Bhandaria", "Mathbaria", "Nazirpur", "Nesarabad", "Kawkhali"]
  },
  {
    id: "barguna",
    nameEN: "Barguna",
    nameBN: "বরগুনা",
    division: "Barishal",
    defaultZone: "national",
    popularUpazilas: ["Barguna Sadar", "Amtali", "Patharghata", "Betagi", "Bamna", "Taltali"]
  },
  {
    id: "jhalokati",
    nameEN: "Jhalokati",
    nameBN: "ঝালকাঠি",
    division: "Barishal",
    defaultZone: "national",
    popularUpazilas: ["Jhalokati Sadar", "Nalchity", "Rajapur", "Kathalia"]
  },

  // ─── Rangpur Division ──────────────────────────────────────────────
  {
    id: "rangpur",
    nameEN: "Rangpur",
    nameBN: "রংপুর",
    division: "Rangpur",
    defaultZone: "national",
    popularUpazilas: ["Rangpur Sadar", "Pirganj", "Badarganj", "Mithapukur", "Gangachhara", "Kaunia", "Pirgachha"]
  },
  {
    id: "dinajpur",
    nameEN: "Dinajpur",
    nameBN: "দিনাজপুর",
    division: "Rangpur",
    defaultZone: "national",
    popularUpazilas: ["Dinajpur Sadar", "Birganj", "Birol", "Parbatipur", "Fulbari", "Ghoraghat", "Hakimpur"]
  },
  {
    id: "gaibandha",
    nameEN: "Gaibandha",
    nameBN: "গাইবান্ধা",
    division: "Rangpur",
    defaultZone: "national",
    popularUpazilas: ["Gaibandha Sadar", "Gobindaganj", "Palashbari", "Sundarganj", "Sadullapur"]
  },
  {
    id: "nilphamari",
    nameEN: "Nilphamari",
    nameBN: "নীলফামারী",
    division: "Rangpur",
    defaultZone: "national",
    popularUpazilas: ["Nilphamari Sadar", "Saidpur", "Domar", "Jaldhaka", "Kishoreganj"]
  },
  {
    id: "kurigram",
    nameEN: "Kurigram",
    nameBN: "কুড়িগ্রাম",
    division: "Rangpur",
    defaultZone: "national",
    popularUpazilas: ["Kurigram Sadar", "Ulipur", "Nageshwari", "Bhurungamari", "Rajarhat", "Chilmari"]
  },
  {
    id: "thakurgaon",
    nameEN: "Thakurgaon",
    nameBN: "ঠাকুরগাঁও",
    division: "Rangpur",
    defaultZone: "national",
    popularUpazilas: ["Thakurgaon Sadar", "Pirganj", "Ranisankail", "Baliadangi", "Haripur"]
  },
  {
    id: "lalmonirhat",
    nameEN: "Lalmonirhat",
    nameBN: "লালমনিরহাট",
    division: "Rangpur",
    defaultZone: "national",
    popularUpazilas: ["Lalmonirhat Sadar", "Patgram", "Aditmari", "Kaliganj", "Hatibandha"]
  },
  {
    id: "panchagarh",
    nameEN: "Panchagarh",
    nameBN: "পঞ্চগড়",
    division: "Rangpur",
    defaultZone: "national",
    popularUpazilas: ["Panchagarh Sadar", "Boda", "Debiganj", "Tetulia", "Atwari"]
  },

  // ─── Mymensingh Division ───────────────────────────────────────────
  {
    id: "mymensingh",
    nameEN: "Mymensingh",
    nameBN: "ময়মনসিংহ",
    division: "Mymensingh",
    defaultZone: "national",
    popularUpazilas: ["Mymensingh Sadar", "Muktagachha", "Bhaluka", "Trishal", "Fulbaria", "Gafargaon", "Ishwarganj"]
  },
  {
    id: "jamalpur",
    nameEN: "Jamalpur",
    nameBN: "জামালপুর",
    division: "Mymensingh",
    defaultZone: "national",
    popularUpazilas: ["Jamalpur Sadar", "Sarishabari", "Melandaha", "Islampur", "Dewanganj", "Madarganj"]
  },
  {
    id: "netrokona",
    nameEN: "Netrokona",
    nameBN: "নেত্রকোণা",
    division: "Mymensingh",
    defaultZone: "national",
    popularUpazilas: ["Netrokona Sadar", "Kendua", "Mohanganj", "Barhatta", "Purbadhala", "Durgapur"]
  },
  {
    id: "sherpur",
    nameEN: "Sherpur",
    nameBN: "শেরপুর",
    division: "Mymensingh",
    defaultZone: "national",
    popularUpazilas: ["Sherpur Sadar", "Nalitabari", "Nakla", "Sreebardi", "Jhenaigati"]
  }
];

export function resolveZoneFromDistrict(districtId: string): "metro" | "suburbs" | "national" {
  const found = BANGLADESH_DISTRICTS.find((d) => d.id === districtId.toLowerCase());
  return found ? found.defaultZone : "national";
}

/**
 * Express Checkout Bilingual Dictionary (English & Bengali)
 */
export const CHECKOUT_I18N = {
  en: {
    title: "1-Page Fast Express Checkout",
    orderConfirmed: "Order Placed Successfully",
    orderSuccessTitle: "Thank you for your order!",
    orderSuccessSubtitle: "We have received your order and booked priority courier dispatch.",
    orderItemsTitle: "Order Items",
    step1Title: "1. Delivery Information",
    fullName: "Your Full Name *",
    fullNamePlaceholder: "e.g. Tanvir Ahmed",
    phone: "Mobile Phone Number *",
    phonePlaceholder: "e.g. 017XXXXXXXX",
    email: "Email (Optional for tracking)",
    emailPlaceholder: "e.g. tanvir@example.com",
    district: "Select District / City *",
    area: "Area / Thana / Upazila *",
    areaPlaceholder: "Select or enter your area",
    address: "Detailed Street Address & House # *",
    addressPlaceholder: "House #, Road #, Area name, Nearest Landmark",
    step2Title: "2. Delivery Zone & Shipping",
    step3Title: "3. Choose Payment Method",
    cod: "Cash on Delivery",
    codSub: "Pay cash at doorstep upon inspection",
    bkash: "bKash Express",
    bkashSub: "Instant MFS transfer",
    nagad: "Nagad Direct",
    nagadSub: "Fast wallet transfer",
    card: "Credit / Debit Card",
    cardSub: "Visa, Mastercard, Amex",
    inspectionGuarantee: "Open Parcel Doorstep Inspection",
    inspectionGuaranteeNote: "You can inspect the product in front of the courier rider before paying.",
    subtotal: "Product Subtotal",
    deliveryFee: "Delivery Charge",
    totalDue: "Total Payable",
    confirmCod: "Confirm Cash on Delivery",
    completeOrder: "Complete Order",
    processing: "Dispatching Order...",
    consignmentId: "Consignment ID",
    courierPartner: "Courier Partner",
    estimatedArrival: "Estimated Arrival",
    continueShopping: "Continue Shopping"
  },
  bn: {
    title: "১-পেজ ফাস্ট এক্সপ্রেস চেকআউট",
    orderConfirmed: "অর্ডার সফলভাবে সম্পন্ন হয়েছে!",
    orderSuccessTitle: "আপনার অর্ডারের জন্য ধন্যবাদ!",
    orderSuccessSubtitle: "আমরা আপনার অর্ডার পেয়েছি এবং কুরিয়ার ডিসপ্যাচ প্রক্রিয়া শুরু হয়েছে।",
    orderItemsTitle: "অর্ডারের পণ্যসমূহ",
    step1Title: "১. ডেলিভারির তথ্য",
    fullName: "আপনার পুরো নাম *",
    fullNamePlaceholder: "যেমনঃ তানভীর আহমেদ",
    phone: "মোবাইল ফোন নম্বর *",
    phonePlaceholder: "যেমনঃ ০১৭১১-২৩৪৫৬৭",
    email: "ইমেইল (ঐচ্ছিক)",
    emailPlaceholder: "যেমনঃ user@gmail.com",
    district: "জেলা নির্বাচন করুন *",
    area: "থানা / উপজেলা / এলাকা *",
    areaPlaceholder: "আপনার এলাকা সিলেক্ট করুন বা লিখুন",
    address: "সম্পূর্ণ ঠিকানা ও বাসা নম্বর *",
    addressPlaceholder: "বাসা নম্বর, রোড নম্বর, এলাকা, নিকটস্থ ল্যান্ডমার্ক",
    step2Title: "২. ডেলিভারি এলাকা ও চার্জ",
    step3Title: "৩. পেমেন্টের মাধ্যম নির্বাচন করুন",
    cod: "ক্যাশ অন ডেলিভারি (COD)",
    codSub: "পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন",
    bkash: "বিকাশ এক্সপ্রেস",
    bkashSub: "দ্রুত বিকাশ ওয়ালেট পেমেন্ট",
    nagad: "নগদ ডিরেক্ট",
    nagadSub: "সহজ নগদ ওয়ালেট ট্রান্সফার",
    card: "ক্রেডিট / ডেবিট কার্ড",
    cardSub: "ভিসা, মাস্টারকার্ড, অনলাইন পেমেন্ট",
    inspectionGuarantee: "পার্সেল খুলে দেখে নেওয়ার সুবিধা",
    inspectionGuaranteeNote: "ডেলিভারি রাইডারের সামনে পার্সেল খুলে চেক করে নিশ্চিন্তে পেমেন্ট করুন।",
    subtotal: "পণ্যের মোট মূল্য",
    deliveryFee: "ডেলিভারি চার্জ",
    totalDue: "সর্বমোট প্রদেয়",
    confirmCod: "ক্যাশ অন ডেলিভারিতে অর্ডার নিশ্চিত করুন",
    completeOrder: "অর্ডার সম্পন্ন করুন",
    processing: "অর্ডার প্রস্তুত হচ্ছে...",
    consignmentId: "কুরিয়ার ট্র্যাকিং কোড",
    courierPartner: "ডেলিভারি পার্টনার",
    estimatedArrival: "সম্ভাব্য ডেলিভারি সময়",
    continueShopping: "আরও কেনাকাটা করুন"
  }
};
