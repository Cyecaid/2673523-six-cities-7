export type ValidationErrorField = {
  property: string;
  messages: string[];
};

export class HttpError extends Error {
  constructor(
    public readonly httpStatusCode: number,
    message: string,
    public readonly detail?: string,
    public readonly details?: ValidationErrorField[],
  ) {
    super(message);
  }
}
