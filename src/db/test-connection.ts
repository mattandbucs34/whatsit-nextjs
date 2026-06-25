/* eslint-disable no-console */
import { db } from './index';

const main = async () => {
    console.log('Testing connection to database...');
    try {
        // Attempt to query up to 5 topics from the database using Drizzle
        const allTopics = await db.query.topics.findMany({
            limit: 5,
        });

        console.log('Connection successful! 🎉');
        console.log('Sample Topics from database:', allTopics);
    } catch (error) {
        console.error('Error connecting to database:', error);
    } finally {
        process.exit(0);
    }
};

main();
