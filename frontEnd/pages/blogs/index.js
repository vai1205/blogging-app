import Head from "next/head";
import Link from "next/link";
import {withRouter} from "next/router";
import Layout from "../../components/Layout";
import {useState} from "react";
import {listBlogsWithCategoriesAndTags} from "../../actions/blog";
import Card from "../../components/blog/Card";
import { APP_NAME, DOMAIN, FB_APP_ID } from "../../config";

const Blogs =  ({blogs, categories, tags, totalBlogs, blogsLimit, blogsSkip, router}) => {

    const head = () => (
        <Head>
            <title>Programming Blogs | {APP_NAME}</title>
            <meta name="description" content="Write the general content for this blog website" />
            <link rel="canonical" href={`${DOMAIN}${router.pathname}`} />
            {/* open graph (og) for facebook */}
            <meta property="og:title" content={`General description of website | ${APP_NAME}`} />
            <meta property="og:description" content="Write the general content for this blog website" /> 
            <meta property="og:type" content="website" / >
            <meta property="og:url" content={`${DOMAIN}${router.pathname}`} / >
            <meta property="og:site_name" content={`${APP_NAME}`} / >
            {/* get a static image suitable for website seo */}
            <meta property="og:image" content={`${DOMAIN}/static/images/seoblog.jpeg`} / >
            <meta property="og:image:secure_url" content={`${DOMAIN}/static/images/seoblog.jpeg`} / >
            <meta property="og:image:type" content="image/jpeg" / >
            <meta property="fb:app_id" content={`${FB_APP_ID}`} / >
        </Head>
    );

    const [limit, setLimit] = useState(blogsLimit);
    const [skip, setSkip] = useState(blogsSkip);
    const [size, setSize] = useState(totalBlogs);
    const [loadedBlogs, setLoadedBlogs] = useState([]);

    const loadMore = () => {
        let toSkip = skip + limit;
        listBlogsWithCategoriesAndTags(toSkip,limit).then((resp) => {
            if(resp.error) {
                console.log(resp.error)
            } else {
                setLoadedBlogs([...loadedBlogs, ...resp.blogs]);
                setSize(resp.size);
                setSkip(toSkip);
            }
        });
    };
    const loadMoreButton = () => {
        return size > 0 && size >= limit && (
            <button className="btn btn-outline-primary btn-lg" onClick={loadMore}>
                Load More
            </button>
        )
    };
    const showLoadedBlogs = () => (
        loadedBlogs.map((blog, i) => (
            <article key={i}>
                <Card blog={blog}/>
                <hr/>
            </article>
        ))
    );
    const showAllBlogs = () => {
        return blogs.map((blog,i) => {
            return <article key={i}>
                <Card blog={blog}/>
                <hr/>
            </article>
        });
    };
    const showAllCategories = () => 
        categories.map((c,i) => 
            <Link href={`/categories/${c.slug}`} key={i}>
                <a className="btn btn-primary mr-1 ml-1 mt-3">{c.name}</a>
            </Link>
        );
    const showAllTags = () => 
        tags.map((t,i) => 
            <Link href={`/tags/${t.slug}`} key={i}>
                <a className="btn btn-outline-primary mr-1 ml-1 mt-3">{t.name}</a>
            </Link>
        );
    return(
        <React.Fragment>
            {head()}
            <Layout>
                <main>
                    <div className="container-fluid">
                        <header>
                            <div className="col-md-12 pt-3">
                                <h1 className="display-4 font-weight-bold text-center">
                                    Programming Blogs and Tutorials
                                </h1>
                            </div>
                            <section>
                                <div className="pb-5 text-center">
                                    {showAllCategories()}
                                    <br/>
                                    {showAllTags()}
                                </div>
                            </section>
                        </header>
                    </div>
                    <div className="container-fluid">
                        {showAllBlogs()}
                    </div>
                    <div className="container-fluid">
                        {showLoadedBlogs()}
                    </div>
                    <div className="text-center pt-5 pb-5">
                        {loadMoreButton()}
                    </div>
                </main>
            </Layout>
        </React.Fragment>
    )
};

// To make this page server side rendered on first load getInitialProps is used. Similar to mapStateToProps
// Once fetched, it is loaded from client side after that
// using simple willMount or useEffect of react is not good because it doesn't ensure data rendered from server till the page load, which is not good for SEO
// "return" statement is compulsory with getInitialProps method provided by Next js

Blogs.getInitialProps = () => {
    let skip = 0;
    let limit = 2;
    return listBlogsWithCategoriesAndTags(skip, limit).then(data => {
        if(data.error) {
            console.log(data.error);
        } else {
            return {
                blogs: data.blogs,
                categories: data.categories,
                tags: data.tags,
                totalBlogs: data.size,
                blogsLimit: limit,
                blogsSkip: skip
            }; // these properties are accessible in the component defined above
        }
    });
};

export default withRouter(Blogs);