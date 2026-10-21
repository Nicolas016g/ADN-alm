import fs from "fs";
import path from "path";

const files = [
  ["IMG_3965.jpg", "10RS4GqG9oGIfhK63TxTKu1v6Bs6TQhQE"],
  ["IMG_3966.jpg", "13aLz4iMFESKajoQg3QZuy1AGOAGmqpI6"],
  ["IMG_3967.jpg", "1ZUnR60L2A5ccBT11JV9lYsqBHPY2R490"],
  ["IMG_3968.jpg", "1FTclvdUtzaszZqKG9zszZka32HVK3CVU"],
  ["IMG_3969.jpg", "1U8XBqG9C3hH9O-OnEnsHbSXb8W3khv4D"],
  ["IMG_3973.jpg", "1wLpPOlF-0b9jWdPS_Wf3PHTyUgX-yhlm"],
  ["IMG_3974.jpg", "1-ln1C2PSkPmNDp-WpE-zS08ljwcmu7FF"],
  ["IMG_3976.jpg", "1xkqyblNxt8JvfuljagQHhUJf-IZSuQNd"],
  ["IMG_3979.jpg", "1V9Hj7MUz6KwwH_GCbqhqv4d9z_KnNzpw"],
  ["IMG_3980.jpg", "1uY39H4aSVODJt2kv-qduIcu0qDKGeTOD"],
  ["IMG_3981.jpg", "1kii6hqdK8JFGQPMoOYU_lDjagNmthc12"],
  ["IMG_3982.jpg", "1ZBR5mFF1bG7nXamx2X-WiGKvCxy0XrO8"],
  ["IMG_3988.jpg", "1gJHpHzbYpUUFsMFnXxP8zLUxUC-lv9Sx"],
  ["IMG_3992.jpg", "1d0j8OOXNKdwVCYir-koNVPxzt3tGx9N0"],
  ["IMG_3995.jpg", "1bu8nCjEbuaK4U4RaLNw7wGctURvtW6cx"],
  ["IMG_3996.jpg", "1zywuLvmTHtIgapSoH3DUifVE7xUg_JrH"],
  ["IMG_3999.jpg", "1NXerpGOrfC51b3Zx5zt_o0vBtg_4QAVQ"],
  ["IMG_4003.jpg", "1neCzbd5uNcPMskmkU7s9nkKV6L99Ozg5"],
  ["IMG_4004.jpg", "1yaJMqfOMlMP5uey8qb3g6adHRIj_rDs0"],
  ["IMG_4008.jpg", "1p_mPm9BbpY01rh8mtnyqvMC1Gdz9unsB"],
  ["IMG_4009.jpg", "1k9efvI0a0Va5nxUKmtsJmYrVkTa7l_wb"],
  ["IMG_4010.jpg", "1yM_pxYudG2lGLgD-2oy8XEbWho3YS4Hi"],
  ["IMG_4011.jpg", "1h3vgqlyCr-kBvqtDzQ5NnXNugYF2xMSx"],
  ["IMG_4012.jpg", "1dP6M80m8A_ciLWNj1uTvqpyl7feDLfqs"],
  ["IMG_4013.jpg", "1vGA2geK-qYBF-tnS9zwg7X2M9LBd_GyI"],
  ["IMG_4014.jpg", "1amYgJvZfq_LMibANla_Z8xuQP35XcfcN"],
  ["IMG_4016.jpg", "1J6ml8NKGEQs8ym0iKCJsufePTBqWYLHy"],
  ["IMG_4019.jpg", "1bQZ5RDMJm0-t6bv2mbZ4K2dYwEf1fICb"],
  ["IMG_4020.jpg", "1BY_Nr3x8s-D4W_qKzKw1OF3-lQhm1XGI"],
  ["IMG_4023.jpg", "1ei8XxicV9_jTdm_FucefuYqA4JA-241d"],
  ["IMG_4026.jpg", "1S0q62-F4_AdupadhrqmY8TbMX5KmeihM"],
  ["IMG_4027.jpg", "1nLXjJfYcOqPj8zv6fz5nmaXiaM3PKBQe"],
  ["IMG_4028.jpg", "1XbPi0Rn9_C-nowEuB2nZdVN_8yS-PmNX"],
  ["IMG_4029.jpg", "1L53ByuZ2ibLEtsRSV66JN_DY7DHt0ZZP"],
  ["IMG_4034.jpg", "1Fj2DhyfMqL3_Bd3bmEfEOmzMOYj0Hkpu"],
  ["IMG_4036.jpg", "1ph8iNihAPh2lB7tlbKGXTrwixPNyOe8U"],
  ["IMG_4039.jpg", "1GFnCcdFXxt1qtHi10giuPMXtVvPOF_hO"],
  ["IMG_4040.jpg", "16GGB78K2IoX7wHGfYFyaH5_OsX0ygNCj"],
  ["IMG_4041.jpg", "1lNjT1uaX2IqzVjzlTC1rLYbYh4JIsSMt"],
  ["IMG_4042.jpg", "1dpXS2P6n-tLrCUp7Oto6c4AMSsxc_cp-"],
  ["IMG_4043.jpg", "19StWUPZzmPuX5IeuhI9UmuKX6yDSVGuf"],
  ["IMG_4044.jpg", "1rnFHIssi8rQc5XPWVzZoUenyVc7LylMo"],
  ["IMG_4045.jpg", "1rxMJ68y0v4mEne3iSYlqoBDMAkZCU4sQ"],
  ["IMG_4049.jpg", "114MJPPo4SholH1EcclcvKf1cikC5qbWX"],
  ["IMG_4052.jpg", "1xSCbkDoyPCng0d6auqYX0e5_S4xG-rdB"],
  ["IMG_4055.jpg", "1Q5oDi34wJYgSfy-uDjr65ybLttM-EkKH"],
  ["IMG_4058.jpg", "1wbLT6KyVoDDPpDDQSoMlOYQp3B6TMGHt"],
  ["IMG_4059.jpg", "11OnK9XQfsEWnCm9nYnoFXI9yxTM3WU6k"],
  ["IMG_4060.jpg", "16vt1TWspoIdkZ8_axzub0lmsh8xgIQtL"],
  ["IMG_4068.jpg", "1xr-FwbfjzjAOVaxzKIR2mF2XSSlJwrK3"],
];

