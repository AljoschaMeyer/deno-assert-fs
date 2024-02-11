import { assertThrows } from "https://deno.land/std@0.215.0/assert/mod.ts";
import {assertFs} from "../mod.ts";

Deno.test("equality", () => {
  assertFs("dirA", "dirB");
});

Deno.test("equality symmetric", () => {
  assertFs("dirB", "dirA");
});

Deno.test("nonequal directories", () => {
  assertThrows(() => assertFs("dirA", "dirC"));
  assertThrows(() => assertFs("dirA", "dirD"));
  assertThrows(() => assertFs("dirA", "dirE"));
  assertThrows(() => assertFs("dirA", "dirF"));
  assertThrows(() => assertFs("dirC", "dirA"));
  assertThrows(() => assertFs("dirD", "dirA"));
  assertThrows(() => assertFs("dirE", "dirA"));
  assertThrows(() => assertFs("dirF", "dirA"));
});
