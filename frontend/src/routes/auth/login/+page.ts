import type { PageLoad } from "./$types";

import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { loginSchema } from "../schema";

export const load: PageLoad = async () => {
  return {
    form: await superValidate(zod4(loginSchema)),
  };
};
