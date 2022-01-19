import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getGym from "app/gyms/queries/getGym"
import updateGym from "app/gyms/mutations/updateGym"
import { updateGymSchema } from "app/gyms/validations"
import { GymForm, FORM_ERROR } from "app/gyms/components/GymForm"
import { Heading } from "@adobe/react-spectrum"

export const EditGym = () => {
  const router = useRouter()
  const gymId = useParam("gymId", "string")
  const [gym, { setQueryData }] = useQuery(
    getGym,
    { id: gymId, withOwner: false },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateGymMutation] = useMutation(updateGym)

  return (
    <>
      <Head>
        <title>Edit Gym {gym.name}</title>
      </Head>

      <div>
        <Heading level={1}>Edit Gym {gym.name}</Heading>

        <GymForm
          submitText="Update Gym"
          schema={updateGymSchema}
          initialValues={gym}
          onSubmit={async (values) => {
            try {
              const updated = await updateGymMutation(values)
              await setQueryData(updated)
              router.push(Routes.ShowGymPage({ gymId: updated.id }))
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

const EditGymPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditGym />
      </Suspense>

      <p>
        <Link href={Routes.GymsPage()}>
          <a>Gyms</a>
        </Link>
      </p>
    </div>
  )
}

EditGymPage.authenticate = true
EditGymPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditGymPage
