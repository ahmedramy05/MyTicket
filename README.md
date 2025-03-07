# Online Event Ticketing System

## Project Overview
This project involves the development of a full-stack web application for an **Online Event Ticketing System**. The system allows users to browse, search, and purchase tickets for various events such as concerts, sports games, theater shows, and more. The application supports three user roles: **Standard User**, **Event Organizer**, and **System Admin**.

## Project Objectives
- Implement **CRUD operations** for events, bookings, and user management.
- Develop a functional and interactive frontend and backend.
- Practice project structuring and component-based design.

## User Roles
1. **Standard User**: Can browse events, book tickets, and view booking history.
2. **Event Organizer**: Can create, update, and delete their own events.
3. **System Admin**: Has full control over the system, including managing users and events.

## Project Features
- **Homepage**: Displays a list of upcoming events with details such as event name, date, location, and price.
- **Event Details Page**: Provides detailed information about an event, including a booking option.
- **Ticket Booking System**: Users can select the number of tickets, view ticket availability, and proceed to checkout.
- **Search and Filter**: Allows users to search for events by name, category, date, or location.
- **User Dashboard**: Displays booked tickets and event history.
- **Admin Panel**: Enables event organizers to add, update, and delete events.
- **Database Integration**: Stores event details, bookings, and user information in MongoDB.

## Project Milestones
1. **Task 1**: Set up GitHub repository, manage branches, and create Mongoose schemas for users, events, and bookings.
2. **Task 2**: Backend development, including ticket booking functionality and user dashboard implementation.
3. **Task 3**: Frontend development (homepage, event listings, admin panel, and details page).
4. **Task 4**: Full project integration.
5. **Task 5**: Final testing, deployment, and project submission.

## Database Schema Design
### User Schema
- Represents users of the system.
- Fields: `name`, `email`, `profile picture`, `password`, `role` (Standard User, Organizer, or System Admin), and `timestamp`.

### Event Schema
- Stores details about each event.
- Fields: `title`, `description`, `date`, `location`, `category`, `image`, `ticket pricing`, `total tickets`, `remaining tickets`, `organizer ID`, and `timestamp`.

### Booking Schema
- Records ticket bookings made by users.
- Fields: `user ID`, `event ID`, `number of tickets`, `total price`, `booking status` (pending, confirmed, or canceled), and `timestamp`.

Contributors
AbdAziz

Ramez

Ahmed Amr

Ahmed Ramy

Seif