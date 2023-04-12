require('dotenv').config()
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mysql = require('mysql2/promise')
const cors = require('cors')
const multer = require('multer')
const path = require('path')

const app = express()

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.resolve('uploads'))
    },
    filename: (req, file, callback) => {
        const time = new Date().getTime()

        callback(null, `${time}_${file.originalname}`)
    },
})

const upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        const filetypes = /jpeg|jpg|png|gif/
        const mimetype = filetypes.test(file.mimetype)
        const extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
        )

        if (mimetype && extname) {
            return callback(null, true)
        }

        callback(new Error('Error: Invalid file type'))
    },
})

const db = mysql.createPool({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
})

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome!' })
})

app.use('/images', express.static('uploads'))


///////////////////////// posts related routes, start  ///////////////////////

app.get('/posts', async (req, res) => {
    const sqlGet = await db.execute(
        'SELECT idposts, name,  image, title, category, date_post, text, synopsis, total_likes, total_comments FROM users, posts WHERE users.id = posts.id ORDER BY idposts DESC'
    )

    const posts = sqlGet[0]

    if (posts.length === 0) {
        return res.status(404).json({ error: 'No posts were created' })
    }

    try {
        res.send(posts)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Something went wrong, try again later',
        })
    }
})

app.get('/posts/:id', async (req, res) => {
    const id = req.params.id
    const sqlGet = await db.execute(
        'SELECT idposts, name, photo,  image, title, category, date_post, text, synopsis, total_likes, total_comments FROM users, posts WHERE users.id = posts.id AND idposts = ? ORDER BY idposts DESC',
        [id]
    )

    const posts = sqlGet[0]

    if (posts.length === 0) {
        return res
            .status(404)
            .json({ error: `There is no post with this id ${id}` })
    }

    try {
        res.send(posts)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Something went wrong, try again later',
        })
    }
})

app.get('/posts/user/:id', async (req, res) => {
    const id = req.params.id
    const sqlGet = await db.execute(
        'SELECT idposts, name,  image, title, category, date_post, text, synopsis, total_likes, total_comments FROM users, posts WHERE users.id = posts.id AND users.id = ? ORDER BY idposts DESC',
        [id]
    )

    const posts = sqlGet[0]

    if (posts.length === 0) {
        return res.status(404).json({ error: 'User has not created any posts' })
    }

    try {
        res.send(posts)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Something went wrong, try again later',
        })
    }
})


app.get('/posts/category/:category', async (req, res) => {
    const sqlGet = await db.execute(
        `SELECT idposts, name, image, title, category, date_post, text, synopsis, total_likes, total_comments FROM posts INNER JOIN users ON posts.id = users.id WHERE category = '${req.params.category}' ORDER BY idposts DESC`
    )

    const postscategory = sqlGet[0]

    if (postscategory.length === 0) {
        return res
            .status(404)
            .json({
                error: `There is none ${req.params.category} category found`,
            })
    }

    try {
        res.send(postscategory)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Something went wrong, try again later',
        })
    }
})

app.get('/posts/search/:query', async (req, res) => {
    const sqlGet = await db.execute(
        `SELECT idposts, name, image, title, category, date_post, text, synopsis, total_likes ,total_comments FROM posts INNER JOIN users ON posts.id = users.id WHERE title LIKE '%${req.params.query}%' OR name LIKE '%${req.params.query}%' OR text LIKE '%${req.params.query}%' OR category LIKE '%${req.params.query}%' OR date_post LIKE '%${req.params.query}%' ORDER BY idposts DESC`
    )

    const postsearch = sqlGet[0]

    if (postsearch.length === 0) {
        return res
            .status(404)
            .json({ error: `There is none ${req.params.query} post found` })
    }

    try {
        res.send(postsearch)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Something went wrong, try again later',
        })
    }
})


app.post('/posts', checkToken, upload.single('file'), async (req, res) => {
    const { id, title, category, text, synopsis } = req.body

    const image = req.file.filename

    if (!id) {
        return res.status(422).json({ error: 'ID is required field' })
    }

    if (!image) {
        return res.status(422).json({ error: 'Image is required file' })
    }

    if (!title) {
        return res.status(422).json({ error: 'Title is required field' })
    }

    if (!category) {
        return res.status(422).json({ error: 'Category is required field' })
    }

    if (!text) {
        return res.status(422).json({ error: `Text is required field` })
    }

    if (!synopsis) {
        return res.status(422).json({ error: `Synopsis is required field` })
    }

    try {
        const result = await db.execute(
            'INSERT INTO posts (id, image, title, category, text, synopsis) VALUES (?, ?, ?, ?, ?, ?)',
            [id, image, title, category, text, synopsis]
        )

        const idposts = result[0].insertId
        res.status(200).json({ idposts, message: 'Post successfully created' })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Something went wrong, try again later',
        })
    }
})

