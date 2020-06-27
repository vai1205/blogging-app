import Layout from "../../../components/Layout";
import Admin from "../../../components/auth/Admin";
import Link from "next/link";
import BlogRead from "../../../components/crud/BlogRead";
const Blogs = () => {
  return (
    <Layout>
      <Admin>
        <div className="container">
            <h2 className="mt-3 mb-3">Manage Blogs</h2>
            <div>
                <BlogRead />
            </div>
        </div>
      </Admin>
    </Layout>
  );
};
export default Blogs;
