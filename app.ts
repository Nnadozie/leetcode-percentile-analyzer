const axios = require('axios');
const fs = require('fs');

interface ranker {
  rank: string;
  finish_time: number;
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
  let page = 0;
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
  } while (res.find((val) => val.finish_time === 0) === undefined);
}

async function main() {
  await buildCompetitors();
}

main();
