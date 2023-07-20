const { client } = require('./connections/elasticSearch');
const User = require('./models/users')
const bcrypt = require('bcrypt') 

const resolvers = {
  Query: {
    tasks: async (parent, {Uid}, context, info) => {
      const result = await client.search({
        index: 'tasks',
        body: {
          query: {
            bool: {
              must: [
                { match: { Uid } }, 
              ]
            }
          },
          size:1000
        }
      })
      const tasks = result.hits.hits.map((hit) => {
        const task = hit._source;
        task.id = hit._id; 
        return task;
      });
  
      return tasks;
    },
    CheckUser: async (parent, { _id, password }, context, info) => {
      const user = await User.findOne({ _id});
      const isMatch = await bcrypt.compare( password, user.password);
      if(isMatch) return user;
    },
    CheckUserRegistered: async (parent, { _id, }, context, info) => {
      const user = await User.findOne({ _id});
      return user
    },
  },
  Mutation: {  
    updatedTitle: async (parent, { id, input }, context, info) => {
      const newName = input.name;
      await client.update({
        index: 'tasks',
        id: id,
        body: {
          doc: {
            taskName: newName
          }
        }
      });
    },

    deleteUser: async (parent, { Uid, id }, context, info) => {
      await User.deleteOne({ _id: Uid });
      const deletePromises = id.map(async (taskId) => {
        await client.delete({
          index: 'tasks',
          id: taskId,
          body: {
            query: {
              bool: {
                must: [
                  { match: { Uid } },
                ]
              }
            }
          }
        });
      });
      await Promise.all(deletePromises);
      return true;
    },
    
    deletedTask: async (parent, { id }, context, info) => {
      await client.delete({
        index: 'tasks',
        id: id,
      });
    },

    deleteAllTasks: async (parent, { Uid, id }, context, info) => {
      const deletePromises = id.map(async (taskId) => {
        await client.delete({
          index: 'tasks',
          id: taskId,
          body: {
            query: {
              bool: {
                must: [
                  { match: { Uid } },
                ]
              }
            }
          }
        });
      });
      await Promise.all(deletePromises);
      return true;
    },
       
    updatedTask: async (parent, { id }, context, info) => {
      const task = await client.get({
        index: 'tasks',
        id: id
      });

      await client.update({
        index: 'tasks',
        id: id,
        body: {
          doc: {
            done: !task._source.done
          }
        }
      });
    },

    newTask: async (parent, { input, Uid, userName }, context, info) => {
      const newTask = {
        userName: userName,
        Uid:Uid,
        taskName: input.name,
        done: false,
      };
    
      const result = await client.index({
        index: 'tasks',
        body: newTask
      });
    
      const taskId = result._id;
      
      return {
        ...newTask,
        id: taskId,
      };
    },
    
    newUser: async (parent, { _id, userName, email, password }, context, info) => {
      const hash = await bcrypt.hash(password,10)
      const newUser = new User ({
        _id:_id,
        userName: userName,
        email:email,
        password:hash
      });
      await newUser.save();
      return newUser;
    },

    getSortedTasks: async (parent, { Uid }, context, info) => {
      const result = await client.search({
        index: 'tasks',
        body: {
          query: {
            bool: {
              must: [
                { match: { Uid } },
              ]
            }
          },
          size: 1000,
          sort: [{ "taskName.keyword": "asc" }]
        }
      });
    
      const sortedTasks = result.hits.hits.map((hit) => {
        const task = hit._source;
        task.id = hit._id;
        return task;
      })
      return sortedTasks;
    },    

    getNonSortedTasks: async (parent, { Uid }, context, info) => {
      const result = await client.search({
        index: 'tasks',
        body: {
          query: {
            bool: {
              must: [
                { match: { Uid } },
              ]
            }
          },
          size: 1000,
          sort: [{ "taskName.keyword": "desc" }]
        }
      });

      const sortedTasks = result.hits.hits.map((hit) => {
        const task = hit._source;
        task.id = hit._id;
        return task;
      });
      return sortedTasks;
    },

    getSortedByDone: async (parent, { Uid }, context, info) => {
      const result = await client.search({
        index: 'tasks',
        body: {
          query: {
            bool: {
              must: [
                { match: { Uid } },
              ]
            }
          },
          size: 1000,
          sort: [
            { "done": { "order": "desc" } },
            { "taskName.keyword": "desc" }
          ]
        }
      });
    
      const sortedTasks = result.hits.hits.map((hit) => {
        const task = hit._source;
        task.id = hit._id;
        return task;
      });
      return sortedTasks;
    },

    getSortedByNotDone: async (parent, { Uid }, context, info) => {
      const result = await client.search({
        index: 'tasks',
        body: {
          query: {
            bool: {
              must: [
                { match: { Uid } },
              ]
            }
          },
          size: 1000,
          sort: [
            { "done": { "order": "asc" } },
            { "taskName.keyword": "desc" }
          ]
        }
      });
    
      const sortedTasks = result.hits.hits.map((hit) => {
        const task = hit._source;
        task.id = hit._id;
        return task;
      });
      return sortedTasks;
    },    
  }
}
module.exports = { resolvers };
