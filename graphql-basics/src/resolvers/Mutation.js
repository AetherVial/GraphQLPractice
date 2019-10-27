import UUID from 'uuid/v4';

const Mutation = {
    createUser(parent, args, {db} , info) {
        const emailTaken = db.users.some(user => user.email === args.data.email)
            if (emailTaken) {
                throw new Error('Email is taken.')
            }

            const user = {
                id: UUID(),
                ...args.data
            }

            db.users.push(user)
            return user
        },
    deleteUser(parent, args, { db }, info) {
        const userIndex = db.users.findIndex(() => {
            return user.id === args.id
        })

        if (userIndex === - 1) {
            throw new Error('user not found')
        }

        const deletedUsers = db.users.splice(userIndex, 1);

        db.posts = db.posts.filter(post => {
            const match = post.author === args.id
            if (match) {
                db.comments = db.comments.filter((comment) => {
                    return comment.post !== post.id
                })
            }
            return !match
        })
        db.comments = db.comments.filter((comment) => comment.author !== args.id);
        return deletedUsers[0];
    },
    updateUser(parent, args, {db}, info) {
        const {id, data} = args
        const user = db.users.find((user) => user.id === id)

        if (!user) {
            throw new Error('user not found')
        }

        if (typeof data.email === 'string') {
            const emailTaken = db.users.some(user => user.email === data.email)
            if (emailTaken) {
                throw new Error('Email in use')
            }
            user.email = data.email
        }

        if (typeof data.name === 'string') {
            user.name = data.name
        }

        if (typeof data.age !== 'undefined' ) {
            user.age = data.age
        }

        return user;
    },
    createPost(parent, args, { db }, info) {
        const userExists = db.users.some(user => user.id === args.author);
        if (!userExists) {
            throw new Error('user not found')
        }

        const post = {
            id: UUID(),
            ...args
        }

        db.posts.push(post)
        return post
    },
    deletePost(parent, args, { db }, info) {
        const postIndex = db.posts.findIndex(() => {
            return post.id === args.id
        })

        if (postIndex === - 1) {
            throw new Error('post not found')
        }
        const deletedPosts = db.posts.splice(postIndex, 1);
        db.comments = db.comments.filter((comment) => comment.post !== args.id)

        return deletedPosts[0];
    },
    updatePost(parent, args, { db }, info) {
        const { id, data } = args
        const post = db.posts.find((post) => post.id === id)

        if (!post) {
            throw new Error('post not found')
        }

        if (typeof data.title === 'string') {
            post.title = data.title
        }

        if (typeof data.body === 'string') {
            post.body = data.body
        }

        if (typeof data.published === 'boolean') {
            post.published = data.published
        }
        return post;
    },
    createComment(parent, args, { db }, info) {
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

        db.comments.push(comment);
        return comment;
    },
    deleteComment(parent, args, { db }, info) {
        const commentIndex = db.comments.findIndex(() => {
            return comment.id === args.id
        })

        if (commentIndex === - 1) {
            throw new Error('comment not found')
        }
        const deletedComments = db.comments.splice(commentIndex, 1);

        return deletedComments[0];
    },
    updateComment(parent, args, { db }, info) {
        const { id, data } = args
        const comment = db.comments.find((comment) => comment.id === id)

        if (!comment) {
            throw new Error('comment not found')
        }

        if (typeof data.text === 'string') {
            comment.text = data.text
        }

        return comment;
    },
}

export default Mutation;