import { GraphQLServer } from 'graphql-yoga';
import UUID from 'uuid/v4';

// Type Definitions (schema)
// String, Boolean, Int, Float,  ID
//
const typeDefs = `
    type Query {
        me: User!
        post: Post!
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments(query: String): [Comment!]!
    }

    type Mutation {
        createUser(user: CreateUserInput): User!
        deleteUser(id: ID!): User!
        createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
        createComment(text: String!, author: ID!, post: ID!): Comment!
    }

    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post]
        comments: [Comment]
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment]
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`
let users = [{
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

let posts = [{
    id: '1',
    title: 'Post1',
    body: 'Graph',
    published: true,
    author: '1'
}, {
    id: '2',
    title: 'Post2',
    body: 'QL',
    published: true,
    author: '1'
}, {
    id: '3',
    title: 'Post3',
    body: 'is so cool',
    published: false,
    author: '2'
}]

let comments = [{
    id: '1',
    text: 'wow',
    author: '1',
    post: '1'
}, {
    id: '2',
    text: 'fuck',
    author: '1',
    post: '1'
}, {
    id: '3',
    text: 'tron',
    author: '1',
    post: '1'
}, {
    id: '4',
    text: '!',
    author: '1',
    post: '1'
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
        comments(parent, args, ctx, info) {
            if (!args.query) {
                return comments
            }
            return posts.filter(comment => {
                const isTextMatch = comment.text.toLowerCase().includes(args.query.toLowerCase)
                const isIDMatch = comment.id.includes(args.query)
                return isIDMatch || isTextMatch
            })
        }
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some(user => user.email === args.data.email)
            if (emailTaken) {
                throw new Error('Email is taken.')
            }

            const user = {
                id: UUID(),
                ...args.data
            }

            users.push(user)
            return user
        },
        deleteUser(parent, args, ctx, info) {
            const userIndex = users.findIndex(() => {
                return user.id === args.id
            })

            if (userIndex === - 1) {
                throw new Error('user not found')
            }

            const deletedUsers = users = users.splice(userIndex, 1);

            posts = posts.filter(post => {
                const match = post.author === args.id
                if (match) {
                    comments = comments.filter((comment) => {
                        return comment.post !== post.id
                    })
                }
                return !match
            })
            comments = comments.filter((comment) => comment.author !== args.id)
            return deletedUsers
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some(user => user.id === args.author);
            if (!userExists) {
                throw new Error('user not found')
            } 

            const post = {
                id: UUID(),
                ...args
            }

            posts.push(post)
            return post
        },
        createComment(parent, args, ctx, info) {
            const userExists = users.some(user => user.id === args.author);
            const postExists = posts.some(post => post.id === args.post);

            if (!userExists) {
                throw new Error('user not found')
            } else if (!postExists) {
                throw new Error('post not found')
            }

            const comment = {
                id: UUID(),
                ...args
            }

            comments.push(comment);
            return comment;
        }
    },
    Post: {
        author(parent, args, ctx, info) {
           return users.find(user => (user.id === parent.author));
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter(post => (post.author === parent.id))
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => (comment.author === parent.id))
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find(user => (user.id === parent.author))
        },
        post(parent, args, ctx, info) {
            return posts.find(post => (post.id === parent.post))
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => {
    console.log('the server is up')
})