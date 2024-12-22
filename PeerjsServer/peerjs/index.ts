import { ExpressPeerServer } from "peer";
import http from "http";
import express from "express";

class PeerJs {
  public PeerJsServer;

  constructor(public server: http.Server) {
    this.PeerJsServer = ExpressPeerServer(server);
    this.PeerJsServer.on("connection", (client) => {
      console.log(`Client connected: ${client.getId()}`);
    });
    this.PeerJsServer.on("disconnect", (client) => {
      console.log(`Client disconnected: ${client.getId()}`);
    });
  }

  public intializePeerJsServerOnPath(app: express.Application, path: string) {
    if (!app) return;
    app.use(path, this.PeerJsServer);
  }
}

export default PeerJs;
