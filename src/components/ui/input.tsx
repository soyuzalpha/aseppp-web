"use client";
import React from "react";
import { commandExists } from "@/utils/commandExists";
import { shell } from "@/utils/shell";
import { handleTabCompletion } from "@/utils/tabCompletion";
import Ps1 from "@/components/layout/Ps1";

interface HistoryEntry {
  id: number;
  date: Date;
  command: string;
  output: string;
}

interface InputProps {
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
  command: string;
  history: HistoryEntry[];
  lastCommandIndex: number;
  setCommand: (value: string) => void;
  setHistory: (value: string) => void;
  setLastCommandIndex: (value: number) => void;
  clearHistory: () => void;
}

export const Input = ({
  inputRef,
  containerRef,
  command,
  history,
  lastCommandIndex,
  setCommand,
  setHistory,
  setLastCommandIndex,
  clearHistory,
}: InputProps) => {
  const onSubmit = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    const commands = history.map(({ command }: { command: string }) => command).filter((command: string) => command);

    if (event.key === "c" && event.ctrlKey) {
      event.preventDefault();
      setCommand("");
      setHistory("");
      setLastCommandIndex(0);
    }

    if (event.key === "l" && event.ctrlKey) {
      event.preventDefault();
      clearHistory();
    }

    if (event.key === "Tab") {
      event.preventDefault();
      handleTabCompletion(command, setCommand);
    }

    if (event.key === "Enter" || event.code === "13") {
      event.preventDefault();
      setLastCommandIndex(0);
      await shell(command, setHistory, clearHistory, setCommand);
      containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!commands.length) {
        return;
      }
      const index = lastCommandIndex + 1;
      if (index <= commands.length) {
        setLastCommandIndex(index);
        setCommand(commands[commands.length - index]);
      }
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!commands.length) {
        return;
      }
      const index = lastCommandIndex - 1;
      if (index > 0) {
        setLastCommandIndex(index);
        setCommand(commands[commands.length - index]);
      } else {
        setLastCommandIndex(0);
        setCommand("");
      }
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommand(event.target.value);
  };

  return (
    <div className="flex flex-row space-x-2">
      <label htmlFor="prompt" className="flex-shrink">
        <Ps1 />
      </label>

      <input
        ref={inputRef}
        id="prompt"
        type="text"
        className={`bg-transparent focus:outline-none flex-grow ${
          commandExists(command) || command === "" ? "text-dark-green" : "text-dark-red"
        }`}
        value={command}
        onChange={onChange}
        onKeyDown={onSubmit}
        autoComplete="off"
        spellCheck="false"
      />
    </div>
  );
};

export default Input;
