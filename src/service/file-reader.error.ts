export class FileNotFoundError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "FileNotFoundError"
    }
}

export class GenericFileError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "GenericFileError"
    }
}
