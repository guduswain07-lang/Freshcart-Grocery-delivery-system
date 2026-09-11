import { db, IUser } from '../config/db.ts';

export const UserModel = {
  find: async (filter: Partial<IUser> = {}) => {
    return db.users.filter(u => {
      for (const key in filter) {
        if ((u as any)[key] !== (filter as any)[key]) return false;
      }
      return true;
    });
  },

  findById: async (id: string) => {
    return db.users.find(u => u._id === id) || null;
  },

  findOne: async (filter: Partial<IUser>) => {
    const list = await UserModel.find(filter);
    return list[0] || null;
  },

  create: async (data: Omit<IUser, '_id' | 'createdAt'>) => {
    const newUser: IUser = {
      _id: 'usr_' + Math.random().toString(36).substr(2, 9),
      ...data,
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    return newUser;
  },

  findByIdAndUpdate: async (id: string, updates: Partial<IUser>) => {
    const userIndex = db.users.findIndex(u => u._id === id);
    if (userIndex === -1) return null;
    db.users[userIndex] = { ...db.users[userIndex], ...updates };
    return db.users[userIndex];
  },

  countDocuments: async (filter: Partial<IUser> = {}) => {
    const list = await UserModel.find(filter);
    return list.length;
  }
};
