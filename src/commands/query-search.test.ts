import { ArgumentsCamelCase } from "yargs"
import { logger } from "../logger"
import { handler, QuerySearchArgv } from "./query-search"

jest.mock("../logger", () => ({
    logger: {
        prompt: jest.fn(),
        log: jest.fn(),
        error: jest.fn()
    }
}))

describe("QuerySearch CLI", () => {
    let loggerSpy: jest.SpyInstance
    let errorLoggerSpy: jest.SpyInstance

    beforeEach(() => {
        jest.clearAllMocks()

        loggerSpy = jest.spyOn(logger, "log")
        errorLoggerSpy = jest.spyOn(logger, "error")
    })

    afterEach(() => {
        loggerSpy.mockRestore()
    })

    it("should print single line when matched with single", async () => {
        await handler({
            query: "joyful life",
            filePath: "./src/test-data/happiness.txt"
        } as ArgumentsCamelCase<QuerySearchArgv>)

        expect(loggerSpy).toHaveBeenCalledWith(
            expect.stringContaining(
                "4: Savor the simple joys for a joyful life."
            )
        )
    })

    it("should print multiple lines when matched with multiple", async () => {
        await handler({
            query: "happiness",
            filePath: "./src/test-data/happiness.txt"
        } as ArgumentsCamelCase<QuerySearchArgv>)

        expect(loggerSpy).toHaveBeenCalledWith(
            expect.stringContaining(
                "2: Happiness is found in the little things.\n5: In simplicity, we discover true happiness."
            )
        )
    })

    it("should print no matches when matched with none", async () => {
        await handler({
            query: "pizza",
            filePath: "./src/test-data/happiness.txt"
        } as ArgumentsCamelCase<QuerySearchArgv>)

        expect(loggerSpy).toHaveBeenCalledWith(
            expect.stringContaining("No matches")
        )
    })

    it("should fail when no file path is specified", async () => {
        await handler({
            query: "happiness"
        } as ArgumentsCamelCase<QuerySearchArgv>)

        expect(loggerSpy).toHaveBeenCalledWith(
            "Both query and filePath are required."
        )
    })

    it("should fail when no args specified at all", async () => {
        await handler({
            query: "happiness"
        } as ArgumentsCamelCase<QuerySearchArgv>)

        expect(loggerSpy).toHaveBeenCalledWith(
            "Both query and filePath are required."
        )
    })

    it("should log an error when file doesn't exist", async () => {
        await handler({
            query: "joyful life",
            filePath: "./src/test-data/non-existing-file.txt"
        } as ArgumentsCamelCase<QuerySearchArgv>)

        expect(errorLoggerSpy).toHaveBeenCalledWith(
            expect.stringContaining("Error reading file")
        )
    })
})
