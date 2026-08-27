"use client";
import React from "react";
import { Ps1 } from "./Ps1";

interface HistoryEntry {
  id: number;
  date: Date;
  command: string;
  output: string;
}

interface HistoryProps {
  history: HistoryEntry[];
}

export const History = ({ history }: HistoryProps) => {
  return (
    <>
      {history.map((entry: HistoryEntry, index: number) => (
        <div key={entry.command + index}>
          <div className="flex flex-row space-x-2">
            <div className="flex-shrink">
              <Ps1 />
            </div>

            <div className="flex-grow">{entry.command}</div>
          </div>

          <p
            className="whitespace-pre-wrap mb-2"
            style={{ lineHeight: "normal" }}
            dangerouslySetInnerHTML={{ __html: entry.output }}
          />
        </div>
      ))}
    </>
  );
};

export default History;
