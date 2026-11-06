import type { Teacher } from "@/lib/booking/types"

// Mock teachers, shared by the home page's 老師介紹 and the booking mock data. Replace with API data.
export const teachers: Teacher[] = [
  { id: "andy", name: "Andy 林安迪", avatar: "/images/coach-andy.jpg", role: "私課老師 / 團課老師" },
  { id: "sandy", name: "Sandy 黃珊迪", avatar: "/images/coach-sandy.jpg", role: "私課老師" },
  { id: "sophie", name: "Sophie 蘇菲", avatar: "/images/coach-sophie.jpg", role: "團課老師" },
  { id: "chris", name: "Chris 克里斯", avatar: "/images/coach-chris.jpg", role: "私課老師 / 團課老師" },
  { id: "lin", name: "林佳穎", avatar: "/images/coach-sandy.jpg", role: "私課老師 / 團課老師" },
  { id: "chen", name: "陳柏翰", avatar: "/images/coach-andy.jpg", role: "私課老師" },
  { id: "wang", name: "王思涵", avatar: "/images/coach-sophie.jpg", role: "團課老師" },
  { id: "chang", name: "張育誠", avatar: "/images/coach-chris.jpg", role: "私課老師 / 團課老師" },
  { id: "lee", name: "李欣怡", avatar: "/images/coach-sandy.jpg", role: "私課老師" },
  { id: "huang", name: "黃詩婷", avatar: "/images/coach-sophie.jpg", role: "團課老師" },
  { id: "wu", name: "吳承恩", avatar: "/images/coach-andy.jpg", role: "私課老師 / 團課老師" },
  { id: "tsai", name: "蔡宜蓁", avatar: "/images/coach-sandy.jpg", role: "私課老師" },
  { id: "liu", name: "劉冠廷", avatar: "/images/coach-chris.jpg", role: "團課老師" },
  { id: "yang", name: "楊雅筑", avatar: "/images/coach-sophie.jpg", role: "私課老師 / 團課老師" },
  { id: "hsu", name: "許家豪", avatar: "/images/coach-andy.jpg", role: "私課老師" },
  { id: "cheng", name: "鄭靜宜", avatar: "/images/coach-sandy.jpg", role: "團課老師" },
  { id: "hsieh", name: "謝明哲", avatar: "/images/coach-chris.jpg", role: "私課老師 / 團課老師" },
  { id: "kuo", name: "郭品妍", avatar: "/images/coach-sophie.jpg", role: "私課老師" },
  { id: "hung", name: "洪志偉", avatar: "/images/coach-andy.jpg", role: "團課老師" },
  { id: "tseng", name: "曾郁婷", avatar: "/images/coach-sandy.jpg", role: "私課老師 / 團課老師" },
  { id: "chiu", name: "邱建宏", avatar: "/images/coach-chris.jpg", role: "私課老師" },
  { id: "liao", name: "廖婉琪", avatar: "/images/coach-sophie.jpg", role: "團課老師" },
  { id: "lai", name: "賴俊宇", avatar: "/images/coach-andy.jpg", role: "私課老師 / 團課老師" },
  { id: "chou", name: "周雅婷", avatar: "/images/coach-sandy.jpg", role: "私課老師" },
]

/** Back-office fields for a teacher's page. */
export type TeacherProfile = {
  /** 教練的一句話. */
  quote: string
  /** 教練介紹, HTML from the back office's rich-text editor. */
  introHtml: string
  phone: string
  /** Shown as icons: Instagram, Facebook, LINE, YouTube and Threads by their address, anything else as a link icon. At most `MAX_TEACHER_LINKS`. */
  links: { title: string; url: string }[]
  /** At most `MAX_TEACHER_PHOTOS`; the back office suggests 900 × 900. */
  photos: string[]
}

export const MAX_TEACHER_LINKS = 5
export const MAX_TEACHER_PHOTOS = 5

