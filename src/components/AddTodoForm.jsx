import { useEffect, useState } from "react";
import "./Tasks.module.css";
import { Input, Select, message } from "antd";
import axios from "axios";
// import useUserStore from "../../store/store";
const { TextArea } = Input;
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function AddTodo({ fetchData, toggleModal }) {
  const [formData, setFormData] = useState({
    task_title: "",
    task_description: "",
  });

  //   const { user, token } = useUserStore();

  //   useEffect(() => {
  //     if (update) {
  //       setFormData({
  //         title: data.title,
  //         description: data.description,
  //       });
  //     }
  //   }, []);

  const handleChange = (value, input) => {
    setFormData((prevVal) => ({
      ...prevVal,
      [input]: value,
    }));
  };

  const validateData = () => {
    console.log(formData.task_title);
    console.log(formData.task_description);
    if (formData.task_title == "" || formData.task_description == "") {
      message.error("All fields are required");
      return false;
    }
    if (formData.task_description.length < 10) {
      message.error("Description must contain atleast 10 character");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateData()) {
      axios
        .post("http://localhost:8000/create", formData)
        .then((response) => {
          if (response.status === 201) {
            message.success(response?.data?.message);
          } else {
            message.error(response?.data?.message);
          }

          fetchData();
          setFormData({
            task_title: "",
            task_description: "",
          });
          toggleModal();
         
        })
        .catch((error) => {
          message.error(error.response?.data?.errors[1]?.message);
          console.log(error.response?.data);
        });
    }
  };

  

  return (
    <div className="inputDiv">
      <h4>Add New Task</h4>
      <div className="mt-4">
        <Input
          value={formData.task_title}
          onChange={(e) => handleChange(e.target.value, "task_title")}
          size="large"
          placeholder="Title"
        />
      </div>
      <div className="mt-2">
        <TextArea
          // showCount
          onChange={(e) => handleChange(e.target.value, "task_description")}
          maxLength={100}
          // onChange={onChange}
          value={formData.task_description}
          placeholder="Description"
          style={{
            height: 120,
            resize: "none",
          }}
        />
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        className="btn btn-success w-100 mt-3"
        onClick={handleSubmit}
      >
        Submit
      </motion.button>
    </div>
  );
}