app.put('/posts/update/:id', checkToken, upload.single('file'), async (req, res) => {
    const { title, category, text, synopsis } = req.body

    const image = req.file.filename

    const id = req.params.id

    const sqlGet = await db.execute(
        'SELECT idposts, name,  image, title, category, date_post, text, synopsis FROM users, posts WHERE users.id = posts.id AND idposts = ? ORDER BY idposts DESC',
        [id]
    )

    const posts = sqlGet[0]

    if (posts.length === 0) {
        return res.status(404).json({ error: `The post doesn't exist` })
    }

    if (!image) {
        return res.status(422).json({ error: 'Image is required file' })
    }

    if (!title) {
        return res.status(422).json({ error: 'Title is required file' })
    }

    if (!category) {
        return res.status(422).json({ error: 'Category is required field' })
    }

    if (!text) {
        return res.status(422).json({ error: 'Text is required field' })
    }

    if (!synopsis) {
        return res.status(422).json({ error: 'Synopsis is required field' })
    }

    try {
        await db.execute(
            'UPDATE posts SET image = ?, title= ?,  category = ?, text = ?, synopsis = ? WHERE idposts = ?',
            [image, title, category, text, synopsis, id]
        )
        res.status(200).json({ message: 'Post successfully updated' })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Something went wrong, try again later',
        })
    }
}
)


app.delete('/posts/delete/:id', checkToken, async (req, res) => {
    const id = req.params.id

    const sqlGet = await db.execute(
        'SELECT idposts, name,  image, title, category, date_post, text, synopsis FROM users, posts WHERE users.id = posts.id AND idposts = ? ORDER BY idposts DESC',
        [id]
    )

    const posts = sqlGet[0]

    if (posts.length === 0) {
        return res.status(404).json({ error: `The post doesn't exist` })
    }

    try {
        await db.execute('DELETE FROM posts WHERE idposts = ?', [id])
        res.status(200).json({ message: 'Post successfully deleted' })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Something went wrong, try again later',
        })
    }
})

/////////////////////////  Posts Comments Start  ///////////////////////

app.get('/posts/comment/:idpost', async (req, res) => {
    const idpost = req.params.idpost

    const sqlGet = await db.execute(
        'SELECT comment.id, post_id, user_id, name, photo, text, date FROM comment JOIN users ON comment.user_id = users.id AND post_id = ?',
        [idpost]
    )

    const comment = sqlGet[0]

    if (comment.length === 0) {
        return res
            .status(404)
            .json({ error: `This post does not contain any comments` })
    }

    try {
        const sqlGet = await db.execute(
            'SELECT comment.id, post_id, user_id, name, photo, text, date FROM comment JOIN users ON comment.user_id = users.id AND post_id = ?',
            [idpost]
        )
        const comments = sqlGet[0]
        return res.status(200).json(comments)
    } catch (error) {
        console.log(error)
        return res
            .status(500)
            .json({ message: 'Something went wrong, try again later' })
    }
})

app.post('/posts/comment', checkToken, async (req, res) => {
    const { post_id, user_id, text } = req.body

    if (!post_id) {
        return res.status(422).json({ error: 'post_id is required field' })
    }

    if (!user_id) {
        return res.status(422).json({ error: 'user_id is required field' })
    }

    if (!text) {
        return res.status(422).json({ error: 'text is required field' })
    }

    try {
        await db.execute(
            'INSERT INTO comment (post_id, user_id, text) VALUES (?, ?, ?)',
            [post_id, user_id, text]
        )
        return res.status(200).json({ message: 'Comment added successfully.' })
    } catch (error) {
        console.log(error)
        return res
            .status(500)
            .json({ message: 'Something went wrong, try again later' })
    }
})







app.put('/posts/comment/:id', checkToken, async (req, res) => {
    const id = req.params.id

    const text = req.body

    const sqlGet = await db.execute('SELECT * FROM comment WHERE id = ?', [id])

    const comment = sqlGet[0]

    if (comment.length === 0) {
        return res.status(404).json({ error: `The comment doesn't exist` })
    }

    if (!text) {
        return res.status(422).json({ error: 'Text is required field' })
    }

    try {
        await db.execute('UPDATE comment SET text = ? WHERE id = ?', [
            req.body.text,
            id,
        ])
        res.status(200).json({ message: 'Successfully updated' })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Something went wrong, try again later',
        })
    }
})


