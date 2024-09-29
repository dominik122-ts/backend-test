export class ResponseError extends Error {
  private _name = "ResponseError";
  private _message: string;
  private _status: 200 | 400 | 401 | 403 | 404 | 500;

  constructor(
    message: string,
    status: 200 | 400 | 401 | 403 | 404 | 500,
    name?: string
  ) {
    super(message);
    this._status = status;
    this._message = message;

    if (name) this._name = name;
  }

  public get status() {
    return this._status;
  }

  public get name() {
    return this._name;
  }

  public get message() {
    return this._message;
  }
}
