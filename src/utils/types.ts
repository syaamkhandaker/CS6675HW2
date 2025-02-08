export class PeerResponse {
  valid: boolean;
  message: string;

  constructor(isValid: boolean, message: string) {
    this.valid = isValid;
    this.message = message;
  }
}
