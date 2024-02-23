import { Colors } from "./deps.ts";
import { fail, fs, join } from "./deps.ts";

export async function assertFs(gotPath: string, expectedPath: string) {
  await assertAsymmetric(gotPath, expectedPath, true);
  await assertAsymmetric(expectedPath, gotPath, false);
}

async function assertAsymmetric(
  p1: string,
  p2: string,
  firstArgIsGot: boolean,
) {
  if (!(await Deno.stat(p1)).isDirectory) {
    fail(`Expected ${Colors.cyan(p1)} to be a directory.`);
  }
  if (!(await Deno.stat(p2)).isDirectory) {
    fail(`Expected ${Colors.cyan(p2)} to be a directory.`);
  }

  for await (
    const entry of fs.walk(p1, {
      includeDirs: true,
      includeFiles: true,
    })
  ) {
    if (entry.path === p1) {
      continue;
    }
    const p = entry.path;
    const suffix = p.slice(p1.length);
    const otherP = join(p2, suffix);

    const otherStats = await Deno.stat(otherP);

    const styledP = firstArgIsGot ? Colors.red(p) : Colors.green(p);
    const styledOtherP = firstArgIsGot
      ? Colors.green(otherP)
      : Colors.red(otherP);

    if (entry.isDirectory && !otherStats.isDirectory) {
      fail(
        `Mismatching directories: ${styledP} is a directory, but ${styledOtherP} is not.`,
      );
    } else if (entry.isFile && !otherStats.isFile) {
      fail(
        `Mismatching file types: ${styledP} is a file, but ${styledOtherP} is not.`,
      );
    } else if (entry.isFile && otherStats.isFile) {
      const pContent = await Deno.readTextFile(p);
      const otherPContent = await Deno.readTextFile(otherP);

      if (pContent != otherPContent) {
        fail(`Nonequal file contents at ${styledOtherP} and ${styledP}.

${styledOtherP}:
${firstArgIsGot ? Colors.green(otherPContent) : Colors.red(otherPContent)}
----====-----=====------======-----=====----====----
${styledP}:
${firstArgIsGot ? Colors.red(pContent) : Colors.green(pContent)}`);
      }
    }
  }
}

export function assertFsSync(gotPath: string, expectedPath: string) {
  assertAsymmetricSync(gotPath, expectedPath, true);
  assertAsymmetricSync(expectedPath, gotPath, false);
}

function assertAsymmetricSync(
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
    if (entry.path === p1) {
      continue;
    }
    const p = entry.path;
    const suffix = p.slice(p1.length);
    const otherP = join(p2, suffix);

    const otherStats = Deno.statSync(otherP);

    const styledP = firstArgIsGot ? Colors.red(p) : Colors.green(p);
    const styledOtherP = firstArgIsGot
      ? Colors.green(otherP)
      : Colors.red(otherP);

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
${firstArgIsGot ? Colors.green(otherPContent) : Colors.red(otherPContent)}
----====-----=====------======-----=====----====----
${styledP}:
${firstArgIsGot ? Colors.red(pContent) : Colors.green(pContent)}`);
      }
    }
  }
}
