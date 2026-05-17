# KozmikRehber - Astroloji Sitesi

AI destekli burç yorum platformu. Günlük, haftalık ve aylık burç yorumları, interaktif araçlar ve daha fazlası.

## Özellikler

- Günlük, haftalık ve aylık AI destekli burç yorumları
- Doğum haritası hesaplama (Güneş, Ay, Yükselen burç)
- Burç uyumluluk testi
- Günlük tarot kartı
- Ay takvimi ve ritüelleri
- Numeroloji hesaplayıcı
- Oracle (Soru-Cevap) - Günde 3 soru
- Türkçe / İngilizce dil desteği
- Mobil uyumlu tasarım
- Premium planları

## Teknoloji Stack

- **Frontend:** Vanilla JS, HTML5, CSS3
- **Backend:** Vercel Serverless Functions
- **AI:** OpenCode Go (DeepSeek V4 Pro & Flash modelleri)
- **Styling:** Glassmorphism, Cosmic theme

## Deployment

### 1. OpenCode Go API Key Al

1. [OpenCode.ai](https://opencode.ai/auth) hesabı oluştur
2. Go planına abone ol ($5 ilk ay, sonra $10/ay)
3. API key'i al

### 2. Vercel'e Deploy

1. [Vercel](https://vercel.com) hesabı oluştur ve GitHub'ınla bağla
2. Projeyi GitHub'a yükle
3. Vercel'de "New Project" > GitHub repo'yu seç
4. Environment Variables'a ekle:
   - `OPENCODE_API_KEY` = OpenCode Go API key'in
5. Deploy!

### 3. Local Test

```bash
# Vercel CLI kur
npm i -g vercel

# Login
vercel login

# Preview deploy
vercel

# Production deploy
vercel --prod
```

## Maliyet

- **OpenCode Go:** $5 ilk ay, $10/ay (31,650 istek/5 saat DeepSeek V4 Flash ile)
- **Hosting:** Vercel Free tier (yeterli)
- **Toplam:** ~$10/ay

## Proje Yapısı

```
Burclar/
├── index.html          # Ana HTML
├── styles.css          # CSS stilleri
├── app.js              # Ana uygulama mantığı
├── i18n.js             # Çeviriler ve sabitler
├── horoscope.js        # AI prompt ve cache mantığı
├── tools.js            # İnteraktif araçlar
├── api/
│   └── chat.js         # Vercel serverless function
├── vercel.json         # Vercel konfigürasyonu
└── .env.example        # Environment değişkenleri şablonu
```

## Özelleştirme

### API Modeli Değiştirme

`api/chat.js` dosyasında `MODEL_CONFIG` objesini düzenle:

```javascript
const MODEL_CONFIG = {
  "deepseek-v4-pro": { /* kaliteli yorumlar için */ },
  "deepseek-v4-flash": { /* oracle ve hızlı cevaplar için */ }
};
```

### Cache Süreleri

`horoscope.js` dosyasında `CACHE_DURATION` objesini düzenle:

```javascript
const CACHE_DURATION = {
  daily: 24 * 60 * 60 * 1000,     // 24 saat
  weekly: 7 * 24 * 60 * 60 * 1000, // 7 gün
  monthly: 30 * 24 * 60 * 60 * 1000 // 30 gün
};
```

## Lisans

MIT