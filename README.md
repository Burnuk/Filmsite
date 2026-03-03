# 🎬 Sinema Kulübü — Kurulum Rehberi

Aşağıdaki adımları sırayla yap, 15 dakikada sitenin yayında olur.

---

## ADIM 1 — JSONBin hesabı aç (ücretsiz, yorumlar burada saklanır)

1. https://jsonbin.io adresine git
2. "Sign Up" ile kayıt ol (Google ile de olur)
3. Giriş yaptıktan sonra sol menüden **"API Keys"** tıkla
4. **"Secret Key"** yanındaki kopyala butonuna bas → bir yere not et (bu senin API KEY'in)
5. Sol menüden **"Bins"** → **"Create a Bin"** tıkla
6. İçine sadece şunu yaz: `{}`
7. **"Create"** butonuna bas
8. URL'de `https://jsonbin.io/b/` dan sonraki kodu kopyala → bir yere not et (bu senin BIN ID'in)

---

## ADIM 2 — Vercel hesabı aç (ücretsiz hosting)

1. https://vercel.com adresine git
2. **"Sign Up"** → **"Continue with GitHub"** tıkla
3. GitHub hesabın yoksa önce https://github.com'da ücretsiz hesap aç

---

## ADIM 3 — Projeyi GitHub'a yükle

1. https://github.com adresine git, giriş yap
2. Sağ üstte **"+"** → **"New repository"** tıkla
3. İsim: `film-sitesi` → **"Create repository"**
4. Açılan sayfada **"uploading an existing file"** linkine tıkla
5. Bu klasördeki **tüm dosyaları** sürükle bırak (src klasörü dahil)
6. **"Commit changes"** tıkla

---

## ADIM 4 — Vercel'e deploy et

1. https://vercel.com'a git, giriş yap
2. **"Add New Project"** tıkla
3. GitHub'dan `film-sitesi` reposunu seç → **"Import"**
4. **"Environment Variables"** bölümünü bul, iki değişken ekle:

   | Key | Value |
   |-----|-------|
   | `VITE_JSONBIN_ID` | (1. adımda not aldığın BIN ID) |
   | `VITE_JSONBIN_KEY` | (1. adımda not aldığın Secret Key) |

5. **"Deploy"** butonuna bas
6. 1-2 dakika bekle → 🎉 **Sitenin linki hazır!**

---

## Sorun mu çıktı?

- JSONBin bedava planda 10.000 istek/ay var, yeter
- Vercel bedava planda sınırsız yayın var
- Herhangi bir adımda takılırsan ekran görüntüsü at, yardım edelim
