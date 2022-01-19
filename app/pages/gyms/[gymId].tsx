import { Suspense } from "react"
import {
  Head,
  Link,
  useRouter,
  useQuery,
  useParam,
  BlitzPage,
  useMutation,
  Routes,
  usePaginatedQuery,
} from "blitz"
import Layout from "app/core/layouts/Layout"
import getGym from "app/gyms/queries/getGym"
import deleteGym from "app/gyms/mutations/deleteGym"
import { View, TabList, Tabs, TabPanels, Item, Content, ListBox, Text } from "@adobe/react-spectrum"
import Heading from "app/core/components/Heading"
import getGymMembers from "app/gyms/queries/getGymMembers"

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
    <View>
      <ListBox>
        {members.map((member) => (
          <Item key={member.id}>
            <Text>
              {member.name} - {member.email}
            </Text>
          </Item>
        ))}
      </ListBox>
    </View>
  )
}

export const Gym = () => {
  const router = useRouter()
  const gymId = useParam("gymId", "string")
  const [deleteGymMutation] = useMutation(deleteGym)
  const [gym] = useQuery(getGym, { id: gymId, withOwner: true })

  return (
    <>
      <Head>
        <title>Gym {gym.id}</title>
      </Head>

      <View>
        <Heading level={1}>Gym {gym.name}</Heading>
        <Tabs>
          <TabList>
            <Item key="discussions">Discussion</Item>
            <Item key="members">Members</Item>
          </TabList>
          <Suspense fallback="Loading...">
            <TabPanels>
              <Item key="discussions">Discussions</Item>
              <Item key="members">
                <MembersPanel />
              </Item>
            </TabPanels>
          </Suspense>
        </Tabs>
      </View>
    </>
  )
}

const ShowGymPage: BlitzPage = () => {
  return (
    <Content>
      <Suspense fallback={<div>Loading...</div>}>
        <Gym />
      </Suspense>
    </Content>
  )
}

ShowGymPage.authenticate = true
ShowGymPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowGymPage
