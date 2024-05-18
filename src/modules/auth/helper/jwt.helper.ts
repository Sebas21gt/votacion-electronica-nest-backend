import { BadRequestException } from "@nestjs/common";

const jwt = require('jsonwebtoken');

export class JwtHelper {
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

  static async getUserName(token: string): Promise<string> {
    token = token.replace('Bearer', '').trim();
    try {
      const decoded = jwt.decode(token);
      return decoded ? decoded['preferred_username'] : null;
    } catch (error) {
      throw new Error('no get user name');
    }
  }

  static async sign(payload: any): Promise<string> {
    return await jwt.sign(payload, process.env.JWT_SECRET, {
      algorithm: 'RS256',
      expiresIn: process.env.JWT_INVITATION_EXPIRATION_TIME
    });
  }

  static async verify(payload: any): Promise<any> {
    try {
      return await jwt.verify(payload, process.env.JWT_SECRET);
    } catch (err) {
      err = {
        ...err,
        statusCode: 400
      }
      throw new BadRequestException(err);
    }
  }
}
