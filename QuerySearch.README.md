# Running the Query Search CLI

## Using pnpm start

To run the query-search command using `pnpm start`, use the following format:

```bash
pnpm start query-search --query <your-query> --filePath <path-to-file>
```

Or using the shorter alias and option names:

```bash
pnpm start q -q <your-query> -f <path-to-file>
```

For example, to search for the word "simple" in the file "src/test-data/happiness.txt":

```bash
pnpm start query-search --query "simple" --filePath "src/test-data/happiness.txt"
```

Or more concisely:

```bash
pnpm start q -q "simple" -f "src/test-data/happiness.txt"
```

Make sure to run these commands from the root directory of your project.
