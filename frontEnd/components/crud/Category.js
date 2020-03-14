import { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import { isAuth, getCookie } from "../../actions/auth";
import { create, getCategories, removeCategory } from "../../actions/category";
const Category = () => {
  const [values, setValues] = useState({
    name: "",
    error: false,
    success: false,
    categories: [],
    removed: false,
    reload: false
  });
  const { name, error, success, categories, removed, reload } = values;
  const token = getCookie("token");
  useEffect(() => {
    loadCategories();
  }, [reload]);
  const loadCategories = () => {
    getCategories().then(resp => {
      if (resp && resp.error) {
        console.log(resp.error);
      } else {
        setValues({ ...values, categories: resp });
      }
    });
  };
  const showCategories = () => {
    return (
      <React.Fragment>
        <h5 className="green pt-4">List of Categories</h5>
        {categories.map((c, i) => (
          <button
            title="Double click to Delete"
            key={i}
            onDoubleClick={() => deleteConfirm(c.slug)}
            className="btn btn-outline-primary mr-1 ml-1 mt-3"
          >
            {c.name}
          </button>
        ))}
      </React.Fragment>
    );
  };
  const deleteConfirm = slug => {
    let answer = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (answer) {
      removeCategory(slug, token).then(resp => {
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
        <div className="alert alert-success">
          Category Created Successfully.
        </div>
      );
    }
  };
  const showMessage = () => {
    if (error) {
      return <div className="alert alert-info">Category Already Exists.</div>;
    }
  };
  const showRemoved = () => {
    if (removed) {
      return (
        <div className="alert alert-danger">Category Deleted Successfully.</div>
      );
    }
  };
  const newCategoryForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="text-muted">Create a new Category</label>
          <input
            type="text"
            className="form-control"
            onChange={handleChange}
            value={name}
            placeholder="Enter the new category name"
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
        {newCategoryForm()}
        {categories && categories.length>0 && showCategories()}
      </div>
    </React.Fragment>
  );
};
export default Category;
