import type { Metadata, Viewport } from "next"
import { Geist, Noto_Sans_TC } from "next/font/google"

import { BrandProvider } from "@/components/member/brand-context"
import { MemberSideNav } from "@/components/member/member-side-nav"
import { cn } from "@/lib/utils"
import "./globals.css"

// The design pairs Geist (Latin/digits) with Noto Sans TC (CJK).
const notoSansTC = Noto_Sans_TC({ variable: "--font-sans", subsets: ["latin"], weight: ["400", "500", "700"] })
const geist = Geist({ variable: "--font-geist", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DEN YOGA",
  description: "DEN YOGA 會員專區",
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  viewportFit: "cover",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-TW" className={cn(notoSansTC.variable, geist.variable, "h-full antialiased")}>
      <body className="flex min-h-full flex-col">
        <BrandProvider className="flex min-h-dvh w-full flex-col bg-white font-[family-name:var(--font-geist),var(--font-sans)] text-black md:h-dvh md:overflow-hidden">
          <MemberSideNav />
          {children}
        </BrandProvider>
      </body>
    </html>
  )
}
