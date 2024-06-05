const jwt = require('jsonwebtoken');

export class JwtHelper {
  static async getUserIdJWT(token: string): Promise<string | null> {
    token = token.replace('Bearer', '').trim();
    try {
      const decoded = jwt.decode(token);
      return decoded ? decoded['userId'] : null;
    } catch (error) {
      throw new Error('no get user id');
    }
  }

  static async getUserRoles(token: string): Promise<string[]> {
    token = token.replace('Bearer', '').trim();
    try {
      const decoded = jwt.decode(token);
      const value = decoded ? decoded : null;
      return value ? value.roles : null;
    } catch (error) {
      throw new Error('no get roles');
    }
  }
}
