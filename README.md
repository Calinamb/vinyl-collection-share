# Vinyl Collection Share

## Project Description
Vinyl Collection Share is a full-stack web application where users can create, modify, and share their vinyl record collections.  
The goal of the application is to allow users to register their personal vinyl collections and make them available to others through a shared link.

This project will be developed as part of the semester project and will evolve over time.

---

## Feature Map

### User Goal
Share a personal vinyl collection with others.

### User Actions and Features

#### Account
- Register user account
- Login and logout
- Store user data in database

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
# Vinyl Collection Share

## Project Description
Vinyl Collection Share is a full-stack web application where users can create, modify, and share their vinyl record collections.  
The goal of the application is to allow users to register their personal vinyl collections and make them available to others through a shared link.

This project will be developed as part of the semester project and will evolve over time.

---

## Feature Map

### User Goal
Share a personal vinyl collection with others.

### User Actions and Features

#### Account
- User accoundts (planned feautures)
- Authentication handled seperateky from content API                                                                    


#### Collections
- Create vinyl collection- Edit collection details
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
Link: INSERT TRELLO LINK HERE

---

## Project Plan
- Setup project repository and structure  
- Setup server and database  
- Implement user accounts  
- Implement core features  
- Add PWA and offline support  
- Testing and refinement  

---

## Current Status
This repository currently contains scaffold code and project documentation.  
Functionality will be implemented incrementally throughout the semester.# Vinyl Collection Share
n
## API Design

The application exposes a REST-style API for managing vinyl collections and albums.
The API is designed to support creating, modifying and sharing vinyl collections.

This API does not handle user authentication.

### Collections

GET /collections  
Returns a list of all vinyl collections.

POST /collections  
Creates a new vinyl collection.

GET /collections/:id  
Returns a single vinyl collection.

PUT /collections/:id  
Updates an existing vinyl collection.

DELETE /collections/:id  
Deletes a vinyl collection.

### Albums

POST /collections/:id/albums  
Adds a new album to a vinyl collection.

PUT /albums/:id  
Updates an album.

DELETE /albums/:id  
Removes an album from a collection.
  

