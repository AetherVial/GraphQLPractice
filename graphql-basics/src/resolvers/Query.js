const Query = {
    users(parent, args, { db }, info) {
        if (!args.query) {
            return db.users
        }
        return db.users.filter(user => {
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
    posts(parent, args, { db }, info) {
        if (!args.query) {
            return db.posts
        }
        return db.posts.filter(post => {
            const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
            const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
            return isTitleMatch || isBodyMatch
        })
    }, // resolver func takes in parent, args, context (contextual data), info 
    comments(parent, args, { db }, info) {
        if (!args.query) {
            return db.comments
        }
        return db.posts.filter(comment => {
            const isTextMatch = comment.text.toLowerCase().includes(args.query.toLowerCase)
            const isIDMatch = comment.id.includes(args.query)
            return isIDMatch || isTextMatch
        })
    }
}

export default Query;