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
    interactPost: {
        path: "/posts/interact",
        method: "post",
        handler: [authenticate, postController.interactPost]
    },
    getInteracts: {
        path: "/interacts",
        method: "get",
        handler: [authenticate, postController.getInteracts]
    },
    getImgs: {
        path: "/images",
        method: "get",
        handler: [authenticate, postController.getImgs]
    }
}

const postAPIs = Object.values(postRoutes);

export default postAPIs;