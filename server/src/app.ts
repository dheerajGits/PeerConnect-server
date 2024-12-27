import express from "express";
import http from "http";
import cors from "cors";
import WSS from "./Websocket";
import bodyParser from "body-parser";
import UserRoutes from "./routes/user.routes";
import AttendeeRoutes from "./routes/attendee.routes";
import MeetingRoutes from "./routes/meeting.routes";
class App {
  public port = 3030;
  public webSocketPort = 3031;
  public peerJsServerPath = "/peerjs";
  public app: express.Application;
  public server: http.Server;
  public routes = [new UserRoutes(), new AttendeeRoutes(), new MeetingRoutes()];

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.initialzeMiddlewares();
    this.initializeRoutes(this.routes);
  }

  public listen() {
    // this will be used to start the main and websocket server

    new WSS(this.server); // initialized websocket server

    // initialize peerjs server

    this.server.listen(this.port, () => {
      console.log(`------server listening on port ${this.port}--------`);
      console.log(
        `------Websocket Listening on port ${
          this.webSocketPort || 3030
        }--------`
      );
    });
  }

  public initialzeMiddlewares() {
    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" })); // set limit to 50mb
    this.app.use(cors());
  }

  public initializeRoutes(Routes: any) {
    console.log("Initializing routes");
    console.log();
    Routes.map((Route: any) => {
      this.app.use("/", Route.router);
    });
  }
}
export default App;
