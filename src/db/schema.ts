import { pgTable, varchar, foreignKey, serial, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// --- Sequelize Meta Table ---
export const sequelizeMeta = pgTable('SequelizeMeta', {
    name: varchar({ length: 255 }).primaryKey().notNull(),
});

// --- Users Table ---
export const users = pgTable('Users', {
    id: serial().primaryKey().notNull(),
    email: varchar({ length: 255 }).notNull(),
    password: varchar({ length: 255 }).notNull(),
    role: varchar({ length: 255 }).default('member').notNull(),
    createdAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
});

// --- Flairs Table ---
export const flairs = pgTable('Flairs', {
    id: serial().primaryKey().notNull(),
    name: varchar({ length: 255 }),
    color: varchar({ length: 255 }),
    createdAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
});

// --- Topics Table ---
export const topics = pgTable('Topics', {
    id: serial().primaryKey().notNull(),
    title: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 255 }).notNull(),
    flairId: integer(),
    createdAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
    foreignKey({
        columns: [table.flairId],
        foreignColumns: [flairs.id],
        name: 'Topics_flairId_fkey'
    }).onUpdate('cascade').onDelete('cascade'),
]);

// --- Posts Table ---
export const posts = pgTable('Posts', {
    id: serial().primaryKey().notNull(),
    title: varchar({ length: 255 }).notNull(),
    body: varchar({ length: 255 }).notNull(),
    topicId: integer().notNull(),
    userId: integer().notNull(),
    createdAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
    foreignKey({
        columns: [table.topicId],
        foreignColumns: [topics.id],
        name: 'Posts_topicId_fkey'
    }).onUpdate('cascade').onDelete('cascade'),
    foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: 'Posts_userId_fkey'
    }).onUpdate('cascade').onDelete('cascade'),
]);

// --- Comments Table ---
export const comments = pgTable('Comments', {
    id: serial().primaryKey().notNull(),
    body: varchar({ length: 255 }).notNull(),
    postId: integer().notNull(),
    userId: integer().notNull(),
    createdAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
    foreignKey({
        columns: [table.postId],
        foreignColumns: [posts.id],
        name: 'Comments_postId_fkey'
    }).onUpdate('cascade').onDelete('cascade'),
    foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: 'Comments_userId_fkey'
    }).onUpdate('cascade').onDelete('cascade'),
]);

// --- Adverts Table ---
export const adverts = pgTable('Adverts', {
    id: serial().primaryKey().notNull(),
    title: varchar({ length: 255 }),
    description: varchar({ length: 255 }),
    topicId: integer(),
    createdAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
    foreignKey({
        columns: [table.topicId],
        foreignColumns: [topics.id],
        name: 'Adverts_topicId_fkey'
    }).onUpdate('cascade').onDelete('cascade'),
]);

// --- Banners Table ---
export const banners = pgTable('Banners', {
    id: serial().primaryKey().notNull(),
    source: varchar({ length: 255 }),
    description: varchar({ length: 255 }),
    topicId: integer(),
    createdAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
    foreignKey({
        columns: [table.topicId],
        foreignColumns: [topics.id],
        name: 'Banners_topicId_fkey'
    }).onUpdate('cascade').onDelete('cascade'),
]);

// --- Favorites Table ---
export const favorites = pgTable('Favorites', {
    id: serial().primaryKey().notNull(),
    postId: integer().notNull(),
    userId: integer().notNull(),
    createdAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
    foreignKey({
        columns: [table.postId],
        foreignColumns: [posts.id],
        name: 'Favorites_postId_fkey'
    }).onUpdate('cascade').onDelete('cascade'),
    foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: 'Favorites_userId_fkey'
    }).onUpdate('cascade').onDelete('cascade'),
]);

// --- Rules Table ---
export const rules = pgTable('Rules', {
    id: serial().primaryKey().notNull(),
    description: varchar({ length: 255 }),
    topicId: integer(),
    createdAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
    foreignKey({
        columns: [table.topicId],
        foreignColumns: [topics.id],
        name: 'Rules_topicId_fkey'
    }).onUpdate('cascade').onDelete('cascade'),
]);

// --- Votes Table ---
export const votes = pgTable('Votes', {
    id: serial().primaryKey().notNull(),
    value: integer().notNull(),
    postId: integer().notNull(),
    userId: integer().notNull(),
    createdAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
    foreignKey({
        columns: [table.postId],
        foreignColumns: [posts.id],
        name: 'Votes_postId_fkey'
    }).onUpdate('cascade').onDelete('cascade'),
    foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: 'Votes_userId_fkey'
    }).onUpdate('cascade').onDelete('cascade'),
]);

// ==========================================
//                 RELATIONS
// ==========================================

export const postsRelations = relations(posts, ({ one, many }) => ({
    topic: one(topics, {
        fields: [posts.topicId],
        references: [topics.id]
    }),
    user: one(users, {
        fields: [posts.userId],
        references: [users.id]
    }),
    favorites: many(favorites),
    comments: many(comments),
    votes: many(votes),
}));

export const topicsRelations = relations(topics, ({ one, many }) => ({
    posts: many(posts),
    flair: one(flairs, {
        fields: [topics.flairId],
        references: [flairs.id]
    }),
    adverts: many(adverts),
    banners: many(banners),
    rules: many(rules),
}));

export const usersRelations = relations(users, ({ many }) => ({
    posts: many(posts),
    favorites: many(favorites),
    comments: many(comments),
    votes: many(votes),
}));

export const flairsRelations = relations(flairs, ({ many }) => ({
    topics: many(topics),
}));

export const advertsRelations = relations(adverts, ({ one }) => ({
    topic: one(topics, {
        fields: [adverts.topicId],
        references: [topics.id]
    }),
}));

export const bannersRelations = relations(banners, ({ one }) => ({
    topic: one(topics, {
        fields: [banners.topicId],
        references: [topics.id]
    }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
    post: one(posts, {
        fields: [favorites.postId],
        references: [posts.id]
    }),
    user: one(users, {
        fields: [favorites.userId],
        references: [users.id]
    }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
    post: one(posts, {
        fields: [comments.postId],
        references: [posts.id]
    }),
    user: one(users, {
        fields: [comments.userId],
        references: [users.id]
    }),
}));

export const rulesRelations = relations(rules, ({ one }) => ({
    topic: one(topics, {
        fields: [rules.topicId],
        references: [topics.id]
    }),
}));

export const votesRelations = relations(votes, ({ one }) => ({
    post: one(posts, {
        fields: [votes.postId],
        references: [posts.id]
    }),
    user: one(users, {
        fields: [votes.userId],
        references: [users.id]
    }),
}));
