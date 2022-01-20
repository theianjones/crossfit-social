import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getChannelPosts from "app/channel-posts/queries/getChannelPosts"

const ITEMS_PER_PAGE = 100

export const ChannelPostsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ channelPosts, hasMore }] = usePaginatedQuery(getChannelPosts, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {channelPosts.map((channelPost) => (
          <li key={channelPost.id}>
            <Link href={Routes.ShowChannelPostPage({ channelPostId: channelPost.id })}>
              <a>{channelPost.name}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const ChannelPostsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>ChannelPosts</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewChannelPostPage()}>
            <a>Create ChannelPost</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <ChannelPostsList />
        </Suspense>
      </div>
    </>
  )
}

ChannelPostsPage.authenticate = true
ChannelPostsPage.getLayout = (page) => <Layout>{page}</Layout>

export default ChannelPostsPage
