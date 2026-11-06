# 🤝 MeetMe — Real-time Video Conferencing & Chat Platform

MeetMe is a modern, real-time video conferencing and instant messaging web application. It combines peer-to-peer (P2P) audio/video streaming via **WebRTC** with real-time text chat and meeting orchestration powered by **Socket.io**.

---

## 🏛️ System Architecture

MeetMe follows a hybrid **Client-Server / P2P hybrid architecture** to support high-performance video communication with minimal server overhead.

```mermaid
sequenceDiagram
    autonumber
    actor Alice as Client A (Frontend)
    actor Bob as Client B (Frontend)
    participant Server as Socket.io Server (Backend)
    participant STUN as Google STUN Server

    Note over Alice, Bob: 1. Signaling Setup
    Alice->>Server: join-call (Room ID / Meeting URL)
    Server-->>Alice: user-joined (Bob is in the room)
    Alice->>Server: Create & Send SDP Offer (via 'signal')
    Server->>Bob: Relay SDP Offer (from Alice)

    Note over Bob: 2. Answer Negotiation
    Bob->>Server: Create & Send SDP Answer (via 'signal')
    Server->>Alice: Relay SDP Answer (from Bob)

    Note over Alice, Bob: 3. ICE Negotiation
    Alice->>STUN: Request Public IP & Port (ICE Candidate)
    STUN-->>Alice: Return ICE Candidate
    Alice->>Server: Send ICE Candidate (via 'signal')
    Server->>Bob: Relay Alice's ICE Candidate

    Bob->>STUN: Request Public IP & Port (ICE Candidate)
    STUN-->>Bob: Return ICE Candidate
    Bob->>Server: Send ICE Candidate (via 'signal')
    Server->>Alice: Relay Bob's ICE Candidate

    Note over Alice, Bob: 4. Direct Peer-to-Peer Stream
    Alice->>Bob: Establish Peer-to-Peer Media Channel (WebRTC)
    Note over Alice, Bob: Audio, Video, and Screen Share are sent directly between browsers!
```

### 🛰️ Architectural Components

1. **Signaling Server (Backend)**: Orchestrates meeting creation, socket room memberships, chat persistence, and relays session configuration data (SDP offers, SDP answers, ICE candidates) so clients can negotiate peer connections.
2. **ICE / STUN Servers**: Used by client browsers to discover their public-facing IP addresses and bypass Network Address Translation (NAT) to configure standard network routes.
3. **P2P Media Channel (WebRTC)**: Once signaling is complete, audio and video streams flow directly client-to-client without routing through the backend, minimizing server resource utilization and reducing delay.
4. **Chat Routing Server (Socket.io)**: Text chat is routed through the central server room to enable real-time messaging, broadcast, and history synchronization.

---

## 💻 Frontend App

The frontend is a single-page application built using modern web standards.

### 🛠️ Tech Stack
*   **Framework**: React 19
*   **Build Tool**: Vite
*   **UI Library**: Material-UI (MUI) (`@mui/material`, `@mui/icons-material`)
*   **HTTP Client**: Axios for API requests
*   **Real-time Gateway**: Socket.io Client for signaling and room events
*   **Routing**: React Router DOM for page navigation
*   **Notifications**: React Toastify for user alerts

### 📂 File Structure

