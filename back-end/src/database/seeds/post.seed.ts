import { PostService } from "src/post/post.service";
import { UserAccountService } from "src/user-account/user-account.service";
import { CreatePostDto } from "src/post/dto/create-post.dto";

export default async function seedPosts(postService: PostService, userAccountService: UserAccountService) {

    // Check if posts already exist
    const existingPosts = await postService.findAll();
    if (existingPosts.length > 0) {
        console.log('Seed: Posts already exist, skipping post seeding');
        return;
    }

    // Find a user to be the author of posts
    const users = await userAccountService.findAll();
    if (!users || users.length === 0) {
        console.error('Seed: No users found. Ensure users are seeded before posts.');
        return;
    }

    const author = users[0]; // Use the first user as the author

    // Create 30 posts with no coverImageUrl
    const postsData: CreatePostDto[] = [
        {
            coverImageUrl: undefined,
            title: 'Introduction to TypeScript',
            content: 'TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale. It adds optional static typing to JavaScript, which can help catch errors early in development.',
            summary: 'Learn the basics of TypeScript and why it\'s becoming the standard for modern web development.'
        },
        {
            coverImageUrl: undefined,
            title: 'NestJS Framework Overview',
            content: 'NestJS is a progressive Node.js framework for building efficient, reliable and scalable server-side applications. It uses modern JavaScript, is built with TypeScript and combines elements of OOP, FP, and FRP.',
            summary: 'Discover how NestJS makes backend development more structured and maintainable.'
        },
        {
            coverImageUrl: undefined,
            title: 'Understanding TypeORM',
            content: 'TypeORM is an ORM that can run in NodeJS and can be used with TypeScript and JavaScript. It supports both Active Record and Data Mapper patterns, making database operations easier.',
            summary: 'A comprehensive guide to using TypeORM for database management in Node.js applications.'
        },
        {
            coverImageUrl: undefined,
            title: 'RESTful API Best Practices',
            content: 'Building RESTful APIs requires following certain conventions and best practices. This includes proper HTTP method usage, status codes, resource naming, and error handling.',
            summary: 'Essential guidelines for designing and implementing robust RESTful APIs.'
        },
        {
            coverImageUrl: undefined,
            title: 'Authentication and Authorization in Web Apps',
            content: 'Security is paramount in modern web applications. Understanding the difference between authentication (who you are) and authorization (what you can do) is crucial for building secure systems.',
            summary: 'Learn how to implement secure authentication and authorization mechanisms.'
        },
        {
            coverImageUrl: undefined,
            title: 'Database Migrations Made Easy',
            content: 'Database migrations are a way to manage database schema changes over time. They allow you to version control your database schema and apply changes systematically across environments.',
            summary: 'Master database migrations to keep your schema changes organized and deployable.'
        },
        {
            coverImageUrl: undefined,
            title: 'React Hooks Deep Dive',
            content: 'React Hooks revolutionized how we write React components. useState, useEffect, and custom hooks provide powerful ways to manage state and side effects in functional components.',
            summary: 'Explore the power of React Hooks and how they simplify component logic.'
        },
        {
            coverImageUrl: undefined,
            title: 'Next.js for Full-Stack Applications',
            content: 'Next.js is a React framework that enables server-side rendering and static site generation. It provides an excellent developer experience with features like file-based routing and API routes.',
            summary: 'Build performant full-stack applications with Next.js and React.'
        },
        {
            coverImageUrl: undefined,
            title: 'CSS-in-JS Solutions Comparison',
            content: 'CSS-in-JS libraries like styled-components, emotion, and CSS Modules offer different approaches to styling React applications. Each has its own benefits and trade-offs.',
            summary: 'Compare popular CSS-in-JS solutions to choose the best fit for your project.'
        },
        {
            coverImageUrl: undefined,
            title: 'Testing Strategies for Node.js',
            content: 'Comprehensive testing is essential for maintaining code quality. Unit tests, integration tests, and e2e tests each serve different purposes in ensuring your application works correctly.',
            summary: 'Implement effective testing strategies for your Node.js applications.'
        },
        {
            coverImageUrl: undefined,
            title: 'Docker for Development Environments',
            content: 'Docker containers provide consistent development environments across different machines. Using Docker Compose, you can orchestrate multiple services needed for your application.',
            summary: 'Streamline your development workflow with Docker and containerization.'
        },
        {
            coverImageUrl: undefined,
            title: 'Git Workflow Best Practices',
            content: 'Effective use of Git can dramatically improve team collaboration. Understanding branching strategies, commit conventions, and merge practices is essential for modern development teams.',
            summary: 'Adopt Git workflows that enhance team productivity and code quality.'
        },
        {
            coverImageUrl: undefined,
            title: 'Microservices Architecture Patterns',
            content: 'Microservices architecture breaks down applications into smaller, independent services. This approach offers scalability and flexibility but also introduces complexity in communication and deployment.',
            summary: 'Understand when and how to implement microservices architecture effectively.'
        },
        {
            coverImageUrl: undefined,
            title: 'GraphQL vs REST',
            content: 'GraphQL provides a query language for APIs that allows clients to request exactly the data they need. While REST has been the standard, GraphQL offers advantages in certain scenarios.',
            summary: 'Compare GraphQL and REST to choose the right API approach for your needs.'
        },
        {
            coverImageUrl: undefined,
            title: 'Web Performance Optimization',
            content: 'Web performance directly impacts user experience and SEO. Techniques like code splitting, lazy loading, image optimization, and caching can significantly improve load times.',
            summary: 'Optimize your web application for better performance and user satisfaction.'
        },
        {
            coverImageUrl: undefined,
            title: 'Security in Modern Web Applications',
            content: 'Web security involves protecting against various threats like XSS, CSRF, SQL injection, and more. Implementing security best practices should be a priority from the start.',
            summary: 'Secure your web applications against common vulnerabilities and attacks.'
        },
        {
            coverImageUrl: undefined,
            title: 'CI/CD Pipeline Setup',
            content: 'Continuous Integration and Continuous Deployment automate the process of testing and deploying code. Setting up a robust CI/CD pipeline improves development velocity and code quality.',
            summary: 'Automate your deployment process with effective CI/CD pipelines.'
        },
        {
            coverImageUrl: undefined,
            title: 'State Management in React',
            content: 'Managing application state is a critical aspect of React development. Solutions range from built-in Context API to libraries like Redux, Zustand, and Recoil.',
            summary: 'Choose the right state management solution for your React application.'
        },
        {
            coverImageUrl: undefined,
            title: 'Responsive Web Design Principles',
            content: 'Responsive design ensures your application works well on all devices. Using flexible grids, media queries, and responsive images creates a seamless experience across screen sizes.',
            summary: 'Create web applications that look great on any device or screen size.'
        },
        {
            coverImageUrl: undefined,
            title: 'API Rate Limiting and Throttling',
            content: 'Protecting your API from abuse requires implementing rate limiting and throttling. These techniques help prevent overload and ensure fair usage of your resources.',
            summary: 'Implement rate limiting to protect your APIs from abuse and overload.'
        },
        {
            coverImageUrl: undefined,
            title: 'Logging and Monitoring in Production',
            content: 'Proper logging and monitoring are essential for maintaining healthy production systems. Tools like Winston, Pino, and cloud monitoring services help track application behavior and issues.',
            summary: 'Set up effective logging and monitoring for production applications.'
        },
        {
            coverImageUrl: undefined,
            title: 'Database Indexing Strategies',
            content: 'Database indexes dramatically improve query performance but come with trade-offs in write performance and storage. Understanding when and how to use indexes is crucial for database optimization.',
            summary: 'Optimize database performance with effective indexing strategies.'
        },
        {
            coverImageUrl: undefined,
            title: 'WebSocket for Real-Time Communication',
            content: 'WebSockets enable bi-directional communication between client and server. This is essential for real-time features like chat applications, live notifications, and collaborative tools.',
            summary: 'Implement real-time features in your applications using WebSockets.'
        },
        {
            coverImageUrl: undefined,
            title: 'Error Handling Patterns',
            content: 'Proper error handling improves application reliability and user experience. Implementing consistent error handling strategies across your application is a mark of quality software.',
            summary: 'Build robust applications with comprehensive error handling strategies.'
        },
        {
            coverImageUrl: undefined,
            title: 'Environment Configuration Management',
            content: 'Managing configuration across different environments (development, staging, production) requires careful planning. Using environment variables and configuration management tools ensures consistency.',
            summary: 'Manage application configuration effectively across multiple environments.'
        },
        {
            coverImageUrl: undefined,
            title: 'Caching Strategies for Web Applications',
            content: 'Caching can dramatically improve application performance by reducing database queries and API calls. Understanding different caching layers and strategies is key to effective implementation.',
            summary: 'Boost application performance with strategic caching implementation.'
        },
        {
            coverImageUrl: undefined,
            title: 'Code Review Best Practices',
            content: 'Code reviews are crucial for maintaining code quality and sharing knowledge within teams. Effective code reviews focus on constructive feedback and continuous improvement.',
            summary: 'Improve code quality and team collaboration through effective code reviews.'
        },
        {
            coverImageUrl: undefined,
            title: 'Accessibility in Web Development',
            content: 'Building accessible web applications ensures everyone can use your product. Following WCAG guidelines and using semantic HTML creates inclusive experiences for all users.',
            summary: 'Make your web applications accessible to users of all abilities.'
        },
        {
            coverImageUrl: undefined,
            title: 'Technical Debt Management',
            content: 'Technical debt accumulates when shortcuts are taken in development. Managing technical debt requires balancing feature development with code quality improvements.',
            summary: 'Manage and reduce technical debt to maintain long-term code health.'
        },
        {
            coverImageUrl: undefined,
            title: 'Dependency Management and Security',
            content: 'Keeping dependencies up-to-date is crucial for security and performance. Regularly auditing and updating dependencies helps prevent vulnerabilities and ensures access to latest features.',
            summary: 'Keep your applications secure with proper dependency management practices.'
        }
    ];

    for (let i = 0; i < postsData.length; i++) {
        try {
            await postService.createPost(postsData[i], author.id);
            console.log(`Seed: Created post '${postsData[i].title}'`);
        } catch (error) {
            console.error(`Seed: Failed to create post '${postsData[i].title}':`, error);
        }
    }

    console.log(`Seed: Successfully created ${postsData.length} posts`);
}
