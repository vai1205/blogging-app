import { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import { withRouter } from "next/router";
import dynamic from "next/dynamic";
import { createBlog } from "../../actions/blog";
import { getCookie, isAuth } from "../../actions/auth";
import { getCategories } from "../../actions/category";
import { getTags } from "../../actions/tag";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "../../node_modules/react-quill/dist/quill.snow.css";
import {QuillModules, QuillFormats} from "../../helpers/quill";

//todo : handle title in local storage
// useState ~ state, useEffect ~ willReceiveProps

const CreateBlog = ({ router }) => {
  const blogFromLS = () => {
    if (typeof window === "undefined") {
      return false;
    }
    if (localStorage.getItem("blog")) {
      return JSON.parse(localStorage.getItem("blog"));
    } else {
      return false;
    }
  };
  const token = getCookie("token");
  const [categories, setCategories] = useState([]);
  const [checkedCategories, setCheckedCategories] = useState([]);
  const [checkedTags, setCheckedTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [body, setBody] = useState(blogFromLS());
  const [values, setValues] = useState({
    error: "",
    sizeError: "",
    success: "",
    formData: "",
    title: "",
    hidePublishButton: false
  });
  const { error, sizeError, success, formData, title, hidePublishButton } = values;
  useEffect(() => {
    setValues({ ...values, formData: new FormData() });
    initCategories();
    initTags();
  }, [router, success]);
  const initCategories = () => {
    getCategories().then(resp => {
      if (resp.error) {
        setValues({ ...values, error: resp.error, success:'' });
      } else {
        setCategories(resp);
      }
    });
  };
  const initTags = () => {
    getTags().then(resp => {
      if (resp.error) {
        setValues({ ...values, error: resp.error, success:'' });
      } else {
        setTags(resp);
      }
    });
  };
  const publishBlog = e => {
    e.preventDefault();
    createBlog(formData, token).then(resp => {
      if (resp.error) {
        setValues({ ...values, error: resp.error, success:'' });
      } else {
        setValues({
          ...values,
          error: "",
          title: "",
          success: `A new blog titled ${resp.title} is created.`
        });
        setBody("");
        setCategories([]);
        setTags([]);
      }
    });
  };
  const handleChange = name => e => {
    let value = name === "photo" ? e.target.files[0] : e.target.value;
    formData.set(name, value);
    setValues({ ...values, formData, error: "", [name]: value });
  };
  const handleBody = e => {
    setBody(e);
    formData.set("body", e);
    if (typeof window !== "undefined") {
      localStorage.setItem("blog", JSON.stringify(e));
    }
  };
  const handleCategoryToggle = id => () => {
    setValues({ ...values, error: "" });
    const all = [...checkedCategories];
    const clickedCategory = checkedCategories.indexOf(id);
    if (clickedCategory === -1) {
      all.push(id);
    } else {
      all.splice(clickedCategory, 1);
    }
    console.log(all);
    setCheckedCategories(all);
    formData.set("categories", all);
  };
  const handleTagToggle = id => () => {
    setValues({ ...values, error: "" });
    const all = [...checkedTags];
    const clickedTag = checkedTags.indexOf(id);
    if (clickedTag === -1) {
      all.push(id);
    } else {
      all.splice(clickedTag, 1);
    }
    console.log(all);
    setCheckedTags(all);
    formData.set("tags", all);
  };
  const showCategories = () => {
    return (
      categories && categories.map((c, i) => (
        <li key={i} className="list-unstyled">
          <input
            type="checkbox"
            onChange={handleCategoryToggle(c._id)}
            className="mr-2"
          />
          <label className="form-check-label">{c.name}</label>
        </li>
      ))
    );
  };
  const showTags = () => {
    return (
      tags && tags.map((t, i) => (
        <li key={i} className="list-unstyled">
          <input
            type="checkbox"
            onChange={handleTagToggle(t._id)}
            className="mr-2"
          />
          <label className="form-check-label">{t.name}</label>
        </li>
      ))
    );
  };
  const createBlogForm = () => {
    return (
      <form onSubmit={publishBlog}>
        <div className="form-group">
          <label className="text-muted">Title</label>
          <input
            type="text"
            onChange={handleChange("title")}
            className="form-control"
            value={title}
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Body</label>
          <ReactQuill
            value={body}
            placeholder="Write something amazing..."
            onChange={handleBody}
            modules={QuillModules}
            formats={QuillFormats}
          />
        </div>
        <div>
          <button className="btn btn-primary" type="submit">
            Publish
          </button>
        </div>
      </form>
    );
  };
  const showError = () => (
    <div style={{ display: error ? "" : 'none' }} className="alert alert-danger">
      {error}
    </div>
  );
  const showSuccess = () => (
    <div
      style={{ display: success ? "" : 'none' }}
      className="alert alert-success"
    >
      {success}
    </div>
  );
  return (
    <React.Fragment>
      <div className="container-fluid">
        <h4>Write most beautiful thing in the world now!</h4>
        <hr />
        <div className="row">
          <div className="col-md-8">
            {createBlogForm()}
            {showError()}
            {showSuccess()}
          </div>
          <div className="col-md-4">
            <h5>Featured Image</h5>
            <hr />
            <small className="text-muted">Maximum Size: 1MB</small>
            <br />
            <br />
            <label className="btn btn-outline-info">
              Upload a Featured Image
              <input
                type="file"
                onChange={handleChange("photo")}
                accept="image/*"
                hidden
              />
            </label>
            <br />
            <br />
            <h5>Categories</h5>
            <hr />
            <ul className="scroll-y">{showCategories()}</ul>
            <h5>Tags</h5>
            <hr />
            <ul className="scroll-y">{showTags()}</ul>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};



export default withRouter(CreateBlog);
