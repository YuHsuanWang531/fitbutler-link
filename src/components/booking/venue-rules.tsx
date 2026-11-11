"use client"

import { useState } from "react"
import { FileText, XIcon } from "lucide-react"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

const UPDATED_AT = "2026/10/31"

/** Placeholder copy until the gym's own rules come from the API. */
const SECTIONS: { title: string; items: string[] }[] = [
  {
    title: "預約與取消",
    items: [
      "團體課程開放課前 7 天預約，額滿後可加入候補。",
      "取消預約請於開課前 2 小時完成，逾時取消或未到課視同缺席。",
      "當月缺席累計 3 次，將暫停預約權限 7 天。",
      "候補成功時會以通知告知，請留意 App 訊息；開課前 1 小時未遞補者自動取消候補。",
    ],
  },
  {
    title: "報到與上課",
    items: [
      "請於開課前 10 分鐘至櫃台或掃描 QR Code 完成報到。",
      "開課 10 分鐘後恕不開放入場，以維護課程品質與安全。",
      "如有傷病、懷孕或特殊身體狀況，請於課前告知老師。",
    ],
  },
  {
    title: "場館使用",
    items: [
      "進入運動區請穿著運動服裝及乾淨室內運動鞋，瑜珈與皮拉提斯教室請赤腳或穿止滑襪。",
      "器材使用完畢請擦拭並歸回原位，自由重量區請勿摔放啞鈴與槓片。",
      "請自備毛巾，使用器材時鋪於接觸面。",
      "館內禁止飲食（飲水除外）、吸菸及嚼食檳榔。",
      "上課期間請將手機調為靜音，未經同意請勿拍攝其他會員或老師。",
    ],
  },
  {
    title: "置物與淋浴",
    items: [
      "置物櫃限當日使用，離館前請清空，隔日開館前未清空者將由館方代為移除。",
      "貴重物品請隨身攜帶或使用櫃台保管箱，遺失恕不負責。",
      "淋浴間每次使用以 15 分鐘為原則，尖峰時段請互相禮讓。",
    ],
  },
  {
    title: "其他",
    items: [
      "會員卡限本人使用，不得轉借他人。",
      "如遇颱風、天災等不可抗力因素，課程異動以館方公告為準。",
      "違反以上規範且經勸導未改善者，館方得暫停其會員權益。",
    ],
  },
]

/** The 預約 header's 場館使用規範 button: a bottom sheet on phones, a centred dialog from md up. */
export function VenueRules() {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const body = (Header: typeof SheetHeader, Title: typeof SheetTitle, Close: typeof SheetClose) => (
    <>
      <Header className="relative items-center gap-0.5 px-12 pt-5 pb-4 text-center">
        <Title className="text-lg leading-7 font-medium">場館使用規範</Title>
        <p className="text-sm leading-5 text-muted-foreground">最近更新時間 {UPDATED_AT}</p>
        <Close aria-label="關閉" className="absolute top-5 right-4 text-neutral-950">
          <XIcon className="size-6" strokeWidth={1.5} />
        </Close>
      </Header>
      <div className="flex min-h-0 flex-col gap-5 overflow-y-auto px-4 pb-6 text-[15px] leading-6 text-neutral-800 md:px-6">
        {SECTIONS.map((section) => (
          <section key={section.title} className="flex flex-col gap-1.5">
            <h3 className="text-base font-medium text-black">{section.title}</h3>
            <ol className="flex list-decimal flex-col gap-1 pl-5 marker:text-neutral-500">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </>
  )

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label="場館使用規範">
        <FileText className="size-6 md:size-7" strokeWidth={1.5} />
      </button>
      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent showCloseButton={false} className="flex max-h-[80dvh] flex-col gap-0 p-0 sm:max-w-[500px]">
            {body(DialogHeader, DialogTitle, DialogClose)}
          </DialogContent>
        </Dialog>
      ) : (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent
            side="bottom"
            showCloseButton={false}
            className="max-h-[85dvh] gap-0 rounded-t-2xl pb-[env(safe-area-inset-bottom)]"
          >
            {body(SheetHeader, SheetTitle, SheetClose)}
          </SheetContent>
        </Sheet>
      )}
    </>
  )
}
