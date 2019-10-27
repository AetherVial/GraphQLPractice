import { GraphQLServer, PubSub } from 'graphql-yoga';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Subscription from './resolvers/Subscription';
import Post from './resolvers/Post';
import Comment from './resolvers/Comment';
import User from './resolvers/User';
import db from './db.js';

const pubsub = new PubSub()
const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: {
        db: db,
        pubsub: pubsub
    }
});

server.start(() => {
    console.log('the server is up')
})