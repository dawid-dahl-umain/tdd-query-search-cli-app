import { promises as fsPromises } from "fs"
import { resolve } from "path"
import { FileNotFoundError, GenericFileError } from "./file-reader.error"

export interface IFileReader extends IFileReaderRead {}

export interface IFileReaderRead {
    readToString(filePath: string): Promise<string>
}

export class FileReader implements IFileReader {
    public async readToString(filePath: string): Promise<string> {
        try {
            const absolutePath = resolve(filePath)

            return await fsPromises.readFile(absolutePath, {
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
