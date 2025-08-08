# AI Agent Requirements for E-commerce API Development

This document outlines the functional and non-functional requirements for an AI agent tasked with developing a headless e-commerce REST API. These requirements are based on a successful development session.

## I. Core Technology & Scaffolding

The agent must be capable of initializing and configuring a project with the following stack:

- **Backend Framework:** Express.js
- **Database ORM:** Sequelize
- **Database:** PostgreSQL
- **Dependency Management:** NPM
- **Core Dependencies:** `express`, `sequelize`, `pg`, `sequelize-cli`, `bcryptjs`

### Key Scaffolding Tasks:
- **Project Initialization:** Create a `package.json` file and install initial dependencies.
- **Directory Structure:** Organize the application into a modular `src` directory containing `models`, `routes`, `controllers`, and `services`.
- **File Naming Convention:** All new files (models, services, controllers, routes) must be named using **kebab-case** (e.g., `product-variant.model.js`, `cart.service.js`).
- **Database Configuration:** Set up the Sequelize configuration file (`config/config.json`) for development, test, and production environments.
- **Primary Keys:** Ensure all database models use UUIDs as their primary key by default.

## II. Model & Data Layer

The agent must handle all aspects of data modeling and migration in a holistic manner.

- **Holistic Model Creation:**
    - When a request to create a new model is made, the agent must not only create the model file but also:
        1.  **Update Associations:** Automatically update the `associate` methods in any related models to establish the new relationships (e.g., creating an `OrderItem` model should add a `hasMany` association to the `Order` model).
        2.  **Update Business Logic:** Identify and update any service files where the new model's logic would be relevant.
    - Implement complex, domain-specific models like `Product`, `Customer`, `Order`, `Cart`, `SalesChannel`, `Coupon`, and `DiscountRule`.
- **Migration Management:**
    - Use `sequelize-cli` to generate migration files corresponding to each model.
    - (Future expectation) Populate migration files with the correct schema based on the model definition.
- **Database Relationships (Associations):**
    - Define and implement one-to-one, one-to-many, and many-to-many relationships between models.
    - Create and manage join tables (e.g., `discount_rule_products`) for many-to-many associations.
    - Centrally configure all model associations within `src/models/index.js` and model files themselves.
- **Handling Diverse Product Types:**
    - Understand and model different product types: physical (requires shipping), digital (delivered electronically), and service (like top-ups, requiring specific handling).
    - Modify models (`Product`, `CartItem`, `OrderItem`) to store type-specific data (e.g., `target_phone_number` for top-ups).

## III. Business Logic & Service Layer

The agent must be able to translate business requirements into functional code within a service layer.

- **Service File Generation:** Create service files to encapsulate business logic.
- **Logic Implementation:**
    - Implement core e-commerce logic: cart creation, adding/updating/removing items.
    - Handle adding/updating items with type-specific data (e.g., `target_phone_number` for top-ups).
    - Implement complex validation rules. For example, when applying a coupon:
        1.  Check if the coupon is valid for the current `SalesChannel`.
        2.  Check if the coupon applies to specific `Product`s within the cart.
        3.  Validate coupon status (e.g., not disabled, within usage limits).
- **Security:** Automatically implement security best practices, such as hashing user passwords with `bcryptjs` before saving to the database.
- **Order Processing with Mixed Types:**
    - Implement logic in the order service to convert carts to orders, transferring type-specific data.
    - Handle conditional requirements during checkout, such as making shipping address optional for orders without physical items.
- **Fulfillment Management:**
    - Understand and implement fulfillment logic based on product type.
    - Implement integration with external services (e.g., a `TelcoService` for top-up fulfillment) or suggest how such integrations should be structured.
    - Update order and order item fulfillment statuses.


## IV. API Layer (Routes & Controllers)

The agent must be able to create and manage the API endpoints.

- **Route & Controller Generation:** Create corresponding route and controller files for each resource.
- **Request Handling:** Implement controller functions to handle HTTP requests, call services, and return structured JSON responses.
- **Error Handling:** Implement basic error handling to return meaningful error messages.

## V. Adaptability & Refactoring

The agent must be flexible and capable of adapting to user-driven changes.

- **Contextual Awareness & Proactive Modifications:**
    - When creating a new module (e.g., a new service or route), the agent must proactively identify and update all related files. For instance, creating a new route file (`cart-routes.js`) should trigger an automatic update to the main router file (`src/routes/index.js`) to import and use the new routes.
- **Code Style Flexibility:**
    - Write code in different programming styles (e.g., Class-based vs. Functional).
    - Refactor existing code from one style to another upon request without breaking functionality.
- **Responsiveness to Feedback:**
    - Correct its own mistakes when pointed out.
    - Understand and act on conversational, affirmative commands.
- **Documentation:**
    - Create and update documentation files like `README.md`.
    - Incorporate high-level project concepts into the documentation.
