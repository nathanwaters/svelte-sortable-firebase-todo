<script>
  import { createEventDispatcher } from "svelte";
  import { db } from "./firebase";

  import Sortable from "svelte-sortablejs";
  import TodoItem from "./TodoItem.svelte";

  const dispatch = createEventDispatcher();

  let text = "";
  export let todos;
  export let group = "today";
  export let showAdd = false;

  let options = {
    draggable: ".todo",
    filter: ".complete",
    group: "shared",
    delay: 200,
    onEnd: e => dispatch("sort", e)
  };

  function add() {
    let extra = [];
    let type = (() => {
      switch (text.substr(0, 2)) {
        case "r ":
          let repeatMatch = text.match(/(.*)(\d+$)/);
          let repeatPeriod = repeatMatch ? repeatMatch[2] : 1;
          text =
            repeatMatch && repeatMatch[1]
              ? repeatMatch[1].substr(2).trim()
              : text.substr(2);
          extra = {
            current: 0,
            period: parseInt(repeatPeriod)
          };
          return "repeat";
        case "t ":
          let toggleText = text.substr(2).split(" or ");
          text = toggleText[0];
          extra = {
            current: "odd",
            odd: toggleText[0],
            even: toggleText[1]
          };
          return "toggle";
        default:
          return "regular";
      }
    })();

    db.collection("todos").add({
      text,
      group,
      type,
      extra,
      complete: false,
      show: true,
      position: todos.length
    });
    text = "";
  }

  function toggle(event) {
    const { id, newStatus } = event.detail;
    db.collection("todos")
      .doc(id)
      .update({ complete: newStatus });
  }

  function remove(event) {
    const { id } = event.detail;
    db.collection("todos")
      .doc(id)
      .delete();
  }
</script>

<style>
  .todolist {
    border: 1px solid #eee;
    border-radius: 5px;
    overflow: hidden;
  }
  .todolist > :global(.svelte-sortable) {
    min-height: 100px;
  }
  .input {
    margin-bottom: 15px;
    height: 50px;
    font-weight: 600;
  }
  @media screen and (min-width: 769px) {
    .input {
      height: 60px;
      margin-bottom: 20px;
    }
  }
</style>

{#if showAdd}
  <form on:submit|preventDefault={add}>
    <input
      type="text"
      bind:value={text}
      placeholder="What's next?"
      class="input is-size-6-mobile is-size-5-tablet" />
  </form>
{/if}

<div class="todolist">
  <Sortable id={group} {options}>
    {#each todos as todo}
      <TodoItem
        id={todo.id}
        text={todo.text}
        complete={todo.complete}
        showCheckbox={todo.group == 'today' ? false : true}
        on:remove={remove}
        on:toggle={toggle}
        {group} />
    {/each}
  </Sortable>
</div>