const root = path.resolve("photos");
fs.mkdirSync(path.join(root, "full"), { recursive: true });
fs.mkdirSync(path.join(root, "thumb"), { recursive: true });

async function grab(id, size) {
  const url = `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=${size}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${id}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 8000 || buf[0] !== 0xff || buf[1] !== 0xd8) {
    throw new Error(`not jpeg ${id} ${buf.length}`);
  }
  return buf;
}

let cursor = 0;
const failures = [];

async function worker() {
  while (cursor < files.length) {
    const index = cursor++;
    const [name, id] = files[index];
    const n = String(index + 1).padStart(2, "0");
    const base = `${n}-${name.replace(/\.jpg$/i, "")}`;
    try {
      const [full, thumb] = await Promise.all([
        grab(id, "w1600"),
        grab(id, "w640"),
      ]);
      fs.writeFileSync(path.join(root, "full", `${base}.jpg`), full);
      fs.writeFileSync(path.join(root, "thumb", `${base}.jpg`), thumb);
      console.log("ok", base, full.length);
    } catch (err) {
      console.error("fail", base, err.message);
      failures.push(base);
    }
  }
}

await Promise.all(Array.from({ length: 4 }, () => worker()));
fs.writeFileSync(
  "photos/manifest.json",
  JSON.stringify(
    files.map(([name], i) => {
      const n = String(i + 1).padStart(2, "0");
      const base = `${n}-${name.replace(/\.jpg$/i, "")}`;
      return {
        id: n,
        file: name,
        full: `photos/full/${base}.jpg`,
        thumb: `photos/thumb/${base}.jpg`,
      };
    }),
    null,
    2
  )
);
console.log("done", files.length - failures.length, "ok", failures.length, "fail");
if (failures.length) process.exitCode = 1;
