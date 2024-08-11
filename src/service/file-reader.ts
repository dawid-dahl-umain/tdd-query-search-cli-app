import { promises as fsPromises } from "fs"
import { resolve } from "path"

export interface IFileReader extends IFileReaderRead {}

export interface IFileReaderRead {
    readToString(filePath: string): Promise<string>
}

export class FileReader implements IFileReader {
    public async readToString(filePath: string): Promise<string> {
        try {
            const absolutePath = resolve(filePath)

            const data = await fsPromises.readFile(absolutePath, {
                encoding: "utf8"
            })

            return data
        } catch (error) {
            console.error("Error reading file:", error)

            return ""
        }
    }
}
