
Online Event Ticketing System
Project Overview
This project involves the development of a full-stack web application for an online event ticketing system. The system allows users to browse, search, and purchase tickets for various events such as concerts, sports games, theater shows, and more.

Project Objectives
Understand and implement CRUD operations.

Apply frontend and backend development skills to build a functional and interactive application.

Practice project structuring and component-based design.

User Roles
Standard User: Can browse events, book tickets, and view their booking history.

Event Posting User (Organizer): Can create, update, and delete their own events.

System Admin: Has full control over the system, including managing users and events.

Project Features
Homepage: Displays a list of upcoming events with details such as event name, date, location, and price.

Event Details Page: Provides detailed information about an event, including a booking option.

Ticket Booking System: Users can select the number of tickets, view ticket availability, and proceed to checkout.

Search and Filter: Allows users to search for events by name, category, date, or location.

User Dashboard: Displays booked tickets and event history.

Admin Panel: Enables event organizers to add, update, and delete events.

Database Integration: Stores event details, bookings, and user information in MongoDB.

Project Milestones
Task 1:

Set up GitHub repository, manage branches, and practice pull requests.

Create the Mongoose schema for the project, including models for users, events, and bookings.

Task 2: Backend development, ticket booking functionality, and user dashboard implementation.

Task 3: Frontend development (homepage, event listings, admin panel, and details page).

Task 4: Full project integration.

Task 5: Final testing, deployment, and project submission.

Task 1 Description
Version Control & Database Schemas
Each team leader must create a GitHub repository for the project.

Each team member should create their own branch for development.

Tasks to be completed:

Create a README.md file with a brief project description.

Set up a .gitignore file for ignoring unnecessary files.

Each member must push an initial commit with their assigned task.

Create and commit Mongoose schemas for users, events, and bookings.

Practice pull requests (PRs) and code reviews before merging into the main branch.

Resolve merge conflicts collaboratively and ensure code quality.

Database Schema Design
User Schema:

Represents the users of the system.

Each user has a name, email, profile picture, and password for authentication.

Users can have one of three roles: Standard User, Organizer, or System Admin.

Includes a timestamp for when the user was created.

Event Schema:

Stores details about each event, such as title, description, date, location, category, image, and ticket pricing.

Tracks the total number of tickets available and the remaining tickets after sales.

Events are associated with the user who created them (Organizer).

A timestamp indicates when the event was added to the system.

Booking Schema:

Records ticket bookings made by users.

Links each booking to a user and an event.

Stores the number of tickets booked, the total price, and the booking status (pending, confirmed, or canceled).

A timestamp indicates when the booking was created.

These schemas define the core database structure for the project. Users can have different roles, organizers can create and manage events, and standard users can book tickets. The system admin has full control over all data.

Contributors
Abdulaziz 

Ramez

Ahmed Amr

Ahmed Ramy Mohamed

saifeleslam saadeldin
