import { ArgumentsCamelCase, Argv } from "yargs"
import { logger } from "../logger"
import {
    QuerySearcher,
    QuerySearcherMatchTuple
} from "../service/query-searcher"

export interface QuerySearchArgv {
    query?: string
    content?: string
}

export const command = "query-search"
export const describe = "Query search in a file."
export const aliases = ["q"]

const isNoMatch = (result: QuerySearcherMatchTuple[]): boolean =>
    result.length === 1 && result[0] !== undefined && result[0][0] === 0

export function builder(yargs: Argv<QuerySearchArgv>): Argv<QuerySearchArgv> {
    return yargs
        .option("query", {
            type: "string",
            alias: "q",
            describe: "Query to search in the file."
        })
        .option("content", {
            type: "string",
            alias: "f",
            describe: "Content to search in."
        })
}

export async function handler(argv: ArgumentsCamelCase<QuerySearchArgv>) {
    try {
        const { query, content } = argv

        if (!query || !content) {
            logger.error("Both query and content are required.")

            return
        }

        const querySearcher = new QuerySearcher()

        const result = await querySearcher.search(query, content)

        if (isNoMatch(result)) {
            logger.log("No matches")

            return
        }

        logger.log(
            `${result.map(querySearchMatch => `${querySearchMatch[0]}: ${querySearchMatch[1]}`).join("\n")}`
        )
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "An error occurred."

        logger.error(errorMessage)

        return
    }
}
