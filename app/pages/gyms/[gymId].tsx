import { Suspense } from "react"
import {
  Head,
  useRouter,
  useQuery,
  useParam,
  BlitzPage,
  useMutation,
  usePaginatedQuery,
} from "blitz"
import type { Channel } from "db"
import Layout from "app/core/layouts/Layout"
import getGym from "app/gyms/queries/getGym"
import getGymMembers from "app/gyms/queries/getGymMembers"
import getChannels from "app/channels/queries/getChannels"
import getChannelPosts from "app/channel-posts/queries/getChannelPosts"
import createChannelPost from "app/channel-posts/mutations/createChannelPost"
import { createChannelPostSchema } from "app/channel-posts/validation"
import { ChannelPostForm } from "app/channel-posts/components/ChannelPostForm"
import { FORM_ERROR } from "final-form"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

const ITEMS_PER_PAGE = 100
const MembersPanel = () => {
  const gymId = useParam("gymId", "string") as string
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ members, hasMore, count }] = usePaginatedQuery(getGymMembers, {
    gymId,
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const showPagination = count > ITEMS_PER_PAGE

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {members.map((member) => (
          <li key={member.id}>
            <p>
              {member.name} - {member.email}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

type ChannelFeedProps = {
  channel: Channel
}

const ChannelFeed = ({ channel }: ChannelFeedProps) => {
  const [{ channelPosts }, { refetch: refetchPosts }] = useQuery(getChannelPosts, {
    where: { channelId: channel.id },
    orderBy: { updatedAt: "desc" },
  })
  const [createChannelPostMutation] = useMutation(createChannelPost)
  const user = useCurrentUser()
  const gymId = channel.gymId
  const gymRole = user?.gymRoles.find((role) => role.gymId === gymId)

  if (!user || !gymRole || !channel) {
    return null
  }

  return (
    <div>
      <h2>{channel.name}</h2>
      <Suspense fallback="Loading...">
        <>
          <div className="mb-4">
            <ChannelPostForm
              submitText="Create Post"
              schema={createChannelPostSchema}
              initialValues={{ gymRoleId: gymRole?.id, channelId: channel.id }}
              onSubmit={async (values, form) => {
                try {
                  await createChannelPostMutation(values)
                  refetchPosts()
                  form.reset()
                } catch (error: any) {
                  console.error(error)
                  return {
                    [FORM_ERROR]: error.toString(),
                  }
                }
              }}
            />
          </div>
          <div>
            <h2 className="text-xl mb-4">Posts</h2>
            <div>
              {channelPosts.map((post) => {
                return (
                  <div key={post.id} className="p-4 bg-light-200">
                    <h3 className="text-lg">{post.title}</h3>
                    <p className="whitespace-pre-line">{post.body}</p>
                    <div>{post.gymRole.user.name || post.gymRole.user.email}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      </Suspense>
    </div>
  )
}
export const Gym = () => {
  const gymId = useParam("gymId", "string")
  const [gym] = useQuery(getGym, { id: gymId, withOwner: true })
  const [{ channels }] = useQuery(getChannels, { where: { gymId } })
  const channel = channels[0]

  return (
    <>
      <Head>
        <title>Gym {gym.id}</title>
      </Head>

      <div>
        <h1>Gym {gym.name}</h1>
        <Suspense fallback="Loading...">
          <div>
            {channel && <ChannelFeed channel={channel} />}
            <div>
              <h2>Members</h2>
              <MembersPanel />
            </div>
          </div>
        </Suspense>
      </div>
    </>
  )
}

const ShowGymPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Gym />
      </Suspense>
    </div>
  )
}

ShowGymPage.authenticate = true
ShowGymPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowGymPage
