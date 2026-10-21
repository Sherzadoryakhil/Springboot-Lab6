import { useEffect, useState } from "react";
import { deleteCourse, getCourses, updateCourse } from "../services/courseApi";

const emptyCourse = { code: "", title: "", credits: "" };

function Courses() {
  const [courses, setCourses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [course, setCourse] = useState(emptyCourse);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadCourses = async () => {
    const response = await getCourses();
    setCourses(response.data);
  };

  useEffect(() => {
    let active = true;

    const fetchCourses = async () => {
      try {
        const response = await getCourses();
        if (active) setCourses(response.data);
      } catch (requestError) {
        if (active) setError("Failed to load courses. Is the Spring Boot API running?");
        console.error(requestError);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchCourses();
    return () => {
      active = false;
    };
  }, []);

  const handleEdit = (selectedCourse) => {
    setEditingId(selectedCourse.id);
    setCourse({
      code: String(selectedCourse.code ?? ""),
      title: String(selectedCourse.title ?? ""),
      credits: String(selectedCourse.credits ?? "")
    });
    setMessage("");
    setError("");
  };

  const handleChange = ({ target: { name, value } }) => {
    setCourse((previous) => ({ ...previous, [name]: value }));
  };

  const closeEditor = () => {
    setEditingId(null);
    setCourse(emptyCourse);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const credits = Number(course.credits);

    if (!Number.isInteger(credits) || credits < 1) {
      setError("Credits must be a whole number of at least 1.");
      return;
    }

    const updatedCourse = {
      // String(...) prevents: TypeError: course.code.trim is not a function.
      code: String(course.code ?? "").trim(),
      title: String(course.title ?? "").trim(),
      credits
    };

    try {
      setSaving(true);
      await updateCourse(editingId, updatedCourse);
      await loadCourses();
      closeEditor();
      setError("");
      setMessage("Course updated successfully.");
    } catch (requestError) {
      console.error(requestError);
      setError("Failed to update course. Check the API endpoint and request fields.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course? This cannot be undone.")) return;

    try {
      await deleteCourse(id);
      await loadCourses();
      if (editingId === id) closeEditor();
      setError("");
      setMessage("Course deleted successfully.");
    } catch (requestError) {
      console.error(requestError);
      setError("Failed to delete course. It may be referenced by another record.");
    }
  };

  return (
    <main className="container mt-4">
      <h1 className="h2 text-center mb-4">Course Management</h1>

      {message && <div className="alert alert-success" role="alert">{message}</div>}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {editingId !== null && (
        <section className="card mb-4 shadow-sm">
          <div className="card-header bg-warning"><strong>Edit Course</strong></div>
          <div className="card-body">
            <form onSubmit={handleUpdate}>
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label" htmlFor="code">Course Code</label>
                  <input id="code" type="text" name="code" className="form-control" value={course.code} onChange={handleChange} required />
                </div>
                <div className="col-md-5">
                  <label className="form-label" htmlFor="title">Course Title</label>
                  <input id="title" type="text" name="title" className="form-control" value={course.title} onChange={handleChange} required />
                </div>
                <div className="col-md-2">
                  <label className="form-label" htmlFor="credits">Credits</label>
                  <input id="credits" type="number" name="credits" min="1" step="1" className="form-control" value={course.credits} onChange={handleChange} required />
                </div>
                <div className="col-md-2 d-flex align-items-end">
                  <button type="submit" className="btn btn-success w-100" disabled={saving}>
                    {saving ? "Updating..." : "Update"}
                  </button>
                </div>
              </div>
              <button type="button" className="btn btn-secondary mt-3" onClick={closeEditor}>Cancel</button>
            </form>
          </div>
        </section>
      )}

      <div className="table-responsive">
        <table className="table table-bordered table-hover text-center align-middle">
          <thead className="table-dark"><tr><th>ID</th><th>Code</th><th>Title</th><th>Credits</th><th>Actions</th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan="5">Loading courses...</td></tr>}
            {!loading && courses.length === 0 && <tr><td colSpan="5">No courses found.</td></tr>}
            {courses.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td><td>{item.code}</td><td>{item.title}</td><td>{item.credits}</td>
                <td>
                  <button type="button" className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(item)}>Edit</button>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Courses;
