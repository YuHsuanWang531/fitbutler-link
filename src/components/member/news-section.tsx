"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { NewsTag } from "@/components/member/news-tag"

export type NewsItem = {
  id: string
  day: string
  month: string
  tag: string
  title: string
  description: string
  image: string
}

const PAGE_SIZE = 3

export function NewsSection({ items }: { items: NewsItem[] }) {
  const [page, setPage] = useState(0)
  const pageCount = Math.ceil(items.length / PAGE_SIZE)
  const visible = items.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <section className="flex flex-col gap-4 px-4 lg:px-6">
      <div className="flex items-center justify-between gap-5">
        <h2 className="text-xl font-medium leading-7 text-black">我和你說</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="上一頁"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="size-[30px] rounded-full border-neutral-200"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="下一頁"
            disabled={page >= pageCount - 1}
            onClick={() => setPage((p) => p + 1)}
            className="size-[30px] rounded-full border-neutral-200"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      <ul className="flex flex-col gap-6">
        {visible.map((item) => (
          <li key={item.id}>
            <Link href={`/news/${item.id}`} className="flex items-center gap-3">
              <div className="flex w-8 shrink-0 flex-col items-center self-start">
                <span className="text-2xl font-medium leading-8 text-black">{item.day}</span>
                <span className="text-xs leading-4 text-muted-foreground">{item.month}</span>
              </div>
              <div className="h-23 w-px shrink-0 bg-neutral-200" />
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
                <NewsTag>{item.tag}</NewsTag>
                <div className="flex flex-col gap-0.5">
                  <h3 className="truncate text-base font-medium leading-6 text-black">{item.title}</h3>
                  <p className="line-clamp-2 text-sm leading-5 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
              <Image
                src={item.image}
                alt=""
                width={92}
                height={92}
                className="size-23 shrink-0 rounded-[10px] object-cover"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
