import { h, render } from "vue";
import ContextRender from "./ContextRender.vue";

export const useContextRender = () => {

  const VNode = h(ContextRender, { title: "123" });

  const D = document.createElement("div");

  render(VNode,D);

  return document.body.appendChild(D.firstElementChild as Node);
}
