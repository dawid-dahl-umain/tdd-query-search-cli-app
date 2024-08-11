import { IFileReader } from "./file-reader"

type QuerySearcherMatchTuple = [number, string]

export class QuerySearcherMatch {
    static create(
        lineNumber: number,
        lineContent: string
    ): QuerySearcherMatchTuple {
        return [lineNumber, lineContent]
    }
}

export class QuerySearcher {
    private fileReader: IFileReader

    constructor(fileReader: IFileReader) {
        this.fileReader = fileReader
    }

    public async search(
        query: string,
        filePath: string
    ): Promise<QuerySearcherMatchTuple[]> {
        const content = await this.fileReader.readToString(filePath)
        const lowerCaseQuery = query.toLowerCase()

        const result = content
            .split("\n")
            .map((line, index) => QuerySearcherMatch.create(index + 1, line))
            .filter(([_, lineContent]) =>
                lineContent.toLowerCase().includes(lowerCaseQuery)
            )

        return result.length > 0 ? result : [QuerySearcherMatch.create(0, "")]
    }
}
