import { Button, Menu, Tooltip } from "@mantine/core";
import { useState } from "react";
import { algorithmOptions } from "../../models/Algorithm";
import type { AlgorithmId } from "../../models/Algorithm";

interface ModeButtonsProps {
  onRunButtonClick: (algorithmId: AlgorithmId) => void;
  onPracticeButtonClick: (algorithmId: AlgorithmId) => void;
  compareAlgorithmIds: AlgorithmId[];
  onCompareAlgorithmToggle: (algorithmId: AlgorithmId) => void;
  onCompareConfirmButtonClick: () => void;
  isAlgorithmMode: boolean;
  isRunMode: boolean;
  isPracticeMode: boolean;
  isCompareMode: boolean;
}

export function ModeButtons({
  onRunButtonClick,
  onPracticeButtonClick,
  compareAlgorithmIds,
  onCompareAlgorithmToggle,
  onCompareConfirmButtonClick,
  isAlgorithmMode,
  isRunMode,
  isPracticeMode,
  isCompareMode,
}: ModeButtonsProps) {
  const [compareMenuOpened, setCompareMenuOpened] = useState(false);
  const canConfirmCompare = compareAlgorithmIds.length === 2;

  const runAlgorithm = (algorithmId: AlgorithmId) => {
    if (algorithmId === "a-star") {
      window.alert("This algorithm is not implemented yet.");
      return;
    }

    onRunButtonClick(algorithmId);
  };

  const practiceAlgorithm = (algorithmId: AlgorithmId) => {
    if (algorithmId === "a-star") {
      window.alert("A* is not implemented yet.");
      return;
    }

    onPracticeButtonClick(algorithmId);
  };

  return (
    <>
      <Tooltip label="Select an algorithm and run it" withArrow openDelay={400}>
        <span>
          <Menu withinPortal position="bottom-start">
            <Menu.Target>
              <Button disabled={isAlgorithmMode}>
                {isRunMode ? "Running" : "Run"}
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              {algorithmOptions.map((algorithm) => (
                <Menu.Item
                  key={algorithm.id}
                  onClick={() => runAlgorithm(algorithm.id)}
                >
                  {algorithm.label}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        </span>
      </Tooltip>

      <Tooltip
        label="Practice the algorithm step by step"
        withArrow
        openDelay={400}
      >
        <span>
          <Menu withinPortal position="bottom-start">
            <Menu.Target>
              <Button disabled={isAlgorithmMode}>
                {isPracticeMode ? "Practicing" : "Practice"}
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              {algorithmOptions.map((algorithm) => (
                <Menu.Item
                  key={algorithm.id}
                  onClick={() => practiceAlgorithm(algorithm.id)}
                >
                  {algorithm.label}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        </span>
      </Tooltip>

      <Tooltip
        label="Select two algorithms to compare"
        withArrow
        openDelay={400}
      >
        <span>
          <Menu
            withinPortal
            position="bottom-start"
            closeOnItemClick={false}
            opened={compareMenuOpened}
            onChange={setCompareMenuOpened}
          >
            <Menu.Target>
              <Button disabled={isAlgorithmMode}>
                {isCompareMode ? "Comparing" : "Compare"}
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              {algorithmOptions.map((algorithm) => {
                const isSelected = compareAlgorithmIds.includes(algorithm.id);
                const isDisabled =
                  !isSelected && compareAlgorithmIds.length >= 2;

                return (
                  <Menu.Item
                    key={algorithm.id}
                    disabled={isDisabled}
                    leftSection={
                      <span
                        style={{
                          display: "inline-block",
                          width: 16,
                          color: isSelected ? "#228be6" : "transparent",
                          fontWeight: 900,
                          textAlign: "center",
                        }}
                      >
                        ✓
                      </span>
                    }
                    onClick={() => onCompareAlgorithmToggle(algorithm.id)}
                  >
                    {algorithm.label}
                  </Menu.Item>
                );
              })}
              <Menu.Divider />
              <div style={{ padding: "6px 8px" }}>
                <Button
                  fullWidth
                  size="xs"
                  disabled={!canConfirmCompare}
                  onClick={() => {
                    onCompareConfirmButtonClick();
                    setCompareMenuOpened(false);
                  }}
                >
                  Confirm
                </Button>
              </div>
            </Menu.Dropdown>
          </Menu>
        </span>
      </Tooltip>
    </>
  );
}
