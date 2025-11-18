Volunteer Connect Portal
A single-page application built with Angular that connects volunteers with service opportunities, allows them to track their service hours, and enables organizations to post new opportunities. The portal features a Service Catalog, a personal dashboard for volunteers, and local data persistence.

<img width="777" height="824" alt="image" src="https://github.com/user-attachments/assets/29bd0362-1c87-4154-8f9e-f806050234d5" />


Features
Service Catalog: A comprehensive list of available volunteer opportunities that can be filtered by keywords.

My Opportunities: A dedicated page to view opportunities you have signed up for.

Service Hour Tracking: A modal interface to log volunteer hours for specific opportunities. Your logged hours are tracked on your dashboard.

Opportunity Posting: A simple form to post new volunteer opportunities to the Service Catalog, making the application a two-way platform.

Data Persistence: User data, including signed-up opportunities and logged hours, is saved to your browser's local storage.

Responsive Design: The application is designed to work seamlessly on both desktop and mobile devices.

Technologies Used
Angular: A modern web framework for building dynamic single-page applications.

TypeScript: A superset of JavaScript that adds static typing.

Tailwind CSS: A utility-first CSS framework for rapid and responsive styling.

Signals & Computed Properties: Angular's modern state management system for reactive updates.

How to Run Locally
This project is contained within a single volunteer-portal.ts file. To run it, you'll need to set up a basic Angular development environment.

Install Node.js: If you don't have it, install Node.js from nodejs.org.

Install Angular CLI: Open your terminal and run the following command to install the Angular CLI globally:

npm install -g @angular/cli

Create a New Angular Project:

ng new volunteer-connect-portal --standalone --skip-install

Choose No for routing, CSS for styling.

Copy the Code: Replace the entire content of src/app/app.component.ts with the code from the volunteer-portal.ts file.

Start the Development Server: Navigate into the project folder and run the ng serve command.

cd volunteer-connect-portal
npm install
ng serve --open

Your application will be available at http://localhost:4200.

Future Enhancements
This project is a strong foundation for a full-scale application. Here are some ideas for future development:

Database Integration: Replace the in-memory data and localStorage with a real-time database like Firebase Firestore for persistent, multi-user data.

User Authentication: Implement user sign-up and login using Firebase Authentication.

Admin Panel: Create a secure admin-only view for approving hours and managing opportunities.

User Profiles: Add more detailed user profiles with skills, interests, and past volunteer history.
