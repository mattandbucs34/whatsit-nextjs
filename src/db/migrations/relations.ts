import { relations } from 'drizzle-orm/relations';
import { topics, posts, users, flairs, adverts, banners, favorites, comments, rules, votes } from './schema';

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