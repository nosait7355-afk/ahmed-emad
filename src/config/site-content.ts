/**
 * Public-site content for the trainer: credentials, services, packages,
 * testimonials and FAQ. Sourced from the trainer's existing site
 * (omdafit.com). Everything the landing page shows comes from here, so copy
 * and prices are edited in one place.
 *
 * Packages here are the initial values only — once the coaching-packages
 * feature lands they are seeded into the database and edited from the
 * dashboard.
 */

type L = { ar: string; en: string };

export const HERO: {
  eyebrow: L;
  titleLine1: L;
  titleLine2: L;
  subtitle: L;
  ctaPrimary: L;
  ctaSecondary: L;
  badge: L;
} = {
  eyebrow: { ar: "تدريب أونلاين احترافي", en: "Online Coaching" },
  titleLine1: { ar: "أنا جاهز،", en: "I'm ready." },
  titleLine2: { ar: "إنت جاهز؟", en: "Are you ready?" },
  subtitle: {
    ar: "برنامج تمارين وتغذية مفصّل على مقاسك، مع متابعة حقيقية خطوة بخطوة حتى توصل لهدفك.",
    en: "A training and nutrition plan built around you, with real step-by-step follow-up until you reach your goal.",
  },
  ctaPrimary: { ar: "ابدأ التغيير", en: "Start now" },
  ctaSecondary: { ar: "شوف الباقات", en: "See plans" },
  badge: { ar: "مدرب معتمد", en: "Certified Coach" },
};

export const PILLARS = ["TRAINING", "NUTRITION", "FOLLOW-UP", "STRENGTH", "DISCIPLINE", "RESULTS"] as const;

export const SERVICES: { title: L; desc: L }[] = [
  {
    title: { ar: "تمارين بالفيديو", en: "Workouts with video" },
    desc: {
      ar: "برنامج مخصّص لمستواك وأهدافك، مع فيديو لكل تمرين عشان تأدّيه صح.",
      en: "A plan for your level and goals, with a video for every exercise so your form is right.",
    },
  },
  {
    title: { ar: "تغذية مرنة", en: "Flexible nutrition" },
    desc: {
      ar: "نظام غذائي على ذوقك وميزانيتك — مش هتاكل نفس الأكل كل يوم.",
      en: "A diet built around your taste and budget — you won't eat the same food every day.",
    },
  },
  {
    title: { ar: "متابعة مستمرة", en: "Continuous follow-up" },
    desc: {
      ar: "تواصل مباشر، تعديل الخطة أول بأول، ودعم حقيقي طول رحلتك.",
      en: "Direct contact, plans adjusted as you go, and real support the whole way.",
    },
  },
];

export const CREDENTIALS: L[] = [
  { ar: "مدرب شخصي معتمد من منظمة EREPS لعلوم الرياضة", en: "Personal trainer certified by EREPS for sports science" },
  { ar: "مُعِدّ بدني ومخطّط أحمال معتمد من ACE", en: "Strength & conditioning coach and load planner certified by ACE" },
  {
    ar: "المُعِدّ البدني لفريق السباحة بنادي وادي دجلة أسيوط",
    en: "Strength & conditioning coach for the swimming team at Wadi Degla Club, Assiut",
  },
  { ar: "أخصائي تدريب وظيفي", en: "Functional training specialist" },
  { ar: "محاضر مدربين بمعهد INSEP Pro", en: "Trainer lecturer at INSEP Pro institute" },
];

export const STATS: { value: string; label: L }[] = [
  { value: "500+", label: { ar: "متدرب", en: "Clients" } },
  { value: "7+", label: { ar: "سنين خبرة", en: "Years" } },
  { value: "24/7", label: { ar: "متابعة", en: "Support" } },
];

export interface SitePackage {
  id: string;
  duration: L;
  /** Whole months of access; null for add-on style packages (VIP). */
  months: number | null;
  tagline: L;
  /** Prices in EGP. `originalPrice` is the struck-through price. */
  originalPrice: number;
  price: number;
  features: L[];
  popular?: boolean;
}