const PROFILES: Record<string, Partial<TeacherProfile>> = {
  andy: {
    quote: "透過扎實的訓練重新認識自己。",
    introHtml:
      "<p>每個人需要的不是嚴苛的極限訓練，而是一套適合自己、能走得長遠的科學計畫。身為你的教練，不只指導動作，更陪你建立自信與習慣。讓我們一起把訓練融入生活，迎接更好的自己！</p>",
    phone: "(+886)0900999000",
    links: [
      { title: "Instagram", url: "https://www.instagram.com/" },
      { title: "Facebook", url: "https://www.facebook.com/" },
      { title: "LINE", url: "https://line.me/" },
      { title: "增肌飲食懶人包", url: "https://example.com/andy-nutrition" },
    ],
  },
  sandy: {
    quote: "每一次的堅持，身體都會記得。",
    introHtml:
      "<p>我是 Sandy，專長<strong>女性體態雕塑</strong>與<strong>產後恢復訓練</strong>。</p><p>曾經自己也是運動小白，所以特別懂剛開始的不安。我的課會從核心與呼吸開始，帶你一步步找回身體的控制感。</p><ul><li>產後腹直肌分離修復</li><li>臀腿線條雕塑</li><li>久坐上班族的肩頸舒緩</li></ul>",
    links: [{ title: "Sandy 的 YouTube 頻道", url: "https://www.youtube.com/" }],
  },
  sophie: {
    quote: "把運動變成生活的一部分，而不是一件苦差事。",
    introHtml:
      "<p>嗨，我是 Sophie！同時帶<strong>團體課</strong>與<strong>一對一私人課</strong>。</p><p>團課以皮拉提斯與有氧舞蹈為主，氣氛輕鬆、節奏明快；私人課則著重姿勢評估與動作矯正。</p><p>證照：Polestar 皮拉提斯墊上與器械、AFAA 團體有氧指導員。</p>",
    links: [
      { title: "Sophie 的 Instagram", url: "https://www.instagram.com/" },
      { title: "皮拉提斯入門 Q&A", url: "https://example.com/pilates-qa" },
      { title: "團課時間表", url: "https://example.com/sophie-classes" },
    ],
  },
  chris: {
    quote: "力量來自穩定，穩定來自每一次正確的重複。",
    introHtml:
      "<p>我是 Chris，前田徑選手，現任私人教練與 TRX、壺鈴團課老師。</p><p>擅長<strong>功能性訓練</strong>與<strong>運動表現提升</strong>，適合想跑得更快、跳得更高，或單純想讓日常更有力的你。</p><ul><li>TRX 懸吊訓練認證</li><li>StrongFirst 壺鈴認證</li></ul>",
    links: [{ title: "Chris 的訓練筆記", url: "https://example.com/chris-notes" }],
  },
}

const DEFAULT_PHOTOS = [
  "/images/course-strength.jpg",
  "/images/course-trx.jpg",
  "/images/course-kettlebell.jpg",
  "/images/course-functional.jpg",
  "/images/course-core.jpg",
]

export function getTeacher(id: string) {
  return teachers.find((t) => t.id === id)
}

/** The teacher's page data; mock teachers without a written profile get placeholder text. */
export function getTeacherProfile(teacher: Teacher): TeacherProfile {
  const profile = PROFILES[teacher.id] ?? {}
  return {
    quote: profile.quote ?? "一起動起來，找到屬於你的運動節奏。",
    introHtml:
      profile.introHtml ??
      `<p>我是${teacher.name}，${teacher.role ?? "老師"}。課程會依每位學員的程度調整，歡迎第一次上課的你。</p>`,
    phone: profile.phone ?? "(+886)0912345678",
    links: (profile.links ?? []).slice(0, MAX_TEACHER_LINKS),
    photos: (profile.photos ?? [teacher.avatar ?? "", ...DEFAULT_PHOTOS]).filter(Boolean).slice(0, MAX_TEACHER_PHOTOS),
  }
}
