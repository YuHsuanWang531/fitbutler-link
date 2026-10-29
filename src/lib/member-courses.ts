// Mock courses for the home page's 課程介紹. Replace with API data; the photos are placeholders.

export type Course = {
  id: string
  /** Category tag, e.g. 「皮拉提斯」. */
  category: string
  title: string
  image: string
}

export const courses: Course[] = [
  { id: "reformer-core", category: "皮拉提斯", title: "機械皮拉提斯核心養成進階班", image: "/images/venue.png" },
  { id: "trx-core", category: "核心訓練課程", title: "TRX 懸吊核心訓練", image: "/images/news-3-photo.jpg" },
  { id: "strength-basics", category: "重量訓練", title: "新手重訓入門基礎班", image: "/images/news-1-photo.jpg" },
  { id: "kettlebell-circuit", category: "壺鈴", title: "壺鈴循環體能訓練", image: "/images/news-2-photo.jpg" },
]
