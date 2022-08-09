export interface MenuItem {
  icon: string;
  name: string;
  route: string;
  children?: MenuItem[]
}

export const menu: MenuItem[] = [
  {
    name: "首页",
    route: "Home",
    icon: "icon-shouye",
  },
  {
    name: "Video",
    route: "Video",
    icon: "icon-yinpinbofang",
    children: [
      {
        name: "上传视频",
        route: "VideoUpload",
        icon: "icon-shangchuan",
      },
      {
        name: "视频列表",
        route: "VideoList",
        icon: "icon-shangchuan",
      },
    ]
  },
  {
    name: "User",
    route: "User",
    icon: "icon-24gl-portraitMaleInfo",
    children: [
      {
        name: "用户列表",
        route: "UserList",
        icon: "icon-24gl-portraitMaleInfo"
      }
    ]
  }
]