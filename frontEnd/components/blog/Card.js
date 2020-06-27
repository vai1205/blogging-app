import Head from "next/head";
import Link from "next/link";
import renderHTML from "react-render-html";
import moment from "moment";
import {API} from "../../config";

const Card = ({blog}) => {
    const showBlogCategories = blog => blog.categories.map((c,i) => 
        <Link href={`/categories/${c.slug}`} key={i}>
            <a className="btn btn-primary mr-1 ml-1 mt-3">{c.name}</a>
        </Link>
    );
    const showBlogTags = blog => blog.tags.map((t,i) => 
        <Link href={`/tags/${t.slug}`} key={i}>
            <a className="btn btn-outline-primary mr-1 ml-1 mt-3">{t.name}</a>
        </Link>
    );
    return (
        <div className="lead pb-4">
            <header>
                <Link href={`/blogs/${blog.slug}`}>
                    <a><h2 className="pt-3 pb-3 font-weight-bold">{blog.title}</h2></a>
                </Link>
            </header>
            <section>
                <p className="mark ml-1 pt2 pb-2">
                    Written By: {blog.postedBy.name} | Published {moment(blog.updatedAt).fromNow()}
                </p>
            </section>
            <section>
                {showBlogCategories(blog)}
                {showBlogTags(blog)}
                <br/>
                <br/>
            </section>
            <div className="row">
                <div className="col-md-4">
                    <section>
                        <img 
                            src={`${API}/blog/photo/${blog.slug}`} 
                            alt={blog.title} 
                            className="img img-fluid"
                            style={{maxHeight:"150px", width:"auto"}}
                        />
                    </section>
                </div>
                <div className="col-md-8">
                    <section>
                        <div className="pb-3">{renderHTML(blog.excerpt)}</div>
                        <Link href={`/blogs/${blog.slug}`}>
                            <a className="btn btn-primary pt-2">Read More</a>
                        </Link>
                    </section>
                </div>
            </div>
        </div>
    );
}
export default Card;