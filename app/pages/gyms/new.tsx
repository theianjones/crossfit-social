import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createGym from "app/gyms/mutations/createGym"
import { createGymSchema } from "app/gyms/validations"
import { GymForm, FORM_ERROR } from "app/gyms/components/GymForm"
import { LabeledTextField } from "app/core/components/LabeledTextField"

const NewGymPage: BlitzPage = () => {
  const router = useRouter()
  const [createGymMutation] = useMutation(createGym)

  return (
    <div>
      <h1>Create New Gym</h1>

      <GymForm
        submitText="Create Gym"
        schema={createGymSchema}
        initialValues={{}}
        onSubmit={async (values) => {
          try {
            const gym = await createGymMutation(values)
            router.push(Routes.ShowGymPage({ gymId: gym.id }))
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      >
        <LabeledTextField type="email" name="gymRoles.0.email" label="Owner" />
      </GymForm>

      <p>
        <Link href={Routes.GymsPage()}>
          <a>Gyms</a>
        </Link>
      </p>
    </div>
  )
}

NewGymPage.authenticate = true
NewGymPage.getLayout = (page) => <Layout title={"Create New Gym"}>{page}</Layout>

export default NewGymPage
