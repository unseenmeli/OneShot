import { i } from '@instantdb/core';

const schema = i.schema({
  entities: {
    users: i.entity({
      email: i.string(),
      password: i.string(),
      createdAt: i.number(),
    }),
    apps: i.entity({
      name: i.string(),
      description: i.string().optional(),
      image: i.string().optional(),
      userId: i.string(),
      createdAt: i.number(),
    }),
  },
});

export default schema;