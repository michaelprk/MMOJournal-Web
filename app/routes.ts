import { index, route } from "@react-router/dev/routes";

const routes = [
  index("./routes/home.tsx"),
  route("/home", "./routes/home.tsx"),
  route("/login", "./routes/login.tsx"),
  route("/create-account", "./routes/create-account.tsx"),
  route("/forgot", "./routes/forgot.tsx"),
  route("/reset", "./routes/reset.tsx"),
  route("/pvp", "./routes/pvp/index.tsx"),
  route("/pvp/teams", "./routes/pvp/teams.tsx"),
  route("/shiny-hunt", "./routes/shiny-hunt/index.tsx"),
  route("/journal", "./routes/journal.tsx"),
  route("/calc", "./routes/calc.tsx"),
];

export default routes;
