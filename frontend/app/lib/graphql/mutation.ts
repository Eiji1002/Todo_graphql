import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!) {
    createUser(name: $name, email: $email) {
      id
      name
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject($name: String!, $userId: Int!) {
    createProject(name: $name, userId: $userId) {
      id
      name
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($title: String!, $projectId: Int!) {
    createTask(title: $title, projectId: $projectId) {
      id
      title
      status
      project {
        id
      }
    }
  }
`;


export const CREATE_SUBTASK = gql`
  mutation CreateSubTask($title: String!, $taskId: Int!) {
    createSubTask(title: $title, taskId: $taskId) {
      id
      title
    }
  }
`;

export const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($taskId: Int!, $status: String!) {
    updateTaskStatus(taskId: $taskId, status: $status) {
      id
      status
    }
  }
`;