export const PACKAGES: SitePackage[] = [
  {
    id: "1m",
    duration: { ar: "شهر واحد", en: "1 Month" },
    months: 1,
    tagline: { ar: "بداية قوية", en: "Strong start" },
    originalPrice: 1000,
    price: 499,
    features: [
      { ar: "برنامج تمارين مخصّص بالفيديو", en: "Custom workout plan with video" },
      { ar: "نظام غذائي مرن حسب ميزانيتك", en: "Flexible diet for your budget" },
      { ar: "متابعة أسبوعية", en: "Weekly follow-up" },
    ],
  },
  {
    id: "3m",
    duration: { ar: "٣ شهور", en: "3 Months" },
    months: 3,
    tagline: { ar: "باقة الدب 🐻", en: "Most chosen" },
    originalPrice: 3000,
    price: 1499,
    popular: true,
    features: [
      { ar: "كل مزايا الشهر", en: "Everything in monthly" },
      { ar: "تعديل الخطة كل أسبوعين", en: "Plan updated every 2 weeks" },
      { ar: "متابعة دقيقة للقياسات", en: "Detailed measurement tracking" },
    ],
  },
  {
    id: "6m",
    duration: { ar: "٦ شهور", en: "6 Months" },
    months: 6,
    tagline: { ar: "نتائج تدوم", en: "Lasting results" },
    originalPrice: 6000,
    price: 3000,
    features: [
      { ar: "كل مزايا الـ٣ شهور", en: "Everything in 3 months" },
      { ar: "دعم أولوية على واتساب", en: "Priority WhatsApp support" },
      { ar: "مراجعة شهرية للصور", en: "Monthly photo review" },
    ],
  },
  {
    id: "12m",
    duration: { ar: "سنة كاملة", en: "12 Months" },
    months: 12,
    tagline: { ar: "أفضل قيمة", en: "Best value" },
    originalPrice: 12000,
    price: 6000,
    features: [
      { ar: "كل مزايا الـ٦ شهور", en: "Everything in 6 months" },
      { ar: "تثبيت السعر طوال السنة", en: "Price locked for a year" },
      { ar: "خطة تثبيت ونمط حياة", en: "Maintenance & lifestyle plan" },
    ],
  },
  {
    id: "vip",
    duration: { ar: "VIP", en: "VIP" },
    months: null,
    tagline: { ar: "دعم شخصي مباشر", en: "Direct personal support" },
    originalPrice: 5000,
    price: 2500,
    features: [
      { ar: "مكالمات هاتفية وفيديو", en: "Phone & video calls" },
      { ar: "رد فوري على مدار اليوم", en: "Same-day replies" },
      { ar: "متابعة يومية", en: "Daily follow-up" },
    ],
  },
];

/** Announced on the current site as "coming soon", with no prices yet. */
export const SWIMMERS_BUNDLE: { comingSoon: boolean; title: L; desc: L; features: L[] } = {
  comingSoon: true,
  title: { ar: "باقة السبّاحين", en: "Swimmers Bundle" },
  desc: {
    ar: "جيم وسباحة في اشتراك واحد. برنامج لياقة من الكابتن، وبرنامج سباحة احترافي من مدرب السباحة — والاتنين بيتابعوك في نفس التطبيق.",
    en: "Gym and swimming in one subscription. A fitness program from the coach and a competitive swim program from a swimming coach — both coaching you inside one app.",
  },
  features: [
    { ar: "برنامج جيم من الكابتن", en: "Gym program from the coach" },
    { ar: "برنامج سباحة من مدرب السباحة", en: "Swim program from a swimming coach" },
    { ar: "نظام غذائي مخصّص للسبّاحين", en: "Swimmer-specific nutrition plan" },
    { ar: "متابعة من المدربَين في تطبيق واحد", en: "Both coaches follow you in one app" },
  ],
};

