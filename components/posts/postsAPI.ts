import PostController from './postsController';
import { authenticate, authorize } from '../../middleware/auth';
import { uploadImages } from "../../services/multer";
import { Injector } from '../../DI/Injector';

const postController = Injector.resolve<PostController>(PostController);

const postRoutes = {
    createPost: {
        path: "/posts",
        method: "post",
        handler: [authenticate, authorize(["lecture"]), uploadImages.any(), postController.createPost, postController.uploadImages]
    },
    getPosts: {
        path: "/posts",
        method: "get",
        handler: [authenticate, postController.getPosts]
    },
    interactPost: {
        path: "/posts/interact",
        method: "post",
        handler: [authenticate, postController.interactPost]
    }
}

const postAPIs = Object.values(postRoutes);

export default postAPIs;