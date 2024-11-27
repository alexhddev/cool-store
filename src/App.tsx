import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const { signOut, user } = useAuthenticator();
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

    
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id }, {
      authMode: 'userPool'
    
    })
  }

  useEffect(() => {
    const sub = client.models.Todo.observeQuery().subscribe({
      next: ({ items }) => {
        setTodos([...items]);
      },
    });
    return () => sub.unsubscribe();
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") }, {
      authMode: 'userPool'
    });
  }

  return (
    <main>
      <h1>{user?.signInDetails?.loginId} todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (          
          <li 
          onClick={() => deleteTodo(todo.id)}
          key={todo.id}>
            {todo.content}
            </li>
        ))}
      </ul>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
