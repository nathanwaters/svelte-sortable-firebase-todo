<script>
  import { auth, googleProvider } from "./firebase";
  import { authState } from "rxfire/auth";
  import "bulma/css/bulma.min.css";

  import Todos from "./Todos.svelte";

  let user;
  const unsubscribe = authState(auth).subscribe(u => (user = u));

  function login() {
    auth.signInWithPopup(googleProvider);
  }
</script>

<style>
  :global(html),
  :global(body) {
    background-color: #fafafa !important;
  }
  .login {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .login .button {
    border: none;
    background: none;
    outline: none !important;
    box-shadow: none !important;
  }
</style>

{#if user && user.email === '[YOUR_EMAIL_HERE]'}
  <Todos />
{:else}
  <section class="login">
    <button on:click={login} class="button is-large">
      {#if user}🤣{:else}😮{/if}
    </button>
  </section>
{/if}
