import React, { Component, useEffect, useState } from "react";
import Modal from "./components/Modal";
import axios from "axios";

function App() {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     viewCompleted: false,
  //     todoList: [],
  //     modal: false,
  //     activeItem: {
  //       title: "",
  //       description: "",
  //       completed: false,
  //     },
  //   };
  // }
  const [viewCompleted, setCompleted] = useState(false);
  const [todoList, setTodoList] = useState([]);
  const [modal, setModal] = useState(false);
  const [activeItem, setActiveItem] = useState({
    title: "",
    description: "",
    completed: false,
  })
  useEffect (() => {
    refreshList();
  })

  const refreshList = () => {
    axios
      .get("/api/todos/")
      // .then((res) => this.setState({ todoList: res.data }))
      .then((res) => setTodoList(res.data))
      .catch((err) => console.log(err));
  };

  const toggle = () => {
    setModal(!modal);
  };

  const handleSubmit = (item) => {
    toggle();

    if (item.id) {
      axios
        .put(`/api/todos/${item.id}/`, item)
        .then((res) => refreshList());
      return;
    }
    axios
      .post("/api/todos/", item)
      .then((res) => refreshList());
  };

  const handleDelete = (item) => {
    axios
      .delete(`/api/todos/${item.id}/`)
      .then((res) => refreshList());
  };

  const createItem = () => {
    const item = { title: "", description: "", completed: false };
    setActiveItem(item);
    setModal(!modal);

    // this.setState({ activeItem: item, modal: !this.state.modal });
  };

  const editItem = (item) => {
    // this.setState({ activeItem: item, modal: !this.state.modal });
    setActiveItem(item);
    setModal(!modal);
  };

  const displayCompleted = (status) => {
    if (status) {
      // return this.setState({ viewCompleted: true });
      return setCompleted(true);
    }
    return setCompleted(false);
    // return this.setState({ viewCompleted: false });
  };

  const renderTabList = () => {
    return (
      <div className="nav nav-tabs">
        <span
          onClick={() => displayCompleted(true)}
          className={viewCompleted ? "nav-link active" : "nav-link"}
        >
          Complete
        </span>
        <span
          onClick={() => displayCompleted(false)}
          className={displayCompleted ? "nav-link" : "nav-link active"}
        >
          Incomplete
        </span>
      </div>
    );
  };

  const renderItems = () => {
    // const { viewCompleted } = state;
    const newItems = todoList.filter(
      (item) => item.completed === viewCompleted
    );

    return newItems.map((item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${
            viewCompleted ? "completed-todo" : ""
          }`}
          title={item.description}
        >
          {item.title}
        </span>
        <span>
          <button
            className="btn btn-secondary mr-2"
            onClick={() => editItem(item)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger"
            onClick={() => handleDelete(item)}
          >
            Delete
          </button>
        </span>
      </li>
    ));
  };
    return (
      <main className="container">
        <h1 className="text-white text-uppercase text-center my-4">Todo app</h1>
        <div className="row">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="mb-4">
                <button
                  className="btn btn-primary"
                  onClick={createItem}
                >
                  Add task
                </button>
              </div>
              {renderTabList()}
              <ul className="list-group list-group-flush border-top-0">
                {renderItems()}
              </ul>
            </div>
          </div>
        </div>
        {modal ? (
          <Modal
            activeItem={activeItem}
            toggle={toggle}
            onSave={handleSubmit}
          />
        ) : null}
      </main>
    );
}

export default App;
