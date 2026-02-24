# Business Portal
This website allows companies to inform their clients about upcoming events and share content through a dedicated blog section.
This project is still in its development phase.

## Demo video of the manage post section
link: https://youtu.be/qcie0JdHPl0

**How was this feature implemented:**
This feature implements full CRUD operations for blog posts using NestJS with TypeORM and PostgreSQL. It includes role-based access control using custom `@Roles` decorator and RolesGuard to restrict post management to admin users only. Cover images are uploaded to AWS S3 using the AWS SDK v3, with file validation (jpg, jpeg, png, webp) and size limits (2MB) handled through FileInterceptor. The implementation includes post status management (Draft, Published, Archived) and automatic slug generation from post titles for SEO-friendly URLs.

## Demo video of the blog section with pagination
link: https://www.youtube.com/watch?v=SzKjzemo2rk

**How was this feature implemented:**
This feature uses TypeORM QueryBuilder to implement server-side pagination for blog posts. The endpoint accepts `page` and `limit` query parameters (defaulting to page 1 and 9 posts per page) and returns paginated results along with total count and page metadata. Posts can be filtered by status (Draft, Published, Archived) while maintaining pagination. The endpoints are marked as `@Public` using a custom decorator to allow unauthenticated access. The implementation includes slug-based routing for individual post retrieval and eager loading of related entities (author, comments) using query builder joins.

## Demo video of the comments section on a blog post
link: https://www.youtube.com/watch?v=rPJi7LwfAms

**How was this feature implemented:**
The implementation includes endpoints for creating, updating, and deleting comments, with public endpoints for fetching all comments or comments by post ID. Comments are eagerly loaded when fetching posts using QueryBuilder joins to minimize database queries.

## Current dbeaver ERD diagram

- User Authentication and Authorization implemented using Role-Based Access Control (RBAC) with AuthGuard, Custom Decorators and JwtService (@nestjs/jwt)
- The application stores uploaded post and event cover images in AWS S3 and persists only the image URLs in the database
- Current Entities: Event, Post, PostComment, UserAccount, Role and Permission.

<table align="center">
  <td align="center">
    <img src="/ERD3.png" alt="ERD diagram" width="800" />
  </td>
</table>

## Technologies
SERVER:
- NestJS
- TypeORM
- Postgres
- AWS S3

CLIENT:
- React
- Next.js
- CSS modules
