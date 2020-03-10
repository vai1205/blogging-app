import { useState, useEffect } from "react";
import { signup, isAuth } from "../../actions/auth";
import Router from "next/router";
const SignUpComponent = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    loading: false,
    message: "",
    showForm: true
  });
  const { name, email, password, error, loading, message, showForm } = values;
  useEffect(() => {
    isAuth() && Router.push("/");
  }, []);
  const handleChange = name => e => {
    setValues({ ...values, error: false, [name]: e.target.value });
  };
  const handleSubmit = e => {
    e.preventDefault();
    setValues({ ...values, loading: true, showForm: false, error: false });
    const user = { name, email, password };
    signup(user).then(resp => {
      if (resp.error) {
        setValues({ ...values, error: resp.error, loading: false });
      } else {
        setValues({
          ...values,
          name: "",
          email: "",
          password: "",
          loading: false,
          message: resp.message,
          showForm: false
        });
      }
    });
  };
  const showLoader = () =>
    loading && <div className="alert alert-info">Loading...</div>;
  const showError = () =>
    error && <div className="alert alert-danger">{error}</div>;
  const showMessage = () =>
    message && <div className="alert alert-success">{message}</div>;
  const signUpForm = () =>
    showForm && (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            value={name}
            onChange={handleChange("name")}
            className="form-control"
            placeholder="Enter Your Name"
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            value={email}
            onChange={handleChange("email")}
            className="form-control"
            placeholder="Enter Your Email"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            value={password}
            onChange={handleChange("password")}
            className="form-control"
            placeholder="Enter Your Password"
          />
        </div>
        <div className="form-group text-center">
          <button type="submit" className="btn btn-primary">
            Sign Up
          </button>
        </div>
      </form>
    );
  return (
    <React.Fragment>
      {showLoader()}
      {showError()}
      {showMessage()}
      {signUpForm()}
    </React.Fragment>
  );
};
export default SignUpComponent;
