import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TokenExtractorMiddleware {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    const token = request.cookie('token');
    if (token) {
      request.headers().authorization = `Bearer ${token}`;
    }
    await next();
  }
}
