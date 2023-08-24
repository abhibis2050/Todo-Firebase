import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const Todo = () => {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    onSnapshot(collection(db, "todos"), (snapshot) => {
      console.log("snapshot.docs------->", snapshot.docs);
      const newData = snapshot?.docs?.map((doc) => ({
        id: doc?.id,
        ...doc.data(),
      }));
      console.log("newData------->", newData);
      setTodos(newData);
    });
  }, []);

  const handleInputChange = async (e) => {
    setInputValue(e.target.value);
  };

  const handleAddTodos = async () => {
    // console.log(" add todo calling...")
    if (inputValue !== "") {
      await addDoc(collection(db, "todos"), {
        text: inputValue,
        completed: false,
      });
      setInputValue("");
    }
  };
  const handleCompleteTodo = async (id) => {
    const todoRef = doc(db, "todos", id);
    const findTodo = todos.find((todo) => todo.id === id);
    await updateDoc(todoRef, {
      completed: !findTodo.completed,
    });
  };

  const handleRemoveTodo = async (id) => {
    const todoRef = doc(db, "todos", id);
    await deleteDoc(todoRef);
  };

  return (
    <div>
      <div className="text-5xl font-bold">TodoList FireBase</div>
      <div className="space-x-3 mt-5">
        <input
          className="py-4 px-3 text-xl border border-black"
          type="text"
          placeholder="Add Todo"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button
          className="py-4 px-4 bg-orange-600 text-white text-xl"
          onClick={handleAddTodos}
        >
          Add Todo
        </button>
      </div>
      <div className="mx-72 my-4 bg-slate-100">
        <ul>
          {todos.map((todo) => {
            return (
              <>
                <li
                  className=" flex space-x-8 items-center py-2 text-lg px-4"
                  key={todo.id}
                >
                  <div className=" w-[55%] text-left font-medium">{todo?.text}</div>
                  <div className={ `w-[25%] font-medium ${todo?.completed ?"text-green-500":"text-red-600"}`}>
                    {todo?.completed ? "COMPLETED" : "NOT COMPLETE"}
                  </div>
                  <div className=" w-[5%]">
                    <input type="checkbox" onChange={()=>{handleCompleteTodo(todo?.id)}}/>
                  </div>
                  <div
                    className=" text-red-600 w-[5%]"
                    onClick={() => {
                      handleRemoveTodo(todo?.id);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </div>
                </li>
              </>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Todo;
