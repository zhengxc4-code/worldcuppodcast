const { dataPath, syncAll } = require("../server");

const mode = process.env.SYNC_MODE || "github-action";

syncAll(mode)
  .then((data) => {
    const providerList = data.sync?.providers || [];
    const providers = providerList.join(", ") || "local-demo";
    const errors = data.sync?.errors || [];
    console.log(`Synced ${dataPath}`);
    console.log(`Providers: ${providers}`);
    console.log(`News: ${(data.news || []).length}`);
    console.log(`Friendlies: ${(data.friendlies || []).length}`);
    if (errors.length) {
      console.log(`Source warnings: ${errors.join(" | ")}`);
    }
    if (providerList.length && errors.length >= providerList.length) {
      console.error("All configured source providers failed; keeping the previous committed data snapshot.");
      process.exitCode = 1;
    }
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
