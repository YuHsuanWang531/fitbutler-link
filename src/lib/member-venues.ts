// Mock venues shared by the home carousel and the venue page; replace with API data.

export type SocialPlatform = "youtube" | "instagram" | "facebook" | "line" | "threads"

export type Venue = {
  id: string
  name: string
  address: string
  /** Card cover on the home page. */
  image: string
  gallery: { src: string; alt: string }[]
  /** Bold opening paragraph of 場館介紹. */
  lead: string
  description: string[]
  phone: string
  email: string
  socials: { platform: SocialPlatform; url: string }[]
  website?: string
}

// Contact details are placeholders (the phone number is the one in the Figma design).
export const venues: Venue[] = [
  {
    id: "city-hall-long",
    name: "市府館市府館市府館名字很長的時",
    address: "台北市中山區復興北路 112 號 5 樓地址很長",
    image: "/images/venue.png",
    gallery: [
      { src: "/images/venue.png", alt: "重訓區與自由重量區" },
      { src: "/images/news-1-photo.jpg", alt: "腿推機訓練區" },
      { src: "/images/news-2-photo.jpg", alt: "TRX 團課教室" },
    ],
    lead: "鄰近捷運站、下班順路就能練，市府館以完整的重訓器材和寬敞的自由重量區，陪你把運動排進日常。",
    description: [
      "館內設有自由重量區、器械區與有氧區，啞鈴從 2 公斤到 40 公斤一應俱全，深蹲架與史密斯機也不必排隊等候。",
      "團課教室每週安排壺鈴、TRX 與伸展課程，新手也能在教練帶領下安心入門；更衣室備有置物櫃、吹風機與淋浴間，練完直接回辦公室也沒問題。",
    ],
    phone: "(+886)0900999000",
    email: "cityhall@example.com",
    socials: [
      { platform: "youtube", url: "https://www.youtube.com" },
      { platform: "instagram", url: "https://www.instagram.com" },
      { platform: "facebook", url: "https://www.facebook.com" },
      { platform: "line", url: "https://line.me" },
      { platform: "threads", url: "https://www.threads.net" },
    ],
    website: "https://example.com",
  },
  {
    id: "zhongshan",
    name: "中山旗艦館",
    address: "台北市中山區復興北路 112 號 5 樓",
    image: "/images/venue.png",
    gallery: [
      { src: "/images/banner-2.png", alt: "中山旗艦館盛大開幕" },
      { src: "/images/venue.png", alt: "中山旗艦館重訓區" },
      { src: "/images/news-1-photo.jpg", alt: "腿推機訓練區" },
    ],
    lead: "全新開幕的中山旗艦館，是目前規模最大的據點，重訓、有氧、團課和教練課一次滿足。",
    description: [
      "整層空間規劃為重訓區、有氧區、團課教室與 PT 專用區，器材全面採用最新機型，地板也加厚避震，訓練更安心。",
      "營業時間為週一至週五 06:00–23:00，週六、日 08:00–22:00；淋浴間與更衣室提供毛巾租借，空手來也能練。",
    ],
    phone: "(+886)0900999000",
    email: "zhongshan@example.com",
    socials: [],
  },
  {
    id: "city-hall",
    name: "市府館",
    address: "台北市中山區復興北路 112 號 5 樓",
    image: "/images/venue.png",
    gallery: [
      { src: "/images/venue.png", alt: "市府館重訓區" },
      { src: "/images/news-2-photo.jpg", alt: "TRX 團課教室" },
      { src: "/images/news-1-photo.jpg", alt: "腿推機訓練區" },
    ],
    lead: "明亮開放的場館設計結合自然採光與流暢動線，無論是自由重量區、有氧訓練區還是團課教室，都能讓每一次訓練更專注、更自在。",
    description: [
      "更衣間與淋浴設備一應俱全，貼心維持潔淨舒適。無論你是剛踏入健身的新手，或是追求極限的運動愛好者，都能在這裡找到專屬節奏，享受身心被釋放的每一刻。",
      "明亮開放的場館設計結合自然採光與流暢動線，無論是自由重量區、有氧訓練區還是團課教室，都能讓每一次訓練更專注、更自在。更衣間與淋浴設備一應俱全，貼心維持潔淨舒適。無論你是剛踏入健身的新手，或是追求極限的運動愛好者，都能在這裡找到專屬節奏，享受身心被釋放的每一刻。",
    ],
    phone: "(+886)0900999000",
    email: "cityhall@example.com",
    socials: [
      { platform: "instagram", url: "https://www.instagram.com" },
      { platform: "line", url: "https://line.me" },
    ],
  },
]

export function getVenue(id: string) {
  return venues.find((venue) => venue.id === id)
}
