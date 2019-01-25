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
      status: HttpStatus.OK,
      error: 'Connexion impossible, vérifiez vos identifiants.',
    }, 200);
  }

  /**
   * Throws the exception of a request that needs a user logon
   * @function notLoggedIn
   * @returns {HttpException}
   */
  notLoggedIn(): HttpException {
    throw new HttpException({
      status: HttpStatus.UNAUTHORIZED,
      error: 'Cette requête nécessite d\'être connecté au préalable.',
    }, 401);
  }
}
