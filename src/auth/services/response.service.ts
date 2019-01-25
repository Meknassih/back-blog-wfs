import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ResponseService {
  /**@function badLogin
   * @description Throws the exception of a login failure
   * @returns {HttpException}
   */
  badLogin(): HttpException {
    throw new HttpException({
      status: HttpStatus.UNAUTHORIZED,
      error: 'Connexion impossible, vérifiez vos identifiants.',
    }, 401);
  }
}
