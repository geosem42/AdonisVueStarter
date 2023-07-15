import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import RegisterValidator from 'App/Validators/RegisterUserValidator'
import UpdateProfileValidator from 'App/Validators/UpdateProfileValidator'
import crypto from 'crypto'
import sgMail from '@sendgrid/mail'

export default class AuthController {

  public async register({ request }: HttpContextContract) {
    // Validate the user input
    const payload = await request.validate(RegisterValidator);

    // Create a new user using the validated data
    const user = new User();
    user.name = payload.name;
    user.email = payload.email;
    user.password = payload.password;
    user.status = 'inactive';
    user.emailVerificationToken = crypto.randomBytes(32).toString('hex');
    await user.save();

    // Send verification email
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY is not defined in the environment');
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: user.email,
      from: process.env.SENDFROM_EMAIL || '',
      subject: 'Verify your email address',
      text: `Click the link to verify your email address: ${process.env.APP_URL}/verify?token=${user.emailVerificationToken}`,
      html: `<p>Click the link to verify your email address: <a href="${process.env.APP_URL}/verify?token=${user.emailVerificationToken}">${process.env.APP_URL}/verify?token=${user.emailVerificationToken}</a></p>`,
    };
    await sgMail.send(msg);


    // const token = await auth.use('api').attempt(payload.email, payload.password);

    // response.cookie('token', token.toJSON().token, {
    //   httpOnly: true,
    //   maxAge: 7200,
    //   path: '/'
    // });

    return { message: 'Registration successful. Please verify your email before logging in.', user: user };
  }

  public async login({ request, auth, response }: HttpContextContract) {
    const email = request.input('email');
    const password = request.input('password');

    const user = await User.findBy('email', email);

    if (!user) {
      return response.unauthorized({ message: 'Invalid email address.' });
    }

    if (user.status !== 'active') {
      return response.unauthorized({ message: 'Account not active.' });
    }

    try {
      const token = await auth.use('api').attempt(email, password);

      response.cookie('token', token.toJSON().token, {
        httpOnly: true,
        maxAge: 7200,
        path: '/'
      });

      return { token: token.toJSON(), user };
    } catch {
      return response.unauthorized({ message: 'Invalid password.' });
    }
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

  public async verifyEmail({ request, response }: HttpContextContract) {
    const token = request.input('token');
    if (!token) {
      return response.badRequest({ message: 'Missing verification token' });
    }
    
    const user = await User.findBy('email_verification_token', token);
    if (!user) {
      return response.badRequest({ message: 'Invalid verification token' });
    }
  
    // Set the user status to active and clear the verification token
    user.status = 'active';
    user.emailVerificationToken = null;
    await user.save();
  
    return response.ok({ message: 'Email address verified successfully' });
    //response.redirect(`${process.env.APP_URL}/login?message=Email+address+verified+successfully`);
  }
}
