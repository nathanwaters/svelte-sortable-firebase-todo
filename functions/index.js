const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.deleteNewUser = functions.auth.user().onCreate(user => {
  if (user.email === "[YOUR_EMAIL_HERE]") return null;
  admin
    .auth()
    .deleteUser(user.uid)
    .then(function() {
      console.log("Successfully deleted user");
    })
    .catch(function(error) {
      console.log("Error deleting user:", error);
    });
});

exports.resetTodos = functions.pubsub
  .schedule("0 0 * * *") //daily at midnight
  //.schedule("every 1 minutes")
  .timeZone("Australia/Sydney") //change to your timezone
  .onRun(context => {
    let todosRef = admin.firestore().collection("todos");
    return todosRef
      .get()
      .then(snapshot => {
        let batch = admin.firestore().batch();
        snapshot.forEach(doc => {
          let data = doc.data();
          let complete = data.complete;
          switch (data.type) {
            case "repeat":
              let repeatShow =
                data.extra.current + 1 === data.extra.period ? true : false;
              let repeatCurrent = repeatShow ? 0 : data.extra.current + 1;
              batch.update(todosRef.doc(doc.id), {
                complete: false,
                show: repeatShow,
                "extra.current": repeatCurrent
              });
              return;
            case "toggle":
              let toggleIndex = data.extra.current == "odd" ? "even" : "odd";
              batch.update(todosRef.doc(doc.id), {
                complete: false,
                text: data.extra[toggleIndex],
                "extra.current": toggleIndex
              });
              return;
            default:
              if (complete) batch.delete(todosRef.doc(doc.id));
              return;
          }
        });
        return batch.commit();
      })
      .catch(error => {
        console.log(error);
      });
  });
