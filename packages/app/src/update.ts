// app/src/update.ts
import { Auth, Update } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import { ChefData } from "server/models";

export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  user: Auth.User
) {
  switch (message[0]) {
    case "chef/load":
      loadChef(message[1], user)
        .then((chef) =>
          apply((model) => ({ ...model, chef }))
        )
        .catch((error) => {
          console.error("Failed to load chef:", error);
        });
      break;

    case "chef/save":
      saveChef(message[1], user)
        .then((chef) =>
          apply((model) => ({ ...model, chef }))
        )
        .catch((error) => {
          console.error("Failed to save chef:", error);
        });
      break;

    case "chefs/load":
      loadChefs(user)
        .then((chefs) =>
          apply((model) => ({ ...model, chefs }))
        )
        .catch((error) => {
          console.error("Failed to load chefs:", error);
        });
      break;

    default:
      const unhandled: never = message[0];
      throw new Error(`Unhandled message "${unhandled}"`);
  }
}

function loadChef(
  payload: { chefId: string },
  user: Auth.User
): Promise<ChefData | undefined> {
  return fetch(`/api/chefs/${payload.chefId}`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error(`Failed to load chef: ${response.status}`);
    })
    .then((json: unknown) => {
      console.log("Chef loaded:", json);
      return json as ChefData;
    });
}

function saveChef(
  payload: { chefId: string; chef: ChefData },
  user: Auth.User
): Promise<ChefData> {
  return fetch(`/api/chefs/${payload.chefId}`, {
    method: "PUT",
    headers: {
      ...Auth.headers(user),
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload.chef)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error(`Failed to save chef: ${response.status}`);
    })
    .then((json: unknown) => {
      console.log("Chef saved:", json);
      return json as ChefData;
    });
}

function loadChefs(user: Auth.User): Promise<ChefData[]> {
  return fetch("/api/chefs", {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error(`Failed to load chefs: ${response.status}`);
    })
    .then((json: unknown) => {
      console.log("Chefs loaded:", json);
      return json as ChefData[];
    });
}