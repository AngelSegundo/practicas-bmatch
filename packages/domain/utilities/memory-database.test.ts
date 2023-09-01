import { BaseEntity } from "../entities/base";
import { QuerySearchTypes } from "../interfaces";
import { MemoryDatabase } from "./memory-database";

const now = new Date().toISOString();

const tableName = "test";
interface TestEntityDTO extends BaseEntity {
  name: string;
  role: string;
}

describe("MemoryDatabase", () => {
  let database: MemoryDatabase;

  describe("basics", () => {
    beforeAll(() => {
      database = new MemoryDatabase();
    });

    test("should be empty on initialization", async () => {
      const result = await database.getAll(tableName);
      expect(result).toEqual([]);
    });

    test("should create an item", async () => {
      const item: TestEntityDTO = {
        id: "1",
        name: "John Doe",
        role: "admin",
        createdAt: now,
        updatedAt: now,
      };
      const result = await database.create<TestEntityDTO>(tableName, item);
      expect(result).toEqual(item);
      const searchedItem = await database.getById(tableName, item.id);
      expect(searchedItem).toEqual(item);
    });

    test("should update an item", async () => {
      const item: TestEntityDTO = {
        id: "1",
        name: "John Doe",
        role: "admin",
        createdAt: now,
        updatedAt: now,
      };
      const updatePayload = {
        name: "Smith Smithson",
        role: "manage",
      };
      const updatedItem = { ...item, ...updatePayload };

      const result = await database.update<TestEntityDTO>(
        tableName,
        item.id,
        updatePayload
      );
      expect(result).toEqual({ ...item, ...updatePayload });
      const searchedItem = await database.getById(tableName, item.id);
      expect(searchedItem).toEqual(updatedItem);
    });

    test("should delete an item", async () => {
      const itemId = "1";
      const result = await database.delete<TestEntityDTO>(tableName, itemId);
      expect(result.id).toEqual(itemId);
      const searchedItems = await database.getAll(tableName);
      expect(searchedItems).toEqual([]);
    });

    test("should store multiple items of mulltiple collections", async () => {
      const item1: TestEntityDTO = {
        id: "1",
        name: "John Doe",
        role: "admin",
        createdAt: now,
        updatedAt: now,
      };
      const item2: TestEntityDTO = {
        id: "2",
        name: "Jane Doe",
        role: "user",
        createdAt: now,
        updatedAt: now,
      };
      const item3: TestEntityDTO = {
        id: "3",
        name: "John Smith",
        role: "admin",
        createdAt: now,
        updatedAt: now,
      };
      await database.create<TestEntityDTO>(tableName, item1);
      await database.create<TestEntityDTO>(tableName, item2);
      await database.create<TestEntityDTO>("otherCollection", item3);
      const collection1Items = await database.getAll<TestEntityDTO>(tableName);
      const collection2Items = await database.getAll<TestEntityDTO>(
        "otherCollection"
      );
      expect(collection1Items).toEqual([item1, item2]);
      expect(collection2Items).toEqual([item3]);
    });
  });

  describe("querying", () => {
    const item1: TestEntityDTO = {
      id: "1",
      name: "John Doe",
      role: "admin",
      createdAt: now,
      updatedAt: now,
    };
    const item2: TestEntityDTO = {
      id: "2",
      name: "John Doe",
      role: "user",
      createdAt: now,
      updatedAt: now,
    };
    const item3: TestEntityDTO = {
      id: "3",
      name: "John Smith",
      role: "admin",
      createdAt: now,
      updatedAt: now,
    };

    beforeAll(async () => {
      database = new MemoryDatabase();
      await database.create<TestEntityDTO>(tableName, item1);
      await database.create<TestEntityDTO>(tableName, item2);
      await database.create<TestEntityDTO>(tableName, item3);
    });

    test("should return all items if no query is passed", async () => {
      const result = await database.find<TestEntityDTO>(tableName, []);
      expect(result).toEqual([item1, item2, item3]);
    });

    test("should query by simple filter", async () => {
      const result = await database.find<TestEntityDTO>(tableName, [
        {
          fieldName: "role",
          searchType: QuerySearchTypes.EQUALS,
          value: "admin",
        },
      ]);
      expect(result).toEqual([item1, item3]);
    });

    test("should query by multiple filters", async () => {
      const result = await database.find<TestEntityDTO>(tableName, [
        {
          fieldName: "role",
          searchType: QuerySearchTypes.EQUALS,
          value: "admin",
        },
        {
          fieldName: "name",
          searchType: QuerySearchTypes.EQUALS,
          value: "John Doe",
        },
      ]);
      expect(result).toEqual([item1]);
    });
  });
});

export {};
