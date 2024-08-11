import { ArgumentsCamelCase } from "yargs"
import { logger } from "../logger"
import { handler, QuerySearchArgv } from "./query-search"

jest.mock("../logger", () => ({
    logger: {
        prompt: jest.fn(),
        log: jest.fn()
    }
}))

describe("QuerySearch CLI", () => {
    let loggerSpy: jest.SpyInstance

    beforeEach(() => {
        jest.clearAllMocks()

        loggerSpy = jest.spyOn(logger, "log")
    })

    afterEach(() => {
        loggerSpy.mockRestore()
    })

    it("should print single line when matched with single", async () => {
        await handler({
            query: "joyful life",
            filePath: "./src/data/happiness.txt"
        } as ArgumentsCamelCase<QuerySearchArgv>)

        expect(loggerSpy).toHaveBeenCalledWith(
            expect.stringContaining(
                "4: Savor the simple joys for a joyful life."
            )
        )
    })
})
