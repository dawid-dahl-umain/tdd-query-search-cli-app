import { promises as fsPromises } from "fs"
import { FileReader } from "./file-reader"
import { FileNotFoundError, GenericFileError } from "./file-reader.error"

describe("FileReader", () => {
    let fileReader: FileReader

    beforeEach(() => {
        fileReader = new FileReader()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it("should return file content as string when readToString is called", async () => {
        const mockFilePath = "/path/to/file.txt"
        const mockFileContent = "file content"

        const readFileSpy = jest
            .spyOn(fsPromises, "readFile")
            .mockResolvedValue(mockFileContent)

        const result = await fileReader.readToString(mockFilePath)

        expect(readFileSpy).toHaveBeenCalledWith(
            mockFilePath,
            expect.any(Object)
        )
        expect(result).toBe(mockFileContent)
    })

    it("should throw a GenericFileError when readToString encounters a general error", async () => {
        const mockFilePath = "/path/to/invalid-file.txt"

        jest.spyOn(fsPromises, "readFile").mockRejectedValue(
            new Error("Some other error")
        )

        await expect(fileReader.readToString(mockFilePath)).rejects.toThrow(
            GenericFileError
        )
    })

    it("should throw a FileNotFoundError when readToString encounters a file-not-found error", async () => {
        const mockFilePath = "/path/to/invalid-file.txt"

        jest.spyOn(fsPromises, "readFile").mockRejectedValue(
            new Error("no such file or directory")
        )

        await expect(fileReader.readToString(mockFilePath)).rejects.toThrow(
            FileNotFoundError
        )
    })
})
