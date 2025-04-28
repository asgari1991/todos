import React, { useState, useEffect } from "react";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import connectToDB from "@/configs/db";
import { verifyToken } from "@/utils/auth";
import todoModel from "@/models/Todo";
import userModel from "@/models/User";

function Todolist({user,todos}) {
 
  
  
  const [isShowInput,setIsShowInput]=useState(false)
  const [title,setTitle]=useState("")
  const [allTodos,setAllTodos]=useState([...todos])
  const getTodos=async ()=>{
    const res=await fetch('/api/todos')
    const todos=await res.json()
    setAllTodos(todos)
  }
  const addTodo=async()=>{
    const res=await fetch('/api/todos',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({title,isCompleted:false})
    })
    
    if (res.status===201) {
      setTitle("")
      getTodos()
    }
    
  }
  return (
    <>
      <h1>Next-Todos</h1>

      <div className="alert">
        <p>⚠ Please add a task first!</p>
      </div>

      <div className="container">
        <div className="form-container" style={{display:`${isShowInput ? 'block':'none'}`}}>
          <div className="add-form">
            <input
              id="input"
              type="text"
              placeholder="Type your To-Do works..."
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
            />
            <button type="submit" id="submit" onClick={addTodo}>
              ADD
            </button>
          </div>
        </div>
        <div className="head">
          <div className="date">
            <p>{user.firstName} {user.lastName}</p>
          </div>
          <div className="add" onClick={()=>setIsShowInput(true)}>
            <svg
              width="2rem"
              height="2rem"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
              />
              <path
                fillRule="evenodd"
                d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
              />
            </svg>
          </div>
          <div className="time">
            <a href="#">Logout</a>
          </div>
        </div>
        <div className="pad">
          <div id="todo">
            <ul id="tasksContainer">
              {allTodos.map(todo=>(
                <li key={todo._id}>
                <span className="mark">
                  <input type="checkbox" className="checkbox" />
                </span>
                <div className="list">
                  <p>{todo.title}</p>
                </div>
                <span className="delete">
                  <FontAwesomeIcon icon={faTrash} />
                </span>
              </li>
              ))}
              
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
export async function getServerSideProps(context) {
  connectToDB()
  const { token } = context.req.cookies;
    if (!token) {
      return {
        redirect:{
          destination:'/signin'
        }
      }
    }
    const tokenPayload = verifyToken(token);
    if (!tokenPayload) {
      return {
        redirect:{
          destination:'/signin'
        }
      }
    }
    
    const user = await userModel.findOne({ email: tokenPayload.email},'firstName lastName' );
    const todos = await todoModel.find({ user: user._id});
 
    
    
    
  return{
    props:{
      user:JSON.parse(JSON.stringify(user)),
      todos:JSON.parse(JSON.stringify(todos))
    }
  }
}

export default Todolist;
