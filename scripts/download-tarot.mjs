import fs from "node:fs";
import path from "node:path";
import https from "node:https";

const TEMP = "C:/Users/Admin/AppData/Local/Temp";
const baseUrls = fs.readFileSync(`${TEMP}/tarot_base_urls.txt`, "utf-8").trim().split("\n");
const cardsList = fs.readFileSync(`${TEMP}/tarot_cards_list.txt`, "utf-8").trim().split("\n");

const idByTitle = new Map();
for (const line of cardsList) {
  const [id, title] = line.split("|");
  idByTitle.set(title.trim(), id.trim());
}

const outDir = "C:/Users/Admin/dazist/src/assets/tarot";
const WIDTH = 250;
const MIN_VALID_SIZE = 50000;

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; personal-project-script/1.0)" } }, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          download(res.headers.location, dest).then(resolve, reject);
          return;
        }
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on("finish", () => file.close(() => resolve()));
        file.on("error", reject);
      })
      .on("error", reject);
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function isAlreadyOk(dest) {
  try {
    return fs.statSync(dest).size > MIN_VALID_SIZE;
  } catch {
    return false;
  }
}

async function main() {
  let ok = 0;
  let fail = 0;
  const pending = [];

  for (const baseUrl of baseUrls) {
    const filenameEncoded = baseUrl.split("/").pop();
    const filenameDecoded = decodeURIComponent(filenameEncoded).replace(/_/g, " ").replace(/\.png$/, "");
    const id = idByTitle.get(filenameDecoded);
    if (!id) continue;
    const dest = path.join(outDir, `${id}.png`);
    if (isAlreadyOk(dest)) {
      ok++;
      continue;
    }
    pending.push({ id, url: `${baseUrl}/${WIDTH}px-${filenameEncoded}`, dest });
  }

  console.log(`Already have ${ok}, need to fetch ${pending.length}`);

  for (const { id, url, dest } of pending) {
    let attempt = 0;
    let success = false;
    while (attempt < 5 && !success) {
      try {
        await download(url, dest);
        if (isAlreadyOk(dest)) {
          success = true;
        } else {
          throw new Error("file too small / invalid");
        }
      } catch (err) {
        attempt++;
        if (attempt < 5) await sleep(2500 * attempt);
      }
    }
    if (success) {
      ok++;
      console.log(`OK   ${id}`);
    } else {
      fail++;
      console.log(`FAIL ${id}`);
    }
    await sleep(900);
  }

  console.log(`\nDone. OK=${ok} FAIL=${fail}`);
}

main();
