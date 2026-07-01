/* eslint-disable no-console */
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { db } from './index';
import { topics, posts, comments, users } from './schema';
import { eq } from 'drizzle-orm';
import { faker } from '@faker-js/faker';

const getOrCreateUsers = async (now: string) => {
    const targetUsers = [
        { email: 'admin@whatsit.com', role: 'admin' },
        { email: 'user1@whatsit.com', role: 'member' },
        { email: 'user2@whatsit.com', role: 'member' },
        { email: 'user3@whatsit.com', role: 'member' },
        { email: 'user4@whatsit.com', role: 'member' },
    ];

    const seededUsers = [];
    const passwordHash = await bcrypt.hash('password123', 10);

    for (const target of targetUsers) {
        let user = await db.query.users.findFirst({
            where: eq(users.email, target.email),
        });

        if (!user) {
            const result = await db
                .insert(users)
                .values({
                    email: target.email,
                    password: passwordHash,
                    role: target.role,
                    createdAt: now,
                    updatedAt: now,
                })
                .returning();
            user = result[0];
            console.log(`Created user: ${target.email}`);
        } else {
            console.log(`User already exists: ${target.email}`);
        }
        seededUsers.push(user);
    }
    return seededUsers;
};

const seed = async () => {
    console.log('Starting seed process...');
    try {
        const now = new Date().toISOString();

        // 1. Seed or retrieve users
        const seededUsers = await getOrCreateUsers(now);

        // 2. Generate and seed 10 Topics
        console.log('Seeding 10 topics...');
        const topicInsertData = Array.from({ length: 10 }).map(() => {
            const rawTitle = faker.lorem.words({ min: 1, max: 3 });
            const title = rawTitle
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
                .slice(0, 255);

            return {
                title,
                description: faker.lorem.paragraph().slice(0, 255),
                createdAt: now,
                updatedAt: now,
            };
        });

        const seededTopics = await db.insert(topics).values(topicInsertData).returning();
        console.log(`Successfully seeded ${seededTopics.length} topics!`);

        // 3. Generate and seed 10 Posts per Topic (100 total)
        console.log('Seeding 10 posts per topic (100 total)...');
        const postInsertData = [];
        for (const topic of seededTopics) {
            for (let i = 0; i < 10; i++) {
                const randomUser = faker.helpers.arrayElement(seededUsers);
                
                // Keep title and body short to obey the varchar(255) column limits in schema.ts
                const rawTitle = faker.lorem.sentence({ min: 3, max: 6 });
                const title = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);

                postInsertData.push({
                    title: title.slice(0, 255),
                    body: faker.lorem.paragraph().slice(0, 255),
                    topicId: topic.id,
                    userId: randomUser.id,
                    createdAt: now,
                    updatedAt: now,
                });
            }
        }

        const seededPosts = await db.insert(posts).values(postInsertData).returning();
        console.log(`Successfully seeded ${seededPosts.length} posts!`);

        // 4. Generate and seed 10 Comments per Post (1000 total)
        console.log('Seeding 10 comments per post (1000 total)...');
        const commentInsertData = [];
        for (const postRecord of seededPosts) {
            for (let j = 0; j < 10; j++) {
                const randomUser = faker.helpers.arrayElement(seededUsers);
                commentInsertData.push({
                    body: faker.lorem.sentence({ min: 4, max: 10 }).slice(0, 255),
                    postId: postRecord.id,
                    userId: randomUser.id,
                    createdAt: now,
                    updatedAt: now,
                });
            }
        }

        const seededComments = await db.insert(comments).values(commentInsertData).returning();
        console.log(`Successfully seeded ${seededComments.length} comments!`);

        console.log('Database seeding completed successfully! 🎉');
    } catch (error) {
        console.error('Error during seeding process:', error);
    } finally {
        process.exit(0);
    }
};

seed();
