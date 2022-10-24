export default async (context) => {
  const result = await context.store.dispatch('keepConnection')
  if (
    result &&
    (context.store.state.userAuth === undefined ||
      context.store.state.userAuth.role !== process.env.roleThree)
  ) {
    return context.redirect('/')
  }
}
