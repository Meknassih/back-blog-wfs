import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

const signupFieldMap = {
  username: 'nom d\'utilisateur',
  password: 'mot de passe',
  firstname: 'prénom',
  lastname: 'nom de famille',
  email: 'e-mail'
};

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

  /**
   * Throws the exception of a request that needs more privileges to be done
   * @function unsufficientPrivileges
   * @returns {HttpException}
   */
  unsufficientPrivileges(): HttpException {
    throw new HttpException({
      status: HttpStatus.UNAUTHORIZED,
      error: 'Cette requête nécessite des droits plus élevés.',
    }, 401);
  }

  /**
   * Throws the exception of a request that deleted succesfully a resource
   * @function deletionSuccessful
   * @returns {HttpException}
   */
  deletionSuccessful(): HttpException {
    throw new HttpException({
      status: HttpStatus.OK,
      error: 'Suppression effectuée avec succès.',
    }, 200);
  }

  /**
   * Throws the exception of a request that could not delete a resource
   * @function deletionUnsuccessful
   * @returns {HttpException}
   */
  deletionUnsuccessful(): HttpException {
    throw new HttpException({
      status: HttpStatus.BAD_REQUEST,
      error: 'La suppression n\'a pas réussi.',
    }, 400);
  }

  /**
   * Throws the exception of a request that cannot be called on target user
   * @function protectedUser
   * @returns {HttpException}
   */
  protectedUser(): HttpException {
    throw new HttpException({
      status: HttpStatus.BAD_REQUEST,
      error: 'Cette requête ne peut pas être réalisée sur l\'utilisateur cible.',
    }, 400);
  }

  /**
   * Throws the exception of a request that cannot be called on target user
   * @function noSuchArticle
   * @returns {HttpException}
   */
  noSuchArticle(): HttpException {
    throw new HttpException({
      status: HttpStatus.BAD_REQUEST,
      error: 'L\'article ciblé n\'existe pas.',
    }, 400);
  }

  /**
   * Throws the exception of a request to log a user with a disabled account
   * @function userAccountDisabled
   * @returns {HttpException}
   */
  userAccountDisabled(): HttpException {
    throw new HttpException({
      status: HttpStatus.OK,
      error: 'Ce compte utilisateur a été désactivé par les administrateurs.',
    }, 200);
  }

  /**
   * Throws the exception for bad form value during signup
   * @function invalidSignup
   * @returns {HttpException}
   */
  invalidSignup(field: string): HttpException {
    throw new HttpException({
      status: HttpStatus.OK,
      error: 'Inscription échouée car le champ ' + signupFieldMap[field] + ' a mal été renseigné.',
    }, 200);
  }
}
