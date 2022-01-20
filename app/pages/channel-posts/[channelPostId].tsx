import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getChannelPost from "app/channel-posts/queries/getChannelPost"
import deleteChannelPost from "app/channel-posts/mutations/deleteChannelPost"

export const ChannelPost = () => {
  const router = useRouter()
  const channelPostId = useParam("channelPostId", "number")
  const [deleteChannelPostMutation] = useMutation(deleteChannelPost)
  const [channelPost] = useQuery(getChannelPost, { id: channelPostId })

  return (
    <>
      <Head>
        <title>ChannelPost {channelPost.id}</title>
      </Head>

      <div>
        <h1>ChannelPost {channelPost.id}</h1>
        <pre>{JSON.stringify(channelPost, null, 2)}</pre>

        <Link href={Routes.EditChannelPostPage({ channelPostId: channelPost.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteChannelPostMutation({ id: channelPost.id })
              router.push(Routes.ChannelPostsPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowChannelPostPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.ChannelPostsPage()}>
          <a>ChannelPosts</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <ChannelPost />
      </Suspense>
    </div>
  )
}

ShowChannelPostPage.authenticate = true
ShowChannelPostPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowChannelPostPage
