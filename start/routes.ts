import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.post('register', 'AuthController.register').middleware('guest');
  Route.post('login', 'AuthController.login').middleware('guest');
  Route.post('/auth/logout', 'AuthController.logout').middleware('auth');
  Route.get('/auth/check', 'AuthController.check').middleware('auth');
  Route.get('/auth/isAuthenticated', 'AuthController.isAuthenticated');
  Route.put('/auth/update', 'AuthController.updateProfile').middleware('auth');
  Route.delete('/auth/delete-account', 'AuthController.deleteAccount').middleware('auth');
}).prefix('api')