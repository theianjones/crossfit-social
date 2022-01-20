import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createChannelPost from "app/channel-posts/mutations/createChannelPost"
import { ChannelPostForm, FORM_ERROR } from "app/channel-posts/components/ChannelPostForm"

const NewChannelPostPage: BlitzPage = () => {
  const router = useRouter()
  const [createChannelPostMutation] = useMutation(createChannelPost)

  return (
    <div>
      <h1>Create New ChannelPost</h1>

      <ChannelPostForm
        submitText="Create ChannelPost"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateChannelPost}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const channelPost = await createChannelPostMutation(values)
            router.push(Routes.ShowChannelPostPage({ channelPostId: channelPost.id }))
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.ChannelPostsPage()}>
          <a>ChannelPosts</a>
        </Link>
      </p>
    </div>
  )
}

NewChannelPostPage.authenticate = true
NewChannelPostPage.getLayout = (page) => <Layout title={"Create New ChannelPost"}>{page}</Layout>

export default NewChannelPostPage
