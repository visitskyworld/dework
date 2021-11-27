const { Octokit } = require("@octokit/rest");
let express = require("express");
let app = express();

const octokit = new Octokit();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`listening at http://localhost:${PORT}`);
});

app.get("/data", async (req, _) => {
  const site = req.query.site;
  const company = site.split("/")[site.split("/").length - 2]; //https://twitter.com/rickyflows/status/1463634511531368448
  const repo = site.split("/")[site.split("/").length - 1];
  const res = await octokit.issues.listForRepo({
    owner: `${company}`,
    repo,
  });
  const COLORS = ["green", "yellow", "red", "blue"];
  const allData = res.data.map(
    ({ title, labels, assignees, id, url, body, state }, idx) => {
      return {
        id: idx,
        title,
        subtitle: body.split("\r")[0],
        status: state,
        sortKey: `0${idx}`,
        tags: labels.map((label, idx) => ({
          label: label.name,
          color: label.color || COLORS[idx] || "green",
        })),
        assignees: assignees.map(({ login, avatar_url, url }) => ({
          name: login,
          github_url: url,
          avatar_url,
        })),
        url,
      };
    }
  );
  console.log("alldata", JSON.stringify(allData, null, 4));
});
