import {
  MongoClientOptions,
  MongoClient,
  Filter,
  UpdateFilter,
  UpdateOptions,
  UpdateResult,
  InsertOneResult,
  Collection,
  InsertOneOptions,
  FindOptions,
  FindCursor,
} from "mongodb";
import { RegisterBody } from "../controllers/auth";

// mongo client döndürür

type MongoDBUserRepositoryReturnType = {
  insertOne(user: RegisterBody, opt?: InsertOneOptions | undefined): Promise<InsertOneResult<RegisterBody>>;
  findOne(filter: Filter<RegisterBody>): Promise<RegisterBody | null>;
  updateOne(
    filter: Filter<RegisterBody>,
    update: UpdateFilter<RegisterBody> | Partial<RegisterBody>,
    opt?: UpdateOptions | undefined
  ): Promise<UpdateResult<RegisterBody>>;
  find(filter: Filter<RegisterBody>, opt?: FindOptions<RegisterBody> | undefined): Promise<FindCursor<RegisterBody>>;
  close(): Promise<void>;
};

type RepositoryConfig = {
  db: string;
  collection: string;
};

export const MongoDBUserRepository = (uri: string, config: RepositoryConfig, clientOpt?: MongoClientOptions): MongoDBUserRepositoryReturnType => {
  try {
    const client: MongoClient = new MongoClient(uri, clientOpt);
    const coll: Collection<RegisterBody> = client.db(config.db).collection(config.collection);

    return {
      insertOne: wrapInsertOne(coll),
      findOne: wrapFindOne(coll),
      find: wrapFind(coll),
      updateOne: wrapUpdateOne(coll),
      close: wrapClose(client),
    } as MongoDBUserRepositoryReturnType;
  } catch (err: any) {
    throw err;
  }
};

const wrapInsertOne = (coll: Collection<RegisterBody>): Function => {
  return async (user: RegisterBody, opt?: InsertOneOptions | undefined): Promise<InsertOneResult<RegisterBody>> => {
    return await coll.insertOne(user, opt);
  };
};

const wrapFindOne = (coll: Collection<RegisterBody>): Function => {
  return async (filter: Filter<RegisterBody>): Promise<RegisterBody | null> => {
    return await coll.findOne<RegisterBody>(filter);
  };
};

const wrapFind = (coll: Collection<RegisterBody>): Function => {
  return async (filter: Filter<RegisterBody>, opt?: FindOptions<RegisterBody> | undefined): Promise<FindCursor<RegisterBody>> => {
    return await coll.find<RegisterBody>(filter, opt);
  };
};

const wrapUpdateOne = (coll: Collection<RegisterBody>): Function => {
  return async (
    filter: Filter<RegisterBody>,
    update: UpdateFilter<RegisterBody> | Partial<RegisterBody>,
    opt?: UpdateOptions | undefined
  ): Promise<UpdateResult<RegisterBody>> => {
    return await coll.updateOne(filter, update, opt);
  };
};

const wrapClose = (client: MongoClient): Function => {
  return async (): Promise<void> => await client.close();
};
