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
    /**
     *
     * @param query The query to search for.
     * @param content The content to search in.
     * @returns An array of tuples containing the line number and the line content.
     */
    public async search(
        query: string,
        content: string
    ): Promise<QuerySearcherMatchTuple[]> {
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
