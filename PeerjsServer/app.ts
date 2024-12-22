import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import PeerJs from "./peerjs";
class App {
  public port = 8080;
  public app: express.Application;
  public server: http.Server;
  public peerJsServerPath = "/peerjs";

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.initialzeMiddlewares();
  }

  public listen() {
    // this will be used to start the main and websocket server

    // initialize peerjs server
    const PeerJsServer = new PeerJs(this.server); // create instance to initialize peerjs server
    PeerJsServer.intializePeerJsServerOnPath(this.app, this.peerJsServerPath);

    this.server.listen(this.port, () => {
      console.log(`------Peerjs Server listening on port ${this.port}--------`);
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
