interface OTPDAL {
    update: (code:string,email:string,ms:string) => {}
    find:(otp:string,ms:string) => {}
    delete: (otp:string) => {}
}

export default OTPDAL;