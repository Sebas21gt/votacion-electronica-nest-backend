export class MessageResponse {
  statusCode: number;
  message: string;
  data: any;
  response: any;

  constructor(statusCode?: number, message?: string, data?: any, response?: any) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.response = response;
  }
}
