import { index, route, layout } from "@react-router/dev/routes";

const routes = [
  // Auth routes with AuthLayout
  layout("./layouts/AuthLayout.tsx", [
    route("/login", "./routes/login.tsx"),
    route("/create-account", "./routes/create-account.tsx"),
    route("/forgot", "./routes/forgot.tsx"),
    route("/reset", "./routes/reset.tsx"),
  ]),
  
  // Main app routes with MainLayout
  layout("./layouts/MainLayout.tsx", [
    index("./routes/index.tsx"),
    route("/home", "./routes/home.tsx"),
    route("/pvp", "./routes/pvp/index.tsx"),
    route("/pvp/teams", "./routes/pvp/teams.tsx"),
    route("/privacy", "./routes/privacy.tsx"),
    route("/tos", "./routes/tos.tsx"),
    route("/shiny-hunt", "./routes/shiny-hunt/index.tsx"),
    route("/journal", "./routes/journal.tsx"),
    route("/calc", "./routes/calc.tsx"),
  ]),
];

export default routes;
