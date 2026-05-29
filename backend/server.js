import exp from 'express'
import { config } from 'dotenv'
import { connect } from 'mongoose'

import { commonApp } from './APIS/commonAPI.js'
import { userApp } from './APIS/userAPI.js'
import { adminApp } from './APIS/adminAPI.js'

import cookieParser from 'cookie-parser'
import cors from 'cors'

config()

const app = exp()

// ─────────────────────────────
// MIDDLEWARES
// ─────────────────────────────

app.use(cors({
  origin: ['http://localhost:5173',"https://pharma-atlas.vercel.app"],
  credentials: true
}))

app.use(exp.json())

app.use(cookieParser())

// ─────────────────────────────
// ROUTES
// ─────────────────────────────

app.use('/common-api', commonApp)

app.use('/user-api', userApp)

app.use("/admin-api", adminApp)

// ─────────────────────────────
// DB CONNECTION
// ─────────────────────────────

async function connectDB() {

  try {

    await connect(process.env.DB_URL)

    console.log('Successfully Connected to DB')

    app.listen(process.env.PORT, () => {

      console.log(
        `Server is up and listening to ${process.env.PORT}`
      )
    })

  } catch (err) {

    console.log('Error while connecting to DB')
  }
}

connectDB()

// ─────────────────────────────
// INVALID PATH
// ─────────────────────────────

app.use((req, res, next) => {

  res.json({
    message: `${req.url} is Invalid path`
  })
})

// ─────────────────────────────
// ERROR HANDLER
// ─────────────────────────────

app.use((err, req, res, next) => {

  console.log("Error name:", err.name)
  console.log("Error code:", err.code)
  console.log("Full error:", err)

  // mongoose validation error
  if (err.name === "ValidationError") {

    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    })
  }

  // mongoose cast error
  if (err.name === "CastError") {

    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    })
  }

  const errCode =
    err.code ??
    err.cause?.code ??
    err.errorResponse?.code

  const keyValue =
    err.keyValue ??
    err.cause?.keyValue ??
    err.errorResponse?.keyValue

  if (errCode === 11000) {

    const field = Object.keys(keyValue)[0]

    const value = keyValue[field]

    return res.status(409).json({
      message: "error occurred",
      error: `${field} ${value} already exists`,
    })
  }

  // custom errors
  if (err.status) {

    return res.status(err.status).json({
      message: "error occurred",
      error: err.message,
    })
  }

  // default server error
  res.status(500).json({
    message: "error occurred",
    error: "Server side error",
  })
})