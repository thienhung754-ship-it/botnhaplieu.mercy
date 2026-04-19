# 🤖 BOT NHẬP LIỆU AI — Landing Page

> **Mercy Tech** · Tự động nhập kho từ ảnh hóa đơn trong 5 giây

---

## 🚀 Tính năng

- **AI OCR tiếng Việt** — đọc hóa đơn viết tay, chụp nghiêng, chữ xấu
- **Bot Telegram** — gửi ảnh → dữ liệu tự vào Google Sheet
- **Lead capture** — form chính + popup sổ tay thuế sau 15 giây
- **Google Sheet integration** — toàn bộ lead đổ thẳng vào sheet

---

## 📁 Cấu trúc

```
LandingPage/
├── index.html          # Trang chính
├── style.css           # Toàn bộ CSS (design system + components)
├── script.js           # JS logic (form, countdown, video, popup)
├── apps-script.gs      # Code dán vào Google Apps Script
├── logo-transparent.png
├── pain1.png / pain2.png / pain3.png   # Pain section images
├── step1.jpg / step2.jpg / step3.jpg   # How-it-works images
├── quyền lợi.png
└── SỔ TAY Hướng dẫn HKD.pdf.png       # Bìa popup popup
```

---

## ⚙️ Setup Google Sheet

1. Mở Google Sheet → **Tiện ích mở rộng** → **Apps Script**
2. Dán nội dung file `apps-script.gs` vào editor
3. **Deploy** → New deployment → Web app → Anyone → Copy URL
4. Dán URL vào `script.js` dòng:
   ```js
   const SHEET_URL = window.SHEET_URL = 'PASTE_URL_HERE';
   ```

---

## 🌐 Deploy

### Netlify (khuyến nghị)
1. Kéo thả toàn bộ folder vào [netlify.com/drop](https://app.netlify.com/drop)

### Vercel
```bash
npx vercel --prod
```

### GitHub Pages
1. Push code lên GitHub
2. Settings → Pages → Branch: `main` → Root `/`

---

## 📊 Tracking UTM

Form tự động ghi nhận: `utm_source`, `utm_medium`, `utm_campaign`
Thêm vào URL: `?utm_source=facebook&utm_medium=cpc&utm_campaign=thang4`

---

## 🛠️ Tech Stack

- HTML5 + CSS3 + Vanilla JS
- Google Apps Script (backend)
- YouTube IFrame API (video)
- Google Sheets (CRM)

---

*© 2026 Mercy Tech — All rights reserved*
