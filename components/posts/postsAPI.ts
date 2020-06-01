import PostController from './postsController';
import { authenticate, authorize } from '../../middleware/auth';
import { uploadImages, uploadAttachment } from "../../services/multer";
import { Injector } from '../../DI/Injector';

const postController = Injector.resolve<PostController>(PostController);

const postRoutes = {
    createPost: {
        path: "/posts",
        method: "post",
        handler: [authenticate, uploadImages("posts").any(), postController.createPost, postController.uploadFiles("post")]
    },
    createPostPDF: {
        path: "/posts/pdf",
        method: "post",
        handler: [authenticate, uploadAttachment("pdf").any(), postController.createPost, postController.uploadFiles("pdf")]
    },
    delPost: {
        path: "/posts",
        method: "delete",
        handler: [authenticate, postController.deletePost]
    },
    getPosts: {
        path: "/posts",
        method: "get",
        handler: [authenticate, postController.getPosts]
    },
    getPostById: {
        path: "/posts/detail/:postId",
        method: "get",
        handler: [authenticate, postController.getPostDetail]
    },
    interactPost: {
        path: "/posts/interact",
        method: "post",
        handler: [authenticate, postController.interactPost]
    },
    getImgs: {
        path: "/images",
        method: "get",
        handler: [authenticate, postController.getImgs]
    }
}

const postAPIs = Object.values(postRoutes);

export default postAPIs;