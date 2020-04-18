import { Request, Response, NextFunction } from "express";
import { Controller } from "../../DI/Controller";
import postSchema from "./post";
import PostService from './postsService';
import LectureService from '../lectures/lecturesService';
import StudentService from '../students/studentsService';
import { check } from '../../common/error';
import fs from "fs";

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
        postId: '',
        newPost: null,
    };

    constructor(
        protected postService: PostService,
        protected lectureService: LectureService,
        protected studentService: StudentService
    ) { }

    getPosts = async (req: ReqType, res: Response) => {
        try {
            const page = parseInt(req.query.page)
            const limit = parseInt(req.query.limit)
            
            const startIndex = (page - 1) * limit

            const firstImgs = await this.postService.firstImgs();
            const joinLikes = await this.postService.joinLikes();
            const countLikes = await this.postService.countInteract();

            const splitImage: { [index: string]: any } = {};
            const isLike: { [index: string]: boolean } = {};
            const numLikes: { [index: string]: number } = {};

            firstImgs.recordset.map((item: any) => {
                const image = {
                    id: item.imageId,
                    imageUrl: item.imageUrl
                }
                splitImage[item.postId] = image.id ? image : null;
            });

            for (let item of joinLikes.recordset) {
                if (req.id === item.accountId) {
                    isLike[item.postId] = true;
                }
            }

            for (let item of countLikes.recordset) {
                numLikes[item.postId] = item.numInteract
            }

            const getAllPosts = await this.postService.getPosts(startIndex, limit);

            const resultPosts = getAllPosts.recordset.map((post: any) => {
                post.id = post.id.toString();
                return {
                    ...post,
                    firstImg: splitImage[post.id],
                    numInteract: numLikes[post.id] ? numLikes[post.id] : 0,
                    isLike: isLike[post.id] ? true : false
                }
            })

            res.status(200).send(resultPosts);
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

            const newPost = await this.postService.createPost(req.id, req.files.length, postContent);

            if (check(newPost, 'NOT_CHANGED')) return res.status(500).send({ message: 'Fail!' });

            const postRecord = newPost.recordset[0];

            const account = await this.lectureService.findBy({MA_GIANG_VIEN: req.id}, "HO_GIANG_VIEN", "TEN_GIANG_VIEN")

            const { HO_GIANG_VIEN, TEN_GIANG_VIEN } = account.recordset[0];

            const createdBy = HO_GIANG_VIEN + " " + TEN_GIANG_VIEN;

            this.nextReq.newPost = {...postRecord, createdBy};

            this.nextReq.postId = postRecord.postId;

            req.files.length > 0 ? next() : res.status(200).send(this.nextReq.newPost);
        } catch (error) {
            console.log("TCL: PostsController -> createPost -> error", error)
            res.status(500).send({ error: 'Fail!' });
        }
    }

    uploadImages = async (req: ReqType, res: Response) => {
        try {
            let imageUrlArr: Array<string[]> = [];

            (req.files || []).map(file => imageUrlArr.push([`'${file.path}'`, this.nextReq.postId]))

            const saveImages = await this.postService.createMultiImgs(imageUrlArr);

            if (check(saveImages, 'NOT_CHANGED')) return res.status(500).send({ message: 'Fail!' });

            res.status(200).send(this.nextReq.newPost);
        } catch (error) {
            console.log("PostsController -> uploadImages -> error", error)
            res.status(500).send({ error: 'Fail!' });
        }
    }

    deletePost = async (req: Request, res: Response) => {
        try {
            const { postId, haveImgs, haveInteract } = req.body;

            const postDel = await this.postService.deletePost(postId, haveImgs, haveInteract);

            if (check(postDel, 'NOT_DELETED')) return res.status(500).send({ message: 'Fail!' });

            haveImgs && postDel.recordset.forEach((item: any) => {
                fs.unlinkSync(item.imgUrl)
            });

            res.status(200).send({ message: `Đã xóa thành công!` });
        } catch (error) {
            console.log("PostsController -> deletePost -> error", error)
            res.status(500).send();
        }
    }

    interactPost = async (req: ReqType, res: Response) => {
        try {
            const { postId, status } = req.body;

            const { id, role } = req;

            const checkWho: { [index: string]: boolean } = { lecture: true, student: false }

            const account = checkWho[role] ? await this.lectureService.findBy({ACCOUNT_ID: id}) : await this.studentService.findBy({ACCOUNT_ID:id});

            const { HO_GIANG_VIEN, HO_SINH_VIEN, TEN_GIANG_VIEN, TEN_SINH_VIEN } = account.recordset[0];

            const fullName = checkWho[role] ? HO_GIANG_VIEN + " " + TEN_GIANG_VIEN : HO_SINH_VIEN + " " + TEN_SINH_VIEN;

            const statusObj: { [index: string]: StatusObjType } = {
                like: {
                    service: this.postService.createInteract,
                    check: "NOT_CHANGED",
                },
                unlike: {
                    service: this.postService.deleteInteract,
                    check: "NOT_DELETED",
                },
            };

            const handleInteract = await statusObj[status].service(postId, id, fullName)

            if (check(handleInteract, statusObj[status].check)) return res.status(500).send({ message: 'Fail!' });

            res.status(200).send({ message: `${status} thành công!` });
        } catch (error) {
            console.log("PostsController -> interactPost -> error", error)
            res.status(500).send();
        }
    }
    
    getInteracts = async (req: ReqType, res: Response) => {
        try {
            const { postId } = req.query;

            const interacts = await this.postService.getInteracts(postId)
            
            res.status(200).send(interacts.recordset);
        } catch (error) {
            console.log("PostsController -> getImgs -> error", error)
            res.status(500).send();
        }
    }

    getImgs = async (req: ReqType, res: Response) => {
        try {
            const { postId } = req.query;

            const imgs = await this.postService.getImgs(postId)
            
            res.status(200).send(imgs.recordset);
        } catch (error) {
            console.log("PostsController -> getImgs -> error", error)
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

type QueryType = {
    page: string;
    limit: string;
    postId: string;
}

type ReqType = {
    id: string;
    role: string;
    files: FilesType[];
    body: BodyType;
    query: QueryType;
}

type StatusObjType = {
    service: (postId: string, accountId: string, fullName: string) => {};
    check: string;
}
