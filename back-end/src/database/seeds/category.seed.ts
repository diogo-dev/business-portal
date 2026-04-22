import { CategoryService } from "src/category/category.service";
import { CreateCategoryDto } from "src/category/dto/create-category.dto";

export default async function seedCategories(categoryService: CategoryService) {

    // Check if categories already exist
    const existingCategories = await categoryService.findAll();
    if (existingCategories.length > 0) {
        console.log('Seed: Categories already exist, skipping category seeding');
        return;
    }

    // Create all categories
    const categoriesData: CreateCategoryDto[] = [
        { name: 'API' },
        { name: 'Accessibility' },
        { name: 'Architecture' },
        { name: 'Authentication' },
        { name: 'Automation' },
        { name: 'Backend' },
        { name: 'Best Practices' },
        { name: 'CI/CD' },
        { name: 'CSS' },
        { name: 'Configuration' },
        { name: 'Containerization' },
        { name: 'Database' },
        { name: 'Deployment' },
        { name: 'Design' },
        { name: 'Development Tools' },
        { name: 'DevOps' },
        { name: 'Docker' },
        { name: 'Frameworks' },
        { name: 'Frontend' },
        { name: 'Full-Stack' },
        { name: 'Git' },
        { name: 'GraphQL' },
        { name: 'JavaScript' },
        { name: 'Microservices' },
        { name: 'Monitoring' },
        { name: 'NestJS' },
        { name: 'Next.js' },
        { name: 'Node.js' },
        { name: 'Optimization' },
        { name: 'Performance' },
        { name: 'Production' },
        { name: 'Programming' },
        { name: 'Project Management' },
        { name: 'Quality Assurance' },
        { name: 'React' },
        { name: 'Real-Time' },
        { name: 'Scalability' },
        { name: 'Security' },
        { name: 'Software Engineering' },
        { name: 'State Management' },
        { name: 'Styling' },
        { name: 'Team Collaboration' },
        { name: 'Testing' },
        { name: 'TypeORM' },
        { name: 'TypeScript' },
        { name: 'Version Control' },
        { name: 'Web Development' },
        { name: 'WebSocket' }
    ];

    for (let i = 0; i < categoriesData.length; i++) {
        try {
            await categoryService.create(categoriesData[i]);
            console.log(`Seed: Created category '${categoriesData[i].name}'`);
        } catch (error: any) {
            console.error(`Seed: Failed to create category '${categoriesData[i].name}':`, error.message);
        }
    }

    console.log(`Seed: Successfully created ${categoriesData.length} categories`);
}
