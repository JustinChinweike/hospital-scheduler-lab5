# Welcome to the Hospital Schedule Management project


Hospital Hospital Schedule Management is a web-based system that allows users to book, edit, and manage doctor appointments easily. It provides an intuitive interface for scheduling and modifying medical visits across multiple departments.


## Features
Book Appointments – Patients can schedule visits by selecting a doctor, date, time, and department.
Edit & Update Appointments – Modify existing appointments with real-time validation.
View All Scheduled Appointments – Easily see upcoming appointments in a structured list.
Delete Appointments – Remove an appointment with a confirmation prompt.
Filter by Doctor, Patient, or Department – Quickly find specific appointments.


## Installation & Setup
 

Follow these steps:

Clone the Repository
```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>




# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>
cd Hospital_Schedule


# Step 3: Install the necessary dependencies.
npm install


# Step 4: Run the Development Server
npm run dev

#This starts a local development server. Open http://localhost:5173/ to see the app.

```




## Project Structure

📂 src/ – Contains the main source code
├── 📂 components/ – UI components like buttons, modals, forms
├── 📂 context/ – Manages global appointment data
├── 📂 pages/ – Different pages (Home, Add, Edit, List Appointments)
├── 📂 data/ – Stores mock appointment data
├── 📂 hooks/ – Custom React hooks (e.g., toast notifications)
└── etc... 


## How to Use
 ### Adding an Appointment
Click "Add Schedule"
Fill in Doctor Name, Patient Name, Date, Time, and Department
Click "Save"

 #### Editing an Appointment
Navigate to the "Edit Schedule" page
Select an appointment to modify
Update details and click "Save Changes"

### Viewing & Filtering Appointments
Go to the "List Schedule" page
Use the search bar and filters to find specific appointments


### Deleting an Appointment
Click "Delete" on an appointment
Confirm the deletion in the pop-up




## What technologies are used for this project?

- React –  For building an interactive and responsive UI.
- Vite –  A fast build tool for efficient development.
- TypeScript – Ensures type safety and better code management.
- Tailwind CSS – Provides modern styling with utility-first design.
- ShadCN UI & Radix UI – Enhances the UI with accessible components.
- React Router – Handles navigation between pages.





## Future Enhancements
Authentication System – Secure user login/logout
Database Integration – Store real patient data instead of mock data
Email & SMS Notifications – Remind users of upcoming appointments
