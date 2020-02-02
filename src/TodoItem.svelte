<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let id, text, complete, group, showCheckbox;

  function remove() {
    dispatch("remove", { id });
  }

  function toggle() {
    let newStatus = !complete;
    dispatch("toggle", {
      id,
      newStatus
    });
  }
</script>

<style>
  li {
    display: flex;
    cursor: grab;
    text-transform: lowercase;
    padding: 10px;
    min-height: 50px;
    align-items: center;
    border-bottom: 1px solid #eee;
    justify-content: space-between;
    position: relative;
    background: #ffffff;
  }
  li:hover,
  .remove:hover {
    background: #eaf7fb;
  }
  .complete {
    opacity: 0.5;
  }
  .title {
    margin: 0;
    line-height: 1.5;
    display: inline-block;
  }
  .complete .title {
    text-decoration: line-through;
    color: green;
  }
  .checkbox {
    margin-right: 5px;
  }
  .remove {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 60px;
    text-align: right;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .remove:hover .button {
    display: inline-block;
  }
  .button,
  .hide {
    font-size: 12px;
    font-weight: 900;
    display: none;
  }
  .soon {
    border-left: 5px solid #baf3c3;
  }
  .later {
    border-left: 5px solid #d9b2ff;
  }
  @media screen and (min-width: 769px) {
    li {
      min-height: 60px;
      padding: 15px;
    }
    .remove {
      width: 70px;
    }
  }
</style>

<li class={`todo ${group}`} on:click={toggle} class:complete>
  <h2 class="title is-size-6-mobile is-size-5-tablet">
    <span class="checkbox" class:hide={showCheckbox}>
      {#if complete}✅{:else}⚪{/if}
    </span>
    {text}
  </h2>
  <div class="remove">
    <button class="button is-danger" on:click={remove}>X</button>
  </div>
</li>
