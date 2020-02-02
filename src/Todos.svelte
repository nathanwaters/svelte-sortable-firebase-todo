<script>
  import { db } from "./firebase";
  import { collectionData } from "rxfire/firestore";
  import { startWith } from "rxjs/operators";

  import TodoList from "./TodoList.svelte";

  const query = db
    .collection("todos")
    .where("show", "==", true)
    .orderBy("complete")
    .orderBy("position");
  const todos = collectionData(query, "id").pipe(startWith([]));

  function handleChange(event) {
    let fromList = event.detail.from.id;
    let fromIndex = event.detail.oldIndex;
    let toList = event.detail.to.id;
    let toIndex = event.detail.newIndex;
    let currentTodo = $todos.filter(x => x.group === fromList)[fromIndex];
    let todos = $todos.filter(x => x.group === toList);

    //insert or reorder
    if (fromList !== toList) {
      todos.splice(toIndex, 0, {
        ...currentTodo,
        group: toList
      });
    } else {
      todos.splice(toIndex, 0, todos.splice(fromIndex, 1)[0]);
    }

    //batch update firestore
    let batch = db.batch();
    todos.forEach((todo, index) => {
      batch.update(db.collection("todos").doc(todo.id), {
        position: index,
        group: toList
      });
    });
    batch.commit();
  }
</script>

<style>
  .container {
    overflow-x: hidden;
    padding: 15px;
  }
  .column {
    padding: 0 0.75em;
  }
  .column:last-child {
    border-left: 1px solid #eee;
  }
  .title {
    margin-top: 20px;
    margin-bottom: 20px !important;
    background-color: #f9fc9d;
    padding: 5px 10px;
    display: inline-block;
  }
  .yay {
    font-size: 24px;
    padding: 20px;
    text-align: center;
  }
  @media screen and (min-width: 769px) {
    .yay > span {
      display: none;
    }
  }
</style>

<div class="container">
  <div class="columns is-variable is-8">
    <div class="column is-one-half-tablet is-two-thirds-desktop">
      <h1 class="title is-size-6-mobile is-size-5-tablet">Today</h1>
      <TodoList
        on:sort={handleChange}
        showAdd={true}
        todos={$todos.filter(x => x.group === 'today')}
        group="today" />
    </div>
    <div class="column is-one-half-tablet is-one-third-desktop">
      <h1 class="title is-size-6-mobile is-size-5-tablet">Soon</h1>
      <TodoList
        on:sort={handleChange}
        todos={$todos.filter(x => x.group === 'soon')}
        group="soon" />
      <h1 class="title is-size-6-mobile is-size-5-tablet">Later</h1>
      <TodoList
        on:sort={handleChange}
        todos={$todos.filter(x => x.group === 'later')}
        group="later" />
      <div class="yay">
        <span>🤠</span>
      </div>
    </div>
  </div>
</div>
