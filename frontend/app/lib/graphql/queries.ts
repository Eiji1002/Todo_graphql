    import { gql } from '@apollo/client';
    export const GET_USERS_ID = gql`
    query GetUsers {
      users {
        id
        name
        email
      }
    }
  `;
  



    export const GET_USERS = gql`
    query GetUsers {
        users {
        id
        name
        projects {
            id
            name
            tasks {
            id
            title
            completed
            subtasks {
                id
                title
                done
            }
            }
        }
        }
    }
    `;


    export const GET_PROJECT_TASKS = gql`
    query GetProjectTasks($projectId: Int!) {
      getProjectTasks(projectId: $projectId) {
        id
        title
        status
        completed
      }
    }
  `;
  
    
