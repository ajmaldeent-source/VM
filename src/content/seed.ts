// Starting content: loaded into the database by migration 0002 and used as a
// read-only fallback when the database is unavailable (e.g. plain `next start` locally).
// Edit content in the admin area, not here.
import type { HeroSlideInput, ProductInput } from "./model";

export const seedProducts: ProductInput[] = [
  {
    "slug": "gate-valve",
    "category": "valves",
    "name": {
      "en": "Gate Valve — Placeholder",
      "ar": "صمام بوابة — مؤقت"
    },
    "summary": {
      "en": "Full-bore isolation valve for pipelines and process lines.",
      "ar": "صمام عزل كامل الفتحة لخطوط الأنابيب والعمليات."
    },
    "description": {
      "en": "Placeholder product. Final model range, manufacturers and datasheets to be confirmed by the client.",
      "ar": "منتج مؤقت. يؤكّد العميل الطرازات والمصنّعين وأوراق البيانات النهائية."
    },
    "features": {
      "en": [
        "Full-bore, low pressure drop",
        "Bolted bonnet design",
        "Handwheel or gear operated"
      ],
      "ar": [
        "فتحة كاملة وانخفاض ضغط منخفض",
        "غطاء مثبّت بمسامير",
        "تشغيل يدوي أو بعلبة تروس"
      ]
    },
    "specs": {
      "en": [
        {
          "label": "Size range",
          "value": "2\" – 24\" (placeholder)"
        },
        {
          "label": "Pressure class",
          "value": "ASME 150 – 1500 (placeholder)"
        },
        {
          "label": "Body material",
          "value": "Carbon steel / stainless steel"
        },
        {
          "label": "Standard",
          "value": "API 600 — confirm"
        }
      ],
      "ar": [
        {
          "label": "نطاق المقاسات",
          "value": "2\" – 24\" (مؤقت)"
        },
        {
          "label": "فئة الضغط",
          "value": "ASME 150 – 1500 (مؤقت)"
        },
        {
          "label": "مادة الجسم",
          "value": "فولاذ كربوني / فولاذ مقاوم للصدأ"
        },
        {
          "label": "المعيار",
          "value": "API 600 — يُؤكَّد"
        }
      ]
    },
    "imageUrl": "/media/product-valves.svg",
    "published": true,
    "sortOrder": 10
  },
  {
    "slug": "ball-valve",
    "category": "valves",
    "name": {
      "en": "Ball Valve — Placeholder",
      "ar": "صمام كروي — مؤقت"
    },
    "summary": {
      "en": "Quarter-turn valve for fast, tight shut-off.",
      "ar": "صمام ربع دورة للإغلاق السريع والمحكم."
    },
    "description": {
      "en": "Placeholder product. Final model range, manufacturers and datasheets to be confirmed by the client.",
      "ar": "منتج مؤقت. يؤكّد العميل الطرازات والمصنّعين وأوراق البيانات النهائية."
    },
    "features": {
      "en": [
        "Floating or trunnion-mounted ball",
        "Fire-safe design option",
        "Actuator-ready mounting pad"
      ],
      "ar": [
        "كرة عائمة أو مثبتة بمحور",
        "خيار تصميم مقاوم للحريق",
        "قاعدة جاهزة لتركيب المشغّل"
      ]
    },
    "specs": {
      "en": [
        {
          "label": "Size range",
          "value": "½\" – 36\" (placeholder)"
        },
        {
          "label": "Pressure class",
          "value": "ASME 150 – 2500 (placeholder)"
        },
        {
          "label": "Seats",
          "value": "Soft or metal seated"
        },
        {
          "label": "Standard",
          "value": "API 6D / ISO 17292 — confirm"
        }
      ],
      "ar": [
        {
          "label": "نطاق المقاسات",
          "value": "½\" – 36\" (مؤقت)"
        },
        {
          "label": "فئة الضغط",
          "value": "ASME 150 – 2500 (مؤقت)"
        },
        {
          "label": "المقاعد",
          "value": "مقاعد لينة أو معدنية"
        },
        {
          "label": "المعيار",
          "value": "API 6D / ISO 17292 — يُؤكَّد"
        }
      ]
    },
    "imageUrl": "/media/product-valves.svg",
    "published": true,
    "sortOrder": 20
  },
  {
    "slug": "check-valve",
    "category": "valves",
    "name": {
      "en": "Check Valve — Placeholder",
      "ar": "صمام عدم رجوع — مؤقت"
    },
    "summary": {
      "en": "Prevents reverse flow in pumps and pipelines.",
      "ar": "يمنع التدفق العكسي في المضخات وخطوط الأنابيب."
    },
    "description": {
      "en": "Placeholder product. Final model range, manufacturers and datasheets to be confirmed by the client.",
      "ar": "منتج مؤقت. يؤكّد العميل الطرازات والمصنّعين وأوراق البيانات النهائية."
    },
    "features": {
      "en": [
        "Swing, lift or dual-plate types",
        "Low cracking pressure",
        "Horizontal or vertical installation"
      ],
      "ar": [
        "أنواع متأرجحة أو رفع أو ثنائية الألواح",
        "ضغط فتح منخفض",
        "تركيب أفقي أو رأسي"
      ]
    },
    "specs": {
      "en": [
        {
          "label": "Size range",
          "value": "2\" – 48\" (placeholder)"
        },
        {
          "label": "Pressure class",
          "value": "ASME 150 – 900 (placeholder)"
        },
        {
          "label": "Standard",
          "value": "API 594 / API 6D — confirm"
        }
      ],
      "ar": [
        {
          "label": "نطاق المقاسات",
          "value": "2\" – 48\" (مؤقت)"
        },
        {
          "label": "فئة الضغط",
          "value": "ASME 150 – 900 (مؤقت)"
        },
        {
          "label": "المعيار",
          "value": "API 594 / API 6D — يُؤكَّد"
        }
      ]
    },
    "imageUrl": "/media/product-valves.svg",
    "published": true,
    "sortOrder": 30
  },
  {
    "slug": "pressure-transmitter",
    "category": "instruments",
    "name": {
      "en": "Pressure Transmitter — Placeholder",
      "ar": "مرسل ضغط — مؤقت"
    },
    "summary": {
      "en": "Smart transmitter for pressure and differential pressure.",
      "ar": "مرسل ذكي للضغط وفرق الضغط."
    },
    "description": {
      "en": "Placeholder product. Final model range, manufacturers and datasheets to be confirmed by the client.",
      "ar": "منتج مؤقت. يؤكّد العميل الطرازات والمصنّعين وأوراق البيانات النهائية."
    },
    "features": {
      "en": [
        "4–20 mA with HART",
        "Local display",
        "Hazardous-area certified options"
      ],
      "ar": [
        "4–20 مللي أمبير مع HART",
        "شاشة محلية",
        "خيارات معتمدة للمناطق الخطرة"
      ]
    },
    "specs": {
      "en": [
        {
          "label": "Range",
          "value": "Up to 400 bar (placeholder)"
        },
        {
          "label": "Accuracy",
          "value": "±0.075% (placeholder)"
        },
        {
          "label": "Certification",
          "value": "ATEX / IECEx — confirm"
        }
      ],
      "ar": [
        {
          "label": "النطاق",
          "value": "حتى 400 بار (مؤقت)"
        },
        {
          "label": "الدقة",
          "value": "±0.075% (مؤقت)"
        },
        {
          "label": "الشهادات",
          "value": "ATEX / IECEx — يُؤكَّد"
        }
      ]
    },
    "imageUrl": "/media/product-instruments.svg",
    "published": true,
    "sortOrder": 40
  },
  {
    "slug": "pressure-gauge",
    "category": "instruments",
    "name": {
      "en": "Pressure Gauge — Placeholder",
      "ar": "مقياس ضغط — مؤقت"
    },
    "summary": {
      "en": "Bourdon-tube gauges for local pressure indication.",
      "ar": "مقاييس بأنبوب بوردون لقراءة الضغط محليًا."
    },
    "description": {
      "en": "Placeholder product. Final model range, manufacturers and datasheets to be confirmed by the client.",
      "ar": "منتج مؤقت. يؤكّد العميل الطرازات والمصنّعين وأوراق البيانات النهائية."
    },
    "features": {
      "en": [
        "Stainless steel case",
        "Glycerine-filled option",
        "Diaphragm seal option"
      ],
      "ar": [
        "هيكل من الفولاذ المقاوم للصدأ",
        "خيار مملوء بالجلسرين",
        "خيار عازل غشائي"
      ]
    },
    "specs": {
      "en": [
        {
          "label": "Dial size",
          "value": "2½\" – 6\" (placeholder)"
        },
        {
          "label": "Accuracy class",
          "value": "1.0 (placeholder)"
        },
        {
          "label": "Standard",
          "value": "EN 837 — confirm"
        }
      ],
      "ar": [
        {
          "label": "قطر الواجهة",
          "value": "2½\" – 6\" (مؤقت)"
        },
        {
          "label": "فئة الدقة",
          "value": "1.0 (مؤقت)"
        },
        {
          "label": "المعيار",
          "value": "EN 837 — يُؤكَّد"
        }
      ]
    },
    "imageUrl": "/media/product-instruments.svg",
    "published": true,
    "sortOrder": 50
  },
  {
    "slug": "flanges",
    "category": "fittings",
    "name": {
      "en": "Flanges — Placeholder",
      "ar": "شفّات — مؤقت"
    },
    "summary": {
      "en": "Weld-neck, slip-on and blind flanges for piping systems.",
      "ar": "شفّات ذات رقبة لحام وانزلاقية وعمياء لأنظمة الأنابيب."
    },
    "description": {
      "en": "Placeholder product. Final model range, manufacturers and datasheets to be confirmed by the client.",
      "ar": "منتج مؤقت. يؤكّد العميل الطرازات والمصنّعين وأوراق البيانات النهائية."
    },
    "features": {
      "en": [
        "Raised face or RTJ",
        "Mill test certificates supplied",
        "Carbon, alloy and stainless grades"
      ],
      "ar": [
        "وجه بارز أو RTJ",
        "شهادات اختبار المصنع مرفقة",
        "درجات كربونية وسبائكية ومقاومة للصدأ"
      ]
    },
    "specs": {
      "en": [
        {
          "label": "Size range",
          "value": "½\" – 48\" (placeholder)"
        },
        {
          "label": "Standard",
          "value": "ASME B16.5 / B16.47 — confirm"
        }
      ],
      "ar": [
        {
          "label": "نطاق المقاسات",
          "value": "½\" – 48\" (مؤقت)"
        },
        {
          "label": "المعيار",
          "value": "ASME B16.5 / B16.47 — يُؤكَّد"
        }
      ]
    },
    "imageUrl": "/media/product-fittings.svg",
    "published": true,
    "sortOrder": 60
  },
  {
    "slug": "tube-fittings",
    "category": "fittings",
    "name": {
      "en": "Instrument Tube Fittings — Placeholder",
      "ar": "تجهيزات أنابيب القياس — مؤقت"
    },
    "summary": {
      "en": "Compression fittings and valves for instrument tubing.",
      "ar": "تجهيزات ضغط وصمامات لأنابيب أجهزة القياس."
    },
    "description": {
      "en": "Placeholder product. Final model range, manufacturers and datasheets to be confirmed by the client.",
      "ar": "منتج مؤقت. يؤكّد العميل الطرازات والمصنّعين وأوراق البيانات النهائية."
    },
    "features": {
      "en": [
        "Twin-ferrule design",
        "316 stainless steel",
        "Metric and imperial sizes"
      ],
      "ar": [
        "تصميم بحلقتين",
        "فولاذ مقاوم للصدأ 316",
        "مقاسات مترية وإنشية"
      ]
    },
    "specs": {
      "en": [
        {
          "label": "Tube sizes",
          "value": "⅛\" – 1\" / 3 – 25 mm (placeholder)"
        },
        {
          "label": "Pressure rating",
          "value": "Up to 400 bar (placeholder)"
        }
      ],
      "ar": [
        {
          "label": "مقاسات الأنابيب",
          "value": "⅛\" – 1\" / 3 – 25 مم (مؤقت)"
        },
        {
          "label": "تصنيف الضغط",
          "value": "حتى 400 بار (مؤقت)"
        }
      ]
    },
    "imageUrl": "/media/product-fittings.svg",
    "published": true,
    "sortOrder": 70
  },
  {
    "slug": "mechanical-seals",
    "category": "spares",
    "name": {
      "en": "Pump Mechanical Seals — Placeholder",
      "ar": "موانع تسرب ميكانيكية للمضخات — مؤقت"
    },
    "summary": {
      "en": "Replacement seals and spares for rotating equipment.",
      "ar": "موانع تسرب وقطع غيار بديلة للمعدات الدوارة."
    },
    "description": {
      "en": "Placeholder product. Final model range, manufacturers and datasheets to be confirmed by the client.",
      "ar": "منتج مؤقت. يؤكّد العميل الطرازات والمصنّعين وأوراق البيانات النهائية."
    },
    "features": {
      "en": [
        "Single and double cartridge seals",
        "OEM-equivalent spares",
        "Seal support systems"
      ],
      "ar": [
        "موانع خرطوشية مفردة ومزدوجة",
        "قطع غيار مكافئة للأصلية",
        "أنظمة دعم موانع التسرب"
      ]
    },
    "specs": {
      "en": [
        {
          "label": "Standard",
          "value": "API 682 — confirm"
        },
        {
          "label": "Supply",
          "value": "Stock and project-based (placeholder)"
        }
      ],
      "ar": [
        {
          "label": "المعيار",
          "value": "API 682 — يُؤكَّد"
        },
        {
          "label": "التوريد",
          "value": "من المخزون وحسب المشروع (مؤقت)"
        }
      ]
    },
    "imageUrl": "/media/product-spares.svg",
    "published": true,
    "sortOrder": 80
  }
];

