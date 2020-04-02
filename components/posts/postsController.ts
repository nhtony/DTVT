import { Request, Response, NextFunction } from "express";
import { Controller } from "../../DI/Controller";
import postSchema from "./post";
import PostService from './postsService';
import LectureService from '../lectures/lecturesService';
import StudentService from '../students/studentsService';
import { check } from '../../common/error';

@Controller()
class PostsController {

    /**
     * postId => image(postId)
     * post = [
     * {
     * postId: 
     * accountId:
     * postContent:
     * imageUrl: []
     * liked: [accountId]
     * isLike: check req.id từ token xem có thuộc trong mảng liked hay không?
     * }]
     */

    private nextReq = {
        postId: ''
    };

    constructor(
        protected postService: PostService,
        protected lectureService: LectureService,
        protected studentService: StudentService
    ) { }

    getPosts = async (req: ReqType, res: Response) => {
        try {
            const joinImgs = await this.postService.joinImgs();
            const joinLikes = await this.postService.joinLikes();

            const splitImage: { [index: string]: any } = {};
            const splitLike: { [index: string]: any } = {};
            const isLike: { [index: string]: boolean } = {};

            joinImgs.recordset.map((item: any) => {
                const image = {
                    id: item.imageId,
                    imageUrl: item.imageUrl
                }
                splitImage[item.postId] ? splitImage[item.postId].push(image) : splitImage[item.postId] = image.id ? [image] : null;
            });

            joinLikes.recordset.map((item: any) => {
                const like = {
                    id: item.likeId,
                    accountName: item.accountName
                }
                splitLike[item.postId] ? splitLike[item.postId].push(like) : splitLike[item.postId] = like.id ? [like] : null;
                isLike[item.postId] = req.id === item.accountId;
            })

            const getAllPosts = await this.postService.joinLecture();

            const resultPosts = getAllPosts.recordset.map((post: any) => {
                post.id = post.id.toString();
                return { ...post, images: splitImage[post.id], liked: splitLike[post.id], isLike: isLike[post.id] }
            })

            res.status(200).send(resultPosts.reverse());
        } catch (error) {
            console.log("PostsController -> getPosts -> error", error)
            res.status(500).send();
        }
    }

    createPost = async (req: ReqType, res: Response, next: NextFunction) => {
        try {
            const validResult = postSchema.validate(req.body, { abortEarly: false });

            if (validResult.error) return res.status(422).send({ message: 'Validation fail!', data: validResult.error.details });

            const { postContent } = req.body;

            const newPost = await this.postService.createPost(req.id, postContent);

            if (check(newPost, 'NOT_CHANGED')) return res.status(500).send({ message: 'Fail!' });

            this.nextReq.postId = newPost.recordset[0].postId;

            console.log(req.files.length)

            req.files.length > 0 ? next() : res.status(200).send({ message: 'Thành công!' });
        } catch (error) {
            console.log("TCL: LecturesController -> getLeclureByID -> error", error)
            res.status(500).send({ error: 'Fail!' });
        }
    }

    uploadImages = async (req: ReqType, res: Response) => {
        try {
            let imageUrlArr: Array<string[]> = [];

            (req.files || []).map(file => imageUrlArr.push([`'${file.path}'`, this.nextReq.postId]))

            const saveImages = await this.postService.createMultiImgs(imageUrlArr);

            if (check(saveImages, 'NOT_CHANGED')) return res.status(500).send({ message: 'Fail!' });

            res.status(200).send({ message: 'Thành công!' });
        } catch (error) {
            console.log("PostsController -> uploadImages -> error", error)
            res.status(500).send();
        }
    }

    interactPost = async (req: ReqType, res: Response) => {
        try {
            const { postId, status, type } = req.body;

            const { id, role } = req;

            const checkWho: { [index: string]: boolean } = { lecture: true, student: false }

            const account = checkWho[role] ? await this.lectureService.findBy({ACCOUNT_ID: id}) : await this.studentService.findBy({ACCOUNT_ID:id});

            const { HO_GIANG_VIEN, HO_SINH_VIEN, TEN_GIANG_VIEN, TEN_SINH_VIEN } = account.recordset[0];

            const fullName = checkWho[role] ? HO_GIANG_VIEN + " " + TEN_GIANG_VIEN : HO_SINH_VIEN + " " + TEN_SINH_VIEN;

            const statusObj: { [index: string]: StatusObjType } = {
                do: {
                    service: this.postService.createInteract,
                    check: "NOT_CHANGED",
                },
                un: {
                    service: this.postService.deleteInteract,
                    check: "NOT_DELETED",
                },
            };

            const table: { [index: string]: string } = {
                like: "POST_LIKE",
                save: "POST_SAVE"
            }

            const handleInteract = await statusObj[status].service(table[type], postId, id, fullName)

            if (check(handleInteract, statusObj[status].check)) return res.status(500).send({ message: 'Fail!' });

            res.status(200).send({ message: `${status + type} thành công!` });
        } catch (error) {
            console.log("PostsController -> likePost -> error", error)
            res.status(500).send();
        }
    }
}

export default PostsController;

type BodyType = {
    postContent: string;
    postId: string;
    status: string;
    type: string;
}

type FilesType = {
    path: string;
}

type ReqType = {
    id: string;
    role: string;
    files: FilesType[];
    body: BodyType;
}

type StatusObjType = {
    service: (table: string, postId: string, accountId: string, fullName: string) => {};
    check: string;
}
