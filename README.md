# PeerConnect Backend with PeerJS and WebSocket

This repository contains the backend implementation for a WebRTC-based application. It integrates a **PeerJS server**, **WebSocket server**, and the **main backend server**, to enhance modularity and maintainability.

### Features:

-   **PeerJS Server**: Runs on a dedicated port to handle peer-to-peer connections, enabling smooth media and data exchange between participants.
-   **WebSocket Server**: Facilitates real-time signaling and communication between the client and server.
-   **Main Backend Server**: Manages core backend operations, such as participant management, meeting logic, and API integrations.
-   **Scalable Architecture**: Designed to efficiently handle multiple simultaneous connections while keeping components decoupled.

### Tech Stack:

-   **Typescript**: Powers the backend logic and APIs.
-   **PeerJS**: Simplifies WebRTC peer-to-peer communication.
-   **Socket.io**: Provides robust real-time communication via WebSocket.

### Deployment:

-   **PeerJS Server** runs on its dedicated port, separate from the WebSocket and main backend server, for streamlined signaling and communication.

