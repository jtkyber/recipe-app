
# The Custom Kitchen
## Description
Whether you're a person who eats anything and everything or you're on the most restrictive of diets, this recipe search web-app aims to make the process of finding recipes that match your dietery needs as effortless as possible.
## How to use
First, create an account, selecting your current diet, intolerances and the ingredients you want to avoid (you may go back to your profile and change these at any time). Then, search for a recipe using the various search filters, such as cuisine, meal type and the ingredients you want included. The options you chose during signup will be automatically applied to your searches unless you choose "Ignore Profile Filters". Click on a recipe to view everything you need to make the recipe, along with detailed nutrition facts. Click the heart icon to save the recipe to your account.
## Filter options
* Diet (automatically applied)
* Intolerances (automatically applied)
* Excluded ingredients (automatically applied)
* Keyword search (searchbar)
* Cuisine (dropdown)
* Meal type (dropdown)
* Ingredients to include (searchbar with autocomplete options)
* Max ready time (number)
* Instructions required (toggle)
* Ignore profile filters (toggle)
* Sort by (dropdown)
## Included in expanded recipe
* Title
* Spoonacular score (a rating calculated by the Spoonacular API by blending things like nutritional balance, popularity, flavor complementarity, etc. Basically, it shows the quality of the recipe as a whole)
* The estimated time to complete the recipe from start to finish
* Save button
* AI summary (transforms the long/ugly default summary from the recipe API to one that's more vibrant, relevant and concise)
* Photo of the finished meal
* A list of ingredients and their quantities (change the amount of servings to change the recipe quantities)
* A list of ordered instructions
* Detailed nutrition facts (the numbers for these will change when you change the amount of servings)
* A link that takes you to the original recipe page
## Tech stack
#### Frontend
* Typescript
* HTML
* SCSS
* React
* Redux Toolkit
* Tanstack Router
* Tanstack Query
* Axios
* Dexie (wrapper for IndexedDB)
#### Backend
* Typescript
* Express
* PostgreSQL
* Knex
* Bcrypt
* Axios
* Node Cache
#### Hosting
* Vercel (frontend and backend)
* Neon (SQL database)
