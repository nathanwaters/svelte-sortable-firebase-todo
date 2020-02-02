# Svelte Todos Sortable App

The ultimate act of procrastination: building a custom personal todos/goals dashboard! 🤨

## Features

* Login with Google auth to accept only _your_ Gsuite/Gmail email.
* Add, [sort/drag](https://github.com/solidsnail/svelte-sortablejs), mark complete, delete and group todos.
* Lightweight PWA app less than ~500KB.
* Firestore realtime database using [RxFire](https://github.com/firebase/firebase-js-sdk/tree/master/packages/rxfire).
* Firebase function resets todos daily at midnight.
* Repeat a todo: "r name of todo [optional # days to repeat]".
* Toggle a todo: "t todo one OR todo two".

Heavily modified from this tutorial: https://fireship.io/lessons/svelte-v3-overview-firebase

There are room for improvements everywhere and I won't be supporting or updating this repo, so please fork and modify to suit your own needs 😃

## Initial Setup

1. Create a new [Firebase](https://console.firebase.google.com/) project, and copy your credentials into `src/firebase.js`

```js
var firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};
```

2. In the Firebase console go to `Authentication` in the sidebar, select `Sign-in method` tab and enable `Google`.

3. Go to `Database` in the sidebar, create a new Firestore database with a `todos` collection. The fields will eventually look like this:

![Firestore Fields](/docs/img/fields.png)

4. In the `Rules` tab, copy this in:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth.token.email == '[YOUR_EMAIL_HERE]'
    }
  }
}
```

5. In the `Indexes` tab create a new composite index like so:

![Firestore Index](/docs/img/index.png)

6. Add your email in `src/App.svelte`

```js
{#if user && user.email === '[YOUR_EMAIL_HERE]'}
```

## Fire It Up

1. Open a terminal and install dependencies

```bash
cd svelte-sortable-firebase-todo
npm install
```

2. Start the app with [Rollup](https://rollupjs.org)

```bash
npm run dev
```

3. Navigate to [localhost:5000](http://localhost:5000)

4. See if you can login and add/drag/delete todos.

5. Oh gawd, oh no, plz no, why, why, just why 😱

6. If it doesn't work, check the console. Could be a domain whitelist issue in Firebase.

## Setup Firebase Functions

There are two [Firebase cloud functions](https://firebase.google.com/docs/functions/get-started): one that removes any new user registrations that aren't you, and one that resets the todos daily at midnight.

1. Add your email in `functions/index.js`

```js
if (user.email === "[YOUR_EMAIL_HERE]") return null;
```

2. Also add your timezone

```js
.timeZone("Australia/Sydney") //change to your timezone
```

3. Open a terminal and install dependencies

```bash
cd svelte-sortable-firebase-todo/functions
npm install
```

4. Install the [Firebase CLI](https://firebaseopensource.com/projects/firebase/firebase-tools/)

```bash
npm install -g firebase-tools
```

4. Login and deploy

```bash
firebase login
```

```bash
firebase deploy --only functions
```

5. In the Firebase console you should see the two functions listed under `Functions` in the sidebar.

6. To test this all works: try login with a different email address. The user should be created and then automatically deleted under `Authentication` in the Firebase console.

7. Also uncomment this line and redeploy the functions to test todo reset every 30 seconds:

```js
.schedule("every 30 seconds")
```

## Deploying To The Web

### With [netlify](https://www.netlify.com)

Install `netlify` if you haven't already:

```bash
npm install netlify-cli -g
```

Then, from within your project folder:

```bash
npm run build
netlify deploy
```

### With [now](https://zeit.co/now)

Install `now` if you haven't already:

```bash
npm install -g now
```

Then, from within your project folder:

```bash
cd public
now deploy --name my-project
```

### With [surge](https://surge.sh)

Install `surge` if you haven't already:

```bash
npm install -g surge
```

Then, from within your project folder:

```bash
npm run build
surge public my-project.surge.sh
```
