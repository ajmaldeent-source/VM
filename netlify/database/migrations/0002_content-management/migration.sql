-- Editable website content managed from the admin area.

CREATE TABLE IF NOT EXISTS products (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  category        TEXT NOT NULL CHECK (category IN ('valves', 'instruments', 'fittings', 'spares')),
  name_en         TEXT NOT NULL,
  name_ar         TEXT NOT NULL,
  summary_en      TEXT NOT NULL DEFAULT '',
  summary_ar      TEXT NOT NULL DEFAULT '',
  description_en  TEXT NOT NULL DEFAULT '',
  description_ar  TEXT NOT NULL DEFAULT '',
  features_en     JSONB NOT NULL DEFAULT '[]'::jsonb,  -- ["…", "…"]
  features_ar     JSONB NOT NULL DEFAULT '[]'::jsonb,
  specs_en        JSONB NOT NULL DEFAULT '[]'::jsonb,  -- [{"label": "…", "value": "…"}]
  specs_ar        JSONB NOT NULL DEFAULT '[]'::jsonb,
  image_url       TEXT,
  published       BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS products_public_idx ON products (published, sort_order, created_at);

CREATE TABLE IF NOT EXISTS hero_slides (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind        TEXT NOT NULL CHECK (kind IN ('image', 'video')),
  media_url   TEXT NOT NULL,
  poster_url  TEXT,
  alt_en      TEXT NOT NULL DEFAULT '',
  alt_ar      TEXT NOT NULL DEFAULT '',
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_settings (
  key         TEXT PRIMARY KEY,
  value       JSONB NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Starting content (placeholders). Safe to edit or delete from the admin area.
INSERT INTO products (slug, category, name_en, name_ar, summary_en, summary_ar, description_en, description_ar, features_en, features_ar, specs_en, specs_ar, image_url, published, sort_order) VALUES ('gate-valve', 'valves', 'Gate Valve — Placeholder', 'صمام بوابة — مؤقت', 'Full-bore isolation valve for pipelines and process lines.', 'صمام عزل كامل الفتحة لخطوط الأنابيب والعمليات.', 'Placeholder product. Final model range, manufacturers and datasheets to be confirmed by the client.', 'منتج مؤقت. يؤكّد العميل الطرازات والمصنّعين وأوراق البيانات النهائية.', '["Full-bore, low pressure drop","Bolted bonnet design","Handwheel or gear operated"]'::jsonb, '["فتحة كاملة وانخفاض ضغط منخفض","غطاء مثبّت بمسامير","تشغيل يدوي أو بعلبة تروس"]'::jsonb, '[{"label":"Size range","value":"2\" – 24\" (placeholder)"},{"label":"Pressure class","value":"ASME 150 – 1500 (placeholder)"},{"label":"Body material","value":"Carbon steel / stainless steel"},{"label":"Standard","value":"API 600 — confirm"}]'::jsonb, '[{"label":"نطاق المقاسات","value":"2\" – 24\" (مؤقت)"},{"label":"فئة الضغط","value":"ASME 150 – 1500 (مؤقت)"},{"label":"مادة الجسم","value":"فولاذ كربوني / فولاذ مقاوم للصدأ"},{"label":"المعيار","value":"API 600 — يُؤكَّد"}]'::jsonb, '/media/product-valves.svg', TRUE, 10) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, category, name_en, name_ar, summary_en, summary_ar, description_en, description_ar, features_en, features_ar, specs_en, specs_ar, image_url, published, sort_order) VALUES ('ball-valve', 'valves', 'Ball Valve — Placeholder', 'صمام كروي — مؤقت', 'Quarter-turn valve for fast, tight shut-off.', 'صمام ربع دورة للإغلاق السريع والمحكم.', 'Placeholder product. Final model range, manufacturers and datasheets to be confirmed by the client.', 'منتج مؤقت. يؤكّد العميل الطرازات والمصنّعين وأوراق البيانات النهائية.', '["Floating or trunnion-mounted ball","Fire-safe design option","Actuator-ready mounting pad"]'::jsonb, '["كرة عائمة أو مثبتة بمحور","خيار تصميم مقاوم للحريق","قاعدة جاهزة لتركيب المشغّل"]'::jsonb, '[{"label":"Size range","value":"½\" – 36\" (placeholder)"},{"label":"Pressure class","value":"ASME 150 – 2500 (placeholder)"},{"label":"Seats","value":"Soft or metal seated"},{"label":"Standard","value":"API 6D / ISO 17292 — confirm"}]'::jsonb, '[{"label":"نطاق المقاسات","value":"½\" – 36\" (مؤقت)"},{"label":"فئة الضغط","value":"ASME 150 – 2500 (مؤقت)"},{"label":"المقاعد","value":"مقاعد لينة أو معدنية"},{"label":"المعيار","value":"API 6D / ISO 17292 — يُؤكَّد"}]'::jsonb, '/media/product-valves.svg', TRUE, 20) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, category, name_en, name_ar, summary_en, summary_ar, description_en, description_ar, features_en, features_ar, specs_en, specs_ar, image_url, published, sort_order) VALUES ('check-valve', 'valves', 'Check Valve — Placeholder', 'صمام عدم رجوع — مؤقت', 'Prevents reverse flow in pumps and pipelines.', 'يمنع التدفق العكسي في المضخات وخطوط الأنابيب.', 'Placeholder product. Final model range, manufacturers and datasheets to be confirmed by the client.', 'منتج مؤقت. يؤكّد العميل الطرازات والمصنّعين وأوراق البيانات النهائية.', '["Swing, lift or dual-plate types","Low cracking pressure","Horizontal or vertical installation"]'::jsonb, '["أنواع متأرجحة أو رفع أو ثنائية الألواح","ضغط فتح منخفض","تركيب أفقي أو رأسي"]'::jsonb, '[{"label":"Size range","value":"2\" – 48\" (placeholder)"},{"label":"Pressure class","value":"ASME 150 – 900 (placeholder)"},{"label":"Standard","value":"API 594 / API 6D — confirm"}]'::jsonb, '[{"label":"نطاق المقاسات","value":"2\" – 48\" (مؤقت)"},{"label":"فئة الضغط","value":"ASME 150 – 900 (مؤقت)"},{"label":"المعيار","value":"API 594 / API 6D — يُؤكَّد"}]'::jsonb, '/media/product-valves.svg', TRUE, 30) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, category, name_en, name_ar, summary_en, summary_ar, description_en, description_ar, features_en, features_ar, specs_en, specs_ar, image_url, published, sort_order) VALUES ('pressure-transmitter', 'instruments', 'Pressure Transmitter — Placeholder', 'مرسل ضغط — مؤقت', 'Smart transmitter for pressure and differential pressure.', 'مرسل ذكي للضغط وفرق الضغط.', 'Placeholder product. Final model range, manufacturers and datasheets to be confirmed by the client.', 'منتج مؤقت. يؤكّد العميل الطرازات والمصنّعين وأوراق البيانات النهائية.', '["4–20 mA with HART","Local display","Hazardous-area certified options"]'::jsonb, '["4–20 مللي أمبير مع HART","شاشة محلية","خيارات معتمدة للمناطق الخطرة"]'::jsonb, '[{"label":"Range","value":"Up to 400 bar (placeholder)"},{"label":"Accuracy","value":"±0.075% (placeholder)"},{"label":"Certification","value":"ATEX / IECEx — confirm"}]'::jsonb, '[{"label":"النطاق","value":"حتى 400 بار (مؤقت)"},{"label":"الدقة","value":"±0.075% (مؤقت)"},{"label":"الشهادات","value":"ATEX / IECEx — يُؤكَّد"}]'::jsonb, '/media/product-instruments.svg', TRUE, 40) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, category, name_en, name_ar, summary_en, summary_ar, description_en, description_ar, features_en, features_ar, specs_en, specs_ar, image_url, published, sort_order) VALUES ('pressure-gauge', 'instruments', 'Pressure Gauge — Placeholder', 'مقياس ضغط — مؤقت', 'Bourdon-tube gauges for local pressure indication.', 'مقاييس بأنبوب بوردون لقراءة الضغط محليًا.', 'Placeholder product. Final model range, manufacturers and datasheets to be confirmed by the client.', 'منتج مؤقت. يؤكّد العميل الطرازات والمصنّعين وأوراق البيانات النهائية.', '["Stainless steel case","Glycerine-filled option","Diaphragm seal option"]'::jsonb, '["هيكل من الفولاذ المقاوم للصدأ","خيار مملوء بالجلسرين","خيار عازل غشائي"]'::jsonb, '[{"label":"Dial size","value":"2½\" – 6\" (placeholder)"},{"label":"Accuracy class","value":"1.0 (placeholder)"},{"label":"Standard","value":"EN 837 — confirm"}]'::jsonb, '[{"label":"قطر الواجهة","value":"2½\" – 6\" (مؤقت)"},{"label":"فئة الدقة","value":"1.0 (مؤقت)"},{"label":"المعيار","value":"EN 837 — يُؤكَّد"}]'::jsonb, '/media/product-instruments.svg', TRUE, 50) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, category, name_en, name_ar, summary_en, summary_ar, description_en, description_ar, features_en, features_ar, specs_en, specs_ar, image_url, published, sort_order) VALUES ('flanges', 'fittings', 'Flanges — Placeholder', 'شفّات — مؤقت', 'Weld-neck, slip-on and blind flanges for piping systems.', 'شفّات ذات رقبة لحام وانزلاقية وعمياء لأنظمة الأنابيب.', 'Placeholder product. Final model range, manufacturers and datasheets to be confirmed by the client.', 'منتج مؤقت. يؤكّد العميل الطرازات والمصنّعين وأوراق البيانات النهائية.', '["Raised face or RTJ","Mill test certificates supplied","Carbon, alloy and stainless grades"]'::jsonb, '["وجه بارز أو RTJ","شهادات اختبار المصنع مرفقة","درجات كربونية وسبائكية ومقاومة للصدأ"]'::jsonb, '[{"label":"Size range","value":"½\" – 48\" (placeholder)"},{"label":"Standard","value":"ASME B16.5 / B16.47 — confirm"}]'::jsonb, '[{"label":"نطاق المقاسات","value":"½\" – 48\" (مؤقت)"},{"label":"المعيار","value":"ASME B16.5 / B16.47 — يُؤكَّد"}]'::jsonb, '/media/product-fittings.svg', TRUE, 60) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, category, name_en, name_ar, summary_en, summary_ar, description_en, description_ar, features_en, features_ar, specs_en, specs_ar, image_url, published, sort_order) VALUES ('tube-fittings', 'fittings', 'Instrument Tube Fittings — Placeholder', 'تجهيزات أنابيب القياس — مؤقت', 'Compression fittings and valves for instrument tubing.', 'تجهيزات ضغط وصمامات لأنابيب أجهزة القياس.', 'Placeholder product. Final model range, manufacturers and datasheets to be confirmed by the client.', 'منتج مؤقت. يؤكّد العميل الطرازات والمصنّعين وأوراق البيانات النهائية.', '["Twin-ferrule design","316 stainless steel","Metric and imperial sizes"]'::jsonb, '["تصميم بحلقتين","فولاذ مقاوم للصدأ 316","مقاسات مترية وإنشية"]'::jsonb, '[{"label":"Tube sizes","value":"⅛\" – 1\" / 3 – 25 mm (placeholder)"},{"label":"Pressure rating","value":"Up to 400 bar (placeholder)"}]'::jsonb, '[{"label":"مقاسات الأنابيب","value":"⅛\" – 1\" / 3 – 25 مم (مؤقت)"},{"label":"تصنيف الضغط","value":"حتى 400 بار (مؤقت)"}]'::jsonb, '/media/product-fittings.svg', TRUE, 70) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, category, name_en, name_ar, summary_en, summary_ar, description_en, description_ar, features_en, features_ar, specs_en, specs_ar, image_url, published, sort_order) VALUES ('mechanical-seals', 'spares', 'Pump Mechanical Seals — Placeholder', 'موانع تسرب ميكانيكية للمضخات — مؤقت', 'Replacement seals and spares for rotating equipment.', 'موانع تسرب وقطع غيار بديلة للمعدات الدوارة.', 'Placeholder product. Final model range, manufacturers and datasheets to be confirmed by the client.', 'منتج مؤقت. يؤكّد العميل الطرازات والمصنّعين وأوراق البيانات النهائية.', '["Single and double cartridge seals","OEM-equivalent spares","Seal support systems"]'::jsonb, '["موانع خرطوشية مفردة ومزدوجة","قطع غيار مكافئة للأصلية","أنظمة دعم موانع التسرب"]'::jsonb, '[{"label":"Standard","value":"API 682 — confirm"},{"label":"Supply","value":"Stock and project-based (placeholder)"}]'::jsonb, '[{"label":"المعيار","value":"API 682 — يُؤكَّد"},{"label":"التوريد","value":"من المخزون وحسب المشروع (مؤقت)"}]'::jsonb, '/media/product-spares.svg', TRUE, 80) ON CONFLICT (slug) DO NOTHING;

INSERT INTO hero_slides (kind, media_url, poster_url, alt_en, alt_ar, sort_order)
SELECT * FROM (VALUES
  ('video', '/media/hero-placeholder.mp4', '/media/hero-placeholder-poster.jpg', 'Placeholder video of fluid flowing through a pipeline', 'فيديو مؤقت لتدفق داخل خط أنابيب', 10),
  ('image', '/media/hero-piping.svg', NULL, 'Placeholder illustration of a pipe rack with a valve', 'رسم مؤقت لحامل أنابيب مع صمام', 20),
  ('image', '/media/hero-instrumentation.svg', NULL, 'Placeholder illustration of pressure gauges', 'رسم مؤقت لمقاييس الضغط', 30),
  ('image', '/media/hero-workshop.svg', NULL, 'Placeholder illustration of an industrial plant at dusk', 'رسم مؤقت لمنشأة صناعية عند الغروب', 40)
) AS v(kind, media_url, poster_url, alt_en, alt_ar, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM hero_slides);

INSERT INTO site_settings (key, value) VALUES
  ('hero_interval_ms', '7000'::jsonb),
  ('hero_show_placeholder_badge', 'true'::jsonb)
ON CONFLICT (key) DO NOTHING;
