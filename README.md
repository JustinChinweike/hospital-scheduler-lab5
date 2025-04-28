Hospital Scheduling Web Application
Project Overview
This full-stack web application enables hospital staff to manage appointments (schedules) efficiently. The system supports creating, viewing, updating, and deleting appointment records, with filtering and sorting capabilities. It includes advanced features such as offline access (operations queue with local storage), real-time updates via WebSockets, dynamic charts for data visualization, and support for uploading attached files. The project is structured into Bronze, Silver, and Gold challenge tiers, each adding progressively advanced functionality.
Features Implemented
Bronze Tier Tasks
 CRUD REST API (Express/TypeScript): Complete backend endpoints to Create, Read, Update, and Delete schedules. Endpoints include POST /schedules, GET /schedules (with query filtering and sorting), GET /schedules/:id, PATCH /schedules/:id, and DELETE /schedules/:id.
 Filtering & Sorting: Supports query parameters (e.g., doctorName, department, dateTime, sortBy, sortOrder) to filter and sort the list of schedules. Pagination is implemented for efficient data loading.
 Server-Side Validation (Zod): Uses Zod schemas to validate POST and PATCH request bodies, ensuring only valid schedule data is accepted. Invalid inputs return a 400 error with details.
 Unit Tests (Jest): Implements backend unit tests for all core operations. Tests mock Express Request/Response and Socket.IO events to verify that creating, retrieving, updating, and deleting schedules behave as expected. Run tests with npm test (backend).
Silver Tier Tasks
 Offline Support: The frontend detects offline/online status and server availability. If the network or server is down, the UI displays an offline indicator. CRUD operations performed offline are queued in localStorage. When connectivity is restored, pending operations automatically synchronize with the server.
 Endless Scrolling (Pagination): The schedule list supports pagination and infinite-scroll-style loading. As the user scrolls, additional pages of schedules are fetched from the backend (using limit/page query parameters). This ensures smooth browsing even with large data sets.
Gold Tier Tasks
 Real-Time Updates (Socket.IO): The backend includes an auto-scheduler that generates new random appointments every 10 seconds. These new schedules are pushed to all connected clients via WebSockets. The frontend listens for events (new_schedule, updated_schedule, deleted_schedule) and updates the UI live without a page refresh.
 Dynamic Charts (Recharts): Includes a dashboard with real-time charts (bar and pie charts) showing appointments by department, doctor, and date. The charts update automatically as the schedule data changes (e.g., when new appointments are added by the auto-scheduler or users).
 File Upload/Download: Allows uploading and downloading of attached files with schedules. The server uses Multer to handle uploads (images and PDFs up to 5MB), storing files in an uploads/ directory. Uploaded files (e.g. patient reports) can be attached to appointments and served as static resources.
Backend Setup
Directory: The server code is located in the backend/ folder.
Port: The backend runs on port 5000 by default (src/index.ts). A health-check endpoint (GET /health) returns status 200.
Dependencies: Uses Node.js, Express.js (v5) with TypeScript. Key libraries include Socket.IO for WebSockets, Zod for validation, and Multer for file uploads.
Start Server: After installing dependencies (npm install in backend/), start the server with npm run dev. The console will indicate Server running at http://localhost:5000.
Frontend Setup
Directory: The client application resides in the frontend/ folder.
Port: The frontend development server runs on port 8080 (as set in vite.config.ts). The app auto-opens in your browser at http://localhost:8080.
Stack: Built with Vite, React, and TypeScript. Styling is done with Tailwind CSS (configured via tailwind.config.ts). React Router handles navigation, and React Query (TanStack Query) is used for data fetching. Charts are implemented using Recharts.
Start App: In frontend/, run npm install to fetch dependencies, then npm run dev to launch the development server.
Installation and Running Instructions
Clone the Repository: Clone or download the project source.
Backend Setup:
Navigate to the backend/ directory.
Run npm install to install server-side dependencies.
Frontend Setup:
Navigate to the frontend/ directory.
Run npm install to install client-side dependencies.
Run the Backend: In backend/, execute npm run dev to start the Express server on port 5000.
Run the Frontend: In frontend/, execute npm run dev to start the Vite development server on port 8080.
Access the App: Open your browser at http://localhost:8080 for the UI, which communicates with the backend at http://localhost:5000.
Note: No additional environment variables are required by default. Ensure Node.js (v16+) and npm are installed. You can build for production using npm run build in each directory if needed.
Testing Instructions
Backend Testing (Jest): Tests are located in backend/src/controllers/__tests__/scheduleController.test.ts. They verify each controller method (createSchedule, getSchedules, etc.) by mocking Express Request/Response and Socket.IO events. To run tests, go to the backend/ folder and run npm test (or npm run test). All tests should pass, confirming that the CRUD operations and validations behave correctly.
Frontend Testing: (No formal automated tests were added for the frontend. Testing is done manually by using the app, including offline mode and dynamic updates.)
Folder Structure Overview
bash
Copy
Edit
HospitalSchedulingApp/
├── backend/                     # Express/TypeScript server
│   ├── src/                     
│   │   ├── controllers/         # Route handler logic (scheduleController.ts)
│   │   ├── models/              # Data models and Zod schemas
│   │   ├── routes/              # Express routes (scheduleRoutes.ts)
│   │   ├── socket.ts            # Socket.IO setup (initSocket)
│   │   └── index.ts             # Server entry point
│   ├── uploads/                 # Stores uploaded files (images, PDFs)
│   ├── package.json             # Server dependencies & scripts
│   └── tsconfig.json            # TypeScript configuration
├── frontend/                    # Vite/React client
│   ├── src/
│   │   ├── components/          # Reusable UI components (e.g., forms, charts)
│   │   ├── context/             # React contexts (ScheduleContext, OfflineContext)
│   │   ├── hooks/               # Custom hooks (e.g., use-schedule, use-toast)
│   │   ├── pages/               # Pages/views (Dashboard, Add/Edit Schedule, etc.)
│   │   ├── utils/               # Utility functions (form validation, API client)
│   │   └── main.tsx             # React app entry point
│   ├── package.json             # Client dependencies & scripts
│   ├── vite.config.ts           # Vite configuration (port 8080)
│   └── tailwind.config.ts       # Tailwind CSS configuration
└── README.md                    # Project documentation (this file)
Technologies Used
Backend: Node.js, Express.js, TypeScript, Socket.IO (for real-time), Zod (validation), Multer (file upload), Jest (testing), UUID (unique IDs), CORS, Nodemon.
Frontend: Vite, React, TypeScript, Tailwind CSS, React Router, React Query (data fetching), Recharts (data visualization), Axios (HTTP client), shadcn UI components, Radix UI primitives.
Testing: Jest with ts-jest (backend tests).