*   [main.jsx](file:///c:/Users/hsr41/.vscode/.vscode/Projects/MeetMe/frontend/src/main.jsx): React application bootstrap and routing.
*   [environment.js](file:///c:/Users/hsr41/.vscode/.vscode/Projects/MeetMe/frontend/src/environment.js): Dynamically controls the destination server base URL.
*   [contexts/AuthContext.jsx](file:///c:/Users/hsr41/.vscode/.vscode/Projects/MeetMe/frontend/src/contexts/AuthContext.jsx): Encapsulates authentication state (signup, login, verification, and meeting history).
*   **Pages**:
    *   [landingPage.jsx](file:///c:/Users/hsr41/.vscode/.vscode/Projects/MeetMe/frontend/src/pages/landingPage.jsx): Entry landing page with styling transitions.
    *   [authentication.jsx](file:///c:/Users/hsr41/.vscode/.vscode/Projects/MeetMe/frontend/src/pages/authentication.jsx): Handles sign-up and login forms.
    *   [guestMeeting.jsx](file:///c:/Users/hsr41/.vscode/.vscode/Projects/MeetMe/frontend/src/pages/guestMeeting.jsx): Details form page for guests to enter Name and Year of Birth.
    *   [joinMeeting.jsx](file:///c:/Users/hsr41/.vscode/.vscode/Projects/MeetMe/frontend/src/pages/joinMeeting.jsx): Pre-meeting lobby page with live camera/microphone toggles and previews.
    *   [home.jsx](file:///c:/Users/hsr41/.vscode/.vscode/Projects/MeetMe/frontend/src/pages/home.jsx): Dashboard where registered users can join meetings or generate meeting codes.
    *   [history.jsx](file:///c:/Users/hsr41/.vscode/.vscode/Projects/MeetMe/frontend/src/pages/history.jsx): Displays lists of meeting history joined by the user.
    *   [VideoMeet.jsx](file:///c:/Users/hsr41/.vscode/.vscode/Projects/MeetMe/frontend/src/pages/VideoMeet.jsx): The core video meeting interface.

---

## ⚙️ Backend API

The backend is built as a REST API and a real-time Socket.io server to coordinate user accounts and chat sessions.

### 🛠️ Tech Stack
*   **Runtime**: Node.js + Express
*   **Database**: MongoDB via Mongoose ORM
*   **Real-time Server**: Socket.io
*   **Security**: JSON Web Token (JWT) & bcrypt
*   **HTTP State**: Cookie-Parser to manage authentication cookies

### 📂 File Structure

*   [app.js](file:///c:/Users/hsr41/.vscode/.vscode/Projects/MeetMe/backend/app.js): Entry point configuration. Sets up CORS, cookie-parsers, database initialization, and launches the HTTP and WebSocket listeners.
*   **Routes**:
    *   [AuthRoute.js](file:///c:/Users/hsr41/.vscode/.vscode/Projects/MeetMe/backend/src/routes/AuthRoute.js): Router for user credentials verification status.
    *   [users_routes.js](file:///c:/Users/hsr41/.vscode/.vscode/Projects/MeetMe/backend/src/routes/users_routes.js): Group endpoints for user authentication actions (`/login`, `/signup`, `/logout`) and history storage (`/get_all_activity`, `/add_to_activity`).
*   **Controllers**:
    *   [Auth.js](file:///c:/Users/hsr41/.vscode/.vscode/Projects/MeetMe/backend/src/controllers/Auth.js): Executes hashing passwords, checking database records, signing JWTs, and returning cookie headers.
    *   [AuthMiddleware.js](file:///c:/Users/hsr41/.vscode/.vscode/Projects/MeetMe/backend/src/controllers/AuthMiddleware.js): Intercepts secure requests, verifies incoming JWT browser cookies, and extracts active user identities.
    *   [history.js](file:///c:/Users/hsr41/.vscode/.vscode/Projects/MeetMe/backend/src/controllers/history.js): CRUD handlers to store and read past meeting sessions associated with users.
    *   [socketManager.js](file:///c:/Users/hsr41/.vscode/.vscode/Projects/MeetMe/backend/src/controllers/socketManager.js): Contains the WebSocket handlers. Listens for user connection, joins/leaves rooms, handles signal relay events (`signal`), and broadcasts chat messages inside specified active meeting codes.
*   **Models**:
    *   [User.js](file:///c:/Users/hsr41/.vscode/.vscode/Projects/MeetMe/backend/src/models/User.js): Schema representing user accounts.
    *   [Meeting.js](file:///c:/Users/hsr41/.vscode/.vscode/Projects/MeetMe/backend/src/models/Meeting.js): Schema logging past meetings for history tracking.

---

## 🔗 Connection: Frontend ↔️ Backend

The connection between the client app and the server API is established through two channels:

```
┌────────────────────────────────────────┐
│               Frontend                 │
│                                        │
│  (1) HTTP Rest APIs   (2) WebSockets   │
│   (Axios + Cookies)  (Socket.io Client)│
└──────┬──────────────────────────┬──────┘
       │                          │
       ▼                          ▼
┌────────────────────────────────────────┐
│               Backend                  │
└────────────────────────────────────────┘
```

1.  **Stateful HTTP Connections**:
    *   Authentication actions (Sign Up, Login) are sent to `/users/signup` or `/users/login`.
    *   The backend responds by setting an `httpOnly` secure cookie named `token` containing the signed JWT.
    *   Subsequent requests send this cookie automatically using Axios configured with `{ withCredentials: true }`.
2.  **WebSocket / Socket.io Relays**:
    *   When entering a meeting, the frontend opens a Socket connection with the server backend at the base URL.
    *   The socket joins a room keyed by the specific meeting code.
    *   The room acts as a private signaling broker, relaying RTCSessionDescription (offers/answers) and RTCIceCandidate details between the participants to negotiate a WebRTC connection.

---

## 🛠️ Problems Solved & Enhancements Made

### 1. Networking & Configuration
*   **Port Mismatch Fixed**: Resolved a bug where the backend ran on port `5001` (from `.env`) but the frontend had `3000` hardcoded. Made ports dynamic and correctly aligned at `5001`.
*   **Local Development Cookie Issues**: Cookies configured with `secure: true` and `sameSite: "none"` were silently rejected by browsers on HTTP `localhost`. Made cookie configurations environment-aware (`secure` is disabled locally and enabled in production).

### 2. User Experience & Flows
*   **Guest Onboarding Flow (/guestmeeting)**: Created a details collection form where guests submit their Name and Year of Birth. Data is saved temporarily to `sessionStorage` and automatically cleared when the session ends.
*   **Pre-Meeting Lobby (/join)**: Built a lobby page with clean UI showing a live camera preview and control toggles for camera/microphone before entering the meeting.
*   **Direct Call Integration**: Users skip duplicate lobby prompts inside `VideoMeet.jsx` since guest credentials are automatically inherited from their lobby choices.

### 3. Video Meeting Overhaul & Layout
*   **Responsive Grid**: Rewrote the video viewport layout so that both local user feeds and all remote participants render in a dynamically resizing grid.
*   **90/10 Height Split Layout**: Structured the call page to use 90% of screen height for the video/chat area and 10% for control buttons.
*   **Adaptive Chat Panel**: When the chat sidebar toggles open on the right, the main video area shrinks smoothly to prevent overlaying the participant screens.
*   **Interactive Emoji Support**: Added quick-select buttons and a fully scrollable drawer inside the chat input area to easily send emojis.

### 4. Stability & Bug Fixes
*   **Duplicate Chat Messages**: Fixed a resource leak where multiple Socket.io client connections were initiated on mount. Managed connection tracking using a React `useRef` reference to assure a single active connection, preventing chat feed duplication.
*   **Infinite Media Request Loop**: Added the missing dependency array to the media permission `useEffect` hooks, stopping infinite cycles of `getUserMedia` calls.
*   **Camera Indicator Hardware Release**: Updated media toggling logic to fully stop local tracks (`track.stop()`), remove tracks from active streams, clear video source objects, and detach tracks from active `RTCPeerConnection` WebRTC senders. This ensures the physical camera hardware indicator light turns off instantly when the user toggles their video off.
*   **Express Router Middleware Fix**: Fixed route registration on `/signup` and `/login` where route controllers were incorrectly declared as middleware, leading to double-header responses and crashes.

---

## 🚀 Running the Project Locally

### 1. Prerequisite Configuration
Create a `.env` file in the `backend/` directory:
```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/meetme
TOKEN_KEY=your_super_secret_jwt_signature_key_here
```

### 2. Startup Backend Server
```bash
cd backend
npm install
npm run dev
```
The server will boot on [http://localhost:5001](http://localhost:5001).

### 3. Startup Frontend Client
```bash
cd frontend
npm install
npm run dev
```
The Vite development server will spin up on [http://localhost:5173](http://localhost:5173).










<!-- # ⚠️ MeetMe — Known Issues, Security Shortcomings, & Fix Plan

This document cataloges security concerns, configuration issues, design limitations, and code bugs in the MeetMe repository, along with detailed recommendations for fixing them.

---

## 🔒 1. Exposed & Hardcoded API Keys / Credentials

### 🚨 Exposed MongoDB Connection String
*   **Location**: [backend/app.js:L18](file:///c:/Users/hsr41/.vscode/.vscode/Projects/MeetMe/backend/app.js#L18)
*   **Shortcoming**: The MongoDB connection string `mongodb+srv://MeetMe:MeetMe@meetme.gqz6xsd.mongodb.net/?appName=MeetMe` is hardcoded directly inside the source code. This exposes database credentials (`MeetMe` user and password) to anyone with repository access.
*   **Fix Plan**: Move the connection string to an environment variable in a secure `.env` file and load it using `dotenv`.
    ```diff
    - const uri="mongodb+srv://MeetMe:MeetMe@meetme.gqz6xsd.mongodb.net/?appName=MeetMe"
    + const uri = process.env.MONGO_URI;
    + if (!uri) {
    +   console.error("❌ MONGO_URI is missing in .env file");
    +   process.exit(1);
    + }
    ```

### 🚨 Version-Controlled JWT Secret Key
*   **Location**: [backend/.env:L1](file:///c:/Users/hsr41/.vscode/.vscode/Projects/MeetMe/backend/.env#L1)
*   **Shortcoming**: While `.env` is ignored in git, the current key is set to a weak default `ZerodhaClone@12345`.
*   **Fix Plan**: Use a strong, random, environment-specific secret key generated cryptographically in production (e.g., using `crypto.randomBytes(64).toString('hex')`).

---

## 🏛️ 2. Architecture & State Shortcomings

### 🚨 Volatile In-Memory Room & Chat Store
*   **Location**: [backend/src/controllers/socketManager.js:L44-L46](file:///c:/Users/hsr41/.vscode/.vscode/Projects/MeetMe/backend/src/controllers/socketManager.js#L44-L46)
*   **Shortcoming**: Active socket connection IDs (`connections`), user time logs (`timeOnline`), and temporary chat history (`messages`) are stored in volatile local JavaScript objects in memory:
    ```javascript
    let connections = {}
    let messages = {}
    let timeOnline = {}
    ```
    If the backend server crashes, restarts (standard behavior during deployment on platforms like Render or Heroku), or scales horizontally to multiple instances, all active meeting states and in-flight chat data are instantly deleted.
*   **Fix Plan**: 
    1. Backup/store active chat histories inside the MongoDB database (using a schema or collection).
    2. Maintain rooms and session states in a **Redis** cache/store to allow horizontal scaling and state persistence across server restarts.

### 🚨 Inefficient Room Search Logic
*   **Location**: [backend/src/controllers/socketManager.js:L108-L135](file:///c:/Users/hsr41/.vscode/.vscode/Projects/MeetMe/backend/src/controllers/socketManager.js#L108-L135)
*   **Shortcoming**: In the `chat-message` event, the server iterates through every single active room and user to identify which room the message sender belongs to:
    ```javascript
    const [matchingRoom, found] = Object.entries(connections)
        .reduce(([room, isFound], [roomKey, roomValue]) => { ... })
    ```
    This linear search runs on every keystroke/message and has a time complexity of $O(N \cdot M)$ where $N$ is active rooms and $M$ is users per room. This does not scale.
*   **Fix Plan**: Keep a reverse-lookup dictionary tracking active mapping of `userToRoom`:
    ```javascript
    let socketToRoom = {}; // socket.id -> roomCode
    ```
    When joining, set the mapping: `socketToRoom[socket.id] = path`. Search becomes an instantaneous $O(1)$ operation:
    ```javascript
    const matchingRoom = socketToRoom[socket.id];
    ```

---

## 🌐 3. Networking & Protocol Concerns

### 🚨 Hardcoded Environment Configuration in Frontend
*   **Location**: [frontend/src/environment.js:L1-L2](file:///c:/Users/hsr41/.vscode/.vscode/Projects/MeetMe/frontend/src/environment.js#L1-L2)
*   **Shortcoming**: The destination backend URL is toggled manually inside source code:
    ```javascript
    let IS_PROD = true;
    const server= IS_PROD ? "https://meetme-backend-85an.onrender.com/" : "http://localhost:3000/";
    ```
    Developers must remember to modify this file before pushing to production or running locally, which is highly error-prone.
*   **Fix Plan**: Use Vite environment variables (`.env.development` and `.env.production` files) and load them using `import.meta.env`:
    ```javascript
    const server = import.meta.env.VITE_API_URL || "http://localhost:3000/";
    export default server;
    ```

### 🚨 Insecure Local WebSocket Client Flag
*   **Location**: [frontend/src/pages/VideoMeet.jsx:L247](file:///c:/Users/hsr41/.vscode/.vscode/Projects/MeetMe/frontend/src/pages/VideoMeet.jsx#L247)
*   **Shortcoming**: The WebSocket client connection specifies `secure: false`:
    ```javascript
    socketRef.current = io.connect(server_url, { secure: false })
    ```
    When the client app is deployed on HTTPS, browsers block connections to insecure endpoints (HTTP/WS) due to Mixed Content policies.
*   **Fix Plan**: Dynamically toggle secure connection based on the target server protocol:
    ```javascript
    const isSecure = server_url.startsWith("https");
    socketRef.current = io.connect(server_url, { secure: isSecure });
    ```

### 🚨 Lack of TURN Configuration (NAT Traversal failures)
*   **Location**: [frontend/src/pages/VideoMeet.jsx:L20-L22](file:///c:/Users/hsr41/.vscode/.vscode/Projects/MeetMe/frontend/src/pages/VideoMeet.jsx#L20-L22)
*   **Shortcoming**: The peer connection is configured with only a single public Google STUN server:
    ```javascript
    const peerConfigConnections = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    ```
    STUN servers only retrieve the client's public IP address. In real-world environments, up to 20-30% of connections fail NAT traversal (e.g., office networks, firewalls, symmetric NATs) and require a **TURN** (Traversal Using Relays around NAT) relay server to forward media traffic.
*   **Fix Plan**: Integrate a free or paid TURN server provider (such as Xirsys or Coturn) into the configuration.

---

## 🪲 4. Code Quality & Bug Risks

### 🚨 Silent Errors / Hanging HTTP Connections
*   **Location**: [backend/src/controllers/Auth.js:L59](file:///c:/Users/hsr41/.vscode/.vscode/Projects/MeetMe/backend/src/controllers/Auth.js#L59) and [backend/src/controllers/Auth.js:L121](file:///c:/Users/hsr41/.vscode/.vscode/Projects/MeetMe/backend/src/controllers/Auth.js#L121)
*   **Shortcoming**: Exception catch blocks swallow errors silently without sending response payloads:
    ```javascript
    } catch (err) {
      console.error(err);
    }
    ```
    If an error occurs inside `Signup`, the server never responds to the client, leaving the browser connection hanging indefinitely until a timeout.
*   **Fix Plan**: Always return an error status code to the client.
    ```javascript
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Signup failed due to internal error" });
    }
    ```

### 🚨 Status Code 200 returned on Errors
*   **Location**: [backend/src/controllers/history.js:L15-L17](file:///c:/Users/hsr41/.vscode/.vscode/Projects/MeetMe/backend/src/controllers/history.js#L15-L17)
*   **Shortcoming**: Database request failures or JWT authentication exceptions return code 200 to clients:
    ```javascript
    } catch (e) {
        res.json({ message: `Something went wrong ${e}` })
    }
    ```
    Returning `200 OK` for server failures breaks semantic API norms and makes client routing/interceptors fail to detect validation problems.
*   **Fix Plan**: Use HTTP status codes:
    ```javascript
    } catch (e) {
        return res.status(500).json({ success: false, message: `Internal server error: ${e.message}` });
    }
    ``` -->










<!-- Walkthrough — Guest Meeting Flow
What was built
A two-step guest onboarding flow:

/guestmeeting — A dark-themed details form with glassmorphism styling where guests enter their Name and Year of Birth
/join — A pre-meeting video lobby with a live camera preview (left panel), audio/video toggle buttons, and a meeting code input + join button (right panel)
Files Created
File	Purpose
guestMeeting.jsx
Guest details form page
joinMeeting.jsx
Pre-meeting video lobby page
guestMeeting.css
Styles for the guest form
joinMeeting.css
Styles for the video lobby
Files Modified
File	Change
main.jsx
Added /guestmeeting and /join routes before the /:url catch-all
Navbar.jsx
"Join as Guest" link now points to /guestmeeting
landingPage.jsx
"Get Started" button now navigates to /guestmeeting
User Flow
Get Started
Join as Guest
Name + Y.O.B → Continue
Meeting Code → Join
Landing Page
/guestmeeting
/join
/:meetingCode (VideoMeet)
Key Design Decisions
Guest data stored in sessionStorage — so the /join page can greet the user by name, and it auto-clears when the tab closes
Camera preview is mirrored (scaleX(-1)) — matches user expectation for self-view
Media tracks are cleaned up on unmount to prevent zombie camera/mic access
Routes placed before /:url catch-all — prevents React Router from matching /join or /guestmeeting as a meeting code parameter
Year of Birth input only allows digits with maxLength=4 and validates range 1900–current year -->










<!-- Guest Meeting Flow — /guestmeeting → /join
Add a two-step guest onboarding flow: a details form page at /guestmeeting, followed by a pre-meeting video lobby at /join where users can preview their camera, toggle audio/video, and join the meeting.

Proposed Changes
Routes & Navigation
[MODIFY] 
main.jsx
Add two new routes before the /:url catch-all route:
/guestmeeting → <GuestMeeting />
/join → <JoinMeeting />
[MODIFY] 
Navbar.jsx
Change "Join as Guest" <Link> to point to /guestmeeting instead of /join
[MODIFY] 
landingPage.jsx
Make "Get Started" button navigate to /guestmeeting using useNavigate()
New Pages
[NEW] 
guestMeeting.jsx
Guest details form page with:
Name text field
Year of Birth text field
Continue button → saves data to sessionStorage and navigates to /join
Dark-themed design matching the app's aesthetic (dark background with the orange accent color rgba(255, 145, 18, 1))
[NEW] 
joinMeeting.jsx
Pre-meeting video lobby with:
Left side (60%): Large video preview showing the user's webcam feed
Right side (40%): Controls panel with:
Camera toggle button (on/off)
Microphone toggle button (on/off)
Meeting code input field
"Join Meeting" button → navigates to /:meetingCode (the existing VideoMeet page)
Reads guest name from sessionStorage to display a greeting
Uses navigator.mediaDevices.getUserMedia() for the camera preview
Cleans up media tracks on unmount
New Styles
[NEW] 
guestMeeting.css
Centered card form with dark background, subtle glassmorphism, smooth animations
[NEW] 
joinMeeting.css
Split-panel layout (video left, controls right), dark theme, rounded video container
Verification Plan
Manual Verification
Click "Get Started" on landing page → should navigate to /guestmeeting
Click "Join as Guest" in navbar → should navigate to /guestmeeting
Fill in Name and Year of Birth, click Continue → should navigate to /join
On /join, camera preview should appear on the left
Toggle video/audio buttons should work
Enter a meeting code and click "Join Meeting" → should navigate to /:meetingCode -->










<!-- Guest Meeting Flow — Tasks
[x] Create guestMeeting.css styles
[x] Create joinMeeting.css styles
[x] Create guestMeeting.jsx page
[x] Create joinMeeting.jsx page
[x] Modify main.jsx — add routes
[x] Modify Navbar.jsx — update "Join as Guest" link
[x] Modify landingPage.jsx — update "Get Started" button -->