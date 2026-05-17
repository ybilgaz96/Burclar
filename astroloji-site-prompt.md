# 🌙 ASTROLOJİ & BURÇLAR SİTESİ — TAM KAPSAMLI PROMPT

---

## GENEL AMAÇ

Türkçe ve İngilizce (global) dil desteğiyle çalışan, **pasif gelir odaklı**, premium astroloji & burç platformu oluştur. Site; günlük, haftalık ve aylık yorumlar sunacak, kullanıcıyı platforma bağlayacak interaktif araçlar içerecek ve çeşitli monetizasyon katmanlarına sahip olacak.

---

## TEKNİK YAPI

- **Tek sayfalık HTML/CSS/JS** uygulama (veya React ile JSX, tek dosya)
- Anthropic Claude API entegrasyonu (gerçek zamanlı AI yorumları)
- Dil seçimi: Türkçe 🇹🇷 / English 🇬🇧 (localStorage ile hatırlanır)
- Mobil öncelikli, responsive tasarım
- Dark mode varsayılan (mistik, derin uzay teması)

---

## ESTETİK & TASARIM YÖNERGELERİ

**Ton:** Lüks + mistik + editorial — "luxury cosmic oracle"
**Renk Paleti:**
- Arka plan: derin lacivert-siyah (#0a0612, #0d0a1e)
- Vurgu: altın (#d4af37), nebula moru (#7b2d8b), krem beyaz (#f5f0e8)
- Kartlar: yarı saydam glassmorphism (backdrop-filter: blur)

**Tipografi:**
- Başlıklar: "Cormorant Garamond" veya "Cinzel Decorative" (Google Fonts)
- Gövde: "EB Garamond" veya "Lora"
- Rakamlar/semboller: monospace accent

**Görsel Efektler:**
- Yıldız yağmuru animasyonu (canvas veya CSS particles)
- Burç sembollerinde glow efekti
- Kart hover'larında altın border glow
- Ay fazı animasyonu (dönen ay)
- Scroll reveal animasyonları
- Gradient mesh arka plan (auroral efekt)

---

## SAYFA YAPISI / BÖLÜMLER

### 1. HEADER / NAV
- Logo: ay + yıldız sembolü + "AstroOracle" (veya "KozmikRehber" Türkçe için)
- Dil toggle butonu (TR / EN)
- Nav linkleri: Günlük | Haftalık | Aylık | Doğum Haritam | Uyumluluk | Premium
- Ay fazı göstergesi (bugünün ay fazı, API ile)

---

### 2. HERO SEKSİYONU
- Büyük başlık: "Yıldızlar Sana Ne Söylüyor?" / "What Do The Stars Say To You?"
- Hareketli yıldız arka planı
- **Burç seçim dropdown'ı** (12 burç, emoji + sembol ile)
- "Yorumunu Al" / "Get Your Reading" CTA butonu
- Bugünün tarihi + ay fazı bilgisi

---

### 3. GÜNLÜK BURÇ YORUMLARI (AI Destekli)
- 12 burç için grid kartları (4x3)
- Her kart: burç sembolü, isim (TR/EN), element, gezegen
- Karta tıklayınca: Claude API ile o günün yorumu yüklenir
- Yorum kategorileri: Aşk ❤️ | Kariyer 💼 | Sağlık 🌿 | Genel ⭐
- Her kategori için 1-5 yıldız enerji göstergesi
- "Şanslı Sayı", "Şanslı Renk", "Şanslı Gün" bilgisi
- Paylaş butonu (Twitter/X, WhatsApp, kopyala)

**API Prompt Yapısı (Günlük):**
```
Sen uzman bir astrolog olarak [BURÇ] burcu için [TARİH] tarihine ait 
[TR/EN] dilinde günlük yorum yaz. Aşk, kariyer, sağlık ve genel enerji 
konularında ayrı paragraflar halinde, mistik ama pratik bir dil kullan. 
Şanslı sayı, renk ve günü de belirt. 150-200 kelime.
```

---

### 4. HAFTALIK YORUMLAR
- Seçilen burç için haftalık genel enerji haritası
- 7 günlük mini takvim görünümü (her gün için emoji + kısa not)
- "Bu Haftanın Teması" başlığı
- Haftalık tavsiyeler listesi (5 madde)
- Gezegen hareketlerinin etkisi

**API Prompt Yapısı (Haftalık):**
```
[BURÇ] burcu için [TARİH ARALIĞI] haftasına ait haftalık astroloji yorumu yaz.
[TR/EN] dilinde. Her gün için kısa bir enerji notu, haftanın genel teması,
önemli gezegen geçişleri ve 5 pratik tavsiye içersin. 300-400 kelime.
```

---

### 5. AYLIK YORUMLAR
- Ay boyunca önemli astrolojik olaylar zaman çizelgesi
- "Bu Ay Öne Çıkan Temalar" (3-4 tema kartı)
- Kariyer, aşk, finans, kişisel gelişim alt başlıkları
- Ay sonu özeti ve tavsiye
- Premium: Detaylı aylık PDF rapor (gelir kapısı)

---

### 6. İNTERAKTİF ARAÇLAR (Kullanıcı Tutma)

#### a) Doğum Haritası Hesaplayıcı
- Form: İsim, Doğum Tarihi, Doğum Saati, Doğum Yeri
- Güneş burcu, Ay burcu, Yükselen burcu hesaplama
- 3'lü burç kombinasyon yorumu (AI destekli)
- Görsel doğum haritası (SVG daire grafiği)

#### b) Burç Uyumluluk Testi
- İki burç seçimi (kullanıcı + partner)
- Aşk, arkadaşlık, iş uyumluluğu yüzdeleri
- Radar/spider chart görselleştirme
- Detaylı uyumluluk yorumu (AI)
- Paylaşılabilir uyumluluk kartı görseli

#### c) Günlük Tarot Kartı
- Her gün farklı bir kart (Major Arcana, 22 kart)
- Kart çevirme animasyonu
- Kartın anlamı + günlük tavsiye (AI)
- "Kartını Arkadaşına Gönder" özelliği

#### d) Ay Takvimi
- Aylık ay fazı takvimi (SVG animasyonlu)
- Her fazın enerjisi ve tavsiyesi
- "Ay Ritüeli" önerileri (yeni ay / dolunay için)
- Dilek/niyet belirleme bölümü

#### e) Numeroloji Hesaplayıcı
- İsim + doğum tarihi ile kader sayısı, yaşam yolu sayısı
- Sayıların mistik anlamları
- Burç + numeroloji kombinasyon yorumu

#### f) Ask the Oracle (Soru-Cevap AI)
- Serbest soru giriş alanı
- Claude API ile mistik, astrolojik dil kullanarak yanıt
- Konu önerileri: aşk, kariyer, karar verme, gelecek
- Günde 3 soru limiti (premium'da sınırsız)

---

### 7. BURÇ REHBERİ (SEO + İçerik)

12 burç için detaylı bilgi sayfaları:
- Sembol, element, yönetici gezegen, modalite
- Karakter özellikleri (güçlü yönler / zorluklar)
- Ünlü [Burç] örnekleri
- Uyumlu burçlar
- Kariyer önerileri
- Aşk hayatı
- Sağlık önerileri
- 2025 yıl yorumu

---

### 8. BLOG / MAKALE BÖLÜMÜ (SEO Trafiği)

Konular:
- Gezegen geçişleri ve etkileri (Merkür retro, Venüs geçişi vb.)
- "Burçlara Göre [X]" listeleri (hediyelik eşya, seyahat yeri, kariyer)
- Ay ritüelleri rehberi
- Astroloji 101: Başlangıç rehberi
- Gerçek yaşam astroloji hikayeleri

---

### 9. MONETİZASYON KATMANLARI

#### Ücretsiz (Free Tier)
- Günlük yorum özeti (kısa)
- Ay takvimi
- Temel uyumluluk
- Günde 3 Oracle sorusu

#### Premium (Aylık/Yıllık Abonelik)
- Tam günlük/haftalık/aylık yorumlar
- Sınırsız Oracle sorusu
- Kişisel doğum haritası analizi
- Aylık PDF rapor (otomatik oluşturulan)
- Reklamsız deneyim
- Öncelikli içerik erişimi

**Premium Fiyatlandırma Gösterimi:**
```
🌙 Ay Planı: ₺99/ay | $4.99/mo
⭐ Yıl Planı: ₺799/yıl | $39.99/yr (2 ay bedava!)
✨ Ömür Boyu: ₺1999 | $99 (sınırlı)
```

#### Ek Gelir Kaynakları (UI'da göster)
- Kişisel okuma seansı booking (Calendly entegrasyonu)
- Dijital ürünler: Ay Ritüeli PDF'leri, Doğum Haritası Kiti
- Affiliate: Kristal, tarot kartı, kitap önerileri (her ürünün yanında link)
- Google AdSense placeholder (ücretsiz kullanıcılar için)

---

### 10. NEWSLETTER / E-POSTA TOPLAMA
- "Haftanın Kozmik Enerjisi" bülteni
- E-posta girişi + burç seçimi
- Teşvik: "Ücretsiz Doğum Haritası PDF al"
- Mailchimp/ConvertKit embed formu

---

### 11. FOOTER
- Hızlı linkler
- Sosyal medya (Instagram, TikTok, YouTube için astroloji içerikleri)
- Dil seçimi
- KVKK / Privacy Policy
- "Bu site Claude AI destekliyle güçlendirilmiştir" notu

---

## VERİ & DURUM YÖNETİMİ

```javascript
// localStorage'da saklanacaklar:
{
  userSign: "kova",           // seçilen burç
  language: "tr",             // dil tercihi
  isPremium: false,           // premium durum
  oracleQuestionsToday: 2,    // günlük soru sayacı
  lastVisit: "2025-01-15",    // son ziyaret
  birthData: {...},           // doğum haritası verisi
  savedReadings: [...]        // kaydedilen yorumlar
}
```

---

## CLAUDE API ENTEGRASYON DETAYLARI

```javascript
const SYSTEM_PROMPT = `
Sen AstroOracle platformunun mistik astroloji asistanısın.
- Türkçe veya İngilizce yaz (kullanıcının diline göre)
- Mistik, sıcak, umut verici ama gerçekçi bir dil kullan
- Asla kesin tahminler yapma, rehberlik sun
- Her yorumda pratik bir tavsiye ekle
- Yanıtları format: önce enerji özeti, sonra kategoriler, son tavsiye
- Emojileri ölçülü kullan (paragraf başına 1)
`;
```

---

## MOBİL UX DETAYLARI

- Bottom navigation bar (mobilde sabit): 🏠 Ana | ♈ Burcum | 🌙 Ay | 🔮 Oracle | ⭐ Premium
- Swipe ile burçlar arası geçiş
- Paylaş butonu: Instagram Story boyutunda kart oluşturma (canvas)
- PWA desteği: "Ana ekrana ekle" bildirimi
- Push notification: "Günlük yorumun hazır!" (isteğe bağlı)

---

## SEO VE BÜYÜME STRATEJİSİ (Kod İçi Meta)

```html
<!-- Her burç sayfası için dinamik meta tagları -->
<meta name="description" content="[BURÇ] burcu günlük yorumu [TARİH] - Aşk, kariyer ve sağlık...">
<meta property="og:image" content="[dinamik burç kartı görseli]">

<!-- Schema markup -->
<script type="application/ld+json">
{
  "@type": "WebApplication",
  "name": "AstroOracle",
  "description": "AI-powered astrology platform"
}
</script>
```

**Hedef Anahtar Kelimeler:**
- TR: "kova burcu yorumu", "haftalık burç", "doğum haritası", "burç uyumu"
- EN: "daily horoscope", "birth chart calculator", "zodiac compatibility"

---

## ÖRNEK KOD YAPISI (React)

```jsx
// Ana bileşen yapısı
<AstroApp>
  <StarfieldBackground />      // Canvas yıldız animasyonu
  <LanguageProvider>           // TR/EN context
    <Header />
    <HeroSection>
      <ZodiacPicker />
      <MoonPhaseWidget />
    </HeroSection>
    <TabNav tabs={["Günlük", "Haftalık", "Aylık"]} />
    <ReadingsSection>
      <AIHoroscope />          // Claude API çağrısı
      <LuckyNumbers />
      <ShareCard />
    </ReadingsSection>
    <ToolsGrid>
      <BirthChart />
      <CompatibilityTest />
      <DailyTarot />
      <MoonCalendar />
      <OracleChat />
    </ToolsGrid>
    <PremiumUpsell />
    <Newsletter />
    <Footer />
  </LanguageProvider>
</AstroApp>
```

---

## LOADING & ERROR STATE'LERİ

- API yüklenirken: dönen yıldız animasyonu + "Yıldızlar okunuyor..." / "Reading the stars..."
- Hata durumu: "Evren şu an meşgul, tekrar dene" + retry butonu
- Rate limit: "Günlük 3 sorun bitti, Premium'a geç" mesajı

---

## SOSYAL PAYLAŞIM KARTI OLUŞTURUCU

Canvas ile dinamik görsel:
- Burç sembolü (büyük)
- Yorumun ilk 2 cümlesi
- AstroOracle logosu + URL
- Tarih
- Gradient arka plan (burca özel renk)
- PNG olarak indir / direkt paylaş

---

## TAMAMLANMIŞ SİTE İÇİN YAPILACAKLAR SIRASI

1. Bu prompt ile temel HTML/React dosyasını oluştur
2. Claude API key'ini al (api.anthropic.com)
3. Vercel veya Netlify'a deploy et (ücretsiz)
4. Google Analytics ekle
5. AdSense başvurusu yap (trafik sonrası)
6. Stripe entegrasyonu ile premium ödemeler
7. Mailchimp/Brevo ile email listesi
8. Instagram + TikTok'ta burç içerikleri paylaş (organik trafik)

---

*Bu prompt ile oluşturulacak site; AI yorumları, interaktif araçlar ve çoklu gelir modeli sayesinde günlük pasif gelir üretmeye hazır bir platform olacak.*
