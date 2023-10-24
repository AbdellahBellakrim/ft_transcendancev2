"use client";
import Structure from "../Structure";
import "../../styles/TailwindRef.css";
import GameLandingPage from "@/components/game/GameLandingPage";
import React, { useState, createContext, useEffect } from "react";
import GameContext from "@/components/game/GameContext";
import GameDashboard from "@/components/game/GameDashboard";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";


export interface GameSettingsInterface {
  GameMode: string;
  GameTheme: string;
  GameSpeed: string;
  Oponent?: string | null;
  Roll?: string | null;
}

export default function Game() {
  const [GameLandingPageBool, SetGameLandingPageBool] = useState(true);
  const [GameDashboardBool, SetGameDashboardBool] = useState(false);

  const [GameSettings, setGameSettings] = useState<GameSettingsInterface>({
    GameMode: "",
    GameTheme: "",
    GameSpeed: "",
    Oponent: null,
    Roll: null,
  });
  const [gameSocket, setGameSocket] = useState<null | Socket>(null)


  useEffect(() => {
    if (gameSocket === null) {
      const socket: Socket = io(`${process.env.NEXT_PUBLIC_BACKEND_SERV}/Game`);
      setGameSocket(socket);
    }
    return () => {
      if (gameSocket !== null) {
        gameSocket.close();
        setGameSocket(null);
      }
    }
  }, [GameSettings]);

  return (
    <Structure>
      <GameContext.Provider
        value={{
          GameLandingPageBool,
          SetGameLandingPageBool,
          GameDashboardBool,
          SetGameDashboardBool,
          GameSettings,
          setGameSettings,
          gameSocket
        }}
      >
        {GameLandingPageBool === true && GameDashboardBool === false && <GameLandingPage />}
        {GameDashboardBool === true && GameLandingPageBool === false && <GameDashboard />}
      </GameContext.Provider>
    </Structure>
  );
}
