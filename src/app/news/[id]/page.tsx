import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { ImageCarousel } from "@/components/member/image-carousel"
import { MemberMain } from "@/components/member/member-main"
import { MemberPageHeader } from "@/components/member/member-page-header"
import { NewsTag } from "@/components/member/news-tag"
import { getNewsArticle, getRelatedArticles, newsArticles } from "@/lib/member-news"

type Props = { params: Promise<{ id: string }> }

// Only the known articles exist; any other id is a 404.
export const dynamicParams = false

export function generateStaticParams() {
  return newsArticles.map((article) => ({ id: article.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getNewsArticle((await params).id)
  return { title: article ? `${article.title}｜我和你說` : "我和你說" }
}

export default async function NewsArticlePage({ params }: Props) {
  const article = getNewsArticle((await params).id)
  if (!article) notFound()
  const related = getRelatedArticles(article)

  return (
    <>
      <MemberPageHeader title="我和你說" />
      <MemberMain className="pb-[env(safe-area-inset-bottom)] md:pb-0">
        <article className="flex flex-col gap-6 py-4 md:pt-3">
          <ImageCarousel
            images={article.gallery.map((image, i) => ({ id: `${article.id}-${i}`, ...image }))}
            label="切換至圖片"
            trackClassName="px-4 md:px-[calc((100%-361px)/2)]"
            slideClassName="aspect-[361/240] md:w-[361px]"
            sizes="(max-width: 767px) 100vw, 361px"
            priority
          />

          <div className="flex flex-col gap-6 px-4 lg:px-6">
            <div className="flex flex-col gap-2">
              <NewsTag>{article.tag}</NewsTag>
              <h1 className="text-2xl leading-8 font-medium">{article.title}</h1>
              <time dateTime={article.date} className="text-sm leading-5 text-muted-foreground">
                {article.date}
              </time>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-lg leading-7 font-medium">{article.lead}</p>
              {article.body.map((paragraph) => (
                <p key={paragraph} className="text-base leading-6">
                  {paragraph}
                </p>
              ))}
            </div>

            {related.length > 0 && (
              <nav aria-labelledby="related-links" className="flex flex-col gap-2">
                <h2 id="related-links" className="text-sm leading-5 text-muted-foreground">
                  相關連結
                </h2>
                <ul className="flex flex-col gap-2">
                  {related.map((item) => (
                    <li key={item.id}>
                      <Link href={`/news/${item.id}`} className="text-base leading-6 underline underline-offset-2">
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </article>
      </MemberMain>
    </>
  )
}
