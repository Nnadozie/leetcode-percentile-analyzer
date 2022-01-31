const axios = require('axios');
const fs = require('fs');

if (process.argv[2] === '-h') {
  console.log(
    ` yarn start <contest-name> \n yarn start <contest-name> <desired-percentile>\n yarn start <contest-name> <desired-percentile> <hh-finish> <mm-finish> <ss-finish>\n yarn start <contest-name> <desired-percentile> <hh-finish> <mm-finish> <ss-finish> <rank>`,
  );
} else {
  interface ranker {
    rank: number;
    finish_time: number;
    score: number;
  }
  const competitors: ranker[] = [];
  const url = `https://leetcode.com/contest/api/ranking/${process.argv[2]}/`;

  async function getCompetitors(url: string): Promise<ranker[]> {
    try {
      const response = (await axios.get(url)) as { data: { total_rank: ranker[] } };
      return response && response.data && response.data.total_rank;
    } catch (error) {
      console.error(error);
    }
  }

  async function findLastPage(page = 0, step = 100): Promise<number> {
    let res: ranker[];
    page = page === 0 ? step : page;
    if (step === 0) return page + 1;
    console.log(`Searching from page: ${page}`, `In steps of: ${step}`);

    while ((res && res.length > 0 && res.find((val) => val.score === 0)) === undefined) {
      res = await getCompetitors(`${url}?pagination=${page}&region=global`);
      page += step;
    }
    return findLastPage(page - step * 2, Math.trunc(step / 2));
  }

  async function findObjectWithRank(
    rank: number,
    page = 0,
    step = 100,
  ): Promise<{ ranker: ranker; pageFound: number }> {
    let res: ranker[];
    page = page === 0 ? step : page;
    console.log(`Searching from page: ${page}`, `in steps of: ${step}`);

    while ((res && res.length > 0 && res.find((val) => val.rank >= rank)) === undefined) {
      res = await getCompetitors(`${url}?pagination=${page}&region=global`);
      page += step;
    }

    if (res && res.find((val) => val.rank === rank)) {
      return { ranker: res.find((val) => val.rank === rank), pageFound: page - step };
    }

    return findObjectWithRank(rank, page - step * 2, Math.trunc(step / 2));
  }

  async function findFirstZeroScore(page: number) {
    let res: ranker[] = await getCompetitors(`${url}?pagination=${page}&region=global`);
    return res && res.find((val) => val.score === 0);
  }

  async function findPercentileByTime(finish_time: number, lastRank: number, page = 0, step = 100): Promise<number> {
    let res: ranker[];
    page = page === 0 ? step : page;
    console.log(`Searching from page: ${page}`, `in steps of: ${step}`);

    while ((res && res.length > 0 && res.find((val) => val.finish_time >= finish_time)) === undefined) {
      res = await getCompetitors(`${url}?pagination=${page}&region=global`);
      page += step;
    }

    //may never find exact time in seconds but this is unlikely
    if (res && res.find((val) => val.finish_time === finish_time)) {
      console.log('\npage found:', page - step);
      const pTile = (res.find((val) => val.finish_time === finish_time).rank / lastRank) * 100;
      console.log(
        '\n',
        res.find((val) => val.finish_time === finish_time),
      );
      return pTile > Math.trunc(pTile) ? 100 - Math.trunc(pTile) : 100 - pTile;
    }

    return findPercentileByTime(finish_time, lastRank, page - step * 2, Math.trunc(step / 2));
  }

  async function main() {
    console.log('Searching For last page with a score > 0\n');
    const lastPage = await findLastPage();
    console.log('\nLast Page:', lastPage);

    // Get obj in last place
    const lastRankObj = (await getCompetitors(`${url}?pagination=${lastPage}&region=global`)).find(
      (val) => val.score === 0,
    );
    console.log('\nUser in last place:', lastRankObj);

    if (process.argv[4] && process.argv[5] && process.argv[6]) {
      const myTime =
        Number(process.argv[4]) * 60 * 60 +
        Number(process.argv[5]) * 60 +
        Number(process.argv[6]) +
        lastRankObj.finish_time;

      console.log(`\nSearching for percentile your completion time of ${myTime}s falls within:`);
      const myPercentile = await findPercentileByTime(myTime, lastRankObj.rank - 1);

      console.log(
        `\nWith time of ${process.argv[4]}:${process.argv[5]}:${process.argv[6]} you finished in the ${myPercentile}th percentile, assuming you completed all submissions without error`,
      );

      if (process.argv[7]) {
        const percentileByRank = 100 - (Number(process.argv[7]) / (lastRankObj.rank - 1)) * 100;
        console.log(
          `With a rank of ${process.argv[7]} you finished in the ${
            percentileByRank > Math.trunc(percentileByRank) ? Math.trunc(percentileByRank) : percentileByRank
          }th percentile`,
        );
      }
    }

    const searchTile = process.argv[3] ? process.argv[3] : 90;
    let nthTileRank = ((100 - Number(searchTile)) / 100) * (lastRankObj.rank - 1);
    nthTileRank = nthTileRank > Math.trunc(nthTileRank) ? Math.trunc(nthTileRank) + 1 : nthTileRank;

    console.log(`\nSearching for user marking the ${searchTile}th Percentile boundary. Rank: ${nthTileRank}\n`);
    const nthObj = await findObjectWithRank(nthTileRank);
    const nthTime = nthObj.ranker.finish_time - lastRankObj.finish_time;
    const hh = Math.trunc(nthTime / 60 / 60);
    const mm = Math.trunc((nthTime - hh * 60 * 60) / 60);
    const ss = nthTime - mm * 60 - hh * 60 * 60;

    console.log(
      `\nTo have made ${searchTile}th percentile you need to have finished within ${hh}h:${mm}m:${ss}s, ahead of user who ranked ${nthTileRank} on page ${nthObj.pageFound}`,
    );
  }

  main();
}
