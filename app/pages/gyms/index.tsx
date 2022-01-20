import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getGyms from "app/gyms/queries/getCurrentSessionGyms"

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
    <div>
      <ul>
        {gyms.map((gym) => (
          <div key={gym.id}>
            <div className="flex items-center flex-col justify-between h-full gap-5">
              <h2>{gym.name}</h2>
              <div>
                <Link href={Routes.ShowGymPage({ gymId: gym.id })}>
                  <a>View</a>
                </Link>
                <Link href={Routes.EditGymPage({ gymId: gym.id })}>
                  <a>Edit</a>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </ul>

      {showPagination && (
        <div>
          <button disabled={page === 0} onClick={goToPreviousPage}>
            Previous
          </button>
          <button disabled={!hasMore} onClick={goToNextPage}>
            Next
          </button>
        </div>
      )}
    </div>
  )
}

const GymsPage: BlitzPage = () => {
  return (
    <div>
      <Head>
        <title>Your Gyms</title>
      </Head>
      <div className="flex justify-between mb-4">
        <h1>Your Gyms</h1>

        <div>
          <Link href={Routes.NewGymPage()}>
            <a>Create Gym</a>
          </Link>
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <GymsList />
      </Suspense>
    </div>
  )
}

GymsPage.authenticate = true
GymsPage.getLayout = (page) => <Layout>{page}</Layout>

export default GymsPage
