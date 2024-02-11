# Assert Files

A (not particularly sophisticated) helper for asserting that two parts of a filesystem are equal, to be used in tests for deno.

`assertFs(got, expected)` ensures that for each file or directory in the directories `got` and `expected`:

- if one contains a file, the other also contains a file of the same name and same contents, and
- if one of them contains a subdirectory, the other contains a subdirectory of the same name, and those two subdirectories are equal by the same criteria.

Only works with utf-8 encoded files. This isn't suposed to be general-purpose or fancy.