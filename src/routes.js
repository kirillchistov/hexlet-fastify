const routes = {
  rootPath: () => '/',
  uPath: () => '/u',
  usersPath: () => '/users',
  newUserPath: () => '/users/new',
  usersShowPath: () => '/users/show',
  userPath: (id) => `/users/${id}`,
  userPostPath: (id, postId) => `/u/${id}/post/${postId}`,
  coursesPath: () => '/courses',
  newCoursePath: () => '/courses/new',
  coursePath: (id) => `/courses/${id}`,
  helloPath: () => '/hello',
}

export default routes
