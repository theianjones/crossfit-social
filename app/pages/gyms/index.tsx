import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getGyms from "app/gyms/queries/getCurrentSessionGyms"
import { Content, Button, ButtonGroup, Text, View, Flex } from "@adobe/react-spectrum"
import Heading from "app/core/components/Heading"

const ITEMS_PER_PAGE = 100

export const GymsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ gyms, hasMore, count }] = usePaginatedQuery(getGyms, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const showPagination = count > ITEMS_PER_PAGE

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <Content>
      <Flex gap={"size-125"}>
        {gyms.map((gym) => (
          <View
            key={gym.id}
            borderRadius={"regular"}
            backgroundColor={"static-white"}
            borderWidth={"thin"}
            padding={"size-125"}
            marginBottom={"size-225"}
          >
            <Flex
              alignItems={"center"}
              direction={"column"}
              justifyContent={"space-between"}
              height={"100%"}
              gap={"size-500"}
            >
              <Heading level={2}>{gym.name}</Heading>
              <View>
                <Link href={Routes.ShowGymPage({ gymId: gym.id })}>
                  <Button
                    variant="primary"
                    height={"size-200"}
                    width={"size-400"}
                    isQuiet
                    elementType={"a"}
                  >
                    <Text>View</Text>
                  </Button>
                </Link>
                <Link href={Routes.EditGymPage({ gymId: gym.id })}>
                  <Button
                    variant="primary"
                    height={"size-200"}
                    width={"size-400"}
                    isQuiet
                    elementType={"a"}
                  >
                    <Text>Edit</Text>
                  </Button>
                </Link>
              </View>
            </Flex>
          </View>
        ))}
      </Flex>

      {showPagination && (
        <ButtonGroup>
          <Button variant="cta" isQuiet isDisabled={page === 0} onPress={goToPreviousPage}>
            <Text>Previous</Text>
          </Button>
          <Button variant="cta" isQuiet isDisabled={!hasMore} onPress={goToNextPage}>
            <Text>Next</Text>
          </Button>
        </ButtonGroup>
      )}
    </Content>
  )
}

const GymsPage: BlitzPage = () => {
  return (
    <View>
      <Head>
        <title>Gyms</title>
      </Head>
      <Flex justifyContent={"space-between"} marginBottom={"size-225"}>
        <Heading level={1}>Your Gyms</Heading>

        <View>
          <Link href={Routes.NewGymPage()}>
            <Button elementType={"a"} variant="cta">
              Create Gym
            </Button>
          </Link>
        </View>
      </Flex>
      <Suspense fallback={<div>Loading...</div>}>
        <GymsList />
      </Suspense>
    </View>
  )
}

GymsPage.authenticate = true
GymsPage.getLayout = (page) => <Layout>{page}</Layout>

export default GymsPage
