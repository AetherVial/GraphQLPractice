import { GraphQLServer } from 'graphql-yoga';

// Type Definitions (schema)
// String, Boolean, Int, Float,  ID
//
const typeDefs = `
    type Query {
        me: User!
        post: Post!
        users(query: String): [User!]!
        posts(query: String): [Post!]!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`
const users = [{
    id: '1',
    name: 'Andrew',
    email: 'andrew@andrew.com'
}, {
    id: '2',
    name: 'Chungus',
    email: 'big@chungus.com'
}, {
    id: '3',
    name: 'Wesley',
    email: 'wesley@yahoo.com'
}]

const posts = [{
    id: '1',
    title: 'Post1',
    body: 'Graph',
    published: true
}, {
    id: '2',
    title: 'Post2',
    body: 'QL',
    published: true
}, {
    id: '3',
    title: 'Post3',
    body: 'is so cool',
    published: false
}]

// Resolvers
const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users
            } 
            return users.filter(user => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        me() {
            return {
                id: '123456',
                name: 'Mike',
                email: 'mike@mike.com',
                age: 23
            }
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts
            }
            return posts.filter(post => {
                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
                const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
                return isTitleMatch || isBodyMatch
            })
        }, // resolver func takes in parent, args, context (contextual data), info 
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => {
    console.log('the server is up')
})