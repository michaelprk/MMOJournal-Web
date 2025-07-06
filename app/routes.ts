import { index, route } from "@react-router/dev/routes";

const routes = [
  index("./routes/home.tsx"),
  route("/login", "./routes/login.tsx"),
  route("/pvp", "./routes/pvp/index.tsx"),
  route("/shiny-hunt", "./routes/shiny-hunt/index.tsx"),
  route("/journey", "./routes/journey/index.tsx"),
];

export default routes;
