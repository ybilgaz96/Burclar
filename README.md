# KozmikRehber

AI destekli günlük, haftalık ve aylık burç yorumları platformu.

## Teknolojiler

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **AI API**: OpenCode AI (Qwen/DeepSeek modelleri)
- **Hosting**: Vercel (static hosting + serverless functions)

## Kurulum

```bash
npm install
```

## Geliştirme

```bash
# Burç yorumları oluştur (CI'da otomatik çalışır)
npm run generate

# Statik sayfaları oluştur
npm run build
```

## Ortam Değişkenleri

```bash
cp .env.example .env
# OPENCODE_API_KEY ayarla
```

## Yapı

- `index.html` - Ana giriş sayfası
- `app.js` - Ana uygulama mantığı (SPA)
- `i18n.js` - Çoklu dil desteği (TR/EN)
- `tools.js` - Astroloji araçları
- `horoscope.js` - AI API istemcisi + cache
- `api/chat.js` - Serverless API endpoint
- `scripts/generate.js` - AI ile burç içeriği üretir
- `scripts/build-pages.js` - JSON'dan statik HTML oluşturur
- `data/` - Üretilen burç verileri (gitignore'da)

## Özellikler

- 12 burç için günlük/haftalık/aylık yorumlar
- Doğum haritası hesaplama
- Burç uyumluluk testi
- Günlük tarot kartı
- Ay takvimi
- Oracle (günlük 3 soru)

## Lisans

© 2026 KozmikRehber