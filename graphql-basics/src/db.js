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

const comments = [{
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

const db = {
    users,
    posts,
    comments
}

export default db;