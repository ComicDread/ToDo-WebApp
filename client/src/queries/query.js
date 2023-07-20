import {gql} from '@apollo/client'

export const CHECK_USER = gql`
  query CheckUser($Uid: String!) {
    CheckUser(Uid: $Uid) {
      _id
      userName
    }
  }
`;

export const DELETE_USER = gql`
  mutation deleteUser($id: [ID!]!, $Uid: String!) {
    deleteUser(id: $id, Uid: $Uid)
  }
`;

export const GET_TASKS = gql`
  query tasks($Uid: String!) {
    tasks(Uid: $Uid) {
      userName
      Uid
      taskName
      done
      id
    }
  }
`;

export const ADD_TASK = gql`
  mutation newTask($input: taskInput!, $Uid: String!, $userName: String!) {
    newTask(input: $input, Uid: $Uid, userName: $userName) {
      userName
      Uid
      taskName
      id
    }
  }
`;

export const TASK_DONE = gql`
  mutation updatedTask($id: ID!, $Uid: String!) {
    updatedTask(id: $id, Uid: $Uid) 
  }
`;

export const DELETE_TASK = gql`
  mutation deletedTask($id: ID!, $Uid: String!) {
    deletedTask(id: $id, Uid: $Uid) 
  }
`;

export const UPDATE_TITLE = gql`
mutation newupdatedTitleTask($id: ID!, $input: titleInput!, $Uid: String!) {
  updatedTitle(id: $id, input: $input, Uid: $Uid)
}
`;

export const DELETE_TASKS = gql`
  mutation DeleteAllTasks($id: [ID!]!, $Uid: String!) {
    deleteAllTasks(id: $id, Uid: $Uid)
  }
`;

export const TASK_SORTED = gql`
  mutation getSortedTasks($Uid: String!) {
    getSortedTasks(Uid: $Uid) {
      userName
      Uid
      taskName
      done
      id
    }
  }
`;

export const TASK_SORTED_DESC = gql`
  mutation getNonSortedTasks($Uid: String!) {
    getNonSortedTasks(Uid: $Uid) {
      userName
      Uid
      taskName
      done
      id
    }
  }
`;

export const TASK_SORTED_DONE = gql`
  mutation getSortedByDone($Uid: String!) {
    getSortedByDone(Uid: $Uid) {
      userName
      Uid
      taskName
      done
      id
    }
  }
`;

export const TASK_SORTED_NOT_DONE = gql`
  mutation getSortedByNotDone($Uid: String!) {
    getSortedByNotDone(Uid: $Uid) {
      userName
      Uid
      taskName
      done
      id
    }
  }
`;



