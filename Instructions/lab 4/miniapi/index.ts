import express from 'express'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import cors from 'cors'

const app = express()

const users = [
  {
    id: "1",
    login: "admin",
    password: "admin123",
    firstName: "Jan",
    lastName: "Kowalski",
    role: "admin"
  },
  {
    id: "2",
    login: "dev1",
    password: "dev123",
    firstName: "Anna",
    lastName: "Nowak",
    role: "developer"
  }
];

const port = 3000

const tokenSecret = process.env.TOKEN_SECRET as string
let refreshToken: string

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World - simple api with JWT!')
})

app.post(
  "/token",
  function (req, res) {
    const expTime = req.body.exp || 60
    const token = generateToken(+expTime)
    refreshToken = generateToken(60 * 60)
    res.status(200).send({ token, refreshToken })
  }
)
app.post(
  "/refreshToken",
  function (req, res) {
    const refreshTokenFromPost = req.body.refreshToken
    if (refreshToken !== refreshTokenFromPost) {
      res.status(400).send('Bad refresh token!')
    }
    const expTime = req.headers.exp || 60
    const token = generateToken(+expTime)
    refreshToken = generateToken(60 * 60)
    setTimeout(() => {
      res.status(200).send({ token, refreshToken })
    }, 3000)
  }
)
app.get(
  "/protected/:id/:delay?",
  verifyToken,
  (req, res) => {
    const id = req.params.id
    const delay = req.params.delay ? +req.params.delay : 1000
    setTimeout(() => {
      res.status(200).send(`{"message": "protected endpoint ${id}"}`)
    }, delay)
  }
)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.post("/login", (req, res) => {
  const { login, password } = req.body;
  const user = users.find(u => u.login === login && u.password === password);

  if (!user) return res.status(401).send({ message: "Invalid login or password" });

  const token = generateToken(60 * 5, { userId: user.id });
  refreshToken = generateToken(60 * 60, { userId: user.id });

  res.status(200).send({
    token,
    refreshToken
  });
});

app.get("/me", verifyToken, (req, res) => {
  const userId = req.user?.userId;
  const user = users.find(u => u.id === userId);

  if (!user) return res.status(404).send({ message: "User not found" });

  const { password, ...userWithoutPassword } = user;
  res.status(200).send(userWithoutPassword);
});



function generateToken(expirationInSeconds: number, payload: object) {
  const exp = Math.floor(Date.now() / 1000) + expirationInSeconds;
  const token = jwt.sign({ exp, ...payload }, tokenSecret, { algorithm: "HS256" });
  return token;
}


function verifyToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization']
  const token = authHeader?.split(' ')[1]

  if (!token) return res.sendStatus(403)

  jwt.verify(token, tokenSecret, (err: any, user: any) => {
    if (err) {
      console.log(err)
      return res.status(401).send(err.message)
    }
    req.user = user
    next()
  })
}
