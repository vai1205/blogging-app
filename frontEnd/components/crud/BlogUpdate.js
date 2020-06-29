import { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import { withRouter } from "next/router";
import dynamic from "next/dynamic";
import { singleBlog, updateBlog } from "../../actions/blog";
import { getCookie, isAuth } from "../../actions/auth";
import { getCategories } from "../../actions/category";
import { getTags } from "../../actions/tag";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "../../node_modules/react-quill/dist/quill.snow.css";
import {QuillModules, QuillFormats} from "../../helpers/quill";
import { API } from "../../config";

const BlogUpdate = ({router}) => {
// todo : change image preview once image is changed and track edited title and body in local storage
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [categories, setCategories] = useState([]);
    const [checkedCategories, setCheckedCategories] = useState([]);
    const [checkedTags, setCheckedTags] = useState([]);
    const [tags, setTags] = useState([]);
    const [imagePath, setImagePath] = useState('');
    const [values, setValues] = useState({
        error: "",
        success: "",
        formData: ""
    });
    const {error, success, formData} = values;
    const token = getCookie("token");

    useEffect(()=>{
        setValues({...values, formData: new FormData()});
        initBlog(router.query.slug);
        findImagePath(router.query.slug);
        initCategories();
        initTags();
    },[router,success]);

    useEffect(()=>{window.scrollTo(0,0);},[])

    const initBlog = slug => {
        if(slug) {
            singleBlog(slug).then(resp => {
                if(resp.error){
                    console.log(resp.error);
                } else {
                    setBody(resp.body);
                    setTitle(resp.title);
                    tickBlogCategories(resp.categories);
                    tickBlogTags(resp.tags);
                }
            });
        }
    };

    const findImagePath = slug => {
        if(slug) {
            let path = `${API}/blog/photo/${slug}`
            setImagePath(path);
        }
    };

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

    const tickBlogCategories = bc => {
        let cArr = [];
        bc.map(c => cArr.push(c._id));
        setCheckedCategories(cArr);
    };

    const tickBlogTags = bt => {
        let tArr = [];
        bt.map(t => tArr.push(t._id));
        setCheckedTags(tArr);
    };

    const findCheckedCategories = ci => {
        if (checkedCategories.indexOf(ci) > -1) {
            return true;
        } else {
            return false;
        }
    };

    const findCheckedTags = ti => {
        if (checkedTags.indexOf(ti) > -1) {
            return true;
        } else {
            return false;
        }
    };

    const handleChange = name => e => {
        let value = name === "photo" ? e.target.files[0] : e.target.value;
        formData.set(name, value);
        setValues({ ...values, formData, error: ""});
        if (name === 'title') {
            setTitle(value)
        }
    };

    const handleBody = e => {
       setBody(e);
       formData.set('body', e);
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

    const editBlog = e => {
        e.preventDefault();
        let slug = router.query.slug;
        if(slug){
            updateBlog(formData, token, slug).then(resp => {
                if (resp.error){
                    setValues({...values, error:resp.error});
                } else {
                    setValues({...values, success:resp.message});
                    window.location.reload();
                }
            })
        }
    };

    const updateBlogForm = () => {
        return (
          <form onSubmit={editBlog}>
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
                Update
              </button>
            </div>
          </form>
        );
    };

    const showCategories = () => {
        return (
          categories && categories.map((c, i) => (
            <li key={i} className="list-unstyled">
              <input
                type="checkbox"
                onChange={handleCategoryToggle(c._id)}
                checked={findCheckedCategories(c._id)}
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
                checked={findCheckedTags(t._id)}
                className="mr-2"
                />
                <label className="form-check-label">{t.name}</label>
            </li>
            ))
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
        <>
            <div className="container-fluid">
                <h4>Update your Creation!</h4>
                <hr />
                <div className="row">
                    <div className="col-md-8">
                        {updateBlogForm()}
                        {showError()}
                        {showSuccess()}
                    </div>
                    <div className="col-md-4">
                        <h5>Featured Image</h5>
                        <hr />
                        <img src={imagePath} alt={title} style={{width:"inherit"}}/>
                        <small className="text-muted">Maximum Size: 1MB</small>
                        <br />
                        <br />
                        <label className="btn btn-outline-info">
                            Change Image
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
        </>
    );
};

export default withRouter(BlogUpdate);