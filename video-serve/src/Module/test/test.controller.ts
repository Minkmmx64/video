import { Controller, Get } from "@nestjs/common";
import { TestService } from "./test.service";

@Controller("/wx")
export class TestController {
  constructor(private readonly TestServices: TestService) { }

  @Get("/video/list")
  public async video() {
    return await this.TestServices.video();
  }
}