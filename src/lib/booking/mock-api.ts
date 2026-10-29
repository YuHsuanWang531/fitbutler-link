// Mock booking backend. Classes are generated from a seed per date, so a given day always has the
// same schedule; bookings live in memory until the page reloads.

import type { BookingApi } from "@/lib/booking/api"
import type { ClassAvailability, ClassCategory, GymClass, MyStatus } from "@/lib/booking/types"
import { eachDay, fromKey, toKey } from "@/lib/booking/dates"
import { teachers as TEACHERS } from "@/lib/member-teachers"

const CATEGORIES: ClassCategory[] = [
  "瑜伽",
  "皮拉提斯",
  "重訓",
  "TRX",
  "壺鈴",
  "拳擊有氧",
  "飛輪",
  "有氧舞蹈",
  "伸展放鬆",
  "核心訓練",
  "功能性訓練",
]

const TITLES: Record<ClassCategory, string[]> = {
  瑜伽: ["流動瑜伽・肩頸放鬆", "陰瑜伽深層伸展", "晨間伸展瑜伽喚醒"],
  皮拉提斯: ["墊上皮拉提斯核心穩定", "核心皮拉提斯體態雕塑"],
  重訓: ["新手重訓入門基礎班", "下肢肌力訓練・臀腿", "上肢肌力訓練・背肩"],
  TRX: ["TRX 全身懸吊訓練", "TRX 核心燃脂循環"],
  壺鈴: ["壺鈴基礎動作入門", "壺鈴循環體能訓練"],
  拳擊有氧: ["拳擊有氧燃脂入門", "拳擊組合進階訓練"],
  飛輪: ["節奏飛輪・音樂騎乘", "飛輪間歇燃脂挑戰"],
  有氧舞蹈: ["流行有氧舞蹈派對", "低衝擊有氧律動"],
  伸展放鬆: ["筋膜放鬆與伸展", "睡前舒緩伸展"],
  核心訓練: ["核心穩定強化訓練", "腹部核心燃燒"],
  功能性訓練: ["功能性訓練・全身整合", "動作模式基礎班"],
}

const ROOMS: Record<string, string[]> = {
  市府館: ["A 教室", "B 教室"],
  中山旗艦館: ["A 教室", "B 教室", "C 教室"],
  信義館: ["A 教室", "B 教室"],
  大安館: ["A 教室"],
  內湖館: ["A 教室", "B 教室"],
  板橋館: ["A 教室", "B 教室"],
  新竹館: ["A 教室"],
  台中旗艦館: ["A 教室", "B 教室", "C 教室"],
  台南館: ["A 教室"],
  高雄館: ["A 教室", "B 教室"],
  桃園館: ["A 教室"],
  南港館: ["A 教室", "B 教室"],
}
const VENUES = Object.keys(ROOMS)
const SLOTS = ["07:00", "09:00", "10:30", "12:15", "18:30", "19:30", "20:40"]
const DURATIONS = [50, 60, 75]

/** Deterministic PRNG (mulberry32) so each date always produces the same classes. */
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hash(text: string) {
  let h = 2166136261
  for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  return h
}

function generateDay(date: string): GymClass[] {
  const rand = seeded(hash(date))
  const pick = <T>(list: T[]) => list[Math.floor(rand() * list.length)]
  // About one day in eight has no classes, so the timeline shows its empty state.
  if (rand() < 0.12) return []
  const count = 1 + Math.floor(rand() * 4)
  const slots = [...SLOTS]
    .sort(() => rand() - 0.5)
    .slice(0, count)
    .sort()

  return slots.map((start, i) => {
    const category = pick(CATEGORIES)
    const venue = pick(VENUES)
    const capacity = pick([8, 10, 12, 15, 20])
    const roll = rand()
    // Mix of open, nearly full (≤3 left) and full classes.
    const bookedCount =
      roll < 0.2 ? capacity : roll < 0.45 ? capacity - 1 - Math.floor(rand() * 3) : Math.floor(rand() * (capacity - 4))
    const statusRoll = rand()
    const myStatus: MyStatus =
      statusRoll < 0.12 ? "booked" : statusRoll < 0.4 && bookedCount >= capacity ? "waitlisted" : "none"
    // A few classes per month are 停課, not open yet, or free to drop in.
    const availabilityRoll = rand()
    const availability: ClassAvailability =
      myStatus !== "none"
        ? "open"
        : availabilityRoll < 0.06
          ? "stopped"
          : availabilityRoll < 0.12
            ? "notOpen"
            : availabilityRoll < 0.18
              ? "free"
              : "open"
    const teacher = pick(TEACHERS)
    // About one class in four is co-taught.
    const second = rand() < 0.25 ? pick(TEACHERS.filter((t) => t.id !== teacher.id)) : null
    return {
      id: `${date}-${i}`,
      date,
      start,
      durationMin: pick(DURATIONS),
      venue,
      room: pick(ROOMS[venue]),
      title: pick(TITLES[category]),
      category,
      teachers: second ? [teacher, second] : [teacher],
      capacity,
      bookedCount,
      availability,
      waitlistEnabled: myStatus === "waitlisted" || rand() < 0.6,
      waitlistPosition: myStatus === "waitlisted" ? 1 + Math.floor(rand() * 5) : undefined,
      hasInfo: rand() < 0.7,
      myStatus,
    }
  })
}

const store = new Map<string, GymClass[]>()

function day(date: string) {
  let classes = store.get(date)
  if (!classes) {
    classes = generateDay(date)
    store.set(date, classes)
  }
  return classes
}

function update(classId: string, change: (c: GymClass) => GymClass) {
  const date = classId.slice(0, 10)
  const classes = day(date)
  const index = classes.findIndex((c) => c.id === classId)
  if (index < 0) return Promise.reject(new Error(`Unknown class ${classId}`))
  classes[index] = change(classes[index])
  return Promise.resolve({ ...classes[index] })
}

export const mockBookingApi: BookingApi = {
  fetchClasses(from, to) {
    const classes = eachDay(fromKey(from), fromKey(to)).flatMap((d) => day(toKey(d)))
    return Promise.resolve(classes.map((c) => ({ ...c })))
  },
  fetchClass(classId) {
    const date = classId.slice(0, 10)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return Promise.resolve(null)
    const found = day(date).find((c) => c.id === classId)
    return Promise.resolve(found ? { ...found } : null)
  },
  fetchFilterOptions() {
    return Promise.resolve({ venues: [...VENUES], categories: [...CATEGORIES], teachers: [...TEACHERS] })
  },
  book: (id) => update(id, (c) => ({ ...c, myStatus: "booked", bookedCount: c.bookedCount + 1 })),
  cancelBooking: (id) => update(id, (c) => ({ ...c, myStatus: "none", bookedCount: c.bookedCount - 1 })),
  joinWaitlist: (id) =>
    update(id, (c) => ({ ...c, myStatus: "waitlisted", waitlistPosition: 1 + (Math.abs(hash(id)) % 5) })),
  leaveWaitlist: (id) => update(id, (c) => ({ ...c, myStatus: "none", waitlistPosition: undefined })),
}
