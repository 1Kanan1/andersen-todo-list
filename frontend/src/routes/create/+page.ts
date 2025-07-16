import type { PageLoad } from "./$types";

import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { createSchema } from "./schema";

export const ssr = false;

export const load: PageLoad = async () => {
  return {
    form: await superValidate(zod4(createSchema)),
  };
};
