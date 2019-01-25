import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

/**
 * Throws exceptions
 * @constructs ResponseController
 */
@Injectable()
export class ResponseService {
  /**
   * Throws the exception of a login failure
   * @function badLogin
   * @returns {HttpException}
   */
  badLogin(): HttpException {
    throw new HttpException({
      status: HttpStatus.UNAUTHORIZED,
      error: 'Connexion impossible, vérifiez vos identifiants.',
    }, 401);
  }
}
