# Project Name

​Talk-in api

## Description

Api for the talk-in app.

## Routes

| Log In                 | GET    | /login                    |
| ---------------------- | ------ | ------------------------- |
| Auth                   | GET    | /me                       |
| Login                  | POST   | /login                    |
| Logout                 | GET    | /logout                   |
| SignUp                 | POST   | /signup                   |
| Abandon                | GET    | /abandon                  |
| User Profile           | GET    | /users/:id                |
| ---------------------- | ------ | ------------------------- |

## Models

USERS:

userName: { type: String, required: true }, 

lastName: { type: String, default: '' },

hashedPassword: { type: String, required: true },

email: { type: String, require: true, unique: true },

avatar: { type: String, default: '' },

city: { type: String, default: '' },

age: { type: Number, default: 0 },

active: Boolean,

rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],

themes: [String],

distanceFromMe: Number,

location: {

type: {

type: String,

enum: ['Point'], // 'location.type' must be 'Point'

},

coordinates: {

type: [Number],

},

},


ROOMS:

roomName: { type: String, required: true },

description: { type: String, required: true },

location: {

type: {

type: String,

enum: ['Point'],

required: true,

},

coordinates: {

type: [Number],

required: true,

},

},

adminList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

userAdmitList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

userBanList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

avatar: {

type: String,

default: 'https://engineering.fb.com/wp-content/uploads/2009/02/chat.jpg',

},

city: { type: String },

chat: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom' },

privateRoom: { type: Boolean, default: false },

numMaxUser: Number,

theme: String,

language: String,

activeUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

participatedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

filter: {

single: Boolean,

family: Boolean,

pet: Boolean,

},

},


CHATS:

conversation: [

{

user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

text: String,

created: {

type: Date,

default: () => Date.now(),

},

},

],

PRIVATE CHATS:

userChat01: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

userChat02: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

status: {

type: String,

enum: ['pending', 'active', 'finished', 'refused'],

default: 'pending',

},

conversation: [

{

user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

text: String,

created: {

type: Date,

default: () => Date.now(),

},

},

],

## Links

The url to your repository and to your deployed project

[Repository Frontend Link](https://github.com/hellograndpa/chat-app-frontend)

[Repository Backend Link](https://github.com/hellograndpa/chat-app-backend)

[Deploy Link](https://www.talk-in.me/)


### Slides


[Slides Link](https://slides.com/antoniorivera-1/talk-in-me/fullscreen)
