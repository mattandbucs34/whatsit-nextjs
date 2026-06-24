import { integer, timestamp, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ---- Users Tabel ----
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    hashedPassword: text('hashed_password').notNull(),
    role: text('role').default('standard').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ---- Topics Table ----
export const topics = pgTable('topics', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ---- Posts Table ----
export const posts = pgTable('posts', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    body: text('body').notNull(),
    userId: integer('user_id').references(() => users.id, {
        onDelete: 'cascade'
    }).notNull(),
    topicId: integer('topic_id').references(() => topics.id, {
        onDelete: 'cascade'
    }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const comments = pgTable('comments', {
    id: serial('id').primaryKey(),
    body: text('body').notNull(),
    userId: integer('user_id').references(() => users.id, {
        onDelete: 'cascade'
    }).notNull(),
    postId: integer('post_id').references(() => posts.id, {
        onDelete: 'cascade'
    }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ---- Relations ----
export const userRelations = relations(users, ({ many }) => ({
    posts: many(posts),
    comments: many(comments),
}));

export const topicRelations = relations(topics, ({ many }) => ({
    posts: many(posts),
}));

export const postRelations = relations(posts, ({ one, many }) => ({
    user: one(users, {
        fields: [posts.userId],
        references: [users.id],
    }),
    topic: one(topics, {
        fields: [posts.topicId],
        references: [topics.id],
    }),
    comments: many(comments),
}));

export const commentRelations = relations(comments, ({ one }) => ({
    user: one(users, {
        fields: [comments.userId],
        references: [users.id],
    }),
    post: one(posts, {
        fields: [comments.postId],
        references: [posts.id],
    }),
}));