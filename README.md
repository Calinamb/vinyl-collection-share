# Vinyl Collection Share

## Project Description
Vinyl Collection Share is a full-stack web application where users can create, modify,
and share their vinyl record collections.

The goal of the application is to allow users to register their personal vinyl collections
and make them available to others through a shared link.

This project is developed as a semester project and will evolve over time.

---

## Feature Map

### User Goal
Share a personal vinyl collection with others.

### User Actions and Features

#### Account
- User accounts (planned feature)
- Authentication handled separately from content API

#### Collections
- Create vinyl collection
- Edit collection details
- Delete collection
- View own collections

#### Albums
- Add album to collection
- Edit album details
- Remove album from collection

#### Sharing
- Generate public share link
- View shared vinyl collections
- Fetch shared data from backend API

#### PWA & Offline
- Add PWA manifest
- Make application installable
- Cache collection data
- Allow offline viewing of collections

---

## Technical Overview
- Client: HTML, CSS, JavaScript
- Server: Node.js with Express
- Database: PostgreSQL (cloud-based)
- API: REST-style API
- PWA: Progressive Web App with offline functionality

---

## Project Management
Project planning and feature mapping is done using Trello.  
Link: https://trello.com/invite/b/696d44ce93dbbd5809a78a10/ATTIdcfd679b7ced62641771959035d88bc23F61D7CA/vinyl-collection-share-project-plan

---

## API Design

The application exposes a REST-style API for managing vinyl collections and albums.
The API is designed to support creating, modifying and sharing vinyl collections.

This API does not handle user authentication.

### Users

POST /users  
Creates a new user.

Required fields:
- username (string)
- consent (boolean, must be true)

Returns:
- id (uuid)
- username
- createdAt (ISO string)

DELETE /users/:id  
Deletes a user account and removes personal data for that user.

(Optional)
GET /users  
Returns all users (development only, in-memory).

### Collections

POST /collections

Creates a new vinyl collection.

Required fields:
- title (string)
- description (string)

Returns:
- id (system generated unique identifier)
- title
- description
- createdAt


GET /collections/:id

Returns a single vinyl collection by id.

Returns:
- id
- title
- description
- createdAt
- albums (array)

### Albums

POST /collections/:id/albums  
Adds a new album to a vinyl collection.

PUT /albums/:id  
Updates an album.

DELETE /albums/:id  
Removes an album from a collection.

---

## User Data

The application collects a minimal set of user data in accordance with
data minimization and GDPR principles.

Collected data:
- id (system generated unique identifier)
- username
- consent to Terms of Service
- account creation date

## Privacy Policy

This application collects minimal personal data required to create a user account. The only personal data stores isa user ID and a chosen username.

The purpose:
 The purpose of this is that user data is collected solely to allow users to create, manage and delete their vinyl collections. 

Storage and Security:
The user data is stored in server memory during development. No sensitive personal data is collected. 

User rights:
The users can request that their account can be deleted at any time. When an account is deleted, all personal data related to the user is removed. 

Consent:
The users must actively consent to this privacy policy before an account is created. 

## Terms of Service 

By creating an account, the user agrees to the terms of this service.

The users retain ownership of all data they create. By using the service, the users grant the application permission to store and display their vinyl collections. 

Users may delete their account at any time, which revokes consent and removed personal data. 