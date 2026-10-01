# FitButler PWA

FitButler 會員端 PWA（Next.js 16 + Tailwind CSS v4）。後台管理介面是另一個專案 `fitbutler`。

## 開發

```bash
npm install
npm run dev
```

## 頁面

| 路由 | 內容 |
| --- | --- |
| `/` | 首頁：Banner、我和你說、場館一覽 |
| `/news/[id]` | 我和你說文章頁 |
| `/venues/[id]` | 場館介紹頁 |
| `/booking`、`/shop`、`/me` | 預約、購買、我的（規劃中） |

點 Header 的 logo 可以輪替品牌。目前所有內容都是假資料，集中在 `src/lib/member-news.ts`、`src/lib/member-venues.ts`、`src/components/member/brand-context.tsx`。
