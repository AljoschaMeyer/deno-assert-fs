import { assertThrows, assertRejects } from "https://deno.land/std@0.215.0/assert/mod.ts";
import {assertFsSync, assertFs } from "../mod.ts";

Deno.test("equality", async () => {
  await assertFs("dirA", "dirB");
});

Deno.test("equality symmetric", async () => {
  await assertFs("dirB", "dirA");
});

Deno.test("nonequal directories", async () => {
  await assertRejects(async () => await assertFs("dirA", "dirC"));
  await assertRejects(async () => await assertFs("dirA", "dirD"));
  await assertRejects(async () => await assertFs("dirA", "dirE"));
  await assertRejects(async () => await assertFs("dirA", "dirF"));
  await assertRejects(async () => await assertFs("dirC", "dirA"));
  await assertRejects(async () => await assertFs("dirD", "dirA"));
  await assertRejects(async () => await assertFs("dirE", "dirA"));
  await assertRejects(async () => await assertFs("dirF", "dirA"));
});

Deno.test("equality", () => {
  assertFsSync("dirA", "dirB");
});

Deno.test("equality symmetric", () => {
  assertFsSync("dirB", "dirA");
});

Deno.test("nonequal directories", () => {
  assertThrows(() => assertFsSync("dirA", "dirC"));
  assertThrows(() => assertFsSync("dirA", "dirD"));
  assertThrows(() => assertFsSync("dirA", "dirE"));
  assertThrows(() => assertFsSync("dirA", "dirF"));
  assertThrows(() => assertFsSync("dirC", "dirA"));
  assertThrows(() => assertFsSync("dirD", "dirA"));
  assertThrows(() => assertFsSync("dirE", "dirA"));
  assertThrows(() => assertFsSync("dirF", "dirA"));
});
