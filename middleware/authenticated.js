export default function ({ store, redirect }) {
  const { auth } = store.state
  // const permissions = auth.payload.permissions

  console.log(auth)
  if (
    !auth.payload
    // !auth.payload ||
    // !permissions.includes('admin')
  ) {
    return redirect('/not-permitted')
  }
}
