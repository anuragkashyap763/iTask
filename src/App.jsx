import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const [todo, setTodo] = useState(""); //this is the todo which we are typing in the text field
  const [todos, setTodos] = useState([]);
  const [showFinished, setShowFinished] = useState(false); //✅ new state for "Show finished todos" checkbox

  // const [id, setId] = useState(1); //❌ removed manual id generation since we are now using uuidv4()

  useEffect(() => {
    console.log("Todos updated:", todos);
  }, [todos]); //this prints todos array everytime it gets updated

  useEffect(() => {
    let todoString = localStorage.getItem("todos"); //here 'getItem("todos")' todos is written because it is stored in localStorage as key value pair where key  is "todos"
    if (todoString) {
      let todos = JSON.parse(localStorage.getItem("todos"));
      setTodos(todos);
    }
  }, []); //for retrieving from local storage

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]); //for updating todos in localStorage everytime there is a change in 'todos' state

  // const saveToLS = () => {
  //   localStorage.setItem("todos",JSON.stringify(todos))
  // }

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleAdd = (e) => {
    //console.log(e.target.value)
    if (todo.trim() === "") {
      return;
    } else {
      setTodos([
        ...todos,
        { todo, isCompleted: false, id: uuidv4(), animating: false },
      ]); //✅ replaced manual id with uuidv4()
      setTodo(""); //✅ clears the input after saving
      //saveToLS()
    }

    //[...todos, {...}] This makes a new array with all the old todos plus the new one.
    //setTodos([...todos, {todo, isCompleted:false}]) -> explaination is :

    /*
    Before clicking “Add”:
    todos = [{ todo: "Learn React", isCompleted: false }] :original todos array
    todo = "Build Todo App" //typing in the text field

    Before clicking “Add”:
    setTodos([
        ...todos, // → [{ todo: "Learn React", isCompleted: false }]
        { todo, isCompleted: false } // → { todo: "Build Todo App", isCompleted: false }]) */
  };

  const handleCheckbox = (e) => {
    let id = e.target.name; //✅ uuid is a string, so no need to convert to Number

    // Step 1: Trigger fade-out animation
    setTodos((prev) =>
      prev.map((item) => (item.id === id ? { ...item, animating: true } : item))
    );

    // Step 2: Wait for animation to complete, then mark as completed
    setTimeout(() => {
      setTodos((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, isCompleted: !item.isCompleted, animating: false }
            : item
        )
      );
    }, 400); // matches the CSS transition duration
  };

  const handleEdit = (e) => {
    const id = e.target.name; //✅ uuid is a string
    const t = todos.filter((item) => item.id === id);
    console.log(t[0].todo);
    setTodo(t[0].todo); //this will create an array of todo which will have only one element, thats why t[0].todo

    //once edit is clicked that item gets deleted from the todos array and wehn you save it it again appears
    const updatedTodos = todos.filter((item) => item.id !== id);
    setTodos(updatedTodos);
  };

  const handleDelete = (e) => {
    let a = confirm("Are you sure , You want to delete this todo?");
    if (a == true) {
      const id = e.target.name; //✅ uuid is a string

      // keep only the todos whose id doesn't match, filter creates a new array excluding whose id matches the given id, filter() is used in react to delete items from array
      const updatedTodos = todos.filter((item) => item.id !== id);

      setTodos(updatedTodos);
    }
  };

  //✅ new handler for "Show finished todos" checkbox
  const handleShowFinishedToggle = (e) => {
    setShowFinished(e.target.checked);
  };

  return (
    <>
      <Navbar />

      <div className="container mx-auto my-5 rounded-xl p-5 bg-violet-200 min-h-[80vh] flex flex-col overflow-hidden">
        {/* ✅ Add Todo Section */}
        <div className="addTodo w-full mb-5">
          <h2 className="text-lg font-bold mb-3">Add a Todo</h2>

          {/* ✅ Input + Save in one line (responsive flex) */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              className="bg-white p-2 rounded-full w-full sm:w-3/4 md:w-2/3"
              type="text"
              onChange={handleChange}
              value={todo}
              placeholder="Enter Your Task"
            />
            <button
              className="bg-violet-800 text-white rounded-lg p-3 py-1 hover:bg-violet-900 hover:font-bold transition-all w-full sm:w-auto"
              value={todo}
              onClick={handleAdd}
            >
              Save
            </button>
          </div>
        </div>

        {/* ✅ Show Finished Todos Toggle */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="showFinished"
            checked={showFinished}
            onChange={handleShowFinishedToggle}
            className="cursor-pointer w-5 h-5"
          />
          <label
            htmlFor="showFinished"
            className="font-semibold text-gray-700 select-none"
          >
            Show finished todos
          </label>
        </div>

        {/* ✅ Finished Todos Section with its own scroll */}
        <div
          className={`finishedTodos bg-violet-100 p-3 rounded-xl mb-5 w-full sm:w-full mx-auto transform transition-all duration-500 ease-in-out ${
            showFinished
              ? "opacity-100 translate-y-0 max-h-[30vh] overflow-y-auto"
              : "opacity-0 -translate-y-5 max-h-0 overflow-hidden"
          }`}
        >
          <h2 className="text-lg font-bold mb-2">Finished Todos</h2>
          {todos.filter((item) => item.isCompleted).length === 0 ? (
            <div className="font-medium text-gray-600">
              No finished todos yet
            </div>
          ) : (
            todos
              .filter((item) => item.isCompleted)
              .map((item) => (
                <div
                  key={item.id}
                  className="todo flex flex-col sm:flex-row items-start sm:items-center justify-between w-full mb-3 border-b border-violet-200 pb-2 transition-all duration-300 ease-in-out"
                >
                  <div className="flex gap-3 flex-1 items-start overflow-hidden">
                    <input
                      type="checkbox"
                      checked
                      disabled
                      className="cursor-not-allowed mt-1"
                    />
                    <div
                      className="todo-text p-2 rounded-xl line-through text-gray-500 break-words whitespace-normal leading-snug flex-1 text-justify"
                      style={{
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {item.todo}
                    </div>
                  </div>

                  {/* ✅ Delete button now safely contained and aligned */}
                  <div className="flex justify-end mt-2 sm:mt-0">
                    <button
                      name={item.id}
                      className="bg-red-600 text-white rounded-lg px-3 py-1 hover:bg-red-700 hover:font-bold transition-all"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* ✅ Scrollable "Your Todos" section */}
        <div className="flex-1 overflow-y-auto p-2 rounded-xl bg-violet-100 shadow-inner">
          <h2 className="text-lg font-bold mb-3">Your Todos</h2>

          {todos.filter((item) => !item.isCompleted).length === 0 && (
            <div className="font-bold font-poppins m-4 text-gray-700">
              No todos to display
            </div>
          )}

          {todos
            .filter((item) => !item.isCompleted)
            .map((item) => (
              <div
                key={item.id}
                className={`todo flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 border-b border-violet-300 transition-all duration-500 ease-in-out mx-auto ${
                  item.animating
                    ? "opacity-0 -translate-x-5"
                    : "opacity-100 translate-x-0"
                }`}
              >
                <div className="flex gap-3 flex-1 items-start overflow-hidden">
                  <input
                    name={item.id}
                    type="checkbox"
                    className="checkBoxClass mt-1"
                    checked={item.isCompleted}
                    onChange={handleCheckbox}
                  />
                  <div
                    className={`todo-text p-2 rounded-xl ${
                      item.isCompleted ? "line-through text-gray-500" : ""
                    } break-words whitespace-normal leading-snug transition-all flex-1 text-justify`}
                    style={{
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    {item.todo}
                  </div>
                </div>

                <div className="buttons flex flex-wrap gap-2 justify-end mt-2 sm:mt-0">
                  <button
                    name={item.id}
                    className="bg-violet-800 text-white rounded-lg px-3 py-1 hover:bg-violet-900 hover:font-bold transition-all"
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                  <button
                    name={item.id}
                    className="bg-violet-800 text-white rounded-lg px-3 py-1 hover:bg-violet-900 hover:font-bold transition-all"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default App;
