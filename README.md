# Business Portal
This website allows companies to inform their clients about upcoming events and share content through a dedicated blog section.
This project is still in its development phase.

## Demo video of the manage post section
link: https://youtu.be/qcie0JdHPl0

## Current dbeaver ERD diagram

- User Authentication and Authorization implemented using Role-Based Access Control (RBAC) with AuthGuard, Custom Decorators and JwtService (@nestjs/jwt)
- The application stores uploaded post and event cover images in AWS S3 and persists only the image URLs in the database
- Current Entities: Event, Post, PostComment, UserAccount, Role and Permission.

<table align="center">
  <td align="center">
    <img src="/ERD2.png" alt="ERD diagram" width="800" />
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
