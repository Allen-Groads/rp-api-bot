import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  api_name: string;
  api_version: string;
  constructor(
    private configService: ConfigService,
    ) {
      this.api_name = this.configService.get<string>('API_NAME');
      this.api_version = this.configService.get<string>('API_VERSION');
  }
  getHello(): string {
    return `{
      "api": 
        {
          "name": "${this.api_name}",
          "version": "${this.api_version}"
        }
      }`;
  }
}