export const seedHeroSlides: HeroSlideInput[] = [
  {
    "kind": "video",
    "mediaUrl": "/media/hero-placeholder.mp4",
    "posterUrl": "/media/hero-placeholder-poster.jpg",
    "alt": {
      "en": "Placeholder video of fluid flowing through a pipeline",
      "ar": "فيديو مؤقت لتدفق داخل خط أنابيب"
    },
    "active": true,
    "sortOrder": 10
  },
  {
    "kind": "image",
    "mediaUrl": "/media/hero-piping.svg",
    "posterUrl": null,
    "alt": {
      "en": "Placeholder illustration of a pipe rack with a valve",
      "ar": "رسم مؤقت لحامل أنابيب مع صمام"
    },
    "active": true,
    "sortOrder": 20
  },
  {
    "kind": "image",
    "mediaUrl": "/media/hero-instrumentation.svg",
    "posterUrl": null,
    "alt": {
      "en": "Placeholder illustration of pressure gauges",
      "ar": "رسم مؤقت لمقاييس الضغط"
    },
    "active": true,
    "sortOrder": 30
  },
  {
    "kind": "image",
    "mediaUrl": "/media/hero-workshop.svg",
    "posterUrl": null,
    "alt": {
      "en": "Placeholder illustration of an industrial plant at dusk",
      "ar": "رسم مؤقت لمنشأة صناعية عند الغروب"
    },
    "active": true,
    "sortOrder": 40
  }
];

export const seedSettings = { heroIntervalMs: 7000, heroShowPlaceholderBadge: true };
