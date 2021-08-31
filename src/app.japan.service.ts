import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class AppJapanService {

  constructor(
    @Inject('APP_NAME') private readonly name: string,
    @Inject('MESSAGE') private readonly message: string
  ) { }

  public getHello(): string {
    return `こんにちは世界 ! ${this.name} ${this.message}`;
  }
}