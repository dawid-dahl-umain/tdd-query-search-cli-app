import { resolve } from "path"
import { FileNotFoundError, GenericFileError } from "./file-reader.error"
import { promises as fs } from "fs"

export interface IFileReader extends IFileReaderRead {}

export interface IFileReaderRead {
    readToString(filePath: string): Promise<string>
}

export type IFileSystem = Pick<typeof fs, "readFile">

export class FileReader implements IFileReader {
    constructor(private readonly fileSystem: IFileSystem) {}

    public async readToString(filePath: string): Promise<string> {
        try {
            const absolutePath = resolve(filePath)

            return await this.fileSystem.readFile(absolutePath, {
                encoding: "utf8"
            })
        } catch (error) {
            if (
                error instanceof Error &&
                error.message.toLowerCase().includes("no such file")
            ) {
                throw new FileNotFoundError(`File not found: ${filePath}`)
            } else {
                throw new GenericFileError(`Error reading file: ${filePath}`)
            }
        }
    }
}
