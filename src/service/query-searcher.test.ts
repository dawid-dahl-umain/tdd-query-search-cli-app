import { IFileReader } from "src/service/file-reader"
import { QuerySearcher, QuerySearcherMatch } from "./query-searcher"
import { FileNotFoundError, GenericFileError } from "./file-reader.error"

const fileReaderMockFactory = (lines: string = ""): IFileReader => ({
    readToString: jest.fn().mockResolvedValue(lines)
})

const querySearchUnconfig =
    (
        fileReaderMockFactory: (content?: string, lines?: string) => IFileReader
    ) =>
    async (query: string, content: string) => {
        const fileReaderMock = fileReaderMockFactory(content)

        const querySearcher = new QuerySearcher(fileReaderMock)

        const result = await querySearcher.search(query, content)

        return result
    }

const querySearch = querySearchUnconfig(fileReaderMockFactory)

describe("QuerySearcher", () => {
    it("should return single line when matched with single line", async () => {
        const query = "TDD"
        const content = "TDD Rocks!"

        const result = await querySearch(query, content)

        expect(result).toStrictEqual([
            QuerySearcherMatch.create(1, "TDD Rocks!")
        ])
    })

    it("should return single line when matched with single line with a different casing", async () => {
        const query = "tdd"
        const content = "TDD Rocks!"

        const result = await querySearch(query, content)

        expect(result).toStrictEqual([
            QuerySearcherMatch.create(1, "TDD Rocks!")
        ])
    })

    it("should return single line when matched with another single line", async () => {
        const query = "TDD"
        const content = "Life is great with TDD!"

        const result = await querySearch(query, content)

        expect(result).toStrictEqual([
            QuerySearcherMatch.create(1, "Life is great with TDD!")
        ])
    })

    it("should return no line when matches with none", async () => {
        const query = "pizza"
        const content = "TDD rocks!"

        const result = await querySearch(query, content)

        expect(result).toStrictEqual([QuerySearcherMatch.create(0, "")])
    })

    it("should return single line when matched with second line", async () => {
        const query = "TDD"
        const content = "Life is great\nTDD rocks"

        const result = await querySearch(query, content)

        expect(result).toStrictEqual([
            QuerySearcherMatch.create(2, "TDD rocks")
        ])
    })

    it("should return multiple lines when matched with multiple", async () => {
        const query = "TDD"
        const content =
            "Life is great\nTDD rocks\nClean code is mandatory\nIn TDD we always start writing with a failing test"

        const result = await querySearch(query, content)

        expect(result).toStrictEqual([
            QuerySearcherMatch.create(2, "TDD rocks"),
            QuerySearcherMatch.create(
                4,
                "In TDD we always start writing with a failing test"
            )
        ])
    })

    it("should read a file using the injected fileReader", async () => {
        const query = "mandatory"
        const filePath = "/location"
        const content =
            "Life is great\nTDD rocks\nClean code is mandatory\nIn TDD we always start writing with a failing test"

        const fileReaderMock = fileReaderMockFactory(content)

        const querySearcher = new QuerySearcher(fileReaderMock)

        const result = await querySearcher.search(query, filePath)

        expect(result).toStrictEqual([
            QuerySearcherMatch.create(3, "Clean code is mandatory")
        ])

        const fileReaderMockReadMethodSpy = jest.spyOn(
            fileReaderMock,
            "readToString"
        )

        expect(fileReaderMockReadMethodSpy).toHaveBeenCalledWith("/location")
        expect(fileReaderMockReadMethodSpy).toHaveBeenCalledTimes(1)
        await expect(fileReaderMock.readToString(filePath)).resolves.toBe(
            content
        )
    })

    it("should throw a FileNotFoundError when file is not found", async () => {
        const query = "something"
        const filePath = "/invalid/path"

        const fileReaderMock = {
            readToString: jest
                .fn()
                .mockRejectedValue(new FileNotFoundError("File not found"))
        }

        const querySearcher = new QuerySearcher(fileReaderMock)

        await expect(querySearcher.search(query, filePath)).rejects.toThrow(
            FileNotFoundError
        )
    })

    it("should throw a GenericFileError when a general error occurs", async () => {
        const query = "something"
        const filePath = "/invalid/path"

        const fileReaderMock = {
            readToString: jest
                .fn()
                .mockRejectedValue(new GenericFileError("Some error"))
        }

        const querySearcher = new QuerySearcher(fileReaderMock)

        await expect(querySearcher.search(query, filePath)).rejects.toThrow(
            GenericFileError
        )
    })
})

describe("QuerySearcherMatch", () => {
    it("should return line number and content", () => {
        const lineNumber = 1
        const lineContent = "TDD Rocks!"

        const result = QuerySearcherMatch.create(lineNumber, lineContent)

        expect(result).toStrictEqual([1, "TDD Rocks!"])
    })

    it("should handle zero as line number", () => {
        const lineNumber = 0
        const lineContent = "Zero Line Number"

        const result = QuerySearcherMatch.create(lineNumber, lineContent)

        expect(result).toStrictEqual([0, "Zero Line Number"])
    })

    it("should handle empty string content", () => {
        const lineNumber = 1
        const lineContent = ""

        const result = QuerySearcherMatch.create(lineNumber, lineContent)

        expect(result).toStrictEqual([1, ""])
    })

    it("should handle undefined content", () => {
        const lineNumber = 1
        const lineContent = undefined as unknown as string

        const result = QuerySearcherMatch.create(lineNumber, lineContent)

        expect(result).toStrictEqual([1, undefined])
    })

    it("should handle null content", () => {
        const lineNumber = 1
        const lineContent = null as unknown as string

        const result = QuerySearcherMatch.create(lineNumber, lineContent)

        expect(result).toStrictEqual([1, null])
    })

    it("should handle being called without arguments", () => {
        const result = QuerySearcherMatch.create(
            undefined as unknown as number,
            undefined as unknown as string
        )

        expect(result).toStrictEqual([undefined, undefined])
    })
})
