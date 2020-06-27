import Head from "next/head";
import Link from "next/link";
import renderHTML from "react-render-html";
import moment from "moment";
import {API} from "../../config";

const SmallCard = ({blog}) => {
    return (
        <div className="card">
            <section>
                <Link href={`/blogs/${blog.slug}`}>
                    <a>
                        <img 
                            src={`${API}/blog/photo/${blog.slug}`} 
                            alt={blog.title} 
                            className="img img-fluid"
                            style={{maxHeight:"150px", width:"auto"}}
                        />
                    </a>
                </Link>
            </section>
            <div className="card-body">
                <section>
                    <Link href={`/blogs/${blog.slug}`}>
                        <a>
                            <h5 className="card-title">{blog.title}</h5>
                        </a>
                    </Link>
                    <p className="card-text">
                        {renderHTML(blog.excerpt)}
                    </p>
                </section>
            </div>
            <div className="card-body">
                <Link href={`/blogs/${blog.slug}`}>
                    <a className="btn btn-primary pt-2">Read More</a>
                </Link>
                Posted {moment(blog.updatedAt).fromNow()} by {blog.postedBy.name}
            </div>
        </div>
    );
}
export default SmallCard;