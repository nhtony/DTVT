const SOCKET = {
    CREATE_POST_NOTI: "CREATE_POST_NOTI"
}

const socketIO = (io: any) => {
    io.on('connect', (socket: any) => {
        socket.on(SOCKET.CREATE_POST_NOTI, (noti: any) => {
            socket.broadcast.emit(SOCKET.CREATE_POST_NOTI, noti)
        })
    })
}

export default socketIO;