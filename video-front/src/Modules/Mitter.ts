import mitt, { Emitter } from "mitt";

interface EventType {
  unShiftBullet: undefined
}

export type VideoEventType<E extends keyof EventType> = Emitter<Record<E, EventType[E]>>;

const Emit = mitt();

export default Emit;