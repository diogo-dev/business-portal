# Business Portal
This website allows companies to inform their clients about upcoming events and share content through a dedicated blog section.
This project is still in its development phase.

## Current dbeaver ERD diagram

- User Authentication and Authorization implemented using Role-Based Access Control (RBAC) with AuthGuard, Custom Decorators and JwtService (@nestjs/jwt)
- Current Entities: Event, Post, PostComment, UserAccount, Role and Permission.

<table align="center">
  <td align="center">
    <img src="/ERD.png" alt="ERD diagram" width="800" />
  </td>
</table>

## Technologies
SERVER:
- NestJS
- TypeORM
- Postgres

CLIENT:
- React
- Next.js
- CSS modules
