import { IFileReader } from "./file-reader"

export type QuerySearcherMatchTuple = [number, string]

export class QuerySearcherMatch {
    static create(
        lineNumber: number,
        lineContent: string
    ): QuerySearcherMatchTuple {
        return [lineNumber ?? 0, lineContent]
    }
}

export class QuerySearcher {
    private fileReader: IFileReader

    constructor(fileReader: IFileReader) {
        this.fileReader = fileReader
    }

    /**
     *
     * @param query The query to search for.
     * @param filePath The path to the file to search in. Query Searcher will attempt to resolve the path and supply the content to the search function.
     * @returns An array of tuples containing the line number and the line content.
     */
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
