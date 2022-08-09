/* eslint-disable no-debugger */
import { ref, Ref } from "vue";
import { menu, MenuItem } from "@/Mock/Menu";
import { useRouter } from "vue-router";
/**
 * 面包屑导航
 */
export function useBreaDNav(): IuseBreaDNav {
  const Nav = ref<BreadNav[]>([]);
  const MenuAC = ref<string>("");
  const router = useRouter();
  MenuAC.value = menu[0].children === undefined ? menu[0].route : menu[0].children[0].route;
  const findByNav = (item: string) => {
    return Nav.value.find(i => i.route === item);
  }

  const DFS = (Menus: MenuItem[],key:string) => {
    Menus.map( item => {
      if (item.children instanceof Array) {
        DFS(item.children,key);
      } else {
        if (key === item.route && findByNav(key) === undefined) {
          Nav.value.push({
            route: item.route,
            name: item.name,
            icon: item.icon
          })
          return;
        }
      }
    })
  }

  const BreadClose = (key: BreadNav, Index: number) => {
    if (Index === 0 && Nav.value.length === 1) return;
    else {
      if (Index === 0) {
        MenuAC.value = Nav.value[Index + 1].route;
      } else {
        if (Index === Nav.value.length - 1) {
          MenuAC.value = Nav.value[Index - 1].route;
        }
        else MenuAC.value = Nav.value[Index + 1].route;
      }
      Nav.value = Nav.value.filter(item => item.route !== key.route);
      router.push(MenuAC.value);
    }
  }

  const BreadNavTag = (nav: string) => {
    MenuAC.value = nav;
    router.push(nav);
  }

  const menuSelect = (key: string) => {
    MenuAC.value = key;
    DFS(menu, key);
    router.push(key);
  }

  const BeforDestory = () => {
    const session: SetSession = {
      Nav: Nav.value,
      MenuAC: MenuAC.value
    };
    sessionStorage.setItem("Bread", JSON.stringify(session));
  }

  return {
    Nav,
    menuSelect,
    MenuAC,
    BreadNavTag,
    BreadClose,
    BeforDestory
  };
}

//面包屑导航
interface BreadNav{
  route: string;
  name: string;
  icon: string;
}

//页面刷新存储的参数
export interface SetSession{
  //面包屑列表
  Nav: BreadNav[];
  //当前路由
  MenuAC: string;
}

interface IuseBreaDNav{

  menuSelect: (k:string) => void;

  Nav: Ref<BreadNav[]>;

  MenuAC: Ref<string>;

  BreadNavTag: (k: string) => void;

  BreadClose: (k: BreadNav, Index: number) => void;

  BeforDestory: () => void;
}

