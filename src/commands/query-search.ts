import { ArgumentsCamelCase, Argv } from "yargs"
import { logger } from "../logger"
import {
    QuerySearcher,
    QuerySearcherMatchTuple
} from "../service/query-searcher"
import { FileReader } from "../service/file-reader"

export interface QuerySearchArgv {
    query?: string
    filePath?: string
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
        .option("filePath", {
            type: "string",
            alias: "f",
            describe: "Path to the file."
        })
}

export async function handler(argv: ArgumentsCamelCase<QuerySearchArgv>) {
    try {
        const { query, filePath } = argv

        if (!query || !filePath) {
            logger.log("Both query and filePath are required.")

            return
        }

        const querySearcher = new QuerySearcher(new FileReader())

        const result = await querySearcher.search(query, filePath)

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
