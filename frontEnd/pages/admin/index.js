import Layout from "../../components/Layout";
import Admin from "../../components/auth/Admin";
import Link from "next/link";
const AdminIndex = () => {
  return (
    <Layout>
      <Admin>
        <div className="row">
          <div className="col-md-12 pt-5 pb-5">
            <h2>Admin Dashboard</h2>
          </div>
          <div className="col-md-4">
            <div className="list-group-item">
              <Link href="/admin/crud/category-tag">
                <a>Create Category</a>
              </Link>
            </div>
            <div className="list-group-item">
              <Link href="/admin/crud/category-tag">
                <a>Create Tag</a>
              </Link>
            </div>
            <div className="list-group-item">
              <Link href="/admin/crud/blog">
                <a>Create Blog</a>
              </Link>
            </div>
          </div>
          <div className="col-md-8">
            <p>Right</p>
          </div>
        </div>
      </Admin>
    </Layout>
  );
};
export default AdminIndex;
