const { makeExecutableSchema } = require('@graphql-tools/schema');
const { resolvers } = require('./resolvers');

const typeDefs = `#graphql

    type Query {
        tasks(Uid: String!): [Task!]!
        CheckUser(_id: ID! password: String!): User
        CheckUserRegistered(_id: ID!): User
    } 

    type Mutation{
        newTask( input: taskInput! Uid:String! userName:String!): Task
        newUser( _id:ID! userName:String! email:String! password:String!): User
        deleteUser (Uid: String! id:[ID!]):Boolean
        getSortedTasks(Uid: String!): [Task!]!
        getNonSortedTasks(Uid: String!): [Task!]!
        getSortedByDone(Uid: String!): [Task!]!
        getSortedByNotDone(Uid: String!): [Task!]!
        updatedTask( id: ID! Uid:String!): Boolean
        deletedTask( id: ID! Uid:String!): Boolean
        deleteAllTasks(id: [ID!]!, Uid: String!): Boolean!
        updatedTitle( id: ID! input: titleInput! Uid:String!): Boolean
    }

    input titleInput{
        name: String!
    }

    input taskInput{
        name: String!
    }

    type Task {
        userName: String!
        Uid: String!
        taskName: String!
        done: Boolean!
        id: ID!
    }


    type User{
        _id: String!
        email:String!
        userName: String!
        password: String!
    }
`
const schema = makeExecutableSchema({ typeDefs, resolvers });
module.exports = {schema}