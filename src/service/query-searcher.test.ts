import { QuerySearcher, QuerySearcherMatch } from "./query-searcher"

describe("QuerySearcher", () => {
    let querySearcher: QuerySearcher

    beforeEach(() => {
        querySearcher = new QuerySearcher()
    })

    it("should return single line when matched with single line", async () => {
        // Arrange
        const query = "TDD"
        const content = "TDD Rocks!"

        // Act
        const result = await querySearcher.search(query, content)

        // Assert
        expect(result).toStrictEqual([
            QuerySearcherMatch.create(1, "TDD Rocks!")
        ])
    })

    it("should return single line when matched with single line with a different casing", async () => {
        // Arrange
        const query = "tdd"
        const content = "TDD Rocks!"

        // Act
        const result = await querySearcher.search(query, content)

        // Assert
        expect(result).toStrictEqual([
            QuerySearcherMatch.create(1, "TDD Rocks!")
        ])
    })

    it("should return no line when matches with none", async () => {
        // Arrange
        const query = "pizza"
        const content = "TDD rocks!"

        // Act
        const result = await querySearcher.search(query, content)

        // Assert
        expect(result).toStrictEqual([QuerySearcherMatch.create(0, "")])
    })

    it.each([
        {
            content: "Life is great\nTDD rocks",
            expectedLineNumber: 2,
            expectedLineContent: "TDD rocks"
        },
        {
            content: "TDD rocks\nLife is great",
            expectedLineNumber: 1,
            expectedLineContent: "TDD rocks"
        }
    ])(
        "should find a line containing the query in a multi-line string and return its line number and content",
        async ({ content, expectedLineNumber, expectedLineContent }) => {
            // Arrange
            const query = "TDD"

            // Act
            const result = await querySearcher.search(query, content)

            // Assert
            expect(result).toStrictEqual([
                QuerySearcherMatch.create(
                    expectedLineNumber,
                    expectedLineContent
                )
            ])
        }
    )

    it("should return multiple lines when matched with multiple", async () => {
        // Arrange
        const query = "TDD"
        const content =
            "Life is great\nTDD rocks\nClean code is mandatory\nIn TDD we always start writing with a failing test"

        // Act
        const result = await querySearcher.search(query, content)

        // Assert
        expect(result).toStrictEqual([
            QuerySearcherMatch.create(2, "TDD rocks"),
            QuerySearcherMatch.create(
                4,
                "In TDD we always start writing with a failing test"
            )
        ])
    })
})

describe("QuerySearcherMatch", () => {
    it("should return line number and content", () => {
        // Arrange
        const lineNumber = 1
        const lineContent = "TDD Rocks!"

        // Act
        const result = QuerySearcherMatch.create(lineNumber, lineContent)

        // Assert
        expect(result).toStrictEqual([1, "TDD Rocks!"])
    })

    it("should handle zero as line number", () => {
        // Arrange
        const lineNumber = 0
        const lineContent = "Zero Line Number"

        // Act
        const result = QuerySearcherMatch.create(lineNumber, lineContent)

        // Assert
        expect(result).toStrictEqual([0, "Zero Line Number"])
    })

    it("should handle empty string content", () => {
        // Arrange
        const lineNumber = 1
        const lineContent = ""

        // Act
        const result = QuerySearcherMatch.create(lineNumber, lineContent)

        // Assert
        expect(result).toStrictEqual([1, ""])
    })

    it("should handle undefined content", () => {
        // Arrange
        const lineNumber = 1
        const lineContent = undefined as unknown as string

        // Act
        const result = QuerySearcherMatch.create(lineNumber, lineContent)

        // Assert
        expect(result).toStrictEqual([1, undefined])
    })

    it("should handle null content", () => {
        // Arrange
        const lineNumber = 1
        const lineContent = null as unknown as string

        // Act
        const result = QuerySearcherMatch.create(lineNumber, lineContent)

        // Assert
        expect(result).toStrictEqual([1, null])
    })

    it("should handle being called without arguments", () => {
        // Arrange
        const lineNumber = undefined as unknown as number
        const lineContent = undefined as unknown as string

        // Act
        const result = QuerySearcherMatch.create(lineNumber, lineContent)

        // Assert
        expect(result).toStrictEqual([0, undefined])
    })
})
