import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '@/models/User';
import Blog from '@/models/Blog';
import connectDB from '@/config/db';

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany({});
        await Blog.deleteMany({});

        console.log('Data cleared...');

        // Create User
        const user = await User.create({
            first_name: 'John',
            last_name: 'Doe',
            bio: 'Software engineer and writer.',
            profile_pic_url: 'https://example.com/john_doe.jpg'
        });

        console.log('User created:', user.first_name);

        // Create Blogs
        const categories = [
            {
                name: 'Food',
                tags: ['food', 'cooking', 'recipes', 'healthy', 'diet'],
                titles: [
                    'The Secret to Perfect Sourdough',
                    '10 Quick Weeknight Dinners',
                    'Understanding Umami Flavors',
                    'Vegan Desserts That Taste Amazing',
                    'The Best Pizza in NYC'
                ]
            },
            {
                name: 'News',
                tags: ['news', 'politics', 'global', 'updates', 'economy'],
                titles: [
                    'Global Tech Summit 2025 Highlights',
                    'Economic Trends to Watch This Year',
                    'SpaceX Launches New Satellite Network',
                    'Climate Change Policy Updates',
                    'Local Election Results Announced'
                ]
            },
            {
                name: 'Tech',
                tags: ['tech', 'coding', 'programming', 'ai', 'gadgets'],
                titles: [
                    'The Future of Artificial Intelligence',
                    'Why You Should Learn Rust in 2025',
                    'Apple vs Android: The Never-ending Debate',
                    'Getting Started with Machine Learning',
                    'Top 5 VS Code Extensions for Developers'
                ]
            },
            {
                name: 'Travel',
                tags: ['travel', 'adventure', 'vacation', 'tourism', 'backpacking'],
                titles: [
                    'Backpacking Through Europe on a Budget',
                    'Hidden Gems in Tokyo',
                    'A Weekend Guide to Paris',
                    'Solo Travel Tips for Beginners',
                    'Hiking the Appalachian Trail'
                ]
            },
            {
                name: 'Lifestyle',
                tags: ['lifestyle', 'mindfulness', 'productivity', 'health', 'fitness'],
                titles: [
                    '5 Habits for a Productive Morning',
                    'Minimalism: Living with Less',
                    'The Benefits of Daily Meditation',
                    'Home Workout Routine for Busy People',
                    'Organizing Your Workspace for Success'
                ]
            }
        ];

        const blogData = [];
        let counter = 1;

        for (const cat of categories) {
            for (const title of cat.titles) {
                // Select 2-3 random tags from the category's pool
                const shuffledTags = cat.tags.sort(() => 0.5 - Math.random());
                const selectedTags = shuffledTags.slice(0, Math.floor(Math.random() * 2) + 2); // 2 or 3 tags

                blogData.push({
                    title: title,
                    sub_title: `A ${cat.name} blog post`,
                    content: `Welcome to our latest article on ${title}. In this post, we explore everything you need to know about ${selectedTags.join(', ')}. This content is generated to demonstrate the ${cat.name} section of our blog app. Enjoy reading! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
                    slug: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${counter}`,
                    tags: selectedTags,
                    author: user._id,
                    created_date: new Date(Date.now() - Math.floor(Math.random() * 1000000000)) // Random date in past
                });
                counter++;
            }
        }

        const blogs = await Blog.create(blogData);

        console.log(`Created ${blogs.length} blogs.`);

        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
