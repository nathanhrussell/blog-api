import { useParams } from "react-router-dom";
import PostForm from "./PostForm";

function EditPost() {
  const { id } = useParams();
  return <PostForm mode="edit" postId={id} />;
}

export default EditPost;
