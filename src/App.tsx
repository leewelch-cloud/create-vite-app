import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import { useAuthenticator } from "@aws-amplify/ui-react"; // 

const client = generateClient<Schema>();

function App() {
  const { user, signOut } = useAuthenticator(); // 
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });

    return () => subscription.unsubscribe(); // 
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  return (
    <main>
      {/* Render the user's username (loginId) in the header */}
      <h1>{user?.signInDetails?.loginId}'s todos</h1>

      {/* Sign out button */}
      {user && (
        <button onClick={signOut}>Sign Out</button>
      )}

      {/* Todo creation button */}
      <button onClick={createTodo}>+ new</button>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id} onClick={() => deleteTodo(todo.id)}>
            {todo.content}
          </li>
        ))}
      </ul>

      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/">Review next &gt;</a>
      </div>
    </main>
  );
}

export default App;

