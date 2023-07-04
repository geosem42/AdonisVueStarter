import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import RegisterValidator from 'App/Validators/RegisterUserValidator'
import UpdateProfileValidator from 'App/Validators/UpdateProfileValidator'

export default class AuthController {

  public async register({ request, auth, response }: HttpContextContract) {
    // Validate the user input
    const payload = await request.validate(RegisterValidator);

    // Create a new user using the validated data
    const user = new User();
    user.name = payload.name;
    user.email = payload.email;
    user.password = payload.password;
    await user.save();

    const token = await auth.use('api').attempt(payload.email, payload.password);

    response.cookie('token', token.toJSON().token, {
      httpOnly: true,
      maxAge: 7200,
      path: '/'
    });

    return { token: token.toJSON(), user: user };
  }

  public async login({ request, auth, response }: HttpContextContract) {
    const email = request.input('email');
    const password = request.input('password');
    const token = await auth.use('api').attempt(email, password);

    response.cookie('token', token.toJSON().token, {
      httpOnly: true,
      maxAge: 7200,
      path: '/'
    });

    const user = auth.user;

    return { token: token.toJSON(), user };
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.use('api').revoke();
    response.clearCookie('token');
    return response.ok({ message: 'Logged out successfully' });
  }

  public async check({ auth, response }: HttpContextContract) {
    try {
      // Ensure user is authenticated
      await auth.authenticate();

      // Respond with user data
      return response.ok({ user: auth.user });
    } catch (error) {
      return response.unauthorized({ message: 'User not authenticated' });
    }
  }

  public async isAuthenticated({ auth, response }: HttpContextContract) {
    try {
      await auth.authenticate();
      return response.ok({ isAuthenticated: true, user: auth.user });
    } catch {
      return response.ok({ isAuthenticated: false });
    }
  }

  public async updateProfile({ request, auth, response }: HttpContextContract) {
    try {
      // Validate the user input
      const payload = await request.validate(UpdateProfileValidator);

      // Get the authenticated user
      const user = auth.user;

      // Ensure that the user is not null or undefined
      if (user) {
        // Update user attributes using the validated data
        if (payload.name) user.name = payload.name;
        if (payload.email) user.email = payload.email;
        if (payload.password) user.password = payload.password;

        // Save the updated user to the database
        await user.save();

        // Return the updated user
        return response.ok({ user });
      } else {
        // Return error response if the user is not authenticated
        return response.unauthorized({ message: 'User not authenticated' });
      }
    } catch (error) {
      if (error.code === 'E_VALIDATION_FAILURE') {
        // Send the validation errors back
        return response.status(422).send(error.messages);
      }
      
      // For other errors, send a generic message
      return response.internalServerError({ message: 'Something went wrong' });
    }
  }

  public async deleteAccount({ auth, response }: HttpContextContract) {
    try {
      // Ensure that the user is authenticated
      const user = auth.user;
      if (user) {
        // Delete the user account
        await user.delete();

        // Clear the token cookie
        response.clearCookie('token');

        // Return a success message
        return response.ok({ message: 'Account deleted successfully' });
      } else {
        // Return error response if the user is not authenticated
        return response.unauthorized({ message: 'User not authenticated' });
      }
    } catch (error) {
      // Return error response
      return response.internalServerError({ message: error.message });
    }
  }
}
