import { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import moment from "moment";
import dynamic from "next/dynamic";
import { list, removeBlog } from "../../actions/blog";
import { getCookie, isAuth } from "../../actions/auth";

const BlogRead = () => {
    const [blogs, setBlogs] = useState([]);
    const [message, setMessage] = useState("");
    useEffect(()=>{
        loadBlogs();
    },[]);
    const token = getCookie("token");
    const loadBlogs = () => {
        list().then(resp => {
            if(resp.error) {
                console.log(resp.error);
            } else {
                setBlogs(resp);
            }
        }) 
    };
    const showBlogs = () => {
        return blogs.map((b,i) => {
            return(
                <section key={i} className="mb-3">
                    <h5>{b.title}</h5>
                    <p className="mark p-2">
                        Published &nbsp; 
                        {moment(b.updatedAt).fromNow()}
                        &nbsp; by: &nbsp;
                        {b.postedBy.name}
                    </p>
                    <div>
                        <span>{showDelete(b.slug)}</span>
                        <span  className="ml-2">{showUpdate(b)}</span>
                    </div>
                </section>
            );
        })
    };
    const showDelete = slug => {
        return (
            <button 
                className="btn btn-sm btn-danger" 
                onClick={() => confirmDelete(slug)}
            >
                Delete
            </button>
        );
    };
    const showUpdate = blog => {
        if(isAuth() && isAuth().role === 1){
            return(
                <Link href={`/admin/crud/${blog.slug}`}>
                    <a className="btn btn-sm btn-success">
                        Update 
                    </a>
                </Link>
            );
        }
    };
    const confirmDelete = slug => {
        let del = window.confirm("Are you sure you want to delete this blog?");
        if(del) {
            removeBlog(slug,token).then(resp => {
                if(resp.error){
                    console.log(resp.error)
                }else{
                    setMessage(resp.message); 
                    loadBlogs();
                }
            })
        }
    };
    return(
        <>
            <h4>Update/Delete Blogs</h4>
            {
                message && 
                <div 
                    className="alert-danger mt-3 mb-3 p-2" 
                    style={{width:"50%"}}
                >
                    {message}
                    <div>
                        <button 
                            className="mt-3 btn btn-outline-dark btn-sm"
                            onClick={() => setMessage("")}
                        >
                            Okay
                        </button>
                    </div>
                </div>
            }
            <div>{showBlogs()}</div>
        </>
    )
};

export default BlogRead;