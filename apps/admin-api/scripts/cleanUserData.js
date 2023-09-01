const admin = require("firebase-admin");

var serviceAccount = require("../service-account-key.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bmatch-dev.firebaseio.com",
});

const auth = app.auth();

const USER_UID = "WrhkkjXA1QTj0iW3cObM9LHJ27H3"; // adri
// const USER_UID = "LxDrChlTdOYs5q78mdkBigahBC43"; // fran
// const USER_UID = "WH9dmJ6mhFbmUU1mOQJkH2sZgV23"; // alex


(async () => {
  const db = app.firestore();
  const readingsRef = db.collection("readings");
  const readingsQuery = readingsRef.where("userId", "==", USER_UID);
  const readingsSnapshot = await readingsQuery.get();

  const batch = db.batch();
  readingsSnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });

  const serviceConnectionsRef = db.collection("connections");
  const serviceConnectionsQuery = serviceConnectionsRef.where(
    "userId",
    "==",
    USER_UID
  );

  const serviceConnectionsSnapshot = await serviceConnectionsQuery.get();
  serviceConnectionsSnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
})();
