import { pgTable, varchar, foreignKey, serial, integer, timestamp } from 'drizzle-orm/pg-core';



export const sequelizeMeta = pgTable('SequelizeMeta', {
	name: varchar({ length: 255 }).primaryKey().notNull(),
});

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

export const users = pgTable('Users', {
	id: serial().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	role: varchar({ length: 255 }).default('member').notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
});

export const flairs = pgTable('Flairs', {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }),
	color: varchar({ length: 255 }),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
});

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