app.delete('/posts/comment/:id', async (req, res) => {
    const comment_id = req.params.id

    const sqlGet = await db.execute('SELECT * FROM comment WHERE id = ?', [
        comment_id,
    ])

    const user = sqlGet[0]

    if (user.length === 0) {
        return res.status(400).json({ message: 'Comment not found.' })
    }

    try {
        await db.execute('DELETE FROM comment WHERE id = ?', [comment_id])
        return res
            .status(200)
            .json({ message: 'Comment deleted successfully.' })
    } catch (error) {
        console.log(error)
        return res
            .status(500)
            .json({ message: 'Something went wrong, try again later' })
    }
})


/////////////////////////  Posts Comments End ///////////////////////




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



/////////////////////////  posts related routes, end  ///////////////////////



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////  author related routes, start  ///////////////////////

app.get('/author', async (req, res) => {
    const sqlGet = await db.execute(
        'SELECT id, name, date_user, biography, photo FROM users ORDER BY id DESC'
    )

    const user = sqlGet[0]

    if (user.length === 0) {
        return res.status(404).json({ error: `There is no author created` })
    }

    try {
        res.send(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Something went wrong, try again later',
        })
    }
})

app.get('/author/:name', async (req, res) => {
    const name = req.params.name

    const sqlGet = await db.execute(
        'SELECT id, name, date_user, biography, photo FROM users WHERE name = ?',
        [name]
    )

    const user = sqlGet[0]

    if (user.length === 0) {
        return res.status(404).json({ error: `The author doesn't exist` })
    }

    try {
        res.send(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Something went wrong, try again later',
        })
    }
})


/////////////////////////  author related routes, end  ///////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////  auth related routes, start  ///////////////////////



app.post('/auth/register', async (req, res) => {
    const { name, email, password, confirmpassword } = req.body

    if (!name) {
        return res.status(422).json({ error: 'Name is required field' })
    }

    if (!email) {
        return res.status(422).json({ error: 'Email is required field' })
    }

    if (!password) {
        return res.status(422).json({ error: 'Password is required field' })
    }

    if (!confirmpassword) {
        return res
            .status(422)
            .json({ error: 'Confirm Password is required field' })
    }

    if (password !== confirmpassword) {
        return res.status(422).json({ error: `Passwords don't match` })
    }

    const [EmailExists] = await db.execute(
        'SELECT email FROM users WHERE email = ?',
        [email]
    )

    const [NameExists] = await db.execute(
        'SELECT name FROM users WHERE name = ?',
        [name]
    )

    if (EmailExists[0]) {
        return res
            .status(409)
            .json({ error: `Please choose another email address` })
    }

    if (NameExists[0]) {
        return res.status(409).json({ error: `Please choose another name` })
    }

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    try {
        await db.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, passwordHash]
        )
        res.status(200).json({ message: 'User successfully created' })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Something went wrong, try again later',
        })
    }
})


app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body

    const [user] = await db.execute('SELECT * FROM users WHERE email = ?', [
        email,
    ])

    if (!user[0]) {
        return res.status(404).json({ error: `Email doesn't exist` })
    }

    if (!email) {
        return res.status(422).json({ error: 'Email is required field' })
    }

    if (!password) {
        return res.status(422).json({ error: 'password is required field' })
    }

    const checkPassword = await bcrypt.compare(password, user[0].password)

    if (!checkPassword) {
        return res.status(422).json({ message: 'Invalid Password' })
    }

    try {
        const secret = process.env.SECRET
        const expiresIn = 3600

        const token = jwt.sign(
            { id: user[0].id, exp: Math.floor(Date.now() / 1000) + expiresIn },
            secret
        )

        res.status(200).json({
            message: 'Auth has been successfully',
            token,
            id: user[0].id,
        })
    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: 'Something went wrong, try again later',
        })
    }
})


/////////////////////////  auth related routes, end  ///////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////  user related routes, start  ///////////////////////



app.get('/user/:id', checkToken, async (req, res) => {
    const id = req.params.id

    const [rows] = await db.execute(
        'SELECT id, name, email, biography, photo FROM users WHERE id = ?',
        [id]
    )

    const user = rows[0]

    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }

    try {
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Something went wrong, try again later',
        })
    }
})



app.put('/user/name/:id', checkToken, async (req, res) => {
    const id = req.params.id

    const name = req.body.name

    const sqlGet = await db.execute(
        'SELECT id, name, email, date_user FROM users WHERE id = ?',
        [id]
    )

    const user = sqlGet[0]

    if (user.length === 0) {
        return res.status(404).json({ error: `The user doesn't exist` })
    }

    if (!name) {
        return res.status(422).json({ error: 'Name is required field' })
    }

    const [NameExists] = await db.execute(
        'SELECT name FROM users WHERE name = ?',
        [name]
    )

    if (NameExists[0]) {
        return res
            .status(409)
            .json({ error: `Name already exists, please choose another` })
    }

    try {
        await db.execute('UPDATE users SET name = ? WHERE id = ?', [name, id])
        res.status(200).json({ message: 'Successfully updated' })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Something went wrong, try again later',
        })
    }
})

