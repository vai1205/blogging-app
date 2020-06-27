import Head from "next/head";
import Link from "next/link";
import {withRouter} from "next/router";
import Layout from "../../components/Layout";
import {listRelated, singleBlog} from "../../actions/blog";
import { APP_NAME, DOMAIN, FB_APP_ID } from "../../config";
import {API} from "../../config";
import renderHTML from "react-render-html";
import SmallCard from "../../components/blog/SmallCard";
import moment from "moment";
import {useState, useEffect} from "react";


const SingleBlog = ({ blog, query }) => { 

    const head = () => (
        <Head>
            <title> {blog.title} | {APP_NAME}</title>
            <meta name="description" content={blog.mdesc} />
            <link rel="canonical" href={`${DOMAIN}/blogs/${query.slug}`} />
            {/* open graph (og) for facebook */}
            <meta property="og:title" content={`${blog.title} | ${APP_NAME}`} />
            <meta property="og:description" content={blog.mdesc} /> 
            <meta property="og:type" content="website" / >
            <meta property="og:url" content={`${DOMAIN}/blogs/${query.slug}`} / >
            <meta property="og:site_name" content={`${APP_NAME}`} / >
            {/* get a static image suitable for website seo */}
            <meta property="og:image" content={`${API}/blog/photo/${blog.slug}`} / >
            <meta property="og:image:secure_url" content={`${API}/blog/photo/${blog.slug}`} / >
            <meta property="og:image:type" content="image/jpeg" / >
            <meta property="fb:app_id" content={`${FB_APP_ID}`} / >
        </Head>
    );

    const [related, setRelated] = useState([]);

    useEffect(()=>{
        loadRelated();
    },[])

    const loadRelated = () => {
        listRelated({blog}).then(resp => {
            if(resp.error) {
                console.log(resp.error);
            } else {
                setRelated(resp);
            }
        });
    };
    const showRelatedBlogs = () => {
        return related.map((blog,i) => (
            <div className="col-md-4" key={i}>
                <article>
                    <SmallCard blog={blog} / >
                </article>
            </div>
        ));
    };
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
        <React.Fragment>
            {head()}
            <Layout>
                <main>
                    <article>
                        <div className="container-fluid" style={{marginTop:"-30px"}}>
                            <section>
                                <img 
                                    src={`${API}/blog/photo/${blog.slug}`}
                                    alt={blog.title}
                                    className="img img-fluid featured-image"
                                />
                            </section>
                            <section>
                                <div className="container">
                                    <h1 className="display-2 pt-3 pb-3 text-center font-weight-bold">
                                        {blog.title}
                                    </h1>
                                    <p className="lead mark mt-3">
                                        Written By: {blog.postedBy.name} | Published {moment(blog.updatedAt).fromNow()}
                                    </p>
                                    <div className="pb-3">
                                        {showBlogCategories(blog)}
                                        {showBlogTags(blog)}
                                        <br/>
                                        <br/>
                                    </div>
                                </div>
                            </section>
                        </div>
                        <div className="container">
                            <section>
                                <div className="col-md-12 lead">
                                    {renderHTML(blog.body)}
                                </div>
                            </section>
                        </div>
                        <div className="container pb-5">
                            <h4 className="text-center pt-5 pb-5 h2">Related Blogs</h4>
                            <hr />
                            <div className="row">
                            {showRelatedBlogs()}
                            </div>
                        </div>
                        <div className="container pb-5">
                            <p>Show comments</p>
                        </div>
                    </article>
                </main>
            </Layout>
        </React.Fragment>
    )
};

SingleBlog.getInitialProps = ({query}) => { // query is provided by NextJs with all details of route for backend
    return singleBlog(query.slug).then(resp => {
        if(resp.error) {
            console.log(resp.error);
        } else {
            return {blog : resp, query};
        }
    });
};

export default SingleBlog; 