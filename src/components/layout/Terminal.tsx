"use client";
import React, { useCallback, useEffect, useRef } from "react";
import History from "./History";
import { useHistory } from "./hook";
import { banner } from "@/utils/bin";
import Input from "../ui/input";

const Terminal = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { history, command, lastCommandIndex, setCommand, setHistory, clearHistory, setLastCommandIndex } =
    useHistory();

  const init = useCallback(() => setHistory(banner()), [setHistory]);

  useEffect(() => {
    init();
  }, []);

  const onClickAnywhere = () => {
    inputRef.current?.focus();
  };

  return (
    <>
      <div
        onClick={onClickAnywhere}
        className="terminal p-3 overflow-hidden h-full border drop-shadow-xl rounded text-xs md:text-md lg:text-lg lg:p-8"
      >
        <div ref={containerRef} className="overflow-y-auto h-full">
          <History history={history} />

          <Input
            inputRef={inputRef}
            containerRef={containerRef}
            command={command}
            history={history}
            lastCommandIndex={lastCommandIndex}
            setCommand={setCommand}
            setHistory={setHistory}
            setLastCommandIndex={setLastCommandIndex}
            clearHistory={clearHistory}
          />
        </div>
      </div>
    </>
  );
};

export default Terminal;
