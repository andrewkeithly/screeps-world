import build from "./build";
import harvest from "./harvest";
import upgrade from "./upgrade";
export { default as spawn } from "./spawn";

const actions = {
  build,
  harvest,
  upgrade
};

export default actions;
