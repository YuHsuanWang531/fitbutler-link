// Mock「我和你說」articles shared by the home list and the article page; replace with API data.

export type NewsArticle = {
  id: string
  /** YYYY-MM-DD */
  date: string
  tag: "促銷" | "活動" | "公告"
  title: string
  thumbnail: string
  gallery: { src: string; alt: string }[]
  /** Bold opening paragraph. */
  lead: string
  body: string[]
  relatedIds: string[]
}

export const newsArticles: NewsArticle[] = [
  {
    id: "monthly-plan-888",
    date: "2025-10-22",
    tag: "促銷",
    title: "月費訂閱制優惠 $888 再贈教練課體驗1堂",
    thumbnail: "/images/news-1.png",
    gallery: [
      { src: "/images/news-1-photo.jpg", alt: "教練在腿推機旁指導會員訓練" },
      { src: "/images/venue.png", alt: "場館重訓區" },
      { src: "/images/news-2-photo.jpg", alt: "教練帶領 TRX 團課" },
    ],
    lead: "不想被長約綁住？月費訂閱制讓你按月付費、隨時暫停，現在加入再送一堂一對一教練課，從第一天就練對方向。",
    body: [
      "1. 方案內容：每月 $888，全日自由進出各館重訓區與有氧區，免入會費、免手續費，也不用綁約。",
      "2. 加贈教練課：10 月 31 日前完成訂閱，加贈 60 分鐘一對一教練課體驗 1 堂，教練會依你的目標安排體態評估與入門課表。",
      "3. 申請方式：到「購買」頁選擇月費訂閱方案，或直接到各館櫃檯由專人協助辦理。",
      "4. 注意事項：體驗課需在訂閱後 30 天內預約使用，逾期失效；每位會員限領一次。",
    ],
    relatedIds: ["small-group-class-450", "winter-muscle-camp", "zhongshan-grand-opening"],
  },
  {
    id: "small-group-class-450",
    date: "2025-09-15",
    tag: "活動",
    title: "3 人就開班，小班精緻團課一堂$450",
    thumbnail: "/images/news-2.png",
    gallery: [
      { src: "/images/news-2-photo.jpg", alt: "壺鈴與 TRX 精緻團課，一堂只要 $450" },
      { src: "/images/news-1-photo.jpg", alt: "教練在腿推機旁指導會員訓練" },
      { src: "/images/venue.png", alt: "場館重訓區" },
    ],
    lead: "想上團課又怕人太多、教練顧不到？小班制壺鈴＆TRX 團課 3 人就開班，最多 6 人，每個動作都有教練即時調整。",
    body: [
      "1. 課程內容：以壺鈴和 TRX 懸吊訓練為主，強化核心與全身肌力，同時改善久坐造成的圓肩、骨盆前傾等姿勢問題。",
      "2. 適合對象：沒有重訓經驗的新手也能參加，教練會依每個人的程度調整重量與動作難度。",
      "3. 上課時段：每週二、四 19:30–20:30，週六 10:00–11:00，每堂 60 分鐘。",
      "4. 費用與報名：單堂 $450，可在「預約」頁選擇時段報名；報名未滿 3 人時，會在開課前一天通知改期。",
    ],
    relatedIds: ["monthly-plan-888", "pt-zone-rules", "winter-muscle-camp"],
  },
  {
    id: "pt-zone-rules",
    date: "2025-09-06",
    tag: "公告",
    title: "PT 專用區使用規範調整",
    thumbnail: "/images/news-3.png",
    gallery: [
      { src: "/images/news-3-photo.jpg", alt: "會員使用戰繩訓練" },
      { src: "/images/venue.png", alt: "場館重訓區" },
    ],
    lead: "為提供更專業與安全的教學環境，市府館自 2025 年 10 月 10 日起調整 PT 專用區的使用方式，請會員留意。",
    body: [
      "1. 使用對象：PT 專用區僅開放給正在上一對一或小團體教練課的會員與教練使用。",
      "2. 自主訓練：一般自主訓練請移至一般重訓區，區內器材種類相同，不影響訓練內容。",
      "3. 進場方式：教練課開始前 10 分鐘可進場暖身，請向櫃檯出示課程預約紀錄。",
      "4. 如有任何疑問，歡迎洽詢市府館櫃檯人員。",
    ],
    relatedIds: ["city-hall-equipment-upgrade", "small-group-class-450"],
  },
  {
    id: "winter-muscle-camp",
    date: "2025-08-28",
    tag: "活動",
    title: "增肌冬令營開跑，60 天挑戰萬元獎品帶回家",
    thumbnail: "/images/banner-1.png",
    gallery: [
      { src: "/images/banner-1.png", alt: "增肌冬令營 15 堂教練課｜60 天增肌挑戰" },
      { src: "/images/news-1-photo.jpg", alt: "教練在腿推機旁指導會員訓練" },
      { src: "/images/news-2-photo.jpg", alt: "教練帶領 TRX 團課" },
    ],
    lead: "冬天正是增肌的好時機！60 天增肌挑戰搭配 15 堂教練課，教練帶你練、營養師幫你吃，完成挑戰還有機會抱走萬元獎品。",
    body: [
      "1. 課程安排：60 天內完成 15 堂一對一教練課，挑戰前後各做一次 InBody 身體組成檢測，追蹤肌肉量變化。",
      "2. 飲食追蹤：加入專屬 LINE 群組，每天回報三餐照片，由營養師給予飲食建議。",
      "3. 獎品辦法：挑戰結束時肌肉量增加最多的前三名，分別可獲得 $10,000、$5,000、$3,000 運動用品禮券。",
      "4. 報名期限：即日起至 9 月 30 日，限額 30 名，額滿為止。",
    ],
    relatedIds: ["monthly-plan-888", "zhongshan-grand-opening", "small-group-class-450"],
  },
  {
    id: "zhongshan-grand-opening",
    date: "2025-08-12",
    tag: "促銷",
    title: "中山旗艦館開幕月入會，首月 $0",
    thumbnail: "/images/banner-2.png",
    gallery: [
      { src: "/images/banner-2.png", alt: "中山旗艦館盛大開幕，開幕月入會首月 $0" },
      { src: "/images/venue.png", alt: "中山旗艦館重訓區" },
      { src: "/images/news-3-photo.jpg", alt: "會員使用戰繩訓練" },
    ],
    lead: "中山旗艦館盛大開幕！全新空間、全新器材，開幕月加入會員首月 $0，邀你一起來體驗。",
    body: [
      "1. 場館介紹：中山旗艦館位於台北市中山區復興北路 112 號 5 樓，設有重訓區、有氧區、團課教室與淋浴間。",
      "2. 開幕優惠：8 月 31 日前在中山旗艦館加入會員，首月月費 $0，第二個月起依原方案計費。",
      "3. 營業時間：週一至週五 06:00–23:00，週六、日 08:00–22:00。",
      "4. 名額有限，額滿為止，詳情請洽中山旗艦館櫃檯。",
    ],
    relatedIds: ["monthly-plan-888", "winter-muscle-camp", "city-hall-equipment-upgrade"],
  },
  {
    id: "city-hall-equipment-upgrade",
    date: "2025-07-30",
    tag: "公告",
    title: "市府館重訓區器材汰換，暫停開放三天",
    thumbnail: "/images/venue.png",
    gallery: [
      { src: "/images/venue.png", alt: "市府館重訓區" },
      { src: "/images/news-3-photo.jpg", alt: "會員使用戰繩訓練" },
    ],
    lead: "為了讓大家練得更安心，市府館重訓區將進行器材汰換，期間暫停開放三天，造成不便敬請見諒。",
    body: [
      "1. 暫停時間：8 月 4 日（一）至 8 月 6 日（三），重訓區全天暫停開放，有氧區與團課教室照常營業。",
      "2. 替代方案：暫停期間可憑會員條碼至中山旗艦館使用重訓區，不另收費。",
      "3. 新增器材：這次會汰換腿推機與史密斯機，並新增兩組多功能訓練架。",
      "4. 重新開放：8 月 7 日（四）起恢復正常開放。",
    ],
    relatedIds: ["pt-zone-rules", "zhongshan-grand-opening"],
  },
]

export function getNewsArticle(id: string) {
  return newsArticles.find((article) => article.id === id)
}

export function getRelatedArticles(article: NewsArticle) {
  return article.relatedIds.flatMap((id) => getNewsArticle(id) ?? [])
}
