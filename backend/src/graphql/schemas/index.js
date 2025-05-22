const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    projects: [Project!]!
  }

  type Project {
    id: ID!
    name: String!
    user: User!
    tasks: [Task!]!
  }

type Task {
  id: ID!
  title: String!
  completed: Boolean!
  status: String!           # ← ajoute ce champ
  project: Project!
  subtasks: [SubTask!]!
}


  type SubTask {
    id: ID!
    title: String!
    done: Boolean!
    task: Task!
  }

  type Query {
    users: [User!]
    usersId: [User!]!
    user(id: ID!): User
    getProjectTasks(projectId: Int!): [Task!]! 
  }

  type Mutation {
    createUser(name: String!, email: String!): User
    createProject(name: String!, userId: Int!): Project
    createTask(title: String!, projectId: Int!): Task
    createSubTask(title: String!, taskId: Int!): SubTask

  updateTaskStatus(taskId: Int!, status: String!): Task 
  }
`;

module.exports = { typeDefs };
