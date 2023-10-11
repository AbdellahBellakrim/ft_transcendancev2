import React, { useEffect, useState } from "react";
import { Space_Mono } from "next/font/google";
import "../../styles/TailwindRef.css";
import Cookies from "js-cookie";
import newSocket from "../GlobalComponents/Socket/socket";

const mono = Space_Mono({
  subsets: ["latin"],
  style: ["normal"],
  weight: ["400", "700"],
});

function Invite({ ...props }) {
  //=========================================================================================================
  const [userFriend, setuserFriend] = useState<
    { id: number; username: string; avatar: string; status: string }[]
  >([]);
  const [updateFriend, setupdateFriend] = useState<
    { id: number; username: string; avatar: string; status: string }[]
  >([]);
  const [searchQuery, setsearchQuery] = useState("");
  const JwtToken = Cookies.get("access_token");

  //--------------------------------------
  useEffect(() => {
    if (searchQuery === "") {
      setupdateFriend(userFriend);
    } else {
      const filterFriends = userFriend.filter((friend) =>
        friend.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setupdateFriend(filterFriends);
    }
  }, [searchQuery, userFriend]);

  useEffect(() => {
    fetch("http://localhost:3001/api/Dashboard/friends", {
      method: "Get",
      headers: {
        Authorization: `Bearer ${JwtToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => setuserFriend(data))
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [JwtToken, userFriend]);

  useEffect(() => {
    newSocket.on("online", (userObj) => {
      if (userObj) {
        setupdateFriend(userObj);
      }
    });

    newSocket.on("offline", (userObj) => {
      if (userObj) {
        setupdateFriend(userObj);
      }
    });

    newSocket.on("friend", (friends) => {
      try {
        console.log("Received friend event with data:", friends);
        if (friends) {
          setuserFriend(friends);
        }
      } catch (error) {
        console.error("Error handling friend event:", error);
      }
    });
  }, [JwtToken, updateFriend]);

  //=========================================================================================================

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[2]">
      {/* this is the backdrop (the background opacity) */}
      <div
        className="absolute bg-black w-full h-full opacity-50 z-[2]"
        onClick={(ev) => {
          ev.preventDefault();
          props.setInvite(false);
        }}
      ></div>
      {/* this is the main component */}
      <div className="bg-[#E4E7FF] rounded shadow-lg w-[80vw] h-[80vh] flex flex-col   p-[30px] box-border overflow-scroll items-center z-[3] min-h-[400px] min-w-[300px] max-h-[1500px] max-w-[720px]">
        <div className="flex items-center w-full flex-row-reverse h-[3%]">
          <img
            src="/close.png"
            alt="photo"
            className="w-[20px] h-[20px] hover:cursor-pointer mt-[-1em] mr-[-0.8em]"
            onClick={(ev) => {
              ev.preventDefault();
              props.setInvite(false);
            }}
          />
        </div>
        <input
          className={`w-[80%] h-[50px] bg-[#0D0149] rounded-3xl hover:cursor-text border-none pl-8 text-white text-[15px] placeholder:text-white ${mono.className} outline-none`}
          placeholder="Find Friend"
          value={searchQuery}
          onChange={(e) => setsearchQuery(e.target.value)}
        ></input>
        <div className="text-white my-[5px] w-full flex  items-center flex-col">
          {updateFriend
            .filter((friend) => friend.status === "ONLINE")
            .map((friend) => (
              <div
                className={`w-[85%] h-[50px] bg-[#0D0149] m-[10px] rounded-3xl flex justify-around items-center ${mono.className}`}
              >
                <img
                  src={friend.avatar}
                  alt="userpic"
                  className="w-[40px] h-[40px] rounded-full"
                />
                {friend.username}

                <div
                  className={`w-[80px] h-[25px]  text-center flex items-center justify-center text-[#22EAAC]  border-[1px] border-[#22EAAC] border-solid ${mono.className} hover:opacity-[65%] hover:cursor-pointer rounded-md text-[13px]`}
                >
                  Invite
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Invite;