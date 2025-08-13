import type { Route } from "../+types/root";

export const loader: Route.LoaderFunction = async () => {
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/pokemmo-damage-calc/index.html?gen=5",
      "X-Robots-Tag": "noindex",
    },
  });
};

export default function CalcRedirect() {
  return null;
}