app.put('/user/photo/:id', checkToken, upload.single('file'), async (req, res) => {
        const id = req.params.id

        const photo = req.file.filename

        const sqlGet = await db.execute(
            'SELECT id, name, email, date_user FROM users WHERE id = ?',
            [id]
        )

        const user = sqlGet[0]

        if (user.length === 0) {
            return res.status(404).json({ error: `The user doesn't exist` })
        }

        if (!req.file || !req.file.filename) {
            return res.status(422).json({ error: 'Photo is required file' })
        }

        try {
            await db.execute('UPDATE users SET photo = ? WHERE id = ?', [
                photo,
                id,
            ])
            res.status(200).json({ message: 'Successfully updated' })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: 'Something went wrong, try again later',
            })
        }
    }
)

app.put('/user/biography/:id', checkToken, async (req, res) => {
    const id = req.params.id

    const biography = req.body

    const sqlGet = await db.execute(
        'SELECT id, name, email, date_user FROM users WHERE id = ?',
        [id]
    )

    const user = sqlGet[0]

    if (user.length === 0) {
        return res.status(404).json({ error: `The user doesn't exist` })
    }

    if (!biography) {
        return res.status(422).json({ error: 'Biography is required field' })
    }

    try {
        await db.execute('UPDATE users SET biography = ? WHERE id = ?', [
            req.body.biography,
            id,
        ])
        res.status(200).json({ message: 'Successfully updated' })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Something went wrong, try again later',
        })
    }
})

/////////////////////////  user related routes, end  ///////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////  likes related routes, start  ///////////////////////



app.get('/likes/total', async (req, res) => {
    try {
        const sqlGet = await db.execute(
            'SELECT post_id, COUNT(*) as total_likes FROM likes GROUP BY post_id'
        )
        const likes = sqlGet[0]
        return res.status(200).json({ likes })
    } catch (error) {
        console.log(error)
        return res
            .status(500)
            .json({ message: 'Something went wrong, try again later' })
    }
})

app.get('/likes/check', checkToken, async (req, res) => {
    const { post_id, user_id } = req.query

    if (!post_id) {
        return res.status(422).json({ error: 'post_id is required field' })
    }

    if (!user_id) {
        return res.status(422).json({ error: 'user_id is required field' })
    }

    const sqlGet = await db.execute(
        'SELECT * FROM likes WHERE post_id = ? and user_id = ?',
        [post_id, user_id]
    )

    const user = sqlGet[0]

    try {
        if (user && user.length > 0) {
            const likeId = user[0].id
            return res.status(200).json({ liked: true, id: likeId })
        } else {
            return res.status(200).json({ liked: false })
        }
    } catch (error) {
        console.log(error)
        return res
            .status(500)
            .json({ message: 'Something went wrong, try again later' })
    }
})

app.post('/likes', checkToken, async (req, res) => {
    const { post_id, user_id } = req.body

    if (!post_id) {
        return res.status(422).json({ error: 'post_id is required field' })
    }

    if (!user_id) {
        return res.status(422).json({ error: 'user_id is required field' })
    }

    const sqlGet = await db.execute(
        'SELECT * FROM likes WHERE post_id = ? and user_id = ?',
        [post_id, user_id]
    )

    const user = sqlGet[0]

    if (user.length > 0) {
        return res
            .status(400)
            .json({ message: 'User has already liked the post.' })
    }

    try {
        await db.execute('INSERT INTO likes (post_id, user_id) VALUES (?, ?)', [
            post_id,
            user_id,
        ])
        return res.status(200).json({ message: 'Like added successfully.' })
    } catch (error) {
        console.log(error)
        return res
            .status(500)
            .json({ message: 'Something went wrong, try again later' })
    }
})

app.delete('/likes/:id', checkToken, async (req, res) => {
    const like_id = req.params.id

    const sqlGet = await db.execute('SELECT * FROM likes WHERE id = ?', [
        like_id,
    ])

    const user = sqlGet[0]

    if (user.length === 0) {
        return res.status(400).json({ message: 'Like not found.' })
    }

    try {
        await db.execute('DELETE FROM likes WHERE id = ?', [like_id])
        return res.status(200).json({ message: 'Like deleted successfully.' })
    } catch (error) {
        console.log(error)
        return res
            .status(500)
            .json({ message: 'Something went wrong, try again later' })
    }
})

/////////////////////////  likes related routes, end  ///////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////  CheckToken  ///////////////////////

function checkToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res
            .status(401)
            .json({ message: 'You are not authorized to access' })
    }

    try {
        const secret = process.env.SECRET

        jwt.verify(token, secret)

        next()
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token' })
    }
}

/////////////////////////  CheckToken  ///////////////////////

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
