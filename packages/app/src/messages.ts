// app/src/messages.ts
import { ChefData } from "server/models";

export type Msg =
  | ["chef/load", { chefId: string }]
  | ["chef/save", { chefId: string; chef: ChefData }]
  | ["chefs/load", {}];