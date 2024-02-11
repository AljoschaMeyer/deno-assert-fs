import { Colors } from "./deps.ts";
import { fail, fs, join } from "./deps.ts";

export function assertFs(gotPath: string, expectedPath: string) {
  assertAsymmetric(gotPath, expectedPath, true);
  assertAsymmetric(expectedPath, gotPath, false);
}

export function assertAsymmetric(
  p1: string,
  p2: string,
  firstArgIsGot: boolean,
) {
  if (!Deno.statSync(p1).isDirectory) {
    fail(`Expected ${Colors.cyan(p1)} to be a directory.`);
  }
  if (!Deno.statSync(p2).isDirectory) {
    fail(`Expected ${Colors.cyan(p2)} to be a directory.`);
  }

  for (
    const entry of fs.walkSync(p1, {
      includeDirs: true,
      includeFiles: true,
    })
  ) {
    const p = entry.path;
    const suffix = p.slice(p1.length);
    const otherP = join(p2, suffix);
    const otherStats = Deno.statSync(otherP);

    const styledP = firstArgIsGot ? Colors.red(p) : Colors.green(p);
    const styledOtherP = firstArgIsGot ? Colors.green(p) : Colors.red(p);

    if (entry.isDirectory && !otherStats.isDirectory) {
      fail(
        `Mismatching directories: ${styledP} is a directory, but ${styledOtherP} is not.`,
      );
    } else if (entry.isFile && !otherStats.isFile) {
      fail(
        `Mismatching file types: ${styledP} is a file, but ${styledOtherP} is not.`,
      );
    } else if (entry.isFile && otherStats.isFile) {
      const pContent = Deno.readTextFileSync(p);
      const otherPContent = Deno.readTextFileSync(otherP);

      if (pContent != otherPContent) {
        fail(`Nonequal file contents at ${styledOtherP} and ${styledP}.

${styledOtherP}:
${Colors.red(otherPContent)}
----====-----=====------======-----=====----====----
${styledP}:
${Colors.green(pContent)}`);
      }
    }
  }
}
