"use client";

import { Flex, NumberInput, NumberInputField } from "@chakra-ui/react";
import { useState } from "react";

const numericRegex = /^[0-9]$/g;

export default function ScorePage() {
  const [currentValue, setCurrentValue] = useState<number | undefined>(
    undefined,
  );

  return (
    <Flex flexDirection="column">
      <NumberInput
        value={currentValue}
        onChange={(value) => {
          if (numericRegex.test(value)) {
            setCurrentValue(Number(value));
          } else {
            setCurrentValue(undefined);
          }
        }}
      >
        <NumberInputField placeholder="새로운 숫자를 입력해주세요." />
      </NumberInput>
    </Flex>
  );
}
