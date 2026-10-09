import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { SourceTextModule, SyntheticModule, createContext } from "node:vm";

// Load the Vite service with mock HTTP helpers; assertions verify outgoing requests.
const requests = [];
const context = createContext({ Blob, FormData });
const constants = new SourceTextModule(await readFile(new URL("../src/features/reader/story-books/constants/storyBooksConstants.js", import.meta.url), "utf8"), { context });
await constants.link(() => { throw new Error("Unexpected constants dependency"); });
await constants.evaluate();
const helperNames = ["getHelper", "postHelper", "putHelper", "patchHelper", "deleteHelper", "postFormDataHelper"];
const helpers = new SyntheticModule(helperNames, function () {
  for (const name of helperNames) this.setExport(name, async (request) => {
    requests.push(request);
    return { messageStatus: "SUCCESS", data: { id: 1 } };
  });
}, { context });
const sanitize = new SyntheticModule(["sanitizeId"], function () { this.setExport("sanitizeId", String); }, { context });
const service = new SourceTextModule(await readFile(new URL("../src/features/reader/story-books/services/storyBooksService.js", import.meta.url), "utf8"), {
  context,
  initializeImportMeta(meta) { meta.env = {}; },
});
await service.link((specifier) => {
  if (specifier.endsWith("storyBooksConstants")) return constants;
  if (specifier.endsWith("apiHelpers")) return helpers;
  if (specifier.endsWith("sanitize")) return sanitize;
  throw new Error(`Unexpected dependency: ${specifier}`);
});
await service.evaluate();
const { storyBooksService, validateStorybookPayload } = service.namespace;
const { STORYBOOK_VALIDATION, COMPANION_TYPES } = constants.namespace;
const payload = (nameAr) => ({ pageCount: 16, child: { nameAr }, companion: { type: "CAT", nameAr: "قطتي", petColor: "ORANGE" } });

test("child names match the backend rule after trimming", () => {
  for (const name of ["علي", "علي حسن", "  ليلى  ", "عَلِي", "ع".repeat(30)]) {
    assert.equal(validateStorybookPayload(payload(name)).valid, true, name);
  }
  for (const name of ["Ali", "علي2", "علي-محمد", "ع".repeat(31), "ع", "عـلي", "َعلي", "", "   ", undefined, 123]) {
    assert.equal(validateStorybookPayload(payload(name)).errors.nameAr, STORYBOOK_VALIDATION.ARABIC_NAME_ERROR, String(name));
  }
});

test("invalid names never send storybook or child-profile requests", async () => {
  requests.length = 0;
  for (const name of ["Ali", "علي2", "علي-محمد", "ع".repeat(31), "ع", ""]) {
    await assert.rejects(storyBooksService.createStoryBook(payload(name)), { message: STORYBOOK_VALIDATION.ARABIC_NAME_ERROR });
    await assert.rejects(storyBooksService.createChild({ nameAr: name }), { message: STORYBOOK_VALIDATION.ARABIC_NAME_ERROR });
  }
  assert.equal(requests.length, 0);
});

test("only pets are selectable; legacy siblings submit as cats with a color", async () => {
  assert.deepEqual(Array.from(COMPANION_TYPES, (option) => option.value), ["CAT", "DOG", "RABBIT", "PARROT"]);
  for (const type of ["BROTHER", "SISTER"]) {
    requests.length = 0;
    const input = payload("  ليلى  ");
    input.companion = { type, nameAr: "أحمد" };
    await storyBooksService.createStoryBook(input);
    assert.equal(requests.length, 1);
    assert.equal(requests[0].body.child.nameAr, "ليلى");
    assert.equal(requests[0].body.companion.type, "CAT");
    assert.equal(requests[0].body.companion.petColor, "ORANGE");
    assert.equal(input.companion.type, type);
  }
});

test("all four pet types retain their color and child-profile names are trimmed", async () => {
  for (const type of ["CAT", "DOG", "RABBIT", "PARROT"]) {
    requests.length = 0;
    const input = payload("علي");
    input.companion.type = type;
    input.companion.petColor = "WHITE";
    await storyBooksService.createStoryBook(input);
    assert.equal(requests[0].body.companion.type, type);
    assert.equal(requests[0].body.companion.petColor, "WHITE");
  }
  requests.length = 0;
  await storyBooksService.createChild({ nameAr: "  ليلى  " });
  assert.equal(requests[0].body.nameAr, "ليلى");
});
