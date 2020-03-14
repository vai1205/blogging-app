import { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import { isAuth, getCookie } from "../../actions/auth";
import { create, getTags, removeTag } from "../../actions/tag";
const Tag = () => {
  const [values, setValues] = useState({
    name: "",
    error: false,
    success: false,
    tags: [],
    removed: false,
    reload: false
  });
  const { name, error, success, tags, removed, reload } = values;
  const token = getCookie("token");
  useEffect(() => {
    loadTags();
  }, [reload]);
  const loadTags = () => {
    getTags().then(resp => {
      if (resp && resp.error) {
        console.log(resp.error);
      } else {
        setValues({ ...values, tags: resp });
      }
    });
  };
  const showTags = () => {
    return (
      <React.Fragment>
        {tags && <h5 className="green pt-4">List of Tags</h5>}
        {tags.map((t, i) => (
          <button
            title="Double click to Delete"
            key={i}
            onDoubleClick={() => deleteConfirm(t.slug)}
            className="btn btn-outline-primary mr-1 ml-1 mt-3"
          >
            {t.name}
          </button>
        ))}
      </React.Fragment>
    );
  };
  const deleteConfirm = slug => {
    let answer = window.confirm("Are you sure you want to delete this Tag?");
    if (answer) {
      removeTag(slug, token).then(resp => {
        if (resp.error) {
          console.log(resp.error);
        } else {
          setValues({
            ...values,
            error: false,
            success: false,
            name: "",
            removed: true,
            name: "",
            reload: !reload
          });
        }
      });
    }
  };
  const handleSubmit = e => {
    e.preventDefault();
    create({ name }, token).then(resp => {
      if (resp && resp.error) {
        setValues({ ...values, error: resp.error, success: false });
      } else {
        setValues({
          ...values,
          error: false,
          success: true,
          reload: !reload,
          removed: false,
          name: ""
        });
      }
    });
  };
  const handleChange = e => {
    setValues({
      ...values,
      error: false,
      name: e.target.value,
      success: false,
      removed: false
    });
  };
  const handleMouseMove = e => {
    setValues({ ...values, success: false, removed: false, error: false });
  };
  const showSuccess = () => {
    if (success) {
      return (
        <div className="alert alert-success">Tag Created Successfully.</div>
      );
    }
  };
  const showMessage = () => {
    if (error) {
      return <div className="alert alert-info">Tag Already Exists.</div>;
    }
  };
  const showRemoved = () => {
    if (removed) {
      return (
        <div className="alert alert-danger">Tag Deleted Successfully.</div>
      );
    }
  };
  const newTagForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="text-muted">Create a new Tag</label>
          <input
            type="text"
            className="form-control"
            onChange={handleChange}
            value={name}
            placeholder="Enter the new tag name"
            required
          />
        </div>
        <button className="btn btn-primary">Create</button>
      </form>
    );
  };
  return (
    <React.Fragment>
      <div>
        {showMessage()}
        {showRemoved()}
        {showSuccess()}
      </div>
      <div onMouseMove={handleMouseMove}>
        {newTagForm()}
        {tags && tags.length>0 && showTags()}
      </div>
    </React.Fragment>
  );
};
export default Tag;
