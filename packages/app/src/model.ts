// app/src/model.ts
import { ChefData } from "server/models";

export interface Model {
  chef?: ChefData;
  chefs?: ChefData[];
}

export const init: Model = {};