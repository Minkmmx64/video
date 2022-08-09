import { VideoModule } from "./admin/Video/video.module";
import { UserClientModule } from "./client/user/user.modules";
import { VideoClientModule } from "./client/video/video.module";
import { TestModule } from "./test/test.module";
export const Modules =  {
  video: VideoModule,
  videoClient: VideoClientModule,
  UserClient: UserClientModule,
  TestModule: TestModule
}