import App from "./app";
import UserRoutes from "./routes/user.routes";

const app = new App([new UserRoutes()]);

app.listen();
