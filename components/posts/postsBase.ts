interface IPost {
    createPost: (accountId: string, postContent: string) => {}
    updatePost: (postId: number, postContent: string) => {};
    deletePost: (postId: number) => {};
    createMultiImgs: (values: Array<string[]>) => {};
    joinImgs: () => {};
    joinLikes: () => {};
    joinLecture: () => {};
    createInteract: (table: string, postId: string, accountId: string, fullName: string) => {}
    deleteInteract: (table: string, postId: string, accountId: string) => {}
};

export default IPost;