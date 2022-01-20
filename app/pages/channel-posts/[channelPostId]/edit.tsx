import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getChannelPost from "app/channel-posts/queries/getChannelPost"
import updateChannelPost from "app/channel-posts/mutations/updateChannelPost"
import { ChannelPostForm, FORM_ERROR } from "app/channel-posts/components/ChannelPostForm"

export const EditChannelPost = () => {
  const router = useRouter()
  const channelPostId = useParam("channelPostId", "number")
  const [channelPost, { setQueryData }] = useQuery(
    getChannelPost,
    { id: channelPostId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateChannelPostMutation] = useMutation(updateChannelPost)

  return (
    <>
      <Head>
        <title>Edit ChannelPost {channelPost.id}</title>
      </Head>

      <div>
        <h1>Edit ChannelPost {channelPost.id}</h1>
        <pre>{JSON.stringify(channelPost, null, 2)}</pre>

        <ChannelPostForm
          submitText="Update ChannelPost"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateChannelPost}
          initialValues={channelPost}
          onSubmit={async (values) => {
            try {
              const updated = await updateChannelPostMutation({
                id: channelPost.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.ShowChannelPostPage({ channelPostId: updated.id }))
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </>
  )
}

const EditChannelPostPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditChannelPost />
      </Suspense>

      <p>
        <Link href={Routes.ChannelPostsPage()}>
          <a>ChannelPosts</a>
        </Link>
      </p>
    </div>
  )
}

EditChannelPostPage.authenticate = true
EditChannelPostPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditChannelPostPage
