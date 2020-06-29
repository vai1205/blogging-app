import Layout from "../../../components/Layout";
import Admin from "../../../components/auth/Admin";
import Link from "next/link";
import BlogUpdate from "../../../components/crud/BlogUpdate";
const UpdateBlog = () => {
  return (
    <Layout>
      <Admin>
        <div className="container">
            <h2 className="mt-3 mb-3">Update Blog</h2>
            <div>
                <BlogUpdate />
            </div>
        </div>
      </Admin>
    </Layout>
  );
};
export default UpdateBlog;
