import App from "./app";
import UserRoutes from "./routes/user.routes";
import AttendeeRoutes from "./routes/attendee.routes";

const app = new App([new UserRoutes(), new AttendeeRoutes()]);

app.listen();
