const axios = require('axios');
const fs = require('fs');

interface ranker {
  rank: string;
  finish_time: number;
  score: number;
}
const competitors: ranker[] = [];

async function getCompetitors(url: string): Promise<ranker[]> {
  try {
    const response = (await axios.get(url)) as { data: { total_rank: ranker[] } };
    return response && response.data && response.data.total_rank;
  } catch (error) {
    console.error(error);
  }
}

async function buildCompetitors() {
  let res: ranker[];
  let page = 671;
  do {
    res = await getCompetitors(
      `https://leetcode.com/contest/api/ranking/weekly-contest-276/?pagination=${page}&region=global`,
    );
    competitors.push(...res);
    console.log(`https://leetcode.com/contest/api/ranking/weekly-contest-276/?pagination=${page}&region=global`);
    console.log(process.argv[2]);
    fs.writeFile(process.argv[2], JSON.stringify(competitors), (err) => {
      if (err) throw err;
      console.log('file saved');
    });
    page++;
  } while ((res && res.find((val) => val.score === 0)) === undefined);
}

//find last page
//find zero score time
//find zero score rank
//calc 10 percentile rank
//find 10 percentile rank object

async function findLastPage(page = 0, step = 100): Promise<number> {
  let res: ranker[];
  page = page === 0 ? step : page;
  if (step === 0) return page + 1;
  console.log(`Searching from page: ${page}`, `In steps of: ${step}`);

  while ((res && res.find((val) => val.score === 0)) === undefined) {
    res = await getCompetitors(
      `https://leetcode.com/contest/api/ranking/biweekly-contest-68/?pagination=${page}&region=global`,
    );
    page += step;
  }
  return findLastPage(page - step * 2, Math.trunc(step / 2));
}

async function main() {
  //await buildCompetitors();
  console.log(await findLastPage());
}

main();
