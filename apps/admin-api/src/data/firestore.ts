import { BaseEntity } from "domain/entities/base";
import { Database, Query } from "domain/interfaces";
import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore();

export class FirestoreDatabase implements Database {
  async getAll<T>(tableName: string): Promise<(T & BaseEntity)[]> {
    const collection = db.collection(tableName);
    const snapshot = await collection.get();
    return snapshot.docs.map((doc) => doc.data() as T & BaseEntity);
  }

  async getById<T>(tableName: string, id: string): Promise<T & BaseEntity> {
    const collection = db.collection(tableName);
    const snapshot = await collection.doc(id).get();
    return snapshot.data() as T & BaseEntity;
  }

  async find<T>(tableName: string, query: Query<T>): Promise<T[]> {
    const collection = db.collection(tableName);
    let searchQuery:
      | FirebaseFirestore.Query<FirebaseFirestore.DocumentData>
      | FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> =
      collection;
    if (query.length > 0) {
      query.forEach((filter) => {
        searchQuery = searchQuery.where(
          filter.fieldName as string,
          filter.searchType,
          filter.value
        );
      });
    }
    const documents = await searchQuery.get();
    return documents.docs.map((doc) => doc.data() as T);
  }

  async create<T extends BaseEntity>(tableName: string, item: T): Promise<T> {
    const collection = db.collection(tableName);
    const documentRef = collection.doc(item.id);
    await documentRef.set(item);
    return item;
  }

  async update<T extends BaseEntity>(
    tableName: string,
    id: string,
    payload: Partial<Omit<T, "id" | "createdAt" | "udpatedAt">>
  ): Promise<T> {
    const collection = db.collection(tableName);
    const documentRef = collection.doc(id);
    await documentRef.update({ ...(payload as { [key: string]: any }) });
    return this.getById<T>(tableName, id);
  }

  async delete(tableName: string, id: string): Promise<void> {
    const collection = db.collection(tableName);
    const documentRef = collection.doc(id);
    await documentRef.delete();
    return;
  }
}