export const TESTIMONIALS: { name: L; quote: L }[] = [
  {
    name: { ar: "سلفيا", en: "Silvia" },
    quote: {
      ar: "والحمدلله لما انتظمت في اخر اسبوعين كسرت رقم الخمسين دولفين زعانف بثانيتين والخمسين دولفين من غير زعانف مثبتة رقم البطولة مع اني اخر فترة كنت معلية جدا علي رقمي",
      en: "Thank God — once I got consistent, in the last two weeks I broke my 50m dolphin (with fins) by two seconds, and my 50m dolphin without fins matched the championship record — even though I'd been way off my times lately.",
    },
  },
  {
    name: { ar: "يوسف", en: "Youssef" },
    quote: {
      ar: "أول مرة ألتزم لآخر الشهر، الكابتن بيتابع معايا أول بأول والأكل سهل ومش ممل.",
      en: "First time I stick to a full month. The coach follows up constantly and the food is easy.",
    },
  },
  {
    name: { ar: "سارة", en: "Sara" },
    quote: {
      ar: "النظام اتعمل على ميزانيتي بالظبط، ونزلت وزن من غير ما أحس إني محرومة.",
      en: "The plan fit my exact budget, and I lost weight without feeling deprived.",
    },
  },
  {
    name: { ar: "عمر", en: "Omar" },
    quote: {
      ar: "أحسن حاجة المتابعة، حاسس إن فيه حد فعلاً مهتم بنتيجتي.",
      en: "The best part is the follow-up — someone genuinely cares about my result.",
    },
  },
  {
    name: { ar: "مريم", en: "Mariam" },
    quote: {
      ar: "نزلت ٧ كيلو في شهرين وأنا مبسوطة، الأكل بيشبّع وعمري ما حسيت بجوع.",
      en: "Lost 7 kg in two months and I'm thrilled — the food is filling and I never felt hungry.",
    },
  },
  {
    name: { ar: "أحمد", en: "Ahmed" },
    quote: {
      ar: "البرنامج فهّمني آكل إزاي مش بس إيه، دلوقتي عارف أتصرف في أي مطعم.",
      en: "It taught me how to eat, not just what — now I can handle any restaurant.",
    },
  },
  {
    name: { ar: "نور", en: "Nour" },
    quote: {
      ar: "حسيت بفرق في طاقتي من أول أسبوع، بصحى نشيطة ومبقتش تعبانة بسرعة.",
      en: "My energy changed from the first week — I wake up active and don't tire quickly.",
    },
  },
  {
    name: { ar: "محمود", en: "Mahmoud" },
    quote: {
      ar: "الكابتن رد عليّا على الواتس في نص الليل لما اتلخبطت، خدمة مفيش زيها.",
      en: "The coach replied on WhatsApp at midnight when I got confused — service like no other.",
    },
  },
  {
    name: { ar: "دينا", en: "Dina" },
    quote: {
      ar: "بعد الولادة كنت يائسة، رجّعلي ثقتي في نفسي ورجع جسمي أحسن من الأول.",
      en: "After giving birth I was hopeless — he brought back my confidence and my body is better than before.",
    },
  },
  {
    name: { ar: "كريم", en: "Karim" },
    quote: {
      ar: "زودت عضل بشكل واضح، صحابي كلهم بيسألوني بتعمل إيه.",
      en: "Gained visible muscle — all my friends keep asking what I'm doing.",
    },
  },
  {
    name: { ar: "هبة", en: "Heba" },
    quote: {
      ar: "الدايت مرن ومفيهوش حرمان، باكل اللي بحبه وبنزل، حاجة مكنتش مصدقاها.",
      en: "The diet is flexible with no deprivation — I eat what I love and still lose. Couldn't believe it.",
    },
  },
  {
    name: { ar: "مصطفى", en: "Mostafa" },
    quote: {
      ar: "اشتركت وأنا مش متوقع حاجة، طلع أحسن قرار خدته السنة دي.",
      en: "I subscribed expecting nothing — turned out to be the best decision I made this year.",
    },
  },
];

export const FAQ: { q: L; a: L }[] = [
  {
    q: { ar: "إزاي بدفع؟", en: "How do I pay?" },
    a: {
      ar: "الدفع عن طريق إنستا باي على الرقم 01010082746، وبعد ما الكابتن يأكد الدفع هيتواصل معاك على واتساب لتفعيل اشتراكك.",
      en: "Pay by InstaPay to 01010082746. Once the coach confirms the payment, he contacts you on WhatsApp to activate your subscription.",
    },
  },
  {
    q: { ar: "هستلم البرنامج إمتى؟", en: "When do I get my plan?" },
    a: {
      ar: "خلال ٢٤–٤٨ ساعة من تأكيد الدفع بيتبعتلك البرنامج كامل.",
      en: "Your full plan is sent within 24–48 hours of payment confirmation.",
    },
  },
  {
    q: { ar: "البرنامج للستات والرجالة؟", en: "Is it for men and women?" },
    a: {
      ar: "أيوه، البرامج متاحة للجنسين وبتتفصّل حسب الهدف.",
      en: "Yes — programs are available for both and tailored to your goal.",
    },
  },
];

export const CONTACT = {
  /** Local display format. */
  phone: "01010082746",
  /** International format, digits only — for wa.me links. */
  whatsapp: "201010082746",
  instapay: "01010082746",
  whatsappGreeting: {
    ar: "مرحبا كابتن، حابب أستفسر عن الاشتراك",
    en: "Hi coach, I'd like to ask about subscribing",
  } as L,
};

/**
 * Photo sets copied from the trainer's existing site, converted to WebP under
 * public/brand/. Paths are generated from the file counts below.
 */
const range = (n: number, start = 1) => Array.from({ length: n }, (_, i) => i + start);

export const GALLERY = {
  /** Studio / gym shots of the trainer (portrait 599×900, except coach-5 landscape). */
  coach: range(4, 2).map((i) => `/brand/coach/coach-${i}.webp`),
  /** Client physique results (450×600). */
  transformations: range(9).map((i) => `/brand/transformations/t-${i}.webp`),
  /** Swimmers the trainer coached, with their medals (~450×560). */
  swimmers: range(11).map((i) => `/brand/swimmers/sw-${i}.webp`),
};
