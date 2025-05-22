const resolvers = {
    Query: {
      users: async (_, __, { prisma }) =>
        prisma.user.findMany({
          include: {
            projects: {
              include: {
                tasks: {
                  include: {
                    subtasks: true, // ← essentiel
                  },
                },
              },
            },
          },
        }),
       user: async (_, { id }, { prisma }) => prisma.user.findUnique({ where: { id: Number(id) }, include: { projects: true } }),
      usersId: async (_, __, { prisma }) =>
        prisma.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
          },
        }),
        getProjectTasks: async (_, { projectId }, { prisma }) => {
          try {
            const project = await prisma.project.findUnique({
              where: { id: Number(projectId) },
              include: { tasks: true },  // Inclure les tâches associées au projet
            });
        
            // Si aucun projet n'est trouvé, on retourne un tableau vide
            return project ? project.tasks : [];
          } catch (error) {
            console.error('Error fetching project tasks:', error);
            throw new Error('Erreur lors de la récupération des tâches du projet');
          }
        },
        
      },
  
    Mutation: {
      createUser: async (_, args, { prisma }) =>
        prisma.user.create({ data: { name: args.name, email: args.email } }),
  
      createProject: async (_, args, { prisma }) =>
        prisma.project.create({ data: { name: args.name, userId: Number(args.userId) } }),
  
      createTask: async (_, args, { prisma }) => {
        return prisma.task.create({
          data: {
            title: args.title,
            projectId: Number(args.projectId),
            status: args.status || 'todo', // Ajout du statut par défaut 'todo'
            completed: false, // Statut de 'completed' par défaut à false
          },
          include: {
            project: true, // Inclure les informations du projet, si nécessaire
          },
        });
      },
      
      
      createSubTask: async (_, args, { prisma }) =>
        prisma.subTask.create({ data: { title: args.title, taskId: Number(args.taskId) } }),
      updateTaskStatus: async (_, { taskId, status }, { prisma }) => {
        return prisma.task.update({
          where: { id: Number(taskId) },
          data: { status },
        });
      },
      
    },
  };
  
  module.exports = { resolvers };
  