# Svelte Todos Sortable App

The ultimate act of procrastination: building a custom personal todos/goals dashboard! 🤨

![Todos App](/docs/img/app.png)

## Features

* Login with Google auth to accept only _your_ Gsuite/Gmail email.
* Add, [sort/drag](https://github.com/solidsnail/svelte-sortablejs), mark complete, delete and group todos.
* Sortable works on mobile (rarity in Svelteland).
* Lightweight PWA app (half-arsed, only tested on Android).
* Firestore realtime database using [RxFire](https://github.com/firebase/firebase-js-sdk/tree/master/packages/rxfire).
* Firebase function resets todos daily at midnight.
* Repeat a todo: `r repeat me daily` or `r show me every other day 2`.
* Toggle a todo: `t dig a hole OR fill the hole`.

Heavily modified from this tutorial: https://fireship.io/lessons/svelte-v3-overview-firebase

There are room for improvements everywhere and I won't be supporting or updating this repo, so please fork and modify to suit your own needs 😃

## Initial Setup

1. Add your email in `src/App.svelte`

```js
{#if user && user.email === '[YOUR_EMAIL_HERE]'}
```

2. Create a new [Firebase](https://console.firebase.google.com/) project, then create a new web app and copy your credentials into `src/firebase.js`

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

3. In the Firebase console go to `Authentication` in the sidebar, select `Set up sign-in method` tab and enable `Google`.

4. Go to `Database` in the sidebar, create a new Firestore database, then start a new `todos` collection. Click `Auto-ID`, save, then delete that document. Eventually the fields will look like this:

![Firestore Fields](/docs/img/fields.png)

5. Upgrade your Firebase project plan to `Blaze`. This is required for scheduled functions: USD$0.10 per month.

6. Add your email in `functions/firestore.rules`:

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

7. Add your email in `functions/index.js`

```js
if (user.email === "[YOUR_EMAIL_HERE]") return null;
```

8. Also configure your timezone

```js
.timeZone("Australia/Sydney") //change to your timezone
```

9. Open a terminal and install dependencies

```bash
cd svelte-sortable-firebase-todo/functions
npm install
```

10. Install the [Firebase CLI](https://firebaseopensource.com/projects/firebase/firebase-tools/)

```bash
npm install -g firebase-tools
```

11. Login to Firebase

```bash
firebase login
```

12. Select the active Firebase project

```bash
firebase use --add
```

13. Deploy to Firebase

```bash
firebase deploy
```

14. In the Firebase console you should see the two functions listed under `Functions` in the sidebar. Also you should see the `Rules` and `Indexes` tabs within `Database` have been updated.

15. You'll need to wait a few minutes for the index to be built.

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

4. See if you can login (click the 😮) and add/drag/delete todos. Hold down to start drag.

5. "Oh gawd, oh no, plz no, why, why, just why" 😱

6. If it doesn't work, check the console. Could be a domain whitelist issue in Firebase.

## Deploying To The Web

** Note: be sure to add the domain to the whitelist in Firebase console and/or [Google Cloud console](https://console.cloud.google.com/apis/credentials).

### With [now](https://zeit.co/now)

Install `now` if you haven't already:

```bash
npm install -g now
```

Then, from within your project folder:

```bash
npm run build
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
