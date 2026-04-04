# RecipeBook

A full-stack recipe management web application where users can browse recipes, explore cuisines, build meal plans, and manage chef profiles. Built as a monorepo with a Lit-based SPA frontend and an Express + MongoDB backend.

**Live Site:** https://otter-meals.vercel.app/app

## Key Features

### Recipe Browsing & Filtering
The home page displays all recipes in a responsive card grid with images, cooking times, serving sizes, and difficulty badges. Users can filter recipes by cuisine using interactive chip selectors on desktop or a dropdown on mobile.

### Chef Profiles
Each chef has a profile page with a bio, favorite dishes, and a list of their contributed recipes. Authenticated users can edit their own profile.

### Recipe Creation & Editing
Signed-in users can create new recipes with step-by-step instructions, ingredient lists with quantities and units, cuisine tagging, and image uploads. Recipes they own can also be edited after creation.

### Cuisine & Ingredient Pages
Dedicated detail pages for each cuisine (region, popular ingredients, typical dishes) and each ingredient (category, allergens, substitutes, nutrition info).

### Dark/Light Mode
Dark mode is enabled by default with a toggle in the header dropdown. Theme preference persists across sessions via localStorage.

### Authentication
JWT-based registration and login. Auth state controls navigation visibility — signed-in users see options to add recipes, view/edit their profile, and sign out.

### Meal Plans
Toggle between recipes and meal plans from the home page. Meal plans group recipes by duration and meal type (breakfast, lunch, dinner), giving users a structured way to organize their cooking. (Not fully implemented)


## Tech Stack

- **Frontend:** Lit, TypeScript, Vite, @calpoly/mustang (MVU state management, routing, auth)
- **Backend:** Express, MongoDB, Mongoose, JWT (bcrypt)
- **Deployment:** Vercel (frontend), Render (backend)

## Getting Started

### Prerequisites
- Node.js
- MongoDB (local or Atlas cluster)

### Installation

1. **Clone the repository** and install dependencies:
   ```bash
   git clone https://github.com/abel-alcala/RecipeBook.git
   cd RecipeBook
   npm install
   ```

2. **Configure environment variables:**

   `packages/server/.env`:
   ```
   TOKEN_SECRET=<jwt-secret>
   MONGO_USER=<mongodb-atlas-user>
   MONGO_PWD=<mongodb-atlas-password>
   MONGO_CLUSTER=<mongodb-atlas-cluster>
   PORT=3000
   ```

   `packages/app/.env`:
   ```
   VITE_API_URL=http://localhost:3000
   ```

3. **Seed the database** (optional):
   ```bash
   cd packages/server
   npm run seed
   ```

4. **Start development servers:**
   ```bash
   # Terminal 1 - Backend
   cd packages/server
   npm run dev

   # Terminal 2 - Frontend
   cd packages/app
   npm run dev
   ```

## How to Contribute
1. **Fork the repository** and clone it locally.
2. **Create a new branch** for your changes: `git checkout -b my-feature`.
3. **Install dependencies**: `npm install` from the root directory.
4. **Run dev servers** using the instructions above.
5. **Commit your changes**: `git commit -am 'Add my feature'`.
6. **Push to your branch**: `git push origin my-feature`.
7. **Submit a pull request**.