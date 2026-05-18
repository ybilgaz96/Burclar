# KozmikRehber - Astroloji Sitesi

AI destekli burç yorum platformu. Günlük, haftalık ve aylık burç yorumları, SEO optimizasyonu, 72 sayfa.

## Özellikler

- **72 SEO sayfası** — 12 burç × 3 periyot (günlük/haftalık/aylık)
- **Otomatik güncelleme** — Her gece GitLab CI/CD ile yeni içerik
- **Google uyumlu** — sitemap.xml, meta tags, Schema.org
- **AdSense hazır** — Her sayfada reklam alanı
- **Newsletter capture** — E-posta toplama formu

## Teknoloji Stack

- **Frontend:** Vanilla JS, HTML5, CSS3 (statik)
- **AI:** OpenCode Go (Qwen3.5 Plus)
- **CI/CD:** GitLab CI/CD (otomatik günlük generation)
- **Hosting:** Vercel (ücretsiz)
- **Styling:** Glassmorphism, Cosmic theme

## Deployment

### 1. GitLab'a Yükle

1. [GitLab](https://gitlab.com) hesabı oluştur
2. Yeni private repo oluştur: `burclar`
3. Projeyi GitLab'a push'la:
```bash
git remote add gitlab https://gitlab.com/KULLANICI/burclar.git
git push -u gitlab main
```

### 2. CI/CD Variables Ayarla

GitLab repo → Settings → CI/CD → Variables:

| Key | Value |
|---|---|
| `OPENCODE_API_KEY` | OpenCode Go API key'in |
| `GITLAB_TOKEN` | GitLab Personal Access Token (write_repository scope) |

Token oluştur: Settings → Access Tokens → "Add new token":
- Name: `ci-push`
- Scope: `write_repository`

### 3. Schedule Kur

GitLab repo → CI/CD → Schedules → "New schedule":
- Interval pattern: `0 0 * * *` (her gece 00:00 UTC = 03:00 TR)
- Target branch: `main`

### 4. Vercel Bağlantısı

1. [Vercel](https://vercel.com) → New Project → "Import Git Repository"
2. GitLab'ı seç ve `burclar` reposunu import et
3. Environment Variables:
   - `OPENCODE_API_KEY` = API key'in

## Local Test

```bash
# API key'i export et
export OPENCODE_API_KEY="your-key-here"

# Horoscope üret (36 istek API'ye)
node scripts/generate.js

# HTML sayfaları oluştur
node scripts/build-pages.js

# Vercel'de görüntüle
npx vercel dev
```

## Proje Yapısı

```
Burclar/
├── index.html              # Ana sayfa (burç seçici)
├── pages/                  # 36 + 36 = 72 SEO sayfası (otomatik üretilir)
│   ├── kova-gunluk.html
│   ├── kova-haftalik.html
│   └── ...
├── data/                   # Ham JSON verisi (otomatik)
│   └── 2026-05-18.json
├── scripts/
│   ├── generate.js          # API'den içerik çeker
│   └── build-pages.js      # HTML üretir
├── templates/
│   └── page.html            # Sayfa şablonu
├── .gitlab-ci.yml           # GitLab CI/CD konfigürasyonu
├── api/
│   └── chat.js             # Oracle Q&A (Vercel serverless)
├── styles.css
└── app-init.js
```

## Workflow

```
GitLab CI (her gece 00:00 UTC)
    │
    ├── generate.js → 36 API isteği (12 × günlük + 12 × haftalık + 12 × aylık)
    ├── build-pages.js → 36 HTML + sitemap.xml
    │
    └── git push → Vercel auto-redeploy
```

## Maliyet

- **OpenCode Go:** $5 ilk ay, $10/ay (Qwen3.5 Plus: 50,500 istek/ay)
- **GitLab CI/CD:** $0 (400 dk/ay bedava)
- **Vercel:** $0 (Hobby tier)
- **Toplam:** ~$10/ay

## SEO

Her sayfada:
- Benzersiz `<title>` ve `<meta description>`
- Canonical URL
- Schema.org Article JSON-LD
- Open Graph meta tags
- Internal linking (diğer burçlara linkler)
- Sitemap.xml (72 URL)

## Lisans

MIT