## About:

This project is aimed at helping you track your leetcode performance using historical leetcode contest data.

The idea being that even without having participated in past contests, you can find out how you'd have performed by timing yourself and using this tool to 
determine what percentile that completion time would have placed you in, had you participated in that contest.

If you're more interested in looking at percentiles of users who have participated in contests please see this project:

- [Leetcode ranking search](https://github.com/chiehmin/leetcode-ranking-search) by @chiehmin

## Before running

yarn install

## Usage

Each contest url contains the `<contest-name>`. Example:

The contest name here is weekly-contest-276

https://leetcode.com/contest/weekly-contest-276/

`yarn start <contest-name> `

    - Percentile defaults to 90th

    Finds finish_time needed to have made 10th percentile.

    Example:
    ```
    yarn start biweekly-contest-69

    > logs ...
    > To have made 10th percentile you need to have finished within 0h:27m:20s, ahead of user who ranked 993 on page 40
    ```

`yarn start <contest-name> <desired-percentile>`

    Finds finish_time needed to have made desired-percentile.

    Example:
    ```
    yarn start biweekly-contest-69 30

    > logs ...
    > To have made 30th percentile you need to have finished within xxh:xxm:xxs, ahead of user who ranked xxxx on page xx
    ```

`yarn start <contest-name> <desired-percentile> <hh-finish> <mm-finish> <ss-finish>`

    All info above +
    Provides percentile which <hh-finish>:<mm-finish>:<ss-finish> finish_time places you in.

    Example:
    ```
    yarn start biweekly-contest-69 70 0 40 35

    > logs ...
    > With time of 0:40:35 you finished in the 20th percentile, assuming you completed all submissions without error
    > With a rank of 6835 you finished in the 69th percentile
    ```

`yarn start <contest-name> <desired-percentile> <hh-finish> <mm-finish> <ss-finish> <rank>`

    All info above +
    Provides percentile which <rank> places you in.

    Example:
    ```
    yarn start biweekly-contest-69 10 0 40 35 6835

    > logs ...
    > With time of 0:40:35 you finished in the 20th percentile, assuming you completed all submissions without error
    > With a rank of 6835 you finished in the 69th percentile
    ```
