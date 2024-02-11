import React, { useEffect, useState } from "react";
import styles from "./Tasks.module.css";
import { motion } from "framer-motion";
import { Modal, message, Skeleton } from "antd";
import AddTodo from "./AddTodoForm";
import axios from "axios";

function Tasks() {
  const [modal, setModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("http://localhost:8000/")
      .then((response) => {
        console.log(response);
        setTasks(response.data.results);
        setLoading(false);
      })
      .catch((error) => {
        message.error(error.response?.data?.errors[0]?.message);
        console.log(error.response?.data);
      });
  };

  return (
    <div className={styles.containerSection + " " + "container-fluid"}>
      <div className={styles.containerDiv + " " + "container pt-3"}>
        <h3 className="text-center">Task Management App</h3>
        <div className={styles.tasksDiv}>
          <div className="row mt-4">
            {tasks.length === 0 ? (
              <>
                {loading ? (
                  <>
                    {Array(3)
                      .fill()
                      .map((item, index) => {
                        return (
                          <div className="col-12 col-sm-6 col-lg-4 col-xll-3">
                            <Skeleton active />
                          </div>
                        );
                      })}
                  </>
                ) : (
                  <p style={{ color: "#454545" }}>
                    No Task Available. Please use below button to add task.
                  </p>
                )}
              </>
            ) : (
              <>
                {tasks.map((task, index) => {
                  return (
                    <div
                      key={index}
                      className="col-12 col-sm-6 col-lg-4 col-xll-3"
                    >
                      <TaskCard
                        id={task?.task_id}
                        fetchData={fetchData}
                        title={task?.task_title}
                        description={task?.task_description}
                        completed={task?.task_completed}
                      />
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
        <div className={styles.newTaskBtnDiv}>
          <motion.button
            onClick={() => setModal(true)}
            whileTap={{ scale: 0.9 }}
            className={styles.newTaskBtn}
          >
            Add New Task
          </motion.button>
        </div>
        <Modal
          title=""
          footer={null}
          open={modal}
          onCancel={() => setModal(false)}
        >
          <AddTodo toggleModal={setModal} fetchData={fetchData} />
        </Modal>
        <div className={styles.infoDiv}>
          <div className="d-flex gap-4">
            <p>Name : Ankur Tiwari</p>
            <p>ankur73tiwari@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const TaskCard = ({ title, description, completed, id, fetchData }) => {
  const deleteTask = () => {
    console.log("Delete hit", id);
    axios
      .delete(`http://localhost:8000/${id}`)
      .then((response) => {
        console.log(response);
        if (response.status === 200) message.success(response?.data?.message);
        else message.error(response?.data?.message);

        fetchData();
      })
      .catch((error) => {
        console.log(error);
        // message.error(response?.data?.message);
      });
  };
  const updateTask = () => {
    console.log("Delete hit", id);
    axios
      .put(`http://localhost:8000/${id}`)
      .then((response) => {
        console.log(response);
        if (response.status === 201) message.success(response?.data?.message);
        else message.error(response?.data?.message);

        fetchData();
      })
      .catch((error) => {
        console.log(error);
        // message.error(response?.data?.message);
      });
  };

  return (
    <div className={styles.taskCard}>
      <p className="mb-1">Task ID : {id}</p>
      <h5 className="mb-1">{title}</h5>
      <p>{description}</p>
      <h6>Status : {completed === 0 ? "Not Completed" : "Completed"}</h6>
      <div className={styles.btns}>
        <motion.button
          onClick={deleteTask}
          whileTap={{ scale: 0.96 }}
          className="btn btn-danger mt-1"
        >
          Delete
        </motion.button>
        <motion.button
          onClick={updateTask}
          whileTap={{ scale: 0.96 }}
          className="btn btn-success  mt-1"
        >
          {completed === 0 ? "Complete" : "Undo Complete"}
        </motion.button>

        {/* <button className="btn btn-danger mt-2">Delete</button> */}
      </div>
    </div>
  );
};

export default Tasks;
