"use client";

import {
  Button,
  Flex,
  GridItem,
  InputRightElement,
  NumberInput,
  NumberInputField,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FormEventHandler, useEffect, useState } from "react";
import _ from "lodash";
import useStorageState from "./_hook/useStorageStorage";

interface ScoreFullData {
  scoreList: {
    round: number;
    score: number;
  }[];
}

function formatNumberWithDots(num: number) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const availabeInputKeys = Object.freeze(["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "Delete", "Backspace", "Enter"])

export default function ScorePage() {
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [scoreData, setScoreData] = useStorageState<ScoreFullData>(
    "scoreData",
    { scoreList: [] },
  );
  const totalScore =
    scoreData?.scoreList
      ?.map?.(({ score }) => score)
      ?.reduce?.((a, b) => a + b, 0) ?? 0;

  const onSubmitInput: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const scoreList = scoreData?.scoreList ?? [];
    const lastRount = scoreList.findLast(() => true)?.round ?? 0;
    if (currentValue != null) {
      setScoreData({
        scoreList: scoreList.concat({
          round: lastRount + 1,
          score: currentValue,
        }),
      });
      setCurrentValue(0);
    }
  };

  const onDeleteScoreData = (score: ScoreFullData["scoreList"][0]) => () => {
    if (
      !confirm(
        `정말로 ${score.round}라운드: ${score.score}값을 삭제하시겠습니까?`,
      )
    ) {
      return;
    }
    setScoreData({
      scoreList: (scoreData?.scoreList ?? [])
        .filter(({ round }) => round != score.round)
        .map((scoreData) => ({
          ...scoreData,
          round: scoreData.round + (scoreData.round >= score.round ? -1 : 0),
        })),
    });
  };
  const onDeleteAll = () => {
    if (!confirm("정말로 전체 데이터를 삭제하시겠습니까?")) {
      return;
    }
    setScoreData({ scoreList: [] });
  };

  return (
    <Flex flexDirection="column">
      <form onSubmit={onSubmitInput}>
        <Stack direction="row">
          <NumberInput
            value={currentValue}
            inputMode="numeric"
            onKeyDown={(e) => {
              if (!availabeInputKeys.includes(e.key)) {
                e.preventDefault();
                console.log("block keyDown", e.key);
              }
            }}
            onChange={(_1, numValue) => {
              setCurrentValue(numValue || 0);
            }}
          >
            <NumberInputField placeholder="새로운 숫자를 입력해주세요." />
          </NumberInput>
          <Button type="submit">ok</Button>
        </Stack>
      </form>
      <SimpleGrid columns={3} spacing={"0.2rem"}>
        <Text>Total</Text>
        <Text textAlign="right">{formatNumberWithDots(totalScore)}</Text>
        <Button onClick={onDeleteAll}>전체삭제</Button>
        {(scoreData?.scoreList ?? []).map((score) => (
          <>
            <Text>{score.round}</Text>
            <Text textAlign="right">{formatNumberWithDots(score.score)}</Text>
            <Button onClick={onDeleteScoreData(score)}>삭제</Button>
          </>
        ))}
      </SimpleGrid>
    </Flex>
  );
}
